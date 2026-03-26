package main

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"
	_ "github.com/tursodatabase/libsql-client-go/libsql"

	"github.com/freesslcert/freesslcert/internal/config"
	"github.com/freesslcert/freesslcert/internal/handler"
	"github.com/freesslcert/freesslcert/internal/middleware"
	"github.com/freesslcert/freesslcert/internal/repository"
	"github.com/freesslcert/freesslcert/internal/router"
	"github.com/freesslcert/freesslcert/internal/service"
)

func main() {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
		Level: slog.LevelInfo,
	}))
	slog.SetDefault(logger)

	if err := run(logger); err != nil {
		logger.Error("fatal error", "error", err)
		os.Exit(1)
	}
}

func run(logger *slog.Logger) error {
	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	// Load configuration.
	cfg, err := config.Load()
	if err != nil {
		return fmt.Errorf("load config: %w", err)
	}

	logger.Info("configuration loaded",
		"env", cfg.AppEnv,
		"port", cfg.AppPort,
		"acme_dir", cfg.ACMEDirectoryURL,
	)

	// Open Turso/libSQL database.
	db, err := sql.Open("libsql", cfg.DatabaseURL)
	if err != nil {
		return fmt.Errorf("open database: %w", err)
	}
	defer func() {
		if err := db.Close(); err != nil {
			logger.Error("close database", "error", err)
		}
	}()

	if err := db.PingContext(ctx); err != nil {
		return fmt.Errorf("ping database: %w", err)
	}
	logger.Info("database connected")

	// Initialise repositories.
	certRepo, err := repository.NewCertificateRepository(ctx, db)
	if err != nil {
		return fmt.Errorf("init certificate repository: %w", err)
	}

	acmeRepo, err := repository.NewAcmeAccountRepository(ctx, db)
	if err != nil {
		return fmt.Errorf("init acme account repository: %w", err)
	}

	// Initialise ACME service.
	acmeSvc, err := service.NewACMEService(ctx, cfg, certRepo, acmeRepo, logger)
	if err != nil {
		return fmt.Errorf("init acme service: %w", err)
	}

	// Start ACME service background cleanup.
	acmeSvc.StartCleanup(ctx)

	// Start background purge job.
	go func() {
		ticker := time.NewTicker(1 * time.Hour)
		defer ticker.Stop()
		for {
			select {
			case <-ctx.Done():
				return
			case <-ticker.C:
				purged, err := certRepo.PurgeSensitiveData(context.Background())
				if err != nil {
					logger.Error("purge sensitive data", "error", err)
				} else if purged > 0 {
					logger.Info("purged sensitive data from orders", "count", purged)
				}

				deleted, err := certRepo.DeleteExpired(context.Background())
				if err != nil {
					logger.Error("purge expired orders", "error", err)
				} else if deleted > 0 {
					logger.Info("purged expired orders", "count", deleted)
				}
			}
		}
	}()

	// Initialise handlers.
	certHandler := handler.NewCertificateHandler(acmeSvc, certRepo)
	healthHandler := handler.NewHealthHandler()

	// Create rate limiter and start its background cleanup.
	rateLimiter := middleware.NewRateLimiter(cfg)
	rateLimiter.StartCleanup(ctx)

	// Setup Gin.
	if !cfg.IsDevelopment() {
		gin.SetMode(gin.ReleaseMode)
	}
	engine := gin.New()
	engine.Use(gin.Recovery())
	engine.Use(gin.Logger())

	router.Setup(engine, cfg, certHandler, healthHandler, rateLimiter)

	// Start HTTP server.
	srv := &http.Server{
		Addr:              ":" + cfg.AppPort,
		Handler:           engine,
		ReadHeaderTimeout: 10 * time.Second,
		ReadTimeout:       30 * time.Second,
		WriteTimeout:      60 * time.Second,
		IdleTimeout:       120 * time.Second,
	}

	// Run server in background.
	errCh := make(chan error, 1)
	go func() {
		logger.Info("server starting", "addr", srv.Addr)
		if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			errCh <- fmt.Errorf("listen and serve: %w", err)
		}
		close(errCh)
	}()

	// Wait for interrupt or server error.
	select {
	case <-ctx.Done():
		logger.Info("shutdown signal received")
	case err := <-errCh:
		if err != nil {
			return err
		}
	}

	// Graceful shutdown with timeout.
	shutdownCtx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()

	if err := srv.Shutdown(shutdownCtx); err != nil {
		return fmt.Errorf("server shutdown: %w", err)
	}

	logger.Info("server stopped gracefully")
	return nil
}
