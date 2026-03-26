package service

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"log/slog"
	"net/http"
	"time"

	"github.com/freesslcert/freesslcert/internal/repository"
)

// Notifier sends SSL certificate expiry reminder emails via the Resend API.
type Notifier struct {
	apiKey  string
	repo    repository.NotificationRepository
	baseURL string
	logger  *slog.Logger
}

// NewNotifier constructs a Notifier. The baseURL is used for building
// unsubscribe links (e.g. "https://api.freesslcert.net").
func NewNotifier(apiKey string, repo repository.NotificationRepository, logger *slog.Logger) *Notifier {
	return &Notifier{
		apiKey:  apiKey,
		repo:    repo,
		baseURL: "https://api.freesslcert.net",
		logger:  logger,
	}
}

// SendPendingNotifications queries due notifications for 14-day and 7-day
// windows, sends reminder emails, and marks each subscription as notified.
func (n *Notifier) SendPendingNotifications(ctx context.Context) {
	for _, days := range []int{14, 7} {
		subs, err := n.repo.GetDueNotifications(ctx, days)
		if err != nil {
			n.logger.Error("get due notifications", "days", days, "error", err)
			continue
		}

		for _, sub := range subs {
			subject := fmt.Sprintf("Your SSL certificate for %s expires in %d days", sub.Domain, days)
			html := n.buildEmailHTML(sub.Domain, sub.ExpiresAt, days, sub.UnsubscribeToken)

			if err := n.sendEmail(ctx, sub.Email, subject, html); err != nil {
				n.logger.Error("send expiry notification email",
					"email", sub.Email,
					"domain", sub.Domain,
					"days", days,
					"error", err,
				)
				continue
			}

			if err := n.repo.MarkNotified(ctx, sub.ID, days); err != nil {
				n.logger.Error("mark notification sent",
					"id", sub.ID,
					"days", days,
					"error", err,
				)
			}

			n.logger.Info("expiry notification sent",
				"email", sub.Email,
				"domain", sub.Domain,
				"days", days,
			)
		}
	}
}

// resendRequest is the payload sent to the Resend API.
type resendRequest struct {
	From    string   `json:"from"`
	To      []string `json:"to"`
	Subject string   `json:"subject"`
	HTML    string   `json:"html"`
}

// sendEmail sends a single email via the Resend API.
func (n *Notifier) sendEmail(ctx context.Context, to, subject, html string) error {
	payload := resendRequest{
		From:    "FreeSSLCert <noreply@freesslcert.net>",
		To:      []string{to},
		Subject: subject,
		HTML:    html,
	}

	body, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("marshal email payload: %w", err)
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, "https://api.resend.com/emails", bytes.NewReader(body))
	if err != nil {
		return fmt.Errorf("create resend request: %w", err)
	}
	req.Header.Set("Authorization", "Bearer "+n.apiKey)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("send resend request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		return fmt.Errorf("resend API returned status %d", resp.StatusCode)
	}

	return nil
}

// buildEmailHTML generates a minimal inline-styled HTML email body for an
// SSL certificate expiry reminder.
func (n *Notifier) buildEmailHTML(domain string, expiresAt time.Time, days int, unsubscribeToken string) string {
	expiryDate := expiresAt.Format("January 2, 2006")
	unsubscribeURL := fmt.Sprintf("%s/api/v1/unsubscribe/%s", n.baseURL, unsubscribeToken)

	return fmt.Sprintf(`<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
  <div style="text-align: center; padding: 20px 0; border-bottom: 2px solid #10b981;">
    <h1 style="color: #10b981; margin: 0; font-size: 24px;">FreeSSLCert.net</h1>
  </div>

  <div style="padding: 30px 0;">
    <h2 style="color: #1f2937; font-size: 20px;">SSL Certificate Expiry Reminder</h2>
    <p style="font-size: 16px; line-height: 1.6;">
      Your SSL certificate for <strong>%s</strong> will expire in <strong>%d days</strong> on <strong>%s</strong>.
    </p>
    <p style="font-size: 16px; line-height: 1.6;">
      To avoid any downtime or security warnings for your visitors, please renew your certificate before it expires.
    </p>
    <div style="text-align: center; padding: 20px 0;">
      <a href="https://freesslcert.net"
         style="display: inline-block; background-color: #10b981; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-size: 16px; font-weight: 600;">
        Renew Now
      </a>
    </div>
  </div>

  <div style="border-top: 1px solid #e5e7eb; padding-top: 16px; text-align: center; font-size: 13px; color: #9ca3af;">
    <p>You received this email because you subscribed to SSL certificate expiry reminders on FreeSSLCert.net.</p>
    <p><a href="%s" style="color: #9ca3af;">Unsubscribe</a></p>
  </div>
</body>
</html>`, domain, days, expiryDate, unsubscribeURL)
}
