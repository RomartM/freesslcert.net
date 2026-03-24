import { StepIndicator } from "@/components/wizard/StepIndicator";
import { StepDomainInput } from "@/components/wizard/StepDomainInput";
import { StepValidation } from "@/components/wizard/StepValidation";
import { StepDownload } from "@/components/wizard/StepDownload";
import { useWizardStore } from "@/stores/wizard-store";

export function WizardContainer() {
  const currentStep = useWizardStore((state) => state.currentStep);

  return (
    <div className="rounded-2xl border border-neutral-200/50 bg-white shadow-lg shadow-neutral-200/50">
      <div className="px-6 pt-5 pb-0 sm:px-8">
        <StepIndicator currentStep={currentStep} />
      </div>
      <div className="px-6 pb-6 pt-2 sm:px-8 sm:pb-8">
        {currentStep === "domain" && <StepDomainInput />}
        {currentStep === "validation" && <StepValidation />}
        {currentStep === "download" && <StepDownload />}
      </div>
    </div>
  );
}
