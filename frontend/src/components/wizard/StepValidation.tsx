import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useWizardStore } from "@/stores/wizard-store";
import { useValidationPolling } from "@/hooks/useValidationPolling";
import { certificatesApi } from "@/api/certificates";
import { ValidationMethodPicker } from "@/components/validation/ValidationMethodPicker";
import { HttpValidation } from "@/components/validation/HttpValidation";
import { DnsValidation } from "@/components/validation/DnsValidation";
import { ValidationStatus } from "@/components/validation/ValidationStatus";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import type { ValidationMethod } from "@/types/certificate";

export function StepValidation() {
  const orderId = useWizardStore((s) => s.orderId);
  const challenges = useWizardStore((s) => s.challenges);
  const validationMethod = useWizardStore((s) => s.validationMethod);
  const certificateType = useWizardStore((s) => s.certificateType);
  const setStep = useWizardStore((s) => s.setStep);
  const setValidationMethod = useWizardStore((s) => s.setValidationMethod);
  const setChallenges = useWizardStore((s) => s.setChallenges);
  const setCertificateData = useWizardStore((s) => s.setCertificateData);
  const reset = useWizardStore((s) => s.reset);

  const isWildcard = certificateType === "wildcard";

  const { data: pollingData, error: pollingError } = useValidationPolling(orderId);

  const validateMutation = useMutation({
    mutationFn: async () => {
      if (!orderId) throw new Error("No order ID found");
      for (const challenge of challenges) {
        await certificatesApi.validateOrder(orderId, challenge.domain);
      }
      return certificatesApi.getOrder(orderId);
    },
    onSuccess: (data) => {
      if (data.challenges) {
        setChallenges(data.challenges);
      }
    },
  });

  // Sync polling data back into store
  useEffect(() => {
    if (pollingData?.challenges) {
      setChallenges(pollingData.challenges);
    }
  }, [pollingData, setChallenges]);

  // Auto-advance: when polling detects "issued" status
  useEffect(() => {
    if (!pollingData) return;

    if (pollingData.status === "issued" && pollingData.certificate) {
      setCertificateData(pollingData);
      setStep("download");
    }
  }, [pollingData, setCertificateData, setStep]);

  const handleMethodChange = (method: ValidationMethod) => {
    if (isWildcard && method === "http-01") return;
    setValidationMethod(method);
  };

  const handleVerifyAll = () => {
    validateMutation.mutate();
  };

  const handleBack = () => {
    setStep("domain");
  };

  const handleTryAgain = () => {
    reset();
  };

  const allValid =
    challenges.length > 0 && challenges.every((c) => c.status === "valid");
  const allSubmitted =
    challenges.length > 0 && challenges.every((c) => c.status === "validating" || c.status === "valid");
  const someSubmitted =
    challenges.length > 0 && challenges.some((c) => c.status === "validating" || c.status === "valid");
  const hasFailures = challenges.some((c) => c.status === "invalid");
  const orderStatus = pollingData?.status;

  const filteredChallenges = challenges.filter(
    (c) => c.type === validationMethod
  );
  const displayChallenges =
    filteredChallenges.length > 0 ? filteredChallenges : challenges;

  // Derive status message
  let statusMessage: string | null = null;
  if (orderStatus === "pending" && !someSubmitted) {
    statusMessage = "Complete the steps above, then click Verify All";
  } else if (orderStatus === "pending" && someSubmitted && !allSubmitted) {
    statusMessage = "Some domains submitted — verify the remaining domains";
  } else if (orderStatus === "validating" || allSubmitted) {
    statusMessage = "Let's Encrypt is verifying your domain and issuing your certificate...";
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="min-h-11 transition-colors duration-150"
          aria-label="Go back to domain entry"
        >
          <ArrowLeft className="size-4" />
          Back
        </Button>
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-5 text-primary-600" aria-hidden="true" />
          <h2 className="text-lg font-semibold tracking-tight text-neutral-900">
            Verify Domain Ownership
          </h2>
        </div>
      </div>

      <ValidationMethodPicker
        value={validationMethod}
        onChange={handleMethodChange}
        isWildcard={isWildcard}
      />

      {validationMethod === "http-01" ? (
        <HttpValidation challenges={displayChallenges} />
      ) : (
        <DnsValidation challenges={displayChallenges} />
      )}

      <ValidationStatus challenges={challenges} />

      {hasFailures && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Validation failed</AlertTitle>
          <AlertDescription>
            One or more domains could not be verified. Please check your
            configuration and try again.
          </AlertDescription>
        </Alert>
      )}

      {validateMutation.isError && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Verification error</AlertTitle>
          <AlertDescription>
            {validateMutation.error.message}
          </AlertDescription>
        </Alert>
      )}

      {pollingError && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Polling error</AlertTitle>
          <AlertDescription>
            Failed to check order status. Please refresh the page and try again.
          </AlertDescription>
        </Alert>
      )}

      {orderStatus === "failed" && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Certificate issuance failed</AlertTitle>
          <AlertDescription>
            Let's Encrypt was unable to issue your certificate. Please start over and try again.
          </AlertDescription>
        </Alert>
      )}

      {statusMessage && (
        <Alert>
          {allSubmitted || orderStatus === "validating" ? (
            <Loader2 className="size-4 animate-spin text-primary-600" />
          ) : someSubmitted ? (
            <Loader2 className="size-4 animate-spin text-amber-500" />
          ) : (
            <CheckCircle2 className="size-4 text-neutral-500" />
          )}
          <AlertTitle>
            {allSubmitted || orderStatus === "validating"
              ? "Verifying with Let's Encrypt"
              : someSubmitted
                ? "Verification in progress"
                : "Waiting for verification"}
          </AlertTitle>
          <AlertDescription>{statusMessage}</AlertDescription>
        </Alert>
      )}

      {orderStatus === "failed" ? (
        <div className="flex justify-end">
          <Button
            onClick={handleTryAgain}
            size="lg"
            variant="destructive"
            className="min-h-11 rounded-lg transition-colors duration-150"
            aria-label="Start over"
          >
            Try Again
          </Button>
        </div>
      ) : !allSubmitted && orderStatus !== "validating" ? (
        <div className="flex justify-end">
          <Button
            onClick={handleVerifyAll}
            disabled={validateMutation.isPending}
            size="lg"
            className="min-h-11 rounded-lg transition-colors duration-150"
            aria-label="Verify all domains"
          >
            {validateMutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <ShieldCheck className="size-4" />
                Verify All
              </>
            )}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
