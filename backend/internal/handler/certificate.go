package handler

import (
	"context"
	"crypto/x509"
	"encoding/json"
	"encoding/pem"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"software.sslmate.com/src/go-pkcs12"

	"github.com/freesslcert/freesslcert/internal/model"
	"github.com/freesslcert/freesslcert/internal/repository"
	"github.com/freesslcert/freesslcert/internal/service"
)

// CertificateHandler exposes HTTP endpoints for the certificate order lifecycle.
type CertificateHandler struct {
	acme           *service.ACMEService
	repo           repository.CertificateRepository
	notifRepo      repository.NotificationRepository
	allowedOrigins map[string]bool
}

// NewCertificateHandler constructs a CertificateHandler.
func NewCertificateHandler(
	acme *service.ACMEService,
	repo repository.CertificateRepository,
	notifRepo repository.NotificationRepository,
	allowedOrigins []string,
) *CertificateHandler {
	origins := make(map[string]bool, len(allowedOrigins))
	for _, o := range allowedOrigins {
		origins[o] = true
	}
	return &CertificateHandler{
		acme:           acme,
		repo:           repo,
		notifRepo:      notifRepo,
		allowedOrigins: origins,
	}
}

// CreateOrder handles POST /api/v1/orders.
func (h *CertificateHandler) CreateOrder(c *gin.Context) {
	var req model.CreateOrderRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Code:    "invalid_request",
			Message: fmt.Sprintf("invalid request body: %v", err),
		})
		return
	}

	// Validate domain count based on certificate type.
	if req.CertificateType == "single" && len(req.Domains) != 1 {
		c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Code:    "invalid_request",
			Message: "single certificate type requires exactly one domain",
		})
		return
	}

	if req.CertificateType == "wildcard" {
		if len(req.Domains) != 1 {
			c.JSON(http.StatusBadRequest, model.ErrorResponse{
				Code:    "invalid_request",
				Message: "wildcard certificate requires exactly one domain",
			})
			return
		}
		for _, d := range req.Domains {
			if len(d) < 3 || d[:2] != "*." {
				c.JSON(http.StatusBadRequest, model.ErrorResponse{
					Code:    "invalid_request",
					Message: fmt.Sprintf("wildcard certificate requires domains starting with *., got %q", d),
				})
				return
			}
		}
	}

	// Extract country from the Cloudflare-injected header. This is a
	// two-letter ISO-3166 country code (e.g. "US", "DE") or "XX" for unknown
	// origins. Requests that bypass Cloudflare (local curl, internal probes)
	// will have no header, which we store as NULL in domain_log.
	country := c.GetHeader("CF-IPCountry")

	order, err := h.acme.CreateOrder(c.Request.Context(), req, country)
	if err != nil {
		handleError(c, err)
		return
	}

	c.JSON(http.StatusCreated, order)
}

// GetOrder handles GET /api/v1/orders/:id.
func (h *CertificateHandler) GetOrder(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Code:    "invalid_request",
			Message: "order ID is required",
		})
		return
	}

	order, err := h.repo.GetByID(c.Request.Context(), id)
	if err != nil {
		handleError(c, err)
		return
	}

	c.JSON(http.StatusOK, order)
}

// validateRequest is the request body for POST /api/v1/orders/:id/validate.
type validateRequest struct {
	Domain string `json:"domain" binding:"required"`
}

// ValidateOrder handles POST /api/v1/orders/:id/validate.
func (h *CertificateHandler) ValidateOrder(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Code:    "invalid_request",
			Message: "order ID is required",
		})
		return
	}

	var req validateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Code:    "invalid_request",
			Message: fmt.Sprintf("invalid request body: %v", err),
		})
		return
	}

	if err := h.acme.ValidateChallenge(c.Request.Context(), id, req.Domain); err != nil {
		handleError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "challenge validated"})
}

// DownloadCertificate handles GET /api/v1/orders/:id/download/:format.
func (h *CertificateHandler) DownloadCertificate(c *gin.Context) {
	id := c.Param("id")
	format := c.Param("format")

	if id == "" || format == "" {
		c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Code:    "invalid_request",
			Message: "order ID and format are required",
		})
		return
	}

	order, err := h.repo.GetByID(c.Request.Context(), id)
	if err != nil {
		handleError(c, err)
		return
	}

	if order.Status != model.StatusIssued {
		c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Code:    "order_not_issued",
			Message: fmt.Sprintf("order status is %s, must be issued to download", order.Status),
		})
		return
	}

	switch format {
	case "pem":
		fullChain := order.Certificate
		if order.CABundle != "" {
			fullChain += "\n" + order.CABundle
		}

		c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=%s.pem", order.Domains[0]))
		c.Data(http.StatusOK, "application/x-pem-file", []byte(fullChain))

	case "key":
		c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=%s.key", order.Domains[0]))
		c.Data(http.StatusOK, "application/x-pem-file", []byte(order.PrivateKey))

	case "bundle":
		bundle := order.Certificate + "\n" + order.PrivateKey
		if order.CABundle != "" {
			bundle += "\n" + order.CABundle
		}
		c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=%s-bundle.pem", order.Domains[0]))
		c.Data(http.StatusOK, "application/x-pem-file", []byte(bundle))

	case "der":
		block, _ := pem.Decode([]byte(order.Certificate))
		if block == nil {
			c.JSON(http.StatusInternalServerError, model.ErrorResponse{
				Code:    "conversion_error",
				Message: "failed to decode certificate PEM",
			})
			return
		}
		c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=%s.der", order.Domains[0]))
		c.Data(http.StatusOK, "application/x-x509-ca-cert", block.Bytes)

	case "pkcs12":
		certBlock, _ := pem.Decode([]byte(order.Certificate))
		if certBlock == nil {
			c.JSON(http.StatusInternalServerError, model.ErrorResponse{
				Code:    "conversion_error",
				Message: "failed to decode certificate PEM",
			})
			return
		}
		cert, err := x509.ParseCertificate(certBlock.Bytes)
		if err != nil {
			c.JSON(http.StatusInternalServerError, model.ErrorResponse{
				Code:    "conversion_error",
				Message: "failed to parse certificate",
			})
			return
		}

		keyBlock, _ := pem.Decode([]byte(order.PrivateKey))
		if keyBlock == nil {
			c.JSON(http.StatusInternalServerError, model.ErrorResponse{
				Code:    "conversion_error",
				Message: "failed to decode private key PEM",
			})
			return
		}
		privKey, err := x509.ParsePKCS8PrivateKey(keyBlock.Bytes)
		if err != nil {
			// Try PKCS1
			privKey2, err2 := x509.ParsePKCS1PrivateKey(keyBlock.Bytes)
			if err2 != nil {
				// Try EC
				privKey3, err3 := x509.ParseECPrivateKey(keyBlock.Bytes)
				if err3 != nil {
					c.JSON(http.StatusInternalServerError, model.ErrorResponse{
						Code:    "conversion_error",
						Message: "failed to parse private key",
					})
					return
				}
				privKey = privKey3
			} else {
				privKey = privKey2
			}
		}

		pfxData, err := pkcs12.LegacyRC2.Encode(privKey, cert, nil, "changeit")
		if err != nil {
			c.JSON(http.StatusInternalServerError, model.ErrorResponse{
				Code:    "conversion_error",
				Message: "failed to create PKCS12 bundle",
			})
			return
		}
		c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=%s.p12", order.Domains[0]))
		c.Data(http.StatusOK, "application/x-pkcs12", pfxData)

	default:
		c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Code:    "invalid_format",
			Message: fmt.Sprintf("unsupported download format %q; use pem, key, bundle, der, or pkcs12", format),
		})
	}
}

// RevokeOrder handles POST /api/v1/orders/:id/revoke.
func (h *CertificateHandler) RevokeOrder(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Code:    "invalid_request",
			Message: "order ID is required",
		})
		return
	}

	if err := h.acme.RevokeCertificate(c.Request.Context(), id); err != nil {
		handleError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "certificate revoked"})
}

// GetConfig handles GET /api/v1/config.
func (h *CertificateHandler) GetConfig(c *gin.Context) {
	c.JSON(http.StatusOK, model.ConfigResponse{
		KeyTypes:          []string{"rsa-2048", "rsa-4096", "ecdsa-p256", "ecdsa-p384"},
		CertificateTypes:  []string{"single", "wildcard"},
		ValidationMethods: []string{"http-01", "dns-01"},
	})
}

// subscribeRequest is the inbound payload for subscribing to expiry notifications.
type subscribeRequest struct {
	Email string `json:"email" binding:"required,email"`
}

// Subscribe handles POST /api/v1/orders/:id/subscribe.
// It subscribes the given email address to expiry reminders for the order's
// certificate.
func (h *CertificateHandler) Subscribe(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Code:    "invalid_request",
			Message: "order ID is required",
		})
		return
	}

	var req subscribeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Code:    "invalid_request",
			Message: fmt.Sprintf("invalid request body: %v", err),
		})
		return
	}

	order, err := h.repo.GetByID(c.Request.Context(), id)
	if err != nil {
		handleError(c, err)
		return
	}

	if order.Status != model.StatusIssued {
		c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Code:    "order_not_issued",
			Message: fmt.Sprintf("order status is %s, must be issued to subscribe", order.Status),
		})
		return
	}

	if order.ExpiresAt == nil {
		c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Code:    "invalid_request",
			Message: "order has no expiry date",
		})
		return
	}

	if len(order.Domains) == 0 {
		c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Code:    "invalid_request",
			Message: "order has no domains",
		})
		return
	}

	domain := order.Domains[0]
	expiresAt := order.ExpiresAt.UTC().Format(time.RFC3339)

	_, err = h.notifRepo.Subscribe(c.Request.Context(), req.Email, id, domain, expiresAt)
	if err != nil {
		slog.Error("subscribe to expiry notification", "error", err, "order_id", id)
		c.JSON(http.StatusInternalServerError, model.ErrorResponse{
			Code:    "internal_error",
			Message: "failed to create subscription",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "subscribed"})
}

// Unsubscribe handles GET /api/v1/unsubscribe/:token.
// It removes the notification subscription and returns a simple HTML page.
func (h *CertificateHandler) Unsubscribe(c *gin.Context) {
	token := c.Param("token")
	if token == "" {
		c.String(http.StatusBadRequest, "missing unsubscribe token")
		return
	}

	if err := h.notifRepo.Unsubscribe(c.Request.Context(), token); err != nil {
		slog.Error("unsubscribe notification", "error", err, "token", token)
		c.String(http.StatusInternalServerError, "an error occurred")
		return
	}

	c.Header("Content-Type", "text/html; charset=utf-8")
	c.String(http.StatusOK, `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Unsubscribed - FreeSSLCert.net</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 500px; margin: 80px auto; padding: 20px; text-align: center; color: #333;">
  <h1 style="color: #10b981; font-size: 24px;">FreeSSLCert.net</h1>
  <h2 style="font-size: 20px; margin-top: 32px;">You've been unsubscribed</h2>
  <p style="font-size: 16px; line-height: 1.6; color: #6b7280;">
    You will no longer receive SSL certificate expiry reminders.
  </p>
  <p style="margin-top: 32px;">
    <a href="https://freesslcert.net" style="color: #10b981; text-decoration: none;">Back to FreeSSLCert.net</a>
  </p>
</body>
</html>`)
}

// WebSocketOrder handles GET /api/v1/orders/:id/ws.
// It upgrades the HTTP connection to a WebSocket, sends the current order state
// immediately, then polls the database every 2 seconds and pushes updates when
// the order changes. The connection is closed after sending a terminal state
// (issued, failed, revoked).
func (h *CertificateHandler) WebSocketOrder(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Code:    "invalid_request",
			Message: "order ID is required",
		})
		return
	}

	upgrader := websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			origin := r.Header.Get("Origin")
			if origin == "" {
				return true
			}
			return h.allowedOrigins[origin]
		},
	}

	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		// Upgrade writes its own HTTP error response; just log.
		slog.Error("websocket upgrade failed", "error", err, "order_id", id)
		return
	}
	defer conn.Close()

	// Use a background context so the poll loop is not tied to the
	// already-hijacked HTTP request context.
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// Monitor client disconnects: when the client sends a close frame or the
	// connection drops, cancel the context so the poll loop exits.
	go func() {
		defer cancel()
		for {
			if _, _, err := conn.ReadMessage(); err != nil {
				return
			}
		}
	}()

	// Fetch and send the initial state.
	order, err := h.repo.GetByID(ctx, id)
	if err != nil {
		writeWSError(conn, err)
		return
	}

	snapshot, err := marshalOrder(order)
	if err != nil {
		slog.Error("marshal order for websocket", "error", err, "order_id", id)
		return
	}

	if err := conn.WriteMessage(websocket.TextMessage, snapshot); err != nil {
		return
	}

	// If already terminal, close immediately after sending the state.
	if isTerminalStatus(order.Status) {
		conn.WriteMessage(websocket.CloseMessage,
			websocket.FormatCloseMessage(websocket.CloseNormalClosure, "order complete"))
		return
	}

	// Poll loop: check every 2 seconds for changes.
	ticker := time.NewTicker(2 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
			updated, err := h.repo.GetByID(ctx, id)
			if err != nil {
				// If the order was deleted or a transient DB error occurred,
				// inform the client and close.
				writeWSError(conn, err)
				return
			}

			newSnapshot, err := marshalOrder(updated)
			if err != nil {
				slog.Error("marshal order for websocket", "error", err, "order_id", id)
				return
			}

			// Only send when the serialised representation actually changed.
			if string(newSnapshot) == string(snapshot) {
				continue
			}
			snapshot = newSnapshot

			if err := conn.WriteMessage(websocket.TextMessage, snapshot); err != nil {
				return
			}

			if isTerminalStatus(updated.Status) {
				conn.WriteMessage(websocket.CloseMessage,
					websocket.FormatCloseMessage(websocket.CloseNormalClosure, "order complete"))
				return
			}
		}
	}
}

// isTerminalStatus returns true for order statuses that will never change again.
func isTerminalStatus(status string) bool {
	switch status {
	case model.StatusIssued, model.StatusFailed, model.StatusRevoked:
		return true
	default:
		return false
	}
}

// marshalOrder serialises a CertificateOrder to JSON bytes.
func marshalOrder(order *model.CertificateOrder) ([]byte, error) {
	data, err := json.Marshal(order)
	if err != nil {
		return nil, fmt.Errorf("marshal certificate order: %w", err)
	}
	return data, nil
}

// writeWSError sends an error message over the WebSocket and initiates a close.
func writeWSError(conn *websocket.Conn, err error) {
	msg := model.ErrorResponse{
		Code:    "error",
		Message: "failed to fetch order",
	}
	if errors.Is(err, model.ErrNotFound) {
		msg.Code = "not_found"
		msg.Message = "order not found"
	}
	data, marshalErr := json.Marshal(msg)
	if marshalErr != nil {
		return
	}
	conn.WriteMessage(websocket.TextMessage, data)
	conn.WriteMessage(websocket.CloseMessage,
		websocket.FormatCloseMessage(websocket.CloseInternalServerErr, msg.Message))
}

// handleError maps domain errors to HTTP status codes.
func handleError(c *gin.Context, err error) {
	switch {
	case errors.Is(err, model.ErrNotFound):
		c.JSON(http.StatusNotFound, model.ErrorResponse{
			Code:    "not_found",
			Message: err.Error(),
		})
	case errors.Is(err, model.ErrInvalidInput):
		c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Code:    "invalid_input",
			Message: err.Error(),
		})
	case errors.Is(err, model.ErrForbidden):
		c.JSON(http.StatusForbidden, model.ErrorResponse{
			Code:    "forbidden",
			Message: err.Error(),
		})
	case errors.Is(err, model.ErrOrderNotReady):
		c.JSON(http.StatusConflict, model.ErrorResponse{
			Code:    "order_not_ready",
			Message: err.Error(),
		})
	default:
		slog.Error("internal error", "error", err, "path", c.Request.URL.Path)
		c.JSON(http.StatusInternalServerError, model.ErrorResponse{
			Code:    "internal_error",
			Message: "an internal error occurred",
		})
	}
}
