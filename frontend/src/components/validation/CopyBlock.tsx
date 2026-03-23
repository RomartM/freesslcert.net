import { useClipboard } from "@/hooks/useClipboard";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CopyBlockProps {
  label: string;
  value: string;
}

export function CopyBlock({ label, value }: CopyBlockProps) {
  const { copied, copy } = useClipboard();

  return (
    <div className="space-y-1.5">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </span>
      <div className="relative group">
        <pre
          className={cn(
            "rounded-lg border bg-neutral-50 dark:bg-neutral-900 p-3 pr-12",
            "font-mono text-sm text-foreground",
            "overflow-x-auto whitespace-pre-wrap break-all",
            "transition-all duration-200"
          )}
        >
          {value}
        </pre>
        <Button
          variant="ghost"
          size="icon-sm"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity duration-200"
          onClick={() => copy(value)}
          aria-label={copied ? "Copied" : `Copy ${label}`}
        >
          {copied ? (
            <Check className="size-3.5 text-success" />
          ) : (
            <Copy className="size-3.5" />
          )}
        </Button>
      </div>
    </div>
  );
}
