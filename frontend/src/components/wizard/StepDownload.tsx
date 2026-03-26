import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useWizardStore } from "@/stores/wizard-store";
import { certificatesApi } from "@/api/certificates";
import { CertificateCard } from "@/components/certificate/CertificateCard";
import { DownloadButtons } from "@/components/certificate/DownloadButtons";
import { InstallGuide } from "@/components/certificate/InstallGuide";
import { AutoClearWarning } from "@/components/certificate/AutoClearWarning";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2, RotateCcw, Bell, Mail } from "lucide-react";

function formatExpiryDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function ExpirySubscription() {
  const orderId = useWizardStore((s) => s.orderId);
  const certificateData = useWizardStore((s) => s.certificateData);

  const [optIn, setOptIn] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribedEmail, setSubscribedEmail] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const expiresAt = certificateData?.expires_at;
  const formattedExpiry = expiresAt ? formatExpiryDate(expiresAt) : null;

  const subscribeMutation = useMutation({
    mutationFn: () => {
      if (!orderId) throw new Error("No order ID found");
      return certificatesApi.subscribeNotification(orderId, email);
    },
    onSuccess: () => {
      setSubscribedEmail(email);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to subscribe. Please try again.");
    },
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = email.trim();
    if (!trimmed) {
      inputRef.current?.focus();
      return;
    }

    subscribeMutation.mutate();
  }

  if (!formattedExpiry) {
    return null;
  }

  // Success state
  if (subscribedEmail) {
    return (
      <div className="rounded-xl border border-primary-200 bg-primary-50/50 p-4">
        <div className="flex items-start gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-100">
            <CheckCircle2 className="size-4 text-primary-600" aria-hidden="true" />
          </div>
          <div className="space-y-0.5">
            <p className="text-sm font-medium text-neutral-900">
              Expiry reminder set
            </p>
            <p className="text-sm text-neutral-600">
              We'll email {subscribedEmail} before your certificate expires on{" "}
              {formattedExpiry}.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-4">
      <div className="flex items-start gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-neutral-100">
          <Bell className="size-4 text-neutral-500" aria-hidden="true" />
        </div>
        <div className="flex-1 space-y-3">
          <label className="flex cursor-pointer items-center gap-2">
            <Checkbox
              checked={optIn}
              onCheckedChange={(checked) => setOptIn(checked)}
              aria-label="Notify me before this certificate expires"
            />
            <span className="text-sm font-medium text-neutral-900">
              Notify me before this certificate expires
            </span>
          </label>

          {optIn && (
            <div className="space-y-3">
              <p className="text-sm text-neutral-600">
                We'll send a reminder 14 and 7 days before your certificate
                expires on {formattedExpiry}.
              </p>
              <form onSubmit={handleSubmit} className="flex gap-2">
                <div className="relative flex-1">
                  <Mail
                    className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-neutral-400"
                    aria-hidden="true"
                  />
                  <Input
                    ref={inputRef}
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-8"
                    aria-label="Email address for expiry reminders"
                    disabled={subscribeMutation.isPending}
                  />
                </div>
                <Button
                  type="submit"
                  size="default"
                  disabled={subscribeMutation.isPending || !email.trim()}
                  className="min-h-8 rounded-lg transition-colors duration-150"
                >
                  {subscribeMutation.isPending ? "Subscribing..." : "Subscribe"}
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function StepDownload() {
  const certificateData = useWizardStore((s) => s.certificateData);
  const reset = useWizardStore((s) => s.reset);

  if (!certificateData) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-sm text-neutral-500">
          No certificate data available. Please start over.
        </p>
        <Button onClick={reset} variant="outline" className="min-h-11 rounded-lg transition-colors duration-150">
          <RotateCcw className="size-4" />
          Start Over
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Success banner */}
      <div className="flex flex-col items-center gap-3 py-4">
        <div className="flex size-16 items-center justify-center rounded-full bg-primary-100">
          <CheckCircle2 className="size-8 text-primary-600" aria-hidden="true" />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-semibold tracking-tight text-neutral-900">
            Certificate Issued
          </h2>
          <p className="text-sm text-neutral-500">
            Your SSL certificate is ready. Download the files below.
          </p>
        </div>
      </div>

      <AutoClearWarning />

      <CertificateCard order={certificateData} />

      <DownloadButtons order={certificateData} />

      <ExpirySubscription />

      <InstallGuide />

      {/* Generate Another */}
      <div className="flex justify-center pt-4 pb-2">
        <Button
          variant="outline"
          size="lg"
          onClick={reset}
          className="min-h-11 rounded-lg transition-colors duration-150"
          aria-label="Generate another certificate"
        >
          <RotateCcw className="size-4" />
          Generate Another Certificate
        </Button>
      </div>
    </div>
  );
}
