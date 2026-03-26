package service

import (
	"context"
	"crypto"
	"crypto/ecdsa"
	"crypto/elliptic"
	"crypto/rand"
	"crypto/rsa"
	"crypto/sha256"
	"crypto/x509"
	"encoding/base64"
	"encoding/json"
	"encoding/pem"
	"fmt"
	"log/slog"
	"strings"
	"sync"
	"time"

	"github.com/go-acme/lego/v4/certcrypto"
	"github.com/go-acme/lego/v4/certificate"
	"github.com/go-acme/lego/v4/lego"
	"github.com/go-acme/lego/v4/registration"
	"github.com/google/uuid"

	"github.com/freesslcert/freesslcert/internal/config"
	"github.com/freesslcert/freesslcert/internal/model"
	"github.com/freesslcert/freesslcert/internal/repository"
)

// acmeUser implements the lego registration.User interface.
type acmeUser struct {
	Email        string                 `json:"email"`
	Registration *registration.Resource `json:"registration"`
	key          crypto.PrivateKey
}

func (u *acmeUser) GetEmail() string                        { return u.Email }
func (u *acmeUser) GetRegistration() *registration.Resource { return u.Registration }
func (u *acmeUser) GetPrivateKey() crypto.PrivateKey        { return u.key }

// manualHTTPProvider captures HTTP-01 challenge details for the user to provision manually.
// Present() blocks until the user signals readiness via Unblock(), giving them time to place
// the validation file on their server before lego tells ACME to verify.
type manualHTTPProvider struct {
	mu         sync.Mutex
	challenges map[string]model.Challenge // domain -> challenge
	ready      map[string]chan struct{}    // domain -> unblock signal
	presented  chan struct{}
}

func newManualHTTPProvider() *manualHTTPProvider {
	return &manualHTTPProvider{
		challenges: make(map[string]model.Challenge),
		ready:      make(map[string]chan struct{}),
		presented:  make(chan struct{}, 100),
	}
}

func (p *manualHTTPProvider) Present(domain, token, keyAuth string) error {
	readyCh := make(chan struct{})
	p.mu.Lock()
	p.challenges[domain] = model.Challenge{
		Domain:      domain,
		Type:        model.ChallengeHTTP01,
		Token:       token,
		KeyAuth:     keyAuth,
		Status:      model.StatusPending,
		FilePath:    "/.well-known/acme-challenge/" + token,
		FileContent: keyAuth,
	}
	p.ready[domain] = readyCh
	p.mu.Unlock()
	p.presented <- struct{}{}

	// Block until user confirms they've placed the file (via Unblock) or timeout.
	select {
	case <-readyCh:
		return nil
	case <-time.After(10 * time.Minute):
		return fmt.Errorf("timed out waiting for user to place HTTP challenge file for %s", domain)
	}
}

// Unblock signals that the user has placed the challenge file for the given domain.
func (p *manualHTTPProvider) Unblock(domain string) {
	p.mu.Lock()
	ch, ok := p.ready[domain]
	p.mu.Unlock()
	if ok {
		select {
		case <-ch:
			// already closed
		default:
			close(ch)
		}
	}
}

func (p *manualHTTPProvider) CleanUp(domain, token, keyAuth string) error {
	p.mu.Lock()
	delete(p.challenges, domain)
	delete(p.ready, domain)
	p.mu.Unlock()
	return nil
}

func (p *manualHTTPProvider) GetChallenges() []model.Challenge {
	p.mu.Lock()
	defer p.mu.Unlock()
	result := make([]model.Challenge, 0, len(p.challenges))
	for _, c := range p.challenges {
		result = append(result, c)
	}
	return result
}

// manualDNSProvider captures DNS-01 challenge details.
// Present() blocks until the user signals readiness via Unblock(), giving them time to create
// the DNS TXT record before lego tells ACME to verify.
type manualDNSProvider struct {
	mu         sync.Mutex
	challenges map[string]model.Challenge
	ready      map[string]chan struct{}
	presented  chan struct{}
}

func newManualDNSProvider() *manualDNSProvider {
	return &manualDNSProvider{
		challenges: make(map[string]model.Challenge),
		ready:      make(map[string]chan struct{}),
		presented:  make(chan struct{}, 100),
	}
}

func (p *manualDNSProvider) Present(domain, token, keyAuth string) error {
	fqdn := fmt.Sprintf("_acme-challenge.%s", domain)

	// DNS-01 requires the TXT record value to be the base64url-encoded
	// SHA-256 digest of the key authorization (RFC 8555 Section 8.4).
	digest := sha256.Sum256([]byte(keyAuth))
	txtValue := base64.RawURLEncoding.EncodeToString(digest[:])

	readyCh := make(chan struct{})
	p.mu.Lock()
	p.challenges[domain] = model.Challenge{
		Domain:      domain,
		Type:        model.ChallengeDNS01,
		Token:       token,
		KeyAuth:     keyAuth,
		Status:      model.StatusPending,
		RecordName:  fqdn,
		RecordValue: txtValue,
	}
	p.ready[domain] = readyCh
	p.mu.Unlock()
	p.presented <- struct{}{}

	// Block until user confirms they've created the DNS record (via Unblock) or timeout.
	select {
	case <-readyCh:
		return nil
	case <-time.After(10 * time.Minute):
		return fmt.Errorf("timed out waiting for user to create DNS record for %s", domain)
	}
}

// Unblock signals that the user has created the DNS TXT record for the given domain.
func (p *manualDNSProvider) Unblock(domain string) {
	p.mu.Lock()
	ch, ok := p.ready[domain]
	p.mu.Unlock()
	if ok {
		select {
		case <-ch:
		default:
			close(ch)
		}
	}
}

func (p *manualDNSProvider) CleanUp(domain, token, keyAuth string) error {
	p.mu.Lock()
	delete(p.challenges, domain)
	delete(p.ready, domain)
	p.mu.Unlock()
	return nil
}

func (p *manualDNSProvider) GetChallenges() []model.Challenge {
	p.mu.Lock()
	defer p.mu.Unlock()
	result := make([]model.Challenge, 0, len(p.challenges))
	for _, c := range p.challenges {
		result = append(result, c)
	}
	return result
}

func (p *manualDNSProvider) Timeout() (time.Duration, time.Duration) {
	return 120 * time.Second, 5 * time.Second
}

// orderState holds ephemeral ACME state for an in-flight order.
type orderState struct {
	PrivateKey  crypto.PrivateKey
	Domains     []string
	KeyType     string
	HTTPProvider *manualHTTPProvider
	DNSProvider  *manualDNSProvider
}

// ACMEService orchestrates ACME certificate issuance via the lego library.
type ACMEService struct {
	user      *acmeUser
	cfg       *config.Config
	repo      repository.CertificateRepository
	acmeRepo  repository.AcmeAccountRepository
	logger    *slog.Logger
	orders    sync.Map // map[orderID]*orderState
}

// NewACMEService initialises the ACME client, registering a new account when
// no persisted account data is found in the database.
func NewACMEService(ctx context.Context, cfg *config.Config, repo repository.CertificateRepository, acmeRepo repository.AcmeAccountRepository, logger *slog.Logger) (*ACMEService, error) {
	user, err := loadOrCreateUser(ctx, acmeRepo, cfg)
	if err != nil {
		return nil, fmt.Errorf("load or create acme user: %w", err)
	}

	// Register the account if not already registered.
	if user.Registration == nil {
		legoCfg := lego.NewConfig(user)
		legoCfg.CADirURL = cfg.ACMEDirectoryURL
		legoCfg.Certificate.KeyType = certcrypto.RSA2048

		client, err := lego.NewClient(legoCfg)
		if err != nil {
			return nil, fmt.Errorf("create lego client for registration: %w", err)
		}

		reg, err := client.Registration.Register(registration.RegisterOptions{TermsOfServiceAgreed: true})
		if err != nil {
			return nil, fmt.Errorf("register acme account: %w", err)
		}
		user.Registration = reg
		if err := saveUser(ctx, acmeRepo, cfg, user); err != nil {
			return nil, fmt.Errorf("save acme user after registration: %w", err)
		}
		logger.Info("registered new ACME account", "email", user.Email)
	} else {
		logger.Info("loaded existing ACME account", "email", user.Email)
	}

	return &ACMEService{
		user:     user,
		cfg:      cfg,
		repo:     repo,
		acmeRepo: acmeRepo,
		logger:   logger,
	}, nil
}

// CreateOrder creates a new certificate order, generates a private key for the
// certificate, starts the ACME Obtain flow in the background, and returns the
// order with real challenge information from the ACME server.
//
// The background goroutine self-finalizes: on success it writes the certificate
// data directly to the database; on failure it sets the order status to failed.
// There is no separate FinalizeCertificate step -- clients poll GET /orders/:id
// until the status transitions to "issued" or "failed".
func (s *ACMEService) CreateOrder(ctx context.Context, req model.CreateOrderRequest) (*model.CertificateOrder, error) {
	orderID := uuid.New().String()

	privKey, err := generatePrivateKey(req.KeyType)
	if err != nil {
		return nil, fmt.Errorf("generate private key: %w", err)
	}

	httpProv := newManualHTTPProvider()
	dnsProv := newManualDNSProvider()

	// Configure a fresh lego client per order with the custom providers.
	legoCfg := lego.NewConfig(s.user)
	legoCfg.CADirURL = s.cfg.ACMEDirectoryURL
	legoCfg.Certificate.KeyType = mapKeyType(req.KeyType)

	client, err := lego.NewClient(legoCfg)
	if err != nil {
		return nil, fmt.Errorf("create lego client for order: %w", err)
	}

	// Determine which challenge provider to use based on the request.
	// Wildcard domains always require DNS-01. Non-wildcards default to HTTP-01
	// unless the user explicitly requests DNS-01.
	hasWildcard := false
	for _, d := range req.Domains {
		if strings.HasPrefix(d, "*.") {
			hasWildcard = true
			break
		}
	}

	useDNS := hasWildcard || req.ValidationMethod == "dns-01"

	if useDNS {
		if err := client.Challenge.SetDNS01Provider(dnsProv); err != nil {
			return nil, fmt.Errorf("set DNS-01 provider: %w", err)
		}
	} else {
		if err := client.Challenge.SetHTTP01Provider(httpProv); err != nil {
			return nil, fmt.Errorf("set HTTP-01 provider: %w", err)
		}
	}

	// Create the DB record FIRST so the background goroutine can update it
	// even if it completes before we finish waiting for challenges (e.g.,
	// when Let's Encrypt has a cached authorization and skips challenges).
	now := time.Now().UTC()
	order := &model.CertificateOrder{
		ID:              orderID,
		Domains:         req.Domains,
		CertificateType: req.CertificateType,
		KeyType:         req.KeyType,
		Status:          model.StatusPending,
		CreatedAt:       now,
		PurgeAfter:      now.Add(24 * time.Hour),
	}

	if err := s.repo.Create(ctx, order); err != nil {
		return nil, fmt.Errorf("persist certificate order: %w", err)
	}

	s.orders.Store(orderID, &orderState{
		PrivateKey:   privKey,
		Domains:      req.Domains,
		KeyType:      req.KeyType,
		HTTPProvider: httpProv,
		DNSProvider:  dnsProv,
	})

	// Launch self-finalizing background goroutine with its own timeout context.
	bgCtx, bgCancel := context.WithTimeout(context.Background(), 10*time.Minute)
	doneCh := make(chan struct{})

	go func() {
		defer close(doneCh)
		defer bgCancel()
		defer s.orders.Delete(orderID)

		resource, obtainErr := client.Certificate.Obtain(certificate.ObtainRequest{
			Domains:    req.Domains,
			Bundle:     true,
			PrivateKey: privKey,
		})

		if obtainErr != nil {
			s.logger.Error("certificate obtain failed", "order_id", orderID, "error", obtainErr)
			_ = s.repo.UpdateStatus(bgCtx, orderID, model.StatusFailed)
			return
		}

		// Success — save certificate to DB.
		issueTime := time.Now().UTC()

		// Parse actual certificate expiry; fall back to 90 days.
		expiry := issueTime.Add(90 * 24 * time.Hour)
		if len(resource.Certificate) > 0 {
			block, _ := pem.Decode(resource.Certificate)
			if block != nil {
				if cert, parseErr := x509.ParseCertificate(block.Bytes); parseErr == nil {
					expiry = cert.NotAfter
				}
			}
		}

		privKeyPEM, encErr := encodePrivateKey(privKey)
		if encErr != nil {
			s.logger.Error("encode private key failed", "order_id", orderID, "error", encErr)
			_ = s.repo.UpdateStatus(bgCtx, orderID, model.StatusFailed)
			return
		}

		certOrder := &model.CertificateOrder{
			ID:          orderID,
			Certificate: string(resource.Certificate),
			PrivateKey:  privKeyPEM,
			CABundle:    string(resource.IssuerCertificate),
			Status:      model.StatusIssued,
			IssuedAt:    &issueTime,
			ExpiresAt:   &expiry,
		}

		if err := s.repo.UpdateCertificate(bgCtx, certOrder); err != nil {
			s.logger.Error("save certificate failed", "order_id", orderID, "error", err)
			return
		}

		// Log successful domain issuance for permanent audit trail.
		if err := s.repo.LogDomain(bgCtx, certOrder); err != nil {
			s.logger.Error("log domain failed", "order_id", orderID, "error", err)
		}

		s.logger.Info("certificate issued", "order_id", orderID, "domains", req.Domains)
	}()

	// Wait for challenges to be presented by lego, OR for the goroutine to
	// complete (happens when authorization is already cached by Let's Encrypt).
	var challenges []model.Challenge
	timeout := time.After(20 * time.Second)
	expectedCount := len(req.Domains)

	for len(challenges) < expectedCount {
		select {
		case <-timeout:
			goto done
		case <-doneCh:
			// Obtain completed without presenting challenges (cached authz).
			// Fetch the order from DB — it may already be "issued".
			updatedOrder, fetchErr := s.repo.GetByID(ctx, orderID)
			if fetchErr == nil && updatedOrder.Status == model.StatusIssued {
				s.logger.Info("certificate issued immediately (cached authorization)",
					"order_id", orderID, "domains", req.Domains)
				return updatedOrder, nil
			}
			// If it failed, return empty challenges so the caller sees the order.
			goto done
		case <-httpProv.presented:
			challenges = httpProv.GetChallenges()
		case <-dnsProv.presented:
			challenges = dnsProv.GetChallenges()
		}
	}
done:

	// Update challenges in DB if we captured any.
	if len(challenges) > 0 {
		_ = s.repo.UpdateChallenges(ctx, orderID, challenges)
	}

	// Return the order (with or without challenges).
	order.Challenges = challenges

	s.logger.Info("created certificate order",
		"order_id", orderID,
		"domains", req.Domains,
		"challenges", len(challenges),
	)

	return order, nil
}

// ValidateChallenge updates the challenge status for a given domain within an
// order. The actual ACME validation is handled by lego in the background
// Obtain goroutine; this method updates the DB status so the API can track
// progress.
func (s *ACMEService) ValidateChallenge(ctx context.Context, orderID string, domain string) error {
	order, err := s.repo.GetByID(ctx, orderID)
	if err != nil {
		return fmt.Errorf("get order for validation: %w", err)
	}

	// Strip wildcard prefix — lego stores challenges by the bare domain.
	lookupDomain := strings.TrimPrefix(domain, "*.")

	found := false
	for i := range order.Challenges {
		if order.Challenges[i].Domain == lookupDomain {
			order.Challenges[i].Status = model.ChallengeStatusValidating
			found = true
			break
		}
	}
	if !found {
		return fmt.Errorf("domain %s in order %s: %w", domain, orderID, model.ErrNotFound)
	}

	if err := s.repo.UpdateChallenges(ctx, orderID, order.Challenges); err != nil {
		return fmt.Errorf("update challenges: %w", err)
	}

	// Unblock the provider so lego can proceed with ACME validation.
	// Use the bare domain (without wildcard prefix) as that's what lego uses.
	if state, ok := s.orders.Load(orderID); ok {
		os := state.(*orderState)
		if os.HTTPProvider != nil {
			os.HTTPProvider.Unblock(lookupDomain)
		}
		if os.DNSProvider != nil {
			os.DNSProvider.Unblock(lookupDomain)
		}
	}

	// Check if all challenges are submitted and update order status.
	allSubmitted := true
	for _, ch := range order.Challenges {
		if ch.Status == model.ChallengeStatusPending {
			allSubmitted = false
			break
		}
	}
	if allSubmitted {
		if err := s.repo.UpdateStatus(ctx, orderID, model.StatusValidating); err != nil {
			return fmt.Errorf("update order status to validating: %w", err)
		}
	}

	s.logger.Info("validated challenge", "order_id", orderID, "domain", domain)
	return nil
}

// RevokeCertificate revokes a previously issued certificate.
func (s *ACMEService) RevokeCertificate(ctx context.Context, orderID string) error {
	order, err := s.repo.GetByID(ctx, orderID)
	if err != nil {
		return fmt.Errorf("get order for revocation: %w", err)
	}

	if order.Status != model.StatusIssued {
		return fmt.Errorf("order %s is not issued (status=%s): %w", orderID, order.Status, model.ErrInvalidInput)
	}

	if order.Certificate != "" {
		// Create a one-off client for revocation.
		legoCfg := lego.NewConfig(s.user)
		legoCfg.CADirURL = s.cfg.ACMEDirectoryURL

		client, clientErr := lego.NewClient(legoCfg)
		if clientErr != nil {
			return fmt.Errorf("create lego client for revocation: %w", clientErr)
		}
		// lego's Revoke expects PEM-encoded certificate bytes.
		if err := client.Certificate.Revoke([]byte(order.Certificate)); err != nil {
			return fmt.Errorf("revoke certificate with ACME: %w", err)
		}
	}

	if err := s.repo.UpdateStatus(ctx, orderID, model.StatusRevoked); err != nil {
		return fmt.Errorf("update status to revoked: %w", err)
	}

	s.logger.Info("certificate revoked", "order_id", orderID)
	return nil
}

// StartCleanup runs a background goroutine that periodically removes stale
// entries from the in-memory orders map.
func (s *ACMEService) StartCleanup(ctx context.Context) {
	go func() {
		ticker := time.NewTicker(1 * time.Hour)
		defer ticker.Stop()
		for {
			select {
			case <-ctx.Done():
				return
			case <-ticker.C:
				// Clean up orders that are no longer active in the DB.
				s.orders.Range(func(key, value any) bool {
					orderID := key.(string)
					order, err := s.repo.GetByID(context.Background(), orderID)
					if err != nil || order.Status == model.StatusIssued || order.Status == model.StatusFailed || order.Status == model.StatusRevoked {
						s.orders.Delete(key)
					}
					return true
				})
			}
		}
	}()
}

// --- helpers ----------------------------------------------------------------

func mapKeyType(keyType string) certcrypto.KeyType {
	switch keyType {
	case "rsa-2048":
		return certcrypto.RSA2048
	case "rsa-4096":
		return certcrypto.RSA4096
	case "ecdsa-p256":
		return certcrypto.EC256
	case "ecdsa-p384":
		return certcrypto.EC384
	default:
		return certcrypto.RSA2048
	}
}

func generatePrivateKey(keyType string) (crypto.PrivateKey, error) {
	switch keyType {
	case "rsa-2048":
		return rsa.GenerateKey(rand.Reader, 2048)
	case "rsa-4096":
		return rsa.GenerateKey(rand.Reader, 4096)
	case "ecdsa-p256":
		return ecdsa.GenerateKey(elliptic.P256(), rand.Reader)
	case "ecdsa-p384":
		return ecdsa.GenerateKey(elliptic.P384(), rand.Reader)
	default:
		return nil, fmt.Errorf("unsupported key type: %s", keyType)
	}
}

func encodePrivateKey(key crypto.PrivateKey) (string, error) {
	switch k := key.(type) {
	case *rsa.PrivateKey:
		block := &pem.Block{
			Type:  "RSA PRIVATE KEY",
			Bytes: x509.MarshalPKCS1PrivateKey(k),
		}
		return string(pem.EncodeToMemory(block)), nil
	case *ecdsa.PrivateKey:
		der, err := x509.MarshalECPrivateKey(k)
		if err != nil {
			return "", fmt.Errorf("marshal ecdsa key: %w", err)
		}
		block := &pem.Block{
			Type:  "EC PRIVATE KEY",
			Bytes: der,
		}
		return string(pem.EncodeToMemory(block)), nil
	default:
		return "", fmt.Errorf("unsupported key type %T", key)
	}
}

// loadOrCreateUser loads a persisted ACME user from the database or creates a new one.
func loadOrCreateUser(ctx context.Context, acmeRepo repository.AcmeAccountRepository, cfg *config.Config) (*acmeUser, error) {
	user := &acmeUser{Email: cfg.ACMEEmail}

	// Try to load existing account from database.
	account, err := acmeRepo.GetAccount(ctx)
	if err != nil {
		return nil, fmt.Errorf("get acme account from db: %w", err)
	}

	if account != nil {
		// Parse the stored private key.
		block, _ := pem.Decode([]byte(account.PrivateKeyPEM))
		if block != nil {
			privKey, ecErr := x509.ParseECPrivateKey(block.Bytes)
			if ecErr != nil {
				rsaKey, rsaErr := x509.ParsePKCS1PrivateKey(block.Bytes)
				if rsaErr != nil {
					return nil, fmt.Errorf("parse account key: %w (ecdsa: %v)", rsaErr, ecErr)
				}
				user.key = rsaKey
			} else {
				user.key = privKey
			}
		}

		// Parse the stored registration.
		if account.RegistrationJSON != "" {
			var reg registration.Resource
			if jsonErr := json.Unmarshal([]byte(account.RegistrationJSON), &reg); jsonErr == nil {
				user.Registration = &reg
			}
		}

		return user, nil
	}

	// No account found — generate a new ECDSA P-256 key.
	privKey, err := ecdsa.GenerateKey(elliptic.P256(), rand.Reader)
	if err != nil {
		return nil, fmt.Errorf("generate account key: %w", err)
	}
	user.key = privKey

	// Persist the new key to DB (registration will be saved after ACME registration).
	der, err := x509.MarshalECPrivateKey(privKey)
	if err != nil {
		return nil, fmt.Errorf("marshal account key: %w", err)
	}
	keyPEM := string(pem.EncodeToMemory(&pem.Block{Type: "EC PRIVATE KEY", Bytes: der}))

	if err := acmeRepo.SaveAccount(ctx, &repository.AcmeAccount{
		Email:         cfg.ACMEEmail,
		PrivateKeyPEM: keyPEM,
		CreatedAt:     time.Now().UTC(),
	}); err != nil {
		return nil, fmt.Errorf("save new acme account key: %w", err)
	}

	return user, nil
}

// saveUser persists the account registration data to the database.
func saveUser(ctx context.Context, acmeRepo repository.AcmeAccountRepository, cfg *config.Config, user *acmeUser) error {
	regData, err := json.MarshalIndent(user.Registration, "", "  ")
	if err != nil {
		return fmt.Errorf("marshal registration: %w", err)
	}

	keyPEM, err := encodePrivateKey(user.key)
	if err != nil {
		return fmt.Errorf("encode account key: %w", err)
	}

	return acmeRepo.SaveAccount(ctx, &repository.AcmeAccount{
		Email:            cfg.ACMEEmail,
		PrivateKeyPEM:    keyPEM,
		RegistrationJSON: string(regData),
		CreatedAt:        time.Now().UTC(),
	})
}
