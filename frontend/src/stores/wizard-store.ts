import { create } from "zustand";
import type { WizardState, WizardActions } from "@/types/wizard";

const initialState: WizardState = {
  currentStep: "domain",
  certificateType: "single",
  domains: [],
  keyType: "rsa-2048",
  csrContent: null,
  expertMode: false,
  validationMethod: "http-01",
  orderId: null,
  challenges: [],
  certificateData: null,
  autoClearTimestamp: null,
};

export const useWizardStore = create<WizardState & WizardActions>((set) => ({
  ...initialState,

  setStep: (step) => set({ currentStep: step }),

  addDomain: (domain) =>
    set((state) => ({
      domains: [...state.domains, { id: crypto.randomUUID(), domain }],
    })),

  removeDomain: (id) =>
    set((state) => ({
      domains: state.domains.filter((d) => d.id !== id),
    })),

  setCertificateType: (type) => set({ certificateType: type }),
  setKeyType: (type) => set({ keyType: type }),
  setValidationMethod: (method) => set({ validationMethod: method }),
  setOrderId: (id) => set({ orderId: id }),
  setChallenges: (challenges) => set({ challenges }),
  setCertificateData: (data) =>
    set({ certificateData: data, autoClearTimestamp: Date.now() + 15 * 60 * 1000 }),
  setExpertMode: (expert) => set({ expertMode: expert }),
  setCsrContent: (csr) => set({ csrContent: csr }),
  reset: () => set(initialState),
}));
