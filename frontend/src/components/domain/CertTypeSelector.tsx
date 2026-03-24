import { cn } from "@/lib/utils";
import type { CertificateType } from "@/types/certificate";

const CERT_TYPES: Array<{ value: CertificateType; label: string; description: string }> = [
  { value: "single", label: "Single", description: "One domain" },
  { value: "wildcard", label: "Wildcard", description: "*.domain" },
  { value: "multi-domain", label: "Multi-Domain", description: "SAN cert" },
];

export interface CertTypeSelectorProps {
  value: CertificateType;
  onChange: (type: CertificateType) => void;
}

export function CertTypeSelector({ value, onChange }: CertTypeSelectorProps) {
  return (
    <fieldset>
      <legend className="sr-only">Certificate type</legend>
      <div className="inline-flex rounded-lg bg-neutral-100 p-1" role="radiogroup">
        {CERT_TYPES.map((type) => (
          <button
            key={type.value}
            type="button"
            role="radio"
            aria-checked={value === type.value}
            aria-label={`${type.label} - ${type.description}`}
            onClick={() => onChange(type.value)}
            className={cn(
              "min-h-10 rounded-md px-4 py-2 text-sm font-medium transition-all duration-150",
              value === type.value
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-500 hover:text-neutral-700"
            )}
          >
            {type.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
