import type { ReactNode } from "react";

export function PageShell({ children }: { children: ReactNode }) {
  return <div className="mx-auto max-w-3xl px-6">{children}</div>;
}
