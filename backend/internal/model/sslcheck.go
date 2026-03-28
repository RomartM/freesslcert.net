package model

import "time"

// SSLCheckResponse is the response envelope for the SSL check endpoint.
type SSLCheckResponse struct {
	Domain      string           `json:"domain"`
	Valid       bool             `json:"valid"`
	Status      string           `json:"status"`
	Certificate *SSLCertificate  `json:"certificate,omitempty"`
	Chain       []SSLChainEntry  `json:"chain,omitempty"`
	Error       string           `json:"error,omitempty"`
}

// SSLCertificate holds the parsed certificate details.
type SSLCertificate struct {
	CommonName         string    `json:"commonName"`
	SANs               []string  `json:"sans"`
	Issuer             SSLIssuer `json:"issuer"`
	ValidFrom          time.Time `json:"validFrom"`
	ValidUntil         time.Time `json:"validUntil"`
	DaysUntilExpiry    int       `json:"daysUntilExpiry"`
	SerialNumber       string    `json:"serialNumber"`
	SignatureAlgorithm string    `json:"signatureAlgorithm"`
	Protocol           string    `json:"protocol"`
}

// SSLIssuer holds issuer information from a certificate.
type SSLIssuer struct {
	Organization string `json:"organization"`
	CommonName   string `json:"commonName"`
}

// SSLChainEntry represents a single certificate in the chain.
type SSLChainEntry struct {
	Subject    string    `json:"subject"`
	Issuer     string    `json:"issuer"`
	ValidFrom  time.Time `json:"validFrom"`
	ValidUntil time.Time `json:"validUntil"`
}
