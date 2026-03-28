package handler

import (
	"crypto/tls"
	"crypto/x509"
	"fmt"
	"math"
	"net"
	"net/http"
	"regexp"
	"strings"
	"time"

	"github.com/gin-gonic/gin"

	"github.com/freesslcert/freesslcert/internal/model"
)

// SSLCheckHandler exposes the SSL certificate checking endpoint.
type SSLCheckHandler struct{}

// NewSSLCheckHandler constructs an SSLCheckHandler.
func NewSSLCheckHandler() *SSLCheckHandler {
	return &SSLCheckHandler{}
}

// domainPattern matches valid domain names. It allows subdomains and TLDs of
// two or more characters. It does NOT allow bare IP addresses.
var domainPattern = regexp.MustCompile(`^([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$`)

// Check handles GET /api/ssl-check?domain={domain}.
func (h *SSLCheckHandler) Check(c *gin.Context) {
	rawDomain := strings.TrimSpace(c.Query("domain"))
	if rawDomain == "" {
		c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Code:    "invalid_request",
			Message: "domain query parameter is required",
		})
		return
	}

	domain, err := sanitizeDomain(rawDomain)
	if err != nil {
		c.JSON(http.StatusBadRequest, model.SSLCheckResponse{
			Domain: rawDomain,
			Valid:  false,
			Status: "error",
			Error:  err.Error(),
		})
		return
	}

	if err := rejectInternalDomain(domain); err != nil {
		c.JSON(http.StatusBadRequest, model.SSLCheckResponse{
			Domain: domain,
			Valid:  false,
			Status: "error",
			Error:  err.Error(),
		})
		return
	}

	result := checkSSLCertificate(domain)
	c.JSON(http.StatusOK, result)
}

// sanitizeDomain strips protocol prefixes, trailing slashes, paths, and port
// numbers, then validates the remaining string looks like a domain name.
func sanitizeDomain(raw string) (string, error) {
	domain := raw

	// Strip protocol prefixes.
	for _, prefix := range []string{"https://", "http://"} {
		domain = strings.TrimPrefix(domain, prefix)
	}

	// Strip trailing path, query string, and fragment.
	if idx := strings.IndexByte(domain, '/'); idx != -1 {
		domain = domain[:idx]
	}
	if idx := strings.IndexByte(domain, '?'); idx != -1 {
		domain = domain[:idx]
	}
	if idx := strings.IndexByte(domain, '#'); idx != -1 {
		domain = domain[:idx]
	}

	// Strip port number if present.
	if host, _, err := net.SplitHostPort(domain); err == nil {
		domain = host
	}

	domain = strings.TrimSpace(strings.ToLower(domain))

	if domain == "" {
		return "", fmt.Errorf("domain is empty after sanitization")
	}

	if !domainPattern.MatchString(domain) {
		return "", fmt.Errorf("invalid domain name: %s", domain)
	}

	return domain, nil
}

// rejectInternalDomain blocks requests to localhost, internal hostnames, and
// domains that resolve to private/reserved IP ranges.
func rejectInternalDomain(domain string) error {
	// Block well-known internal hostnames.
	lower := strings.ToLower(domain)
	blockedSuffixes := []string{
		"localhost",
		".local",
		".internal",
		".lan",
		".home",
		".corp",
		".intranet",
	}
	for _, suffix := range blockedSuffixes {
		if lower == suffix || strings.HasSuffix(lower, suffix) {
			return fmt.Errorf("checking internal domains is not allowed: %s", domain)
		}
	}

	// Resolve the domain and check each IP against private/reserved ranges.
	ips, err := net.LookupHost(domain)
	if err != nil {
		// If DNS resolution fails, let the TLS check handle the error
		// downstream so the user gets a meaningful connection error.
		return nil
	}

	for _, ipStr := range ips {
		ip := net.ParseIP(ipStr)
		if ip == nil {
			continue
		}
		if ip.IsLoopback() || ip.IsPrivate() || ip.IsLinkLocalUnicast() ||
			ip.IsLinkLocalMulticast() || ip.IsUnspecified() {
			return fmt.Errorf("domain %s resolves to a private/reserved IP address", domain)
		}
	}

	return nil
}

// checkSSLCertificate connects to the domain on port 443, performs a TLS
// handshake, and extracts certificate information.
func checkSSLCertificate(domain string) model.SSLCheckResponse {
	dialer := &net.Dialer{Timeout: 5 * time.Second}
	conn, err := tls.DialWithDialer(dialer, "tcp", domain+":443", &tls.Config{
		// We deliberately allow InsecureSkipVerify so we can still report
		// on expired or self-signed certificates rather than failing outright.
		// We perform our own validity assessment below.
		InsecureSkipVerify: true, //nolint:gosec
	})
	if err != nil {
		return model.SSLCheckResponse{
			Domain: domain,
			Valid:  false,
			Status: "error",
			Error:  fmt.Sprintf("connection failed: %s", err.Error()),
		}
	}
	defer conn.Close()

	state := conn.ConnectionState()
	if len(state.PeerCertificates) == 0 {
		return model.SSLCheckResponse{
			Domain: domain,
			Valid:  false,
			Status: "error",
			Error:  "no certificates presented by server",
		}
	}

	leaf := state.PeerCertificates[0]
	now := time.Now()

	// Determine validity: the leaf certificate must be temporally valid AND
	// must verify against the system root pool for the requested domain.
	isValid := true
	status := "valid"

	if now.Before(leaf.NotBefore) {
		isValid = false
		status = "not_yet_valid"
	} else if now.After(leaf.NotAfter) {
		isValid = false
		status = "expired"
	}

	// Additionally verify the certificate chain and hostname match.
	if isValid {
		opts := x509.VerifyOptions{
			DNSName:       domain,
			Intermediates: x509.NewCertPool(),
		}
		for _, cert := range state.PeerCertificates[1:] {
			opts.Intermediates.AddCert(cert)
		}
		if _, verifyErr := leaf.Verify(opts); verifyErr != nil {
			isValid = false
			status = "invalid"
		}
	}

	daysUntilExpiry := int(math.Floor(time.Until(leaf.NotAfter).Hours() / 24))

	// Build issuer info.
	issuerOrg := ""
	if len(leaf.Issuer.Organization) > 0 {
		issuerOrg = leaf.Issuer.Organization[0]
	}

	// Build the certificate chain.
	chain := make([]model.SSLChainEntry, 0, len(state.PeerCertificates))
	for _, cert := range state.PeerCertificates {
		issuerCN := cert.Issuer.CommonName
		chain = append(chain, model.SSLChainEntry{
			Subject:    cert.Subject.CommonName,
			Issuer:     issuerCN,
			ValidFrom:  cert.NotBefore,
			ValidUntil: cert.NotAfter,
		})
	}

	return model.SSLCheckResponse{
		Domain: domain,
		Valid:  isValid,
		Status: status,
		Certificate: &model.SSLCertificate{
			CommonName:         leaf.Subject.CommonName,
			SANs:               leaf.DNSNames,
			Issuer: model.SSLIssuer{
				Organization: issuerOrg,
				CommonName:   leaf.Issuer.CommonName,
			},
			ValidFrom:          leaf.NotBefore,
			ValidUntil:         leaf.NotAfter,
			DaysUntilExpiry:    daysUntilExpiry,
			SerialNumber:       leaf.SerialNumber.Text(16),
			SignatureAlgorithm: formatSignatureAlgorithm(leaf.SignatureAlgorithm),
			Protocol:           formatTLSVersion(state.Version),
		},
		Chain: chain,
	}
}

// formatSignatureAlgorithm converts x509.SignatureAlgorithm to a readable string.
func formatSignatureAlgorithm(algo x509.SignatureAlgorithm) string {
	switch algo {
	case x509.SHA256WithRSA:
		return "SHA256-RSA"
	case x509.SHA384WithRSA:
		return "SHA384-RSA"
	case x509.SHA512WithRSA:
		return "SHA512-RSA"
	case x509.SHA256WithRSAPSS:
		return "SHA256-RSAPSS"
	case x509.SHA384WithRSAPSS:
		return "SHA384-RSAPSS"
	case x509.SHA512WithRSAPSS:
		return "SHA512-RSAPSS"
	case x509.ECDSAWithSHA256:
		return "ECDSA-SHA256"
	case x509.ECDSAWithSHA384:
		return "ECDSA-SHA384"
	case x509.ECDSAWithSHA512:
		return "ECDSA-SHA512"
	case x509.PureEd25519:
		return "Ed25519"
	default:
		return algo.String()
	}
}

// formatTLSVersion converts the TLS version constant to a human-readable string.
func formatTLSVersion(version uint16) string {
	switch version {
	case tls.VersionTLS10:
		return "TLS 1.0"
	case tls.VersionTLS11:
		return "TLS 1.1"
	case tls.VersionTLS12:
		return "TLS 1.2"
	case tls.VersionTLS13:
		return "TLS 1.3"
	default:
		return fmt.Sprintf("Unknown (0x%04x)", version)
	}
}
