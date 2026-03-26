import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CertTypeSelector } from "@/components/domain/CertTypeSelector";
import { AdvancedOptions } from "@/components/config/AdvancedOptions";
import { useWizardStore } from "@/stores/wizard-store";
import { certificatesApi } from "@/api/certificates";
import type { CertificateType } from "@/types/certificate";

const domainSchema = z.object({
  domain: z
    .string()
    .min(1, "Domain is required")
    .regex(
      /^([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/,
      "Enter a valid domain (e.g., example.com)"
    ),
});

type DomainFormValues = z.infer<typeof domainSchema>;

export function StepDomainInput() {
  const {
    certificateType,
    keyType,
    csrContent,
    validationMethod,
    setCertificateType,
    setStep,
    setOrderId,
    setChallenges,
    setValidationMethod,
  } = useWizardStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<DomainFormValues>({
    resolver: zodResolver(domainSchema),
    defaultValues: { domain: "" },
  });

  const domainValue = watch("domain");

  const createOrderMutation = useMutation({
    mutationFn: certificatesApi.createOrder,
    onSuccess: (data) => {
      setOrderId(data.id);
      if (data.challenges && data.challenges.length > 0) {
        setChallenges(data.challenges);
      }
      setStep("validation");
      toast.success("Order created. Complete verification to get your certificate.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create certificate order");
    },
  });

  const handleCertTypeChange = useCallback(
    (type: CertificateType) => {
      setCertificateType(type);
      if (type === "wildcard") {
        setValidationMethod("dns-01");
      }
    },
    [setCertificateType, setValidationMethod]
  );

  const handleGenerate = useCallback(
    (data: DomainFormValues) => {
      let domain = data.domain.toLowerCase().trim().replace(/^\*\./, "");

      if (certificateType === "wildcard") {
        domain = `*.${domain}`;
      }

      createOrderMutation.mutate({
        domains: [domain],
        certificate_type: certificateType,
        key_type: keyType,
        validation_method: validationMethod,
        ...(csrContent ? { csr: csrContent } : {}),
      });
    },
    [certificateType, keyType, validationMethod, csrContent, createOrderMutation]
  );

  return (
    <div className="space-y-4">
      {/* Certificate Type */}
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-medium text-neutral-500">Type</span>
        <CertTypeSelector
          value={certificateType}
          onChange={handleCertTypeChange}
        />
      </div>

      {/* Domain Input + Generate — single row */}
      <form
        onSubmit={handleSubmit(handleGenerate)}
        className="flex gap-2"
      >
        <div className="relative flex-1">
          {certificateType === "wildcard" && (
            <span
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-neutral-400"
              aria-hidden="true"
            >
              *.
            </span>
          )}
          <Input
            id="domain-input"
            placeholder="example.com"
            className={`h-11 rounded-lg text-sm ${certificateType === "wildcard" ? "pl-8" : ""}`}
            aria-invalid={!!errors.domain}
            aria-describedby={errors.domain ? "domain-error" : undefined}
            {...register("domain")}
          />
        </div>
        <Button
          type="submit"
          disabled={!domainValue || createOrderMutation.isPending}
          className="h-11 rounded-lg px-5 text-sm font-medium"
        >
          {createOrderMutation.isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              Generate
              <ArrowRight className="size-4" />
            </>
          )}
        </Button>
      </form>
      {errors.domain && (
        <p
          id="domain-error"
          className="text-xs text-destructive -mt-2"
          role="alert"
        >
          {errors.domain.message}
        </p>
      )}

      {/* Advanced Options */}
      <AdvancedOptions />

      {/* Error Alert */}
      {createOrderMutation.isError && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription className="text-sm">
            {createOrderMutation.error?.message ||
              "Failed to create certificate order. Please try again."}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
