import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Challenge, ChallengeStatus } from "@/types/certificate";

const statusConfig: Record<
  ChallengeStatus,
  { icon: typeof CheckCircle2; className: string; label: string }
> = {
  pending: { icon: Loader2, className: "text-neutral-400 animate-spin", label: "Pending" },
  valid: { icon: CheckCircle2, className: "text-primary-600", label: "Verified" },
  invalid: { icon: XCircle, className: "text-red-500", label: "Failed" },
};

export interface ValidationStatusProps {
  challenges: Challenge[];
}

export function ValidationStatus({ challenges }: ValidationStatusProps) {
  if (challenges.length === 0) return null;

  return (
    <div className="space-y-2">
      {challenges.map((challenge) => {
        const config = statusConfig[challenge.status] ?? statusConfig.pending;
        const Icon = config.icon;
        return (
          <div
            key={challenge.domain}
            className="flex items-center justify-between rounded-lg border border-neutral-100 bg-white px-4 py-3"
          >
            <span className="text-sm font-medium text-neutral-700">{challenge.domain}</span>
            <div className={cn("flex items-center gap-1.5 text-sm", config.className)}>
              <Icon className="size-4" />
              <span>{config.label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
