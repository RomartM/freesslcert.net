import { cn } from "@/lib/utils";
import { Globe, Server } from "lucide-react";
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
  const methods: Array<{
    id: ValidationMethod;
    label: string;
    icon: typeof Globe;
    description: string;
  }> = [
    {
      id: "http-01",
      label: "HTTP File Upload",
      icon: Server,
      description: "Place a file on your web server",
    },
    {
      id: "dns-01",
      label: "DNS Record",
      icon: Globe,
      description: "Add a TXT record to your DNS",
    },
  ];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {methods.map((method) => {
          const isSelected = value === method.id;
          const isDisabled = method.id === "http-01" && isWildcard;
          const Icon = method.icon;

          return (
            <button
              key={method.id}
              type="button"
              disabled={isDisabled}
              onClick={() => onChange(method.id)}
              aria-pressed={isSelected}
              className={cn(
                "relative flex items-center gap-3 rounded-lg border p-4",
                "text-left transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isSelected
                  ? "border-primary-500 bg-primary-50 ring-1 ring-primary-500"
                  : "border-border hover:border-neutral-300",
                isDisabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <div
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-md",
                  isSelected
                    ? "bg-primary-500 text-white"
                    : "bg-neutral-100 text-neutral-500"
                )}
              >
                <Icon className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {method.label}
                </p>
                <p className="text-xs text-muted-foreground">
                  {method.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground">
        {isWildcard
          ? "DNS validation is required for wildcard certificates."
          : "HTTP-01 is simplest if you have server access. DNS-01 is required for wildcard certificates."}
      </p>
    </div>
  );
}
