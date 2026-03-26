import { cn } from "@/lib/utils";
import type { CertificateType } from "@/types/certificate";

const CERT_TYPES: Array<{ value: CertificateType; label: string }> = [
  { value: "single", label: "Single" },
  { value: "wildcard", label: "Wildcard" },
];

export interface CertTypeSelectorProps {
  value: CertificateType;
  onChange: (type: CertificateType) => void;
}

export function CertTypeSelector({ value, onChange }: CertTypeSelectorProps) {
  return (
    <div className="inline-flex rounded-lg bg-neutral-100/80 p-0.5" role="radiogroup" aria-label="Certificate type">
      {CERT_TYPES.map((type) => (
        <button
          key={type.value}
          type="button"
          role="radio"
          aria-checked={value === type.value}
          onClick={() => onChange(type.value)}
          className={cn(
            "rounded-md px-3 py-1.5 text-[13px] font-medium transition-all duration-150",
            value === type.value
              ? "bg-white text-neutral-900 shadow-sm"
              : "text-neutral-400 hover:text-neutral-600"
          )}
        >
          {type.label}
        </button>
      ))}
    </div>
  );
}
