import { CopyBlock } from "@/components/validation/CopyBlock";
import type { Challenge } from "@/types/certificate";

export interface HttpValidationProps {
  challenges: Challenge[];
}

export function HttpValidation({ challenges }: HttpValidationProps) {
  if (challenges.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No HTTP challenges available. Please go back and create an order first.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-foreground">
          HTTP File Validation
        </h3>
        <p className="text-sm text-muted-foreground">
          Create the following file(s) on your web server to prove domain
          ownership.
        </p>
      </div>

      {challenges.map((challenge, index) => (
        <div
          key={challenge.domain}
          className="space-y-4 rounded-lg border bg-card p-4"
        >
          <p className="text-sm font-medium text-foreground">
            {challenges.length > 1 ? `${index + 1}. ` : ""}
            {challenge.domain}
          </p>

          <ol className="space-y-4 list-none">
            <li className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary-500 text-xs font-semibold text-white">
                  1
                </span>
                <span className="text-sm font-medium text-foreground">
                  Create this file on your server
                </span>
              </div>
              <div className="ml-8">
                <CopyBlock
                  label="File path"
                  value={
                    challenge.file_path ||
                    `/.well-known/acme-challenge/${challenge.token}`
                  }
                />
              </div>
            </li>

            <li className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary-500 text-xs font-semibold text-white">
                  2
                </span>
                <span className="text-sm font-medium text-foreground">
                  Set the file content to
                </span>
              </div>
              <div className="ml-8">
                <CopyBlock
                  label="File content"
                  value={
                    challenge.file_content || challenge.key_authorization
                  }
                />
              </div>
            </li>

            <li className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary-500 text-xs font-semibold text-white">
                  3
                </span>
                <span className="text-sm font-medium text-foreground">
                  Verify the file is accessible
                </span>
              </div>
              <div className="ml-8">
                <p className="text-xs text-muted-foreground">
                  Ensure the file is reachable at{" "}
                  <code className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-xs">
                    http://{challenge.domain}
                    {challenge.file_path ||
                      `/.well-known/acme-challenge/${challenge.token}`}
                  </code>
                </p>
              </div>
            </li>
          </ol>
        </div>
      ))}
    </div>
  );
}
