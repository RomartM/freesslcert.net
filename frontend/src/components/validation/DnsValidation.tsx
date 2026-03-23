import { CopyBlock } from "@/components/validation/CopyBlock";
import { useClipboard } from "@/hooks/useClipboard";
import { Button } from "@/components/ui/button";
import { Check, Copy, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { Challenge } from "@/types/certificate";

export interface DnsValidationProps {
  challenges: Challenge[];
}

export function DnsValidation({ challenges }: DnsValidationProps) {
  if (challenges.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No DNS challenges available. Please go back and create an order first.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-foreground">
          DNS Record Validation
        </h3>
        <p className="text-sm text-muted-foreground">
          Add the following TXT record(s) to your DNS configuration to prove
          domain ownership.
        </p>
      </div>

      <div className="space-y-4">
        {challenges.map((challenge) => (
          <DnsRecordRow key={challenge.domain} challenge={challenge} />
        ))}
      </div>

      <Alert>
        <Info className="size-4" />
        <AlertDescription>
          DNS changes may take up to a few minutes to propagate. If validation
          fails, wait a moment and try again.
        </AlertDescription>
      </Alert>
    </div>
  );
}

interface DnsRecordRowProps {
  challenge: Challenge;
}

function DnsRecordRow({ challenge }: DnsRecordRowProps) {
  const recordName =
    challenge.record_name || `_acme-challenge.${challenge.domain}`;
  const recordValue = challenge.record_value || challenge.key_authorization;

  return (
    <div className="rounded-lg border bg-card p-4 space-y-4">
      <p className="text-sm font-medium text-foreground">{challenge.domain}</p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm" role="table">
          <thead>
            <tr className="border-b">
              <th className="pb-2 pr-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Record Name
              </th>
              <th className="pb-2 pr-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Type
              </th>
              <th className="pb-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Value
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="pt-2 pr-4">
                <DnsCopyValue value={recordName} />
              </td>
              <td className="pt-2 pr-4">
                <span className="inline-flex items-center rounded-md bg-primary-50 dark:bg-primary-900/30 px-2 py-0.5 text-xs font-medium text-primary-700 dark:text-primary-300">
                  TXT
                </span>
              </td>
              <td className="pt-2">
                <DnsCopyValue value={recordValue} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <CopyBlock label="Full DNS record" value={`${recordName} TXT "${recordValue}"`} />
    </div>
  );
}

interface DnsCopyValueProps {
  value: string;
}

function DnsCopyValue({ value }: DnsCopyValueProps) {
  const { copied, copy } = useClipboard();

  return (
    <span className="inline-flex items-center gap-1.5 max-w-full">
      <code className="font-mono text-xs break-all">{value}</code>
      <Button
        variant="ghost"
        size="icon-xs"
        onClick={() => copy(value)}
        aria-label={copied ? "Copied" : `Copy ${value}`}
        className="shrink-0"
      >
        {copied ? (
          <Check className="size-3 text-success" />
        ) : (
          <Copy className="size-3" />
        )}
      </Button>
    </span>
  );
}
