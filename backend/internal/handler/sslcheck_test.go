package handler

import (
	"crypto/x509"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"

	"github.com/freesslcert/freesslcert/internal/model"
)

func init() {
	gin.SetMode(gin.TestMode)
}

func setupSSLCheckRouter() (*gin.Engine, *SSLCheckHandler) {
	h := NewSSLCheckHandler()
	r := gin.New()
	r.GET("/api/ssl-check", h.Check)
	return r, h
}

func TestSSLCheck_MissingDomain(t *testing.T) {
	t.Parallel()
	r, _ := setupSSLCheckRouter()

	w := httptest.NewRecorder()
	req, _ := http.NewRequest(http.MethodGet, "/api/ssl-check", nil)
	r.ServeHTTP(w, req)

	if w.Code != http.StatusBadRequest {
		t.Fatalf("expected status 400, got %d", w.Code)
	}

	var resp model.ErrorResponse
	if err := json.Unmarshal(w.Body.Bytes(), &resp); err != nil {
		t.Fatalf("unmarshal response: %v", err)
	}
	if resp.Code != "invalid_request" {
		t.Errorf("expected code 'invalid_request', got %q", resp.Code)
	}
}

func TestSSLCheck_EmptyDomain(t *testing.T) {
	t.Parallel()
	r, _ := setupSSLCheckRouter()

	w := httptest.NewRecorder()
	req, _ := http.NewRequest(http.MethodGet, "/api/ssl-check?domain=", nil)
	r.ServeHTTP(w, req)

	if w.Code != http.StatusBadRequest {
		t.Fatalf("expected status 400, got %d", w.Code)
	}
}

func TestSSLCheck_InvalidDomain(t *testing.T) {
	t.Parallel()

	cases := []struct {
		name   string
		domain string
	}{
		{"bare_word", "notadomain"},
		{"ip_address", "192.168.1.1"},
		{"ip_with_port", "192.168.1.1:443"},
		{"special_chars", "exam!ple.com"},
		{"only_slashes", "///"},
	}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			t.Parallel()
			r, _ := setupSSLCheckRouter()

			w := httptest.NewRecorder()
			req, _ := http.NewRequest(http.MethodGet, "/api/ssl-check?domain="+tc.domain, nil)
			r.ServeHTTP(w, req)

			if w.Code != http.StatusOK && w.Code != http.StatusBadRequest {
				t.Fatalf("expected status 200 or 400, got %d", w.Code)
			}

			var resp model.SSLCheckResponse
			if err := json.Unmarshal(w.Body.Bytes(), &resp); err != nil {
				t.Fatalf("unmarshal response: %v", err)
			}
			if resp.Valid {
				t.Errorf("expected valid=false for domain %q", tc.domain)
			}
			if resp.Status != "error" {
				t.Errorf("expected status 'error', got %q", resp.Status)
			}
		})
	}
}

func TestSSLCheck_InternalDomains(t *testing.T) {
	t.Parallel()

	cases := []struct {
		name   string
		domain string
	}{
		{"localhost_suffix", "my.localhost"},
		{"dot_local", "server.local"},
		{"dot_internal", "app.internal"},
		{"dot_lan", "printer.lan"},
	}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			t.Parallel()
			r, _ := setupSSLCheckRouter()

			w := httptest.NewRecorder()
			req, _ := http.NewRequest(http.MethodGet, "/api/ssl-check?domain="+tc.domain, nil)
			r.ServeHTTP(w, req)

			if w.Code != http.StatusBadRequest {
				t.Fatalf("expected status 400, got %d", w.Code)
			}

			var resp model.SSLCheckResponse
			if err := json.Unmarshal(w.Body.Bytes(), &resp); err != nil {
				t.Fatalf("unmarshal response: %v", err)
			}
			if resp.Valid {
				t.Errorf("expected valid=false for domain %q", tc.domain)
			}
		})
	}
}

func TestSanitizeDomain(t *testing.T) {
	t.Parallel()

	cases := []struct {
		name     string
		input    string
		expected string
		wantErr  bool
	}{
		{"plain_domain", "example.com", "example.com", false},
		{"https_prefix", "https://example.com", "example.com", false},
		{"http_prefix", "http://example.com", "example.com", false},
		{"trailing_slash", "example.com/", "example.com", false},
		{"with_path", "https://example.com/some/path", "example.com", false},
		{"with_port", "example.com:443", "example.com", false},
		{"with_query", "example.com?foo=bar", "example.com", false},
		{"with_fragment", "example.com#section", "example.com", false},
		{"uppercase", "EXAMPLE.COM", "example.com", false},
		{"subdomain", "www.example.com", "www.example.com", false},
		{"full_url", "https://www.example.com:443/path?q=1#frag", "www.example.com", false},
		{"empty_after_strip", "https://", "", true},
		{"just_slashes", "///", "", true},
		{"ip_address", "192.168.1.1", "", true},
		{"invalid_chars", "exam!ple.com", "", true},
	}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			t.Parallel()
			got, err := sanitizeDomain(tc.input)
			if tc.wantErr {
				if err == nil {
					t.Fatalf("expected error for input %q, got %q", tc.input, got)
				}
				return
			}
			if err != nil {
				t.Fatalf("unexpected error for input %q: %v", tc.input, err)
			}
			if got != tc.expected {
				t.Errorf("sanitizeDomain(%q) = %q, want %q", tc.input, got, tc.expected)
			}
		})
	}
}

func TestRejectInternalDomain(t *testing.T) {
	t.Parallel()

	rejected := []string{
		"my.localhost",
		"server.local",
		"app.internal",
		"printer.lan",
		"dev.home",
		"mail.corp",
		"wiki.intranet",
	}
	for _, domain := range rejected {
		t.Run("reject_"+domain, func(t *testing.T) {
			t.Parallel()
			if err := rejectInternalDomain(domain); err == nil {
				t.Errorf("expected rejection for %q", domain)
			}
		})
	}

	// Public domains should not be rejected (they may fail DNS, but
	// rejectInternalDomain should not return an error).
	allowed := []string{
		"example.com",
		"google.com",
		"github.com",
	}
	for _, domain := range allowed {
		t.Run("allow_"+domain, func(t *testing.T) {
			t.Parallel()
			if err := rejectInternalDomain(domain); err != nil {
				t.Errorf("unexpected rejection for %q: %v", domain, err)
			}
		})
	}
}

func TestFormatTLSVersion(t *testing.T) {
	t.Parallel()

	cases := []struct {
		version  uint16
		expected string
	}{
		{0x0301, "TLS 1.0"},
		{0x0302, "TLS 1.1"},
		{0x0303, "TLS 1.2"},
		{0x0304, "TLS 1.3"},
		{0x0000, "Unknown (0x0000)"},
	}

	for _, tc := range cases {
		t.Run(tc.expected, func(t *testing.T) {
			t.Parallel()
			got := formatTLSVersion(tc.version)
			if got != tc.expected {
				t.Errorf("formatTLSVersion(0x%04x) = %q, want %q", tc.version, got, tc.expected)
			}
		})
	}
}

func TestFormatSignatureAlgorithm(t *testing.T) {
	t.Parallel()

	cases := []struct {
		algo     x509.SignatureAlgorithm
		expected string
	}{
		{x509.SHA256WithRSA, "SHA256-RSA"},
		{x509.SHA384WithRSA, "SHA384-RSA"},
		{x509.SHA512WithRSA, "SHA512-RSA"},
		{x509.SHA256WithRSAPSS, "SHA256-RSAPSS"},
		{x509.SHA384WithRSAPSS, "SHA384-RSAPSS"},
		{x509.SHA512WithRSAPSS, "SHA512-RSAPSS"},
		{x509.ECDSAWithSHA256, "ECDSA-SHA256"},
		{x509.ECDSAWithSHA384, "ECDSA-SHA384"},
		{x509.ECDSAWithSHA512, "ECDSA-SHA512"},
		{x509.PureEd25519, "Ed25519"},
	}

	for _, tc := range cases {
		t.Run(tc.expected, func(t *testing.T) {
			t.Parallel()
			got := formatSignatureAlgorithm(tc.algo)
			if got != tc.expected {
				t.Errorf("formatSignatureAlgorithm(%v) = %q, want %q", tc.algo, got, tc.expected)
			}
		})
	}
}

// TestSSLCheck_RealDomain performs an integration test against a real public
// domain. It is skipped in short mode.
func TestSSLCheck_RealDomain(t *testing.T) {
	if testing.Short() {
		t.Skip("skipping integration test in short mode")
	}

	r, _ := setupSSLCheckRouter()

	w := httptest.NewRecorder()
	req, _ := http.NewRequest(http.MethodGet, "/api/ssl-check?domain=google.com", nil)
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d; body: %s", w.Code, w.Body.String())
	}

	var resp model.SSLCheckResponse
	if err := json.Unmarshal(w.Body.Bytes(), &resp); err != nil {
		t.Fatalf("unmarshal response: %v", err)
	}

	if resp.Domain != "google.com" {
		t.Errorf("expected domain 'google.com', got %q", resp.Domain)
	}
	if !resp.Valid {
		t.Errorf("expected valid=true for google.com, got error: %s", resp.Error)
	}
	if resp.Status != "valid" {
		t.Errorf("expected status 'valid', got %q", resp.Status)
	}
	if resp.Certificate == nil {
		t.Fatal("expected certificate to be non-nil")
	}
	if resp.Certificate.DaysUntilExpiry <= 0 {
		t.Errorf("expected positive days until expiry, got %d", resp.Certificate.DaysUntilExpiry)
	}
	if len(resp.Certificate.SANs) == 0 {
		t.Error("expected at least one SAN")
	}
	if resp.Certificate.Protocol == "" {
		t.Error("expected non-empty protocol")
	}
	if resp.Certificate.SerialNumber == "" {
		t.Error("expected non-empty serial number")
	}
	if len(resp.Chain) == 0 {
		t.Error("expected non-empty certificate chain")
	}
}

// TestSSLCheck_URLStripping verifies that protocol prefixes and paths are
// properly stripped before checking the domain.
func TestSSLCheck_URLStripping(t *testing.T) {
	if testing.Short() {
		t.Skip("skipping integration test in short mode")
	}

	r, _ := setupSSLCheckRouter()

	w := httptest.NewRecorder()
	req, _ := http.NewRequest(http.MethodGet, "/api/ssl-check?domain=https://google.com/search?q=test", nil)
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d", w.Code)
	}

	var resp model.SSLCheckResponse
	if err := json.Unmarshal(w.Body.Bytes(), &resp); err != nil {
		t.Fatalf("unmarshal response: %v", err)
	}

	if resp.Domain != "google.com" {
		t.Errorf("expected domain 'google.com', got %q", resp.Domain)
	}
}
