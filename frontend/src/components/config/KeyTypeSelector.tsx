import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { InfoTooltip } from "@/components/shared/InfoTooltip";
import type { KeyType } from "@/types/certificate";

export interface KeyTypeSelectorProps {
  value: KeyType;
  onChange: (type: KeyType) => void;
}

const KEY_TYPES: Array<{
  value: KeyType;
  label: string;
  shortLabel: string;
  tooltip: string;
}> = [
  {
    value: "rsa-2048",
    label: "RSA 2048",
    shortLabel: "RSA 2K",
    tooltip: "2048-bit RSA key. Widely compatible and fast. Recommended for most uses.",
  },
  {
    value: "rsa-4096",
    label: "RSA 4096",
    shortLabel: "RSA 4K",
    tooltip: "4096-bit RSA key. Stronger but slower. Use if your security policy requires it.",
  },
  {
    value: "ecdsa-p256",
    label: "ECDSA P-256",
    shortLabel: "EC 256",
    tooltip: "256-bit ECDSA key. Smaller and faster than RSA with equivalent security to RSA 3072.",
  },
  {
    value: "ecdsa-p384",
    label: "ECDSA P-384",
    shortLabel: "EC 384",
    tooltip: "384-bit ECDSA key. Stronger ECDSA variant. Equivalent security to RSA 7680.",
  },
];

export function KeyTypeSelector({ value, onChange }: KeyTypeSelectorProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5">
        <label className="text-sm font-medium text-foreground">
          Key Algorithm
        </label>
        <InfoTooltip content="The cryptographic algorithm used to generate your certificate's key pair." />
      </div>
      <ToggleGroup
        value={[value]}
        onValueChange={(newValue: string[]) => {
          if (newValue.length > 0) {
            onChange(newValue[0] as KeyType);
          }
        }}
        variant="outline"
        className="flex w-full flex-wrap gap-1"
        spacing={1}
      >
        {KEY_TYPES.map(({ value: keyValue, label, shortLabel, tooltip }) => (
          <div key={keyValue} className="flex items-center gap-0.5">
            <ToggleGroupItem
              value={keyValue}
              aria-label={label}
              className="px-3 py-1.5 text-xs sm:text-sm"
            >
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden">{shortLabel}</span>
            </ToggleGroupItem>
            <span className="hidden sm:inline-flex">
              <InfoTooltip content={tooltip} />
            </span>
          </div>
        ))}
      </ToggleGroup>
    </div>
  );
}
