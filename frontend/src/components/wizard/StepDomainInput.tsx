import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Plus, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CertTypeSelector } from "@/components/domain/CertTypeSelector";
import { DomainList } from "@/components/domain/DomainList";
import { AdvancedOptions } from "@/components/config/AdvancedOptions";
import { useWizardStore } from "@/stores/wizard-store";
import { certificatesApi } from "@/api/certificates";
import type { CertificateType } from "@/types/certificate";

const domainSchema = z.object({
  domain: z
    .string()
    .min(1, "Domain is required")
    .regex(
      /^(\*\.)?([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/,
      "Enter a valid domain"
    ),
});

type DomainFormValues = z.infer<typeof domainSchema>;

export function StepDomainInput() {
  const {
    certificateType,
    domains,
    keyType,
    csrContent,
    setCertificateType,
    addDomain,
    removeDomain,
    setStep,
    setOrderId,
    setChallenges,
    setValidationMethod,
  } = useWizardStore();

  const {
    register,
    handleSubmit,
    reset: resetForm,
    formState: { errors },
    setError,
  } = useForm<DomainFormValues>({
    resolver: zodResolver(domainSchema),
    defaultValues: { domain: "" },
  });

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

      // Clear domains when switching types
      domains.forEach((d) => removeDomain(d.id));

      // Wildcard forces DNS-01 validation
      if (type === "wildcard") {
        setValidationMethod("dns-01");
      }
    },
    [setCertificateType, domains, removeDomain, setValidationMethod]
  );

  const handleAddDomain = useCallback(
    (data: DomainFormValues) => {
      // Strip any accidentally typed wildcard prefix, then normalize
      let domainToAdd = data.domain
        .toLowerCase()
        .trim()
        .replace(/^\*\./, "");

      // For wildcard, prefix with *.
      if (certificateType === "wildcard") {
        domainToAdd = `*.${domainToAdd}`;
      }

      // For single domain, only one allowed
      if (certificateType === "single" && domains.length >= 1) {
        setError("domain", {
          message:
            "Single domain certificates support only one domain. Remove the existing one first.",
        });
        return;
      }

      // For wildcard, only one allowed
      if (certificateType === "wildcard" && domains.length >= 1) {
        setError("domain", {
          message:
            "Wildcard certificates support only one domain. Remove the existing one first.",
        });
        return;
      }

      // Check for duplicates
      if (domains.some((d) => d.domain === domainToAdd)) {
        setError("domain", { message: "This domain has already been added" });
        return;
      }

      addDomain(domainToAdd);
      resetForm({ domain: "" });
    },
    [certificateType, domains, addDomain, resetForm, setError]
  );

  const handleGenerate = useCallback(() => {
    if (domains.length === 0) return;

    createOrderMutation.mutate({
      domains: domains.map((d) => d.domain),
      certificate_type: certificateType,
      key_type: keyType,
      ...(csrContent ? { csr: csrContent } : {}),
    });
  }, [domains, certificateType, keyType, csrContent, createOrderMutation]);

  const canAddMore =
    certificateType === "multi-domain" || domains.length === 0;

  return (
    <div className="space-y-5">
      {/* Certificate Type */}
      <CertTypeSelector
        value={certificateType}
        onChange={handleCertTypeChange}
      />

      {/* Domain Input */}
      <div className="space-y-2">
        <label
          htmlFor="domain-input"
          className="text-sm font-medium text-neutral-700"
        >
          {certificateType === "multi-domain" ? "Add Domains" : "Domain Name"}
        </label>
        <form
          onSubmit={handleSubmit(handleAddDomain)}
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
              disabled={!canAddMore}
              className={`h-11 rounded-lg text-base ${certificateType === "wildcard" ? "pl-8" : ""}`}
              aria-invalid={!!errors.domain}
              aria-describedby={errors.domain ? "domain-error" : undefined}
              {...register("domain")}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSubmit(handleAddDomain)();
                }
              }}
            />
          </div>
          <Button
            type="submit"
            variant="outline"
            disabled={!canAddMore}
            className="h-11 rounded-lg px-4"
            aria-label="Add domain"
          >
            <Plus className="size-4" />
            <span className="hidden sm:inline">Add</span>
          </Button>
        </form>
        {errors.domain && (
          <p
            id="domain-error"
            className="text-xs text-destructive"
            role="alert"
          >
            {errors.domain.message}
          </p>
        )}
      </div>

      {/* Domain List */}
      <DomainList domains={domains} onRemove={removeDomain} />

      {/* Advanced Options */}
      <AdvancedOptions />

      {/* Error Alert */}
      {createOrderMutation.isError && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>
            {createOrderMutation.error?.message ||
              "Failed to create certificate order. Please try again."}
          </AlertDescription>
        </Alert>
      )}

      {/* Generate Button */}
      <Button
        onClick={handleGenerate}
        disabled={domains.length === 0 || createOrderMutation.isPending}
        className="w-full h-12 rounded-lg text-base font-medium"
        size="lg"
      >
        {createOrderMutation.isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            <span>Creating Order...</span>
          </>
        ) : (
          <>
            <span>Generate Certificate</span>
            <ArrowRight className="size-4" />
          </>
        )}
      </Button>
    </div>
  );
}
