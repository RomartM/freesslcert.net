import { Shield, Lock, Timer, ShieldCheck } from "lucide-react";

const badges = [
  { icon: Shield, label: "100% Free" },
  { icon: Lock, label: "Let's Encrypt" },
  { icon: Timer, label: "Keys Auto-Purged" },
  { icon: ShieldCheck, label: "ACME Standard" },
];

export function TrustSection() {
  return (
    <section
      className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-neutral-400"
      aria-label="Trust and security features"
    >
      {badges.map((badge) => {
        const Icon = badge.icon;
        return (
          <div key={badge.label} className="flex items-center gap-1.5">
            <Icon className="size-3.5" aria-hidden="true" />
            <span>{badge.label}</span>
          </div>
        );
      })}
    </section>
  );
}
