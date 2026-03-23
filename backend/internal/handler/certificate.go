package handler

import (
	"crypto/x509"
	"encoding/pem"
	"errors"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"software.sslmate.com/src/go-pkcs12"

	"github.com/freesslcert/freesslcert/internal/model"
	"github.com/freesslcert/freesslcert/internal/repository"
	"github.com/freesslcert/freesslcert/internal/service"
)

// CertificateHandler exposes HTTP endpoints for the certificate order lifecycle.
type CertificateHandler struct {
	acme *service.ACMEService
	repo repository.CertificateRepository
}

// NewCertificateHandler constructs a CertificateHandler.
func NewCertificateHandler(acme *service.ACMEService, repo repository.CertificateRepository) *CertificateHandler {
	return &CertificateHandler{acme: acme, repo: repo}
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

	order, err := h.acme.CreateOrder(c.Request.Context(), req)
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

// FinalizeOrder handles POST /api/v1/orders/:id/finalize.
func (h *CertificateHandler) FinalizeOrder(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Code:    "invalid_request",
			Message: "order ID is required",
		})
		return
	}

	order, err := h.acme.FinalizeCertificate(c.Request.Context(), id)
	if err != nil {
		handleError(c, err)
		return
	}

	c.JSON(http.StatusOK, order)
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
		CertificateTypes:  []string{"single", "wildcard", "multi-domain"},
		ValidationMethods: []string{"http-01", "dns-01"},
	})
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
		c.JSON(http.StatusInternalServerError, model.ErrorResponse{
			Code:    "internal_error",
			Message: "an internal error occurred",
		})
	}
}
