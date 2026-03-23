import api from "@/lib/api-client";
import type { CertificateOrder, CreateOrderRequest, ConfigResponse } from "@/types/certificate";

export const certificatesApi = {
  createOrder: (data: CreateOrderRequest) =>
    api.post<CertificateOrder>("/api/v1/orders", data).then((r) => r.data),

  getOrder: (id: string) =>
    api.get<CertificateOrder>(`/api/v1/orders/${id}`).then((r) => r.data),

  validateOrder: (id: string, domain: string) =>
    api.post<{ status: string }>(`/api/v1/orders/${id}/validate`, { domain }).then((r) => r.data),

  finalizeOrder: (id: string) =>
    api.post<CertificateOrder>(`/api/v1/orders/${id}/finalize`).then((r) => r.data),

  downloadCertificate: (id: string, format: string) =>
    api.get(`/api/v1/orders/${id}/download/${format}`, { responseType: "blob" }).then((r) => r.data),

  revokeOrder: (id: string) =>
    api.post(`/api/v1/orders/${id}/revoke`).then((r) => r.data),

  getConfig: () =>
    api.get<ConfigResponse>("/api/v1/config").then((r) => r.data),
};
