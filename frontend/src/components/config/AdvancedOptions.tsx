import { useState } from "react";
import { ChevronDown, FileKey } from "lucide-react";
import { cn } from "@/lib/utils";
import { KeyTypeSelector } from "@/components/config/KeyTypeSelector";
import { useWizardStore } from "@/stores/wizard-store";

export function AdvancedOptions() {
  const [open, setOpen] = useState(false);
  const csrContent = useWizardStore((s) => s.csrContent);
  const setCsrContent = useWizardStore((s) => s.setCsrContent);
  const expertMode = useWizardStore((s) => s.expertMode);
  const setExpertMode = useWizardStore((s) => s.setExpertMode);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex min-h-11 items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 transition-colors duration-150"
        aria-expanded={open}
        aria-controls="advanced-options-panel"
      >
        <ChevronDown
          className={cn("size-4 transition-transform duration-150", open && "rotate-180")}
          aria-hidden="true"
        />
        Advanced Options
      </button>

      {open && (
        <div id="advanced-options-panel" className="pt-4 space-y-4">
          {!expertMode && <KeyTypeSelector />}

          <label className="flex min-h-11 items-center gap-2 text-sm text-neutral-600 cursor-pointer">
            <input
              type="checkbox"
              checked={expertMode}
              onChange={(e) => {
                setExpertMode(e.target.checked);
                if (!e.target.checked) {
                  setCsrContent(null);
                }
              }}
              className="size-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
            />
            <FileKey className="size-4" aria-hidden="true" />
            I have my own CSR
          </label>

          {expertMode && (
            <div className="space-y-1.5">
              <label htmlFor="csr-textarea" className="text-sm font-medium text-neutral-700">
                Certificate Signing Request
              </label>
              <textarea
                id="csr-textarea"
                value={csrContent ?? ""}
                onChange={(e) => setCsrContent(e.target.value || null)}
                placeholder="-----BEGIN CERTIFICATE REQUEST-----"
                className="w-full min-h-[120px] rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-sm font-mono text-neutral-700 placeholder:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors duration-150"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
