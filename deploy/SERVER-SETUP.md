# Server Setup (Manual)

All commands run via Tailscale SSH: `ssh root@100.65.161.20`

## 1. Install Docker

```bash
apt-get update
apt-get install -y ca-certificates curl gnupg
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" > /etc/apt/sources.list.d/docker.list
apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
systemctl enable docker && systemctl start docker
```

## 2. Configure UFW Firewall

```bash
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow 80/tcp comment 'HTTP'
ufw allow 443/tcp comment 'HTTPS'
ufw allow from 100.64.0.0/10 to any port 22 proto tcp comment 'SSH via Tailscale'
ufw deny 22/tcp comment 'Block public SSH'
ufw --force enable
ufw status verbose
```

## 3. Create Directory Structure

```bash
mkdir -p /opt/freesslcert/deploy/nginx/ssl
mkdir -p /opt/freesslcert/deploy/nginx/conf.d
```

## 4. Generate Deploy SSH Key

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f /root/.ssh/github_deploy_key -N ""
cat /root/.ssh/github_deploy_key.pub >> /root/.ssh/authorized_keys
chmod 600 /root/.ssh/authorized_keys
cat /root/.ssh/github_deploy_key
```

Copy the private key output and add it as GitHub Secret `DEPLOY_SSH_KEY`.

## 5. Create Production .env

```bash
cat > /opt/freesslcert/.env << 'EOF'
APP_ENV=production
APP_PORT=8080
DB_PATH=/app/data/freesslcert.db
ACME_DATA_DIR=/app/data/acme
ACME_EMAIL=admin@freesslcert.net
ACME_DIRECTORY_URL=https://acme-v02.api.letsencrypt.org/directory
CLOUDFLARE_API_TOKEN=<your-token>
CORS_ALLOWED_ORIGINS=https://freesslcert.net,https://www.freesslcert.net
RATE_LIMIT_REQUESTS=30
RATE_LIMIT_WINDOW_SECONDS=60
EOF
chmod 600 /opt/freesslcert/.env
```

Edit and replace `<your-token>` with the real Cloudflare API token.

## 6. Install Cloudflare Origin Certificate

Generate at: Cloudflare Dashboard > SSL/TLS > Origin Server > Create Certificate
- Hostname: `api.freesslcert.net`
- Validity: 15 years

Then copy to server:
```bash
# From your local machine (via Tailscale)
scp origin.pem root@100.65.161.20:/opt/freesslcert/deploy/nginx/ssl/
scp origin-key.pem root@100.65.161.20:/opt/freesslcert/deploy/nginx/ssl/
ssh root@100.65.161.20 'chmod 600 /opt/freesslcert/deploy/nginx/ssl/origin-key.pem'
```

## 7. GitHub Secrets

| Secret | Value |
|--------|-------|
| `TS_OAUTH_CLIENT_ID` | Tailscale OAuth Client ID |
| `TS_OAUTH_SECRET` | Tailscale OAuth Client Secret |
| `DEPLOY_HOST` | `100.65.161.20` |
| `DEPLOY_USER` | `root` |
| `DEPLOY_SSH_KEY` | Private key from step 4 |

## 8. Tailscale ACL

In Tailscale Admin Console > ACLs, add:
```jsonc
{
  "tagOwners": { "tag:ci": ["autogroup:admin"] },
  "acls": [
    { "action": "accept", "src": ["tag:ci"], "dst": ["100.65.161.20:22"] }
  ]
}
```

## 9. DNS (Cloudflare)

| Type | Name | Value | Proxy |
|------|------|-------|-------|
| CNAME | `@` | `<user>.github.io` | DNS only |
| CNAME | `www` | `<user>.github.io` | DNS only |
| A | `api` | Server public IP | Proxied |

SSL/TLS mode: Full (strict)

## 10. First Deploy

```bash
# On server
cd /opt/freesslcert
docker compose up -d
docker compose logs -f
```

## Verification

```bash
# SSH blocked publicly
ssh root@<public-ip>              # Should timeout

# SSH works via Tailscale
ssh root@100.65.161.20            # Should work

# API accessible
curl https://api.freesslcert.net/health

# Frontend accessible
curl https://freesslcert.net
```
