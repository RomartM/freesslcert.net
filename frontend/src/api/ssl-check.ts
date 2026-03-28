import api from "@/lib/api-client";
import type { SSLCheckResponse } from "@/types/ssl-check";

export const sslCheckApi = {
  check: (domain: string) =>
    api
      .get<SSLCheckResponse>("/api/ssl-check", {
        params: { domain },
        timeout: 15_000,
      })
      .then((r) => r.data),
};
