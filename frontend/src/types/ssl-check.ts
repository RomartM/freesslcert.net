/** Status of the SSL certificate check. */
export type SSLCheckStatus =
  | "valid"
  | "expired"
  | "not_yet_valid"
  | "invalid"
  | "self_signed"
  | "error";

/** Issuer information from the SSL certificate. */
export interface SSLIssuer {
  organization: string;
  commonName: string;
}

/** Parsed SSL certificate details returned by the backend. */
export interface SSLCertificate {
  commonName: string;
  sans: string[];
  issuer: SSLIssuer;
  validFrom: string;
  validUntil: string;
  daysUntilExpiry: number;
  serialNumber: string;
  signatureAlgorithm: string;
  protocol: string;
}

/** A single certificate in the chain of trust. */
export interface SSLChainEntry {
  subject: string;
  issuer: string;
  validFrom: string;
  validUntil: string;
}

/** Full response from GET /api/ssl-check?domain={domain}. */
export interface SSLCheckResponse {
  domain: string;
  valid: boolean;
  status: SSLCheckStatus;
  certificate?: SSLCertificate;
  chain?: SSLChainEntry[];
  error?: string;
}
