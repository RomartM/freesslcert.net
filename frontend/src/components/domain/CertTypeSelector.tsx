import { Globe, Asterisk, Layers } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { CertificateType } from "@/types/certificate";

export interface CertTypeSelectorProps {
  value: CertificateType;
  onChange: (type: CertificateType) => void;
}

const CERT_TYPES: Array<{
  value: CertificateType;
  label: string;
  icon: typeof Globe;
}> = [
  { value: "single", label: "Single Domain", icon: Globe },
  { value: "wildcard", label: "Wildcard", icon: Asterisk },
  { value: "multi-domain", label: "Multi-Domain", icon: Layers },
];

export function CertTypeSelector({ value, onChange }: CertTypeSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">
        Certificate Type
      </label>
      <ToggleGroup
        value={[value]}
        onValueChange={(newValue: string[]) => {
          if (newValue.length > 0) {
            onChange(newValue[0] as CertificateType);
          }
        }}
        variant="outline"
        className="flex w-full"
      >
        {CERT_TYPES.map(({ value: typeValue, label, icon: Icon }) => (
          <ToggleGroupItem
            key={typeValue}
            value={typeValue}
            aria-label={label}
            className="flex flex-1 items-center justify-center gap-1.5 px-3 py-2 text-xs sm:text-sm"
          >
            <Icon className="size-3.5 shrink-0" />
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden">
              {typeValue === "single"
                ? "Single"
                : typeValue === "wildcard"
                  ? "Wild"
                  : "Multi"}
            </span>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}
