import { useEffect, useState } from "react";
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

  const [hasAutoAdvanced, setHasAutoAdvanced] = useState(false);

  const isWildcard = certificateType === "wildcard";

  const { data: pollingData } = useValidationPolling(orderId);

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

  // Auto-advance when all domains are validated
  useEffect(() => {
    if (hasAutoAdvanced) return;

    const allValid =
      challenges.length > 0 &&
      challenges.every((c) => c.status === "valid");

    if (allValid && pollingData) {
      setHasAutoAdvanced(true);

      if (pollingData.status === "issued" && pollingData.certificate) {
        setCertificateData(pollingData);
        setStep("download");
      } else if (pollingData.status !== "failed" && orderId) {
        // Finalize the order to get the certificate
        certificatesApi
          .finalizeOrder(orderId)
          .then((finalData) => {
            setCertificateData(finalData);
            setStep("download");
          })
          .catch(() => {
            // Reset auto-advance flag so user can retry
            setHasAutoAdvanced(false);
          });
      }
    }
  }, [
    challenges,
    pollingData,
    orderId,
    hasAutoAdvanced,
    setCertificateData,
    setStep,
  ]);

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

  const allValid =
    challenges.length > 0 && challenges.every((c) => c.status === "valid");
  const hasFailures = challenges.some((c) => c.status === "invalid");

  const filteredChallenges = challenges.filter(
    (c) => c.type === validationMethod
  );
  const displayChallenges =
    filteredChallenges.length > 0 ? filteredChallenges : challenges;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          aria-label="Go back to domain entry"
        >
          <ArrowLeft className="size-4" />
          Back
        </Button>
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-5 text-primary-500" />
          <h2 className="text-lg font-semibold text-foreground">
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

      {allValid && (
        <Alert>
          <CheckCircle2 className="size-4 text-success" />
          <AlertTitle>All domains verified</AlertTitle>
          <AlertDescription>
            Generating your certificate. You will be redirected shortly.
          </AlertDescription>
        </Alert>
      )}

      {!allValid && (
        <div className="flex justify-end">
          <Button
            onClick={handleVerifyAll}
            disabled={validateMutation.isPending}
            size="lg"
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
      )}
    </div>
  );
}
