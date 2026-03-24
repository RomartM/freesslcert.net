import { cn } from "@/lib/utils";
import type { ValidationMethod } from "@/types/certificate";

export interface ValidationMethodPickerProps {
  value: ValidationMethod;
  onChange: (method: ValidationMethod) => void;
  isWildcard: boolean;
}

export function ValidationMethodPicker({
  value,
  onChange,
  isWildcard,
}: ValidationMethodPickerProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-neutral-700">Validation Method</label>
      <div className="inline-flex rounded-lg bg-neutral-100 p-1">
        <button
          type="button"
          onClick={() => !isWildcard && onChange("http-01")}
          disabled={isWildcard}
          className={cn(
            "rounded-md px-4 py-2 text-sm font-medium transition-all",
            value === "http-01" && !isWildcard
              ? "bg-white text-neutral-900 shadow-sm"
              : "text-neutral-500 hover:text-neutral-700",
            isWildcard && "opacity-40 cursor-not-allowed"
          )}
        >
          HTTP Upload
        </button>
        <button
          type="button"
          onClick={() => onChange("dns-01")}
          className={cn(
            "rounded-md px-4 py-2 text-sm font-medium transition-all",
            value === "dns-01"
              ? "bg-white text-neutral-900 shadow-sm"
              : "text-neutral-500 hover:text-neutral-700"
          )}
        >
          DNS Record
        </button>
      </div>
      {isWildcard && (
        <p className="text-xs text-neutral-400">DNS validation is required for wildcard certificates.</p>
      )}
    </div>
  );
}
