package router

import (
	"github.com/gin-gonic/gin"

	"github.com/freesslcert/freesslcert/internal/config"
	"github.com/freesslcert/freesslcert/internal/handler"
	"github.com/freesslcert/freesslcert/internal/middleware"
)

// Setup configures all middleware and routes on the provided gin engine.
func Setup(
	engine *gin.Engine,
	cfg *config.Config,
	certHandler *handler.CertificateHandler,
	healthHandler *handler.HealthHandler,
	rateLimiter *middleware.RateLimiter,
) {
	// Global middleware.
	engine.Use(middleware.RequestID())
	engine.Use(middleware.SecurityHeaders(cfg))
	engine.Use(middleware.CORS(cfg))

	// Health endpoint registered BEFORE rate limiting so it is always
	// reachable by load balancers and health probes.
	engine.GET("/health", healthHandler.Health)

	// WebSocket endpoint registered BEFORE rate limiting. WebSocket
	// connections are long-lived and should not be subject to the
	// per-request rate limiter.
	engine.GET("/api/v1/orders/:id/ws", certHandler.WebSocketOrder)

	// Apply rate limiting to all subsequent routes.
	engine.Use(rateLimiter.Middleware())

	// API v1.
	v1 := engine.Group("/api/v1")
	{
		v1.POST("/orders", certHandler.CreateOrder)
		v1.GET("/orders/:id", certHandler.GetOrder)
		v1.POST("/orders/:id/validate", certHandler.ValidateOrder)
		v1.GET("/orders/:id/download/:format", certHandler.DownloadCertificate)
		v1.POST("/orders/:id/revoke", certHandler.RevokeOrder)
		v1.GET("/config", certHandler.GetConfig)
	}
}
