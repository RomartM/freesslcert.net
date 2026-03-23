import type { ReactNode } from "react";

export interface PageShellProps {
  children: ReactNode;
}

export function PageShell({ children }: PageShellProps) {
  return (
    <div className="mx-auto max-w-5xl px-4">
      {children}
    </div>
  );
}
