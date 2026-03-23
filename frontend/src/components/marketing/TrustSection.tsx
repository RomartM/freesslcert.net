import { Shield, Lock, EyeOff, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrustBadge {
  icon: typeof Shield;
  label: string;
}

const badges: TrustBadge[] = [
  { icon: Shield, label: "100% Free" },
  { icon: Lock, label: "Let's Encrypt" },
  { icon: EyeOff, label: "Auto-Purged in 24h" },
  { icon: Globe, label: "Open Source" },
];

export function TrustSection() {
  return (
    <section
      className="mt-12 mb-8"
      aria-label="Trust and security features"
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {badges.map((badge) => {
          const Icon = badge.icon;
          return (
            <div
              key={badge.label}
              className={cn(
                "flex items-center justify-center gap-2 rounded-lg border px-4 py-3",
                "bg-card text-card-foreground shadow-sm",
                "transition-all duration-200 hover:shadow-md"
              )}
            >
              <Icon
                className="size-4 shrink-0 text-primary-500"
                aria-hidden="true"
              />
              <span className="text-sm font-medium">{badge.label}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
