import { X } from "lucide-react";
import type { DomainEntry } from "@/types/wizard";

export interface DomainListProps {
  domains: DomainEntry[];
  onRemove: (id: string) => void;
}

export function DomainList({ domains, onRemove }: DomainListProps) {
  if (domains.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2" role="list" aria-label="Added domains">
      {domains.map((domain) => (
        <span
          key={domain.id}
          role="listitem"
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary-50 px-3 py-1.5 text-sm font-medium text-primary-700"
        >
          {domain.domain}
          <button
            type="button"
            onClick={() => onRemove(domain.id)}
            className="flex size-5 items-center justify-center rounded text-primary-400 hover:text-primary-700 transition-colors duration-150"
            aria-label={`Remove ${domain.domain}`}
          >
            <X className="size-3.5" />
          </button>
        </span>
      ))}
    </div>
  );
}
