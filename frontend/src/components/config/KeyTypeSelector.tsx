import { cn } from "@/lib/utils";
import { useWizardStore } from "@/stores/wizard-store";
import type { KeyType } from "@/types/certificate";

const KEY_TYPES: Array<{ value: KeyType; label: string }> = [
  { value: "rsa-2048", label: "RSA 2048" },
  { value: "rsa-4096", label: "RSA 4096" },
  { value: "ecdsa-p256", label: "ECDSA P-256" },
  { value: "ecdsa-p384", label: "ECDSA P-384" },
];

export function KeyTypeSelector() {
  const keyType = useWizardStore((s) => s.keyType);
  const setKeyType = useWizardStore((s) => s.setKeyType);

  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium text-neutral-700">Key Algorithm</legend>
      <div className="flex flex-wrap gap-2" role="radiogroup">
        {KEY_TYPES.map((type) => (
          <button
            key={type.value}
            type="button"
            role="radio"
            aria-checked={keyType === type.value}
            onClick={() => setKeyType(type.value)}
            className={cn(
              "min-h-10 rounded-lg border px-3 py-1.5 text-sm font-medium transition-all duration-150",
              keyType === type.value
                ? "border-primary-500 bg-primary-50 text-primary-700"
                : "border-neutral-200 text-neutral-500 hover:border-neutral-300 hover:text-neutral-600"
            )}
          >
            {type.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
