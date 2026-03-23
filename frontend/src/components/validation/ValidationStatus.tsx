import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import type { Challenge, ChallengeStatus } from "@/types/certificate";

export interface ValidationStatusProps {
  challenges: Challenge[];
}

const statusConfig: Record<
  ChallengeStatus,
  { icon: typeof CheckCircle2; label: string; className: string }
> = {
  pending: {
    icon: Loader2,
    label: "Pending",
    className: "text-neutral-400 dark:text-neutral-500",
  },
  valid: {
    icon: CheckCircle2,
    label: "Verified",
    className: "text-success",
  },
  invalid: {
    icon: XCircle,
    label: "Failed",
    className: "text-error",
  },
};

export function ValidationStatus({ challenges }: ValidationStatusProps) {
  if (challenges.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        Validation Status
      </h4>
      <div className="rounded-lg border divide-y">
        {challenges.map((challenge) => {
          const config = statusConfig[challenge.status];
          const Icon = config.icon;
          const isSpinning = challenge.status === "pending";

          return (
            <div
              key={challenge.domain}
              className="flex items-center justify-between px-4 py-3"
            >
              <span className="text-sm font-medium text-foreground">
                {challenge.domain}
              </span>
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 text-sm font-medium",
                  config.className
                )}
              >
                <Icon
                  className={cn("size-4", isSpinning && "animate-spin")}
                  aria-hidden="true"
                />
                {config.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
