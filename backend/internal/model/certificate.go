package model

import (
	"errors"
	"time"
)

// Sentinel errors for domain-level error handling.
var (
	ErrNotFound      = errors.New("not found")
	ErrAlreadyExists = errors.New("already exists")
	ErrForbidden     = errors.New("forbidden")
	ErrInvalidInput  = errors.New("invalid input")
	ErrOrderNotReady = errors.New("order not ready for finalization")
)

// CertificateOrder represents a single SSL certificate order lifecycle.
type CertificateOrder struct {
	ID              string      `json:"id"`
	Domains         []string    `json:"domains"`
	CertificateType string      `json:"certificate_type"`
	KeyType         string      `json:"key_type"`
	Status          string      `json:"status"`
	Certificate     string      `json:"certificate,omitempty"`
	PrivateKey      string      `json:"private_key,omitempty"`
	CABundle        string      `json:"ca_bundle,omitempty"`
	IssuedAt        *time.Time  `json:"issued_at,omitempty"`
	ExpiresAt       *time.Time  `json:"expires_at,omitempty"`
	CreatedAt       time.Time   `json:"created_at"`
	PurgeAfter      time.Time   `json:"purge_after"`
	Challenges      []Challenge `json:"challenges,omitempty"`
}

// Challenge holds ACME challenge details for a single domain.
type Challenge struct {
	Domain      string `json:"domain"`
	Type        string `json:"type"`
	Token       string `json:"token"`
	KeyAuth     string `json:"key_authorization"`
	Status      string `json:"status"`
	RecordName  string `json:"record_name,omitempty"`
	RecordValue string `json:"record_value,omitempty"`
	FilePath    string `json:"file_path,omitempty"`
	FileContent string `json:"file_content,omitempty"`
}

// CreateOrderRequest is the inbound payload for creating a certificate order.
type CreateOrderRequest struct {
	Domains          []string `json:"domains" binding:"required,min=1"`
	CertificateType  string   `json:"certificate_type" binding:"required,oneof=single wildcard multi-domain"`
	KeyType          string   `json:"key_type" binding:"required,oneof=rsa-2048 rsa-4096 ecdsa-p256 ecdsa-p384"`
	ValidationMethod string   `json:"validation_method,omitempty"`
	CSR              string   `json:"csr,omitempty"`
}

// ConfigResponse describes the capabilities the API exposes to clients.
type ConfigResponse struct {
	KeyTypes          []string `json:"key_types"`
	CertificateTypes  []string `json:"certificate_types"`
	ValidationMethods []string `json:"validation_methods"`
}

// ErrorResponse is the standard error envelope returned by the API.
type ErrorResponse struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

// Order status constants.
const (
	StatusPending    = "pending"
	StatusValidating = "validating"
	StatusIssued     = "issued"
	StatusFailed     = "failed"
	StatusRevoked    = "revoked"
)

// Challenge type constants.
const (
	ChallengeHTTP01 = "http-01"
	ChallengeDNS01  = "dns-01"
)

// Challenge status constants.
const (
	ChallengeStatusPending    = "pending"
	ChallengeStatusValidating = "validating"
	ChallengeStatusValid      = "valid"
	ChallengeStatusInvalid    = "invalid"
)
