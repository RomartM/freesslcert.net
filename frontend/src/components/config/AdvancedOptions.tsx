import { useState } from "react";
import { ChevronDown, FileKey } from "lucide-react";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { KeyTypeSelector } from "@/components/config/KeyTypeSelector";
import { cn } from "@/lib/utils";
import type { KeyType } from "@/types/certificate";

export interface AdvancedOptionsProps {
  keyType: KeyType;
  onKeyTypeChange: (type: KeyType) => void;
  csrEnabled: boolean;
  onCsrEnabledChange: (enabled: boolean) => void;
  csrContent: string | null;
  onCsrContentChange: (content: string | null) => void;
}

export function AdvancedOptions({
  keyType,
  onKeyTypeChange,
  csrEnabled,
  onCsrEnabledChange,
  csrContent,
  onCsrContentChange,
}: AdvancedOptionsProps) {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex w-full items-center gap-2 rounded-md px-1 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
        <ChevronDown
          className={cn(
            "size-4 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
        <span>Advanced Options</span>
      </CollapsibleTrigger>

      <CollapsibleContent className="space-y-4 pt-2">
        {!csrEnabled && (
          <KeyTypeSelector value={keyType} onChange={onKeyTypeChange} />
        )}

        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <input
              type="checkbox"
              checked={csrEnabled}
              onChange={(e) => {
                onCsrEnabledChange(e.target.checked);
                if (!e.target.checked) {
                  onCsrContentChange(null);
                }
              }}
              className="size-4 rounded border-border accent-primary-500"
            />
            <FileKey className="size-3.5" />
            <span>I have my own CSR</span>
          </label>

          {csrEnabled && (
            <div className="space-y-1.5">
              <label
                htmlFor="csr-textarea"
                className="text-xs text-muted-foreground"
              >
                Paste your Certificate Signing Request (PEM format)
              </label>
              <textarea
                id="csr-textarea"
                value={csrContent ?? ""}
                onChange={(e) => onCsrContentChange(e.target.value || null)}
                placeholder="-----BEGIN CERTIFICATE REQUEST-----&#10;...&#10;-----END CERTIFICATE REQUEST-----"
                className="h-32 w-full resize-y rounded-lg border border-input bg-transparent px-3 py-2 font-mono text-xs transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                aria-label="Certificate Signing Request content"
              />
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
