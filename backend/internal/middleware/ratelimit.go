package middleware

import (
	"context"
	"fmt"
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"

	"github.com/freesslcert/freesslcert/internal/config"
	"github.com/freesslcert/freesslcert/internal/model"
)

// bucket tracks request tokens for a single client IP.
type bucket struct {
	tokens    int
	lastReset time.Time
}

// RateLimiter is an in-memory per-IP token-bucket rate limiter.
type RateLimiter struct {
	mu      sync.Mutex
	buckets map[string]*bucket
	limit   int
	window  time.Duration
}

// NewRateLimiter creates a RateLimiter from configuration.
func NewRateLimiter(cfg *config.Config) *RateLimiter {
	return &RateLimiter{
		buckets: make(map[string]*bucket),
		limit:   cfg.RateLimitRequests,
		window:  cfg.RateLimitWindow,
	}
}

// StartCleanup runs a background goroutine that periodically prunes stale
// entries from the buckets map to prevent unbounded memory growth.
func (rl *RateLimiter) StartCleanup(ctx context.Context) {
	go func() {
		ticker := time.NewTicker(5 * time.Minute)
		defer ticker.Stop()
		for {
			select {
			case <-ctx.Done():
				return
			case <-ticker.C:
				rl.mu.Lock()
				now := time.Now()
				for ip, b := range rl.buckets {
					if now.Sub(b.lastReset) > 2*rl.window {
						delete(rl.buckets, ip)
					}
				}
				rl.mu.Unlock()
			}
		}
	}()
}

// Middleware returns a gin handler that enforces rate limiting.
func (rl *RateLimiter) Middleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		ip := c.ClientIP()

		rl.mu.Lock()
		b, exists := rl.buckets[ip]
		now := time.Now()

		if !exists || now.Sub(b.lastReset) >= rl.window {
			rl.buckets[ip] = &bucket{
				tokens:    rl.limit - 1,
				lastReset: now,
			}
			rl.mu.Unlock()
			c.Next()
			return
		}

		if b.tokens <= 0 {
			retryAfter := rl.window - now.Sub(b.lastReset)
			rl.mu.Unlock()

			c.Header("Retry-After", fmt.Sprintf("%.0f", retryAfter.Seconds()))
			c.AbortWithStatusJSON(http.StatusTooManyRequests, model.ErrorResponse{
				Code:    "rate_limited",
				Message: fmt.Sprintf("rate limit exceeded, try again in %.0f seconds", retryAfter.Seconds()),
			})
			return
		}

		b.tokens--
		rl.mu.Unlock()
		c.Next()
	}
}
