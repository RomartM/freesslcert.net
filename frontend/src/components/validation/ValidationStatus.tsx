import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Challenge, ChallengeStatus } from "@/types/certificate";

const statusConfig: Record<
  ChallengeStatus,
  { icon: typeof CheckCircle2; iconClass: string; textClass: string; label: string }
> = {
  pending: { icon: Loader2, iconClass: "animate-spin text-neutral-400", textClass: "text-neutral-400", label: "Pending" },
  valid: { icon: CheckCircle2, iconClass: "text-primary-600", textClass: "text-primary-600", label: "Verified" },
  invalid: { icon: XCircle, iconClass: "text-red-500", textClass: "text-red-500", label: "Failed" },
};

export function ValidationStatus({ challenges }: { challenges: Challenge[] }) {
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
            <span className="text-sm font-medium text-neutral-700 truncate mr-3">
              {challenge.domain}
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <Icon className={cn("size-4", config.iconClass)} />
              <span className={cn("text-sm", config.textClass)}>{config.label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
