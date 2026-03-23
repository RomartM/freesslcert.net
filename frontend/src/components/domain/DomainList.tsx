import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { DomainEntry } from "@/types/wizard";

export interface DomainListProps {
  domains: DomainEntry[];
  onRemove: (id: string) => void;
}

export function DomainList({ domains, onRemove }: DomainListProps) {
  if (domains.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2" role="list" aria-label="Added domains">
      {domains.map((entry) => (
        <Badge
          key={entry.id}
          variant="secondary"
          className="flex items-center gap-1 py-1 pl-2.5 pr-1 text-sm"
        >
          <span role="listitem">{entry.domain}</span>
          <button
            type="button"
            onClick={() => onRemove(entry.id)}
            className="ml-0.5 inline-flex size-4 items-center justify-center rounded-full transition-colors hover:bg-foreground/10"
            aria-label={`Remove ${entry.domain}`}
          >
            <X className="size-3" />
          </button>
        </Badge>
      ))}
    </div>
  );
}
