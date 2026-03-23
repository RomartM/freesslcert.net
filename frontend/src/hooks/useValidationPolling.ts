import { useQuery } from "@tanstack/react-query";
import { certificatesApi } from "@/api/certificates";

export function useValidationPolling(orderId: string | null) {
  return useQuery({
    queryKey: ["order-status", orderId],
    queryFn: () => certificatesApi.getOrder(orderId!),
    enabled: !!orderId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === "issued" || status === "failed" || status === "revoked") return false;
      return 10_000;
    },
  });
}
