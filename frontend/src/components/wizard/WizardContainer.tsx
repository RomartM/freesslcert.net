import { StepIndicator } from "@/components/wizard/StepIndicator";
import { StepDomainInput } from "@/components/wizard/StepDomainInput";
import { StepValidation } from "@/components/wizard/StepValidation";
import { StepDownload } from "@/components/wizard/StepDownload";
import { useWizardStore } from "@/stores/wizard-store";

export function WizardContainer() {
  const currentStep = useWizardStore((state) => state.currentStep);

  return (
    <div className="rounded-xl border border-neutral-200/60 bg-white shadow-sm">
      <div className="p-6 pb-0">
        <StepIndicator currentStep={currentStep} />
      </div>
      <div className="p-6">
        {currentStep === "domain" && <StepDomainInput />}
        {currentStep === "validation" && <StepValidation />}
        {currentStep === "download" && <StepDownload />}
      </div>
    </div>
  );
}
