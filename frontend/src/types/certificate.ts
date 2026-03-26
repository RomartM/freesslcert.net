export type CertificateType = "single" | "wildcard" | "multi-domain";
export type KeyType = "rsa-2048" | "rsa-4096" | "ecdsa-p256" | "ecdsa-p384";
export type ValidationMethod = "http-01" | "dns-01";
export type OrderStatus = "pending" | "validating" | "issued" | "failed" | "revoked";
export type ChallengeStatus = "pending" | "validating" | "valid" | "invalid";

export interface Challenge {
  domain: string;
  type: ValidationMethod;
  token: string;
  key_authorization: string;
  status: ChallengeStatus;
  record_name?: string;
  record_value?: string;
  file_path?: string;
  file_content?: string;
}

export interface CertificateOrder {
  id: string;
  domains: string[];
  certificate_type: CertificateType;
  key_type: KeyType;
  status: OrderStatus;
  certificate?: string;
  private_key?: string;
  ca_bundle?: string;
  issued_at?: string;
  expires_at?: string;
  created_at: string;
  challenges?: Challenge[];
}

export interface CreateOrderRequest {
  domains: string[];
  certificate_type: CertificateType;
  key_type: KeyType;
  validation_method?: ValidationMethod;
  csr?: string;
}

export interface ConfigResponse {
  key_types: string[];
  certificate_types: string[];
  validation_methods: string[];
}
