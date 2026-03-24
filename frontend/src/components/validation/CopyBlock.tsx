import { useState, useCallback } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CopyBlockProps {
  label: string;
  value: string;
}

export function CopyBlock({ label, value }: CopyBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = value;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [value]);

  return (
    <div className="space-y-1.5">
      {label && (
        <span className="text-xs font-medium uppercase tracking-wider text-neutral-400">
          {label}
        </span>
      )}
      <div className="group relative">
        <pre className="overflow-x-auto rounded-lg bg-neutral-900 p-3 text-sm text-neutral-100 font-mono leading-relaxed">
          {value}
        </pre>
        <button
          type="button"
          onClick={handleCopy}
          className={cn(
            "absolute right-2 top-2 rounded-md p-1.5 transition-all",
            "text-neutral-400 hover:text-white hover:bg-neutral-700",
            "opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
          )}
          aria-label="Copy to clipboard"
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
        </button>
      </div>
    </div>
  );
}
