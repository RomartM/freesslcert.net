import type { CertificateType, KeyType, ValidationMethod, CertificateOrder, Challenge } from "./certificate";

export type WizardStep = "domain" | "validation" | "download";

export interface DomainEntry {
  id: string;
  domain: string;
}

export interface WizardState {
  currentStep: WizardStep;
  certificateType: CertificateType;
  domains: DomainEntry[];
  keyType: KeyType;
  csrContent: string | null;
  expertMode: boolean;
  validationMethod: ValidationMethod;
  orderId: string | null;
  challenges: Challenge[];
  certificateData: CertificateOrder | null;
  autoClearTimestamp: number | null;
}

export interface WizardActions {
  setStep: (step: WizardStep) => void;
  addDomain: (domain: string) => void;
  removeDomain: (id: string) => void;
  setCertificateType: (type: CertificateType) => void;
  setKeyType: (type: KeyType) => void;
  setValidationMethod: (method: ValidationMethod) => void;
  setOrderId: (id: string) => void;
  setChallenges: (challenges: Challenge[]) => void;
  setCertificateData: (data: CertificateOrder) => void;
  setExpertMode: (expert: boolean) => void;
  setCsrContent: (csr: string | null) => void;
  reset: () => void;
}
