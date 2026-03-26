import { CopyBlock } from "@/components/validation/CopyBlock";
import { Info } from "lucide-react";
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
          <DnsRecordCard key={challenge.domain} challenge={challenge} />
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

interface DnsRecordCardProps {
  challenge: Challenge;
}

function DnsRecordCard({ challenge }: DnsRecordCardProps) {
  const recordName =
    challenge.record_name || `_acme-challenge.${challenge.domain}`;
  const recordValue = challenge.record_value || challenge.key_authorization;

  return (
    <div className="rounded-lg border bg-card p-4 space-y-4">
      <p className="text-sm font-medium text-foreground">{challenge.domain}</p>

      <div className="space-y-4">
        <CopyBlock label="Record name" value={recordName} />

        <div className="space-y-1.5">
          <span className="text-xs font-medium uppercase tracking-wider text-neutral-400">
            Type
          </span>
          <div>
            <span className="inline-flex items-center rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
              TXT
            </span>
          </div>
        </div>

        <CopyBlock label="Value" value={recordValue} />

        <CopyBlock
          label="Full DNS record"
          value={`${recordName} TXT "${recordValue}"`}
        />
      </div>
    </div>
  );
}
