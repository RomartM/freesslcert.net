---
name: licensing-system
description: >
  Software licensing system design and implementation. Hardware fingerprinting, cryptographic
  license signing, online/offline validation, and license management. Use whenever discussing
  or implementing licensing, activation, trial, or DRM features.
  Triggers on: license, activation, hardware fingerprint, trial, subscription, DRM, or
  software protection.
---

# Licensing System Skill

## Official Documentation (ALWAYS check first)
- .NET Cryptography: https://learn.microsoft.com/en-us/dotnet/standard/security/cryptography-model
- .NET Data Protection: https://learn.microsoft.com/en-us/aspnet/core/security/data-protection/
- Go Crypto: https://pkg.go.dev/crypto
- RSA (RFC 8017): https://www.rfc-editor.org/rfc/rfc8017
- Ed25519 (RFC 8032): https://www.rfc-editor.org/rfc/rfc8032

## License Architecture

### Components
1. **License Server** (Go) — Issues and validates licenses
2. **License Client** (C#) — Embedded in application, validates locally
3. **Admin Portal** (React) — License management dashboard
4. **Hardware Fingerprint Collector** — Cross-platform system identifier

### Validation Flow
```
Application Start
  → Load license file
  → Verify cryptographic signature (public key)
  → Check expiration date
  → Collect hardware fingerprint
  → Compare fingerprint (fuzzy match, N-1 of M factors)
  → Online: Heartbeat to license server
  → Offline: Validate grace period (72h default)
  → Result: Valid / Expired / Invalid / Grace Period
```

### Security Requirements
- Private signing key stored only on license server (HSM in production)
- Public verification key embedded in application binary
- License file is signed, not encrypted (integrity over secrecy)
- Multiple validation checkpoints in application (not just startup)
- Anti-tampering: checksum validation on critical binaries
- Rate-limited license API endpoints
- Audit logging for all license operations

Read `references/fingerprint-implementation.md` for hardware fingerprint code.
Read `references/crypto-signing.md` for license signing/verification code.
