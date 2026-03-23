import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StepIndicator } from "@/components/wizard/StepIndicator";
import { StepDomainInput } from "@/components/wizard/StepDomainInput";
import { StepValidation } from "@/components/wizard/StepValidation";
import { StepDownload } from "@/components/wizard/StepDownload";
import { useWizardStore } from "@/stores/wizard-store";
import type { WizardStep } from "@/types/wizard";

const STEP_TITLES: Record<WizardStep, string> = {
  domain: "Configure Your Certificate",
  validation: "Verify Domain Ownership",
  download: "Download Certificate",
};

export function WizardContainer() {
  const currentStep = useWizardStore((state) => state.currentStep);

  return (
    <Card className="shadow-md">
      <CardHeader className="space-y-4 border-b pb-4">
        <StepIndicator currentStep={currentStep} />
        <CardTitle className="text-lg font-semibold">
          {STEP_TITLES[currentStep]}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {currentStep === "domain" && <StepDomainInput />}
        {currentStep === "validation" && <StepValidation />}
        {currentStep === "download" && <StepDownload />}
      </CardContent>
    </Card>
  );
}
