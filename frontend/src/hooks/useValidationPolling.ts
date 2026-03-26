import { useEffect, useRef, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { certificatesApi } from "@/api/certificates";
import type { CertificateOrder, OrderStatus } from "@/types/certificate";

const TERMINAL_STATUSES: ReadonlySet<OrderStatus> = new Set([
  "issued",
  "failed",
  "revoked",
]);

function isTerminalStatus(status: OrderStatus | undefined): boolean {
  return status !== undefined && TERMINAL_STATUSES.has(status);
}

/**
 * Build the WebSocket URL from the configured API base URL.
 * Converts http(s) to ws(s) and appends the order WebSocket path.
 */
function buildWsUrl(orderId: string): string {
  const base = import.meta.env.VITE_API_BASE_URL || "";

  if (!base) {
    // Relative URL: derive from current page location
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    return `${protocol}//${window.location.host}/api/v1/orders/${orderId}/ws`;
  }

  const url = new URL(base);
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  url.pathname = `/api/v1/orders/${orderId}/ws`;
  return url.toString();
}

/**
 * Replaces pure API polling with WebSocket-first order status updates,
 * falling back to 5-second API polling if the WebSocket connection fails.
 *
 * Returns the same `UseQueryResult<CertificateOrder>` interface as the
 * original polling-only hook so that consumers (StepValidation.tsx) need
 * no changes.
 */
export function useValidationPolling(orderId: string | null) {
  const queryClient = useQueryClient();
  const wsRef = useRef<WebSocket | null>(null);
  const wsConnectedRef = useRef(false);

  // Track whether we should fall back to polling.
  // Starts as false (optimistic: assume WS will work).
  // Flipped to true on WS error/close before terminal state.
  const shouldPollRef = useRef(false);

  // We store a generation counter so that stale WS connections from a
  // previous orderId do not write into the cache of a newer order.
  const generationRef = useRef(0);

  const closeWs = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    wsConnectedRef.current = false;
  }, []);

  // --- WebSocket lifecycle ---
  useEffect(() => {
    if (!orderId) return;

    // Check whether the order is already in a terminal state in cache.
    const cached = queryClient.getQueryData<CertificateOrder>([
      "order-status",
      orderId,
    ]);
    if (cached && isTerminalStatus(cached.status)) {
      return;
    }

    const generation = ++generationRef.current;
    shouldPollRef.current = false;

    let ws: WebSocket;
    try {
      ws = new WebSocket(buildWsUrl(orderId));
    } catch {
      // WebSocket constructor can throw (e.g. invalid URL or blocked by CSP).
      shouldPollRef.current = true;
      return;
    }

    wsRef.current = ws;

    ws.addEventListener("open", () => {
      if (generation !== generationRef.current) return;
      wsConnectedRef.current = true;
    });

    ws.addEventListener("message", (event: MessageEvent) => {
      if (generation !== generationRef.current) return;

      let order: CertificateOrder;
      try {
        order = JSON.parse(event.data as string) as CertificateOrder;
      } catch {
        return; // Ignore malformed messages
      }

      queryClient.setQueryData<CertificateOrder>(
        ["order-status", orderId],
        order,
      );

      if (isTerminalStatus(order.status)) {
        closeWs();
      }
    });

    ws.addEventListener("error", () => {
      if (generation !== generationRef.current) return;
      shouldPollRef.current = true;
      closeWs();
    });

    ws.addEventListener("close", () => {
      if (generation !== generationRef.current) return;

      // If the close was not triggered by a terminal status, enable polling.
      const current = queryClient.getQueryData<CertificateOrder>([
        "order-status",
        orderId,
      ]);
      if (!current || !isTerminalStatus(current.status)) {
        shouldPollRef.current = true;
      }
      wsConnectedRef.current = false;
      wsRef.current = null;
    });

    return () => {
      // Cleanup on unmount or when orderId changes.
      generationRef.current++;
      closeWs();
    };
  }, [orderId, queryClient, closeWs]);

  // --- TanStack Query (initial fetch + fallback polling) ---
  return useQuery({
    queryKey: ["order-status", orderId],
    queryFn: () => certificatesApi.getOrder(orderId!),
    enabled: !!orderId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;

      // Never poll in a terminal state.
      if (isTerminalStatus(status)) return false;

      // Poll only when the WebSocket is not active.
      if (wsConnectedRef.current) return false;

      // If the WS has not failed yet, do one initial fetch then wait.
      if (!shouldPollRef.current) return false;

      return 5_000;
    },
  });
}
