package config

import (
	"fmt"
	"os"
	"strconv"
	"strings"
	"time"
)

// Config holds all application configuration loaded from environment variables.
type Config struct {
	AppEnv             string
	AppPort            string
	DatabaseURL        string
	ACMEEmail          string
	ACMEDirectoryURL   string
	CloudflareAPIToken string
	CORSAllowedOrigins []string
	RateLimitRequests  int
	RateLimitWindow    time.Duration
	ResendAPIKey       string
}

// Load reads configuration from environment variables. For any variable FOO,
// if FOO is empty but FOO_FILE is set it reads the value from the file at that path (useful for
// Docker secrets). Required fields cause a fatal error when missing.
func Load() (*Config, error) {
	cfg := &Config{
		AppEnv:           envOrDefault("APP_ENV", "development"),
		AppPort:          envOrDefault("APP_PORT", "8080"),
		DatabaseURL:      envOrSecret("DATABASE_URL"),
		ACMEEmail:        envOrSecret("ACME_EMAIL"),
		ACMEDirectoryURL: envOrDefault("ACME_DIRECTORY_URL", "https://acme-staging-v02.api.letsencrypt.org/directory"),
	}

	cfg.CloudflareAPIToken = envOrSecret("CLOUDFLARE_API_TOKEN")
	cfg.ResendAPIKey = envOrSecret("RESEND_API_KEY")

	originsRaw := envOrDefault("CORS_ALLOWED_ORIGINS", "http://localhost:5173")
	cfg.CORSAllowedOrigins = strings.Split(originsRaw, ",")
	for i := range cfg.CORSAllowedOrigins {
		cfg.CORSAllowedOrigins[i] = strings.TrimSpace(cfg.CORSAllowedOrigins[i])
	}

	rlReqs, err := strconv.Atoi(envOrDefault("RATE_LIMIT_REQUESTS", "30"))
	if err != nil {
		return nil, fmt.Errorf("parse RATE_LIMIT_REQUESTS: %w", err)
	}
	cfg.RateLimitRequests = rlReqs

	rlWindowSec, err := strconv.Atoi(envOrDefault("RATE_LIMIT_WINDOW_SECONDS", "60"))
	if err != nil {
		return nil, fmt.Errorf("parse RATE_LIMIT_WINDOW_SECONDS: %w", err)
	}
	cfg.RateLimitWindow = time.Duration(rlWindowSec) * time.Second

	if err := cfg.validate(); err != nil {
		return nil, fmt.Errorf("config validation: %w", err)
	}

	return cfg, nil
}

// IsDevelopment returns true when AppEnv is "development".
func (c *Config) IsDevelopment() bool {
	return c.AppEnv == "development"
}

func (c *Config) validate() error {
	if c.DatabaseURL == "" {
		return fmt.Errorf("DATABASE_URL is required (set DATABASE_URL or DATABASE_URL_FILE)")
	}
	if c.ACMEEmail == "" {
		return fmt.Errorf("ACME_EMAIL is required (set ACME_EMAIL or ACME_EMAIL_FILE)")
	}
	return nil
}

// envOrSecret reads VAR from environment. If VAR is empty but VAR_FILE is set,
// it reads the content of the file at that path. This supports Docker secrets.
func envOrSecret(key string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	filePath := os.Getenv(key + "_FILE")
	if filePath == "" {
		return ""
	}
	data, err := os.ReadFile(filePath)
	if err != nil {
		return ""
	}
	return strings.TrimSpace(string(data))
}

func envOrDefault(key, defaultVal string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	// Also check the _FILE variant.
	if fileVal := envOrSecret(key); fileVal != "" {
		return fileVal
	}
	return defaultVal
}
