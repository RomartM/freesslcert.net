import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WizardStep } from "@/types/wizard";

const STEPS: Array<{ key: WizardStep; label: string }> = [
  { key: "domain", label: "Domain" },
  { key: "validation", label: "Verify" },
  { key: "download", label: "Download" },
];

function getStepIndex(step: WizardStep): number {
  return STEPS.findIndex((s) => s.key === step);
}

export function StepIndicator({ currentStep }: { currentStep: WizardStep }) {
  const currentIndex = getStepIndex(currentStep);

  return (
    <nav aria-label="Wizard progress" className="w-full">
      <ol className="flex items-center justify-between mb-6">
        {STEPS.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <li key={step.key} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full text-sm font-medium transition-all duration-150",
                    isCompleted && "bg-primary-600 text-white",
                    isCurrent && "bg-primary-50 text-primary-700 ring-2 ring-primary-600",
                    !isCompleted && !isCurrent && "bg-neutral-100 text-neutral-400"
                  )}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  {isCompleted ? <Check className="size-4" strokeWidth={2.5} /> : index + 1}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium",
                    (isCurrent || isCompleted) ? "text-primary-700" : "text-neutral-400"
                  )}
                >
                  {step.label}
                </span>
              </div>

              {index < STEPS.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-px mx-4 transition-colors duration-150",
                    isCompleted ? "bg-primary-400" : "bg-neutral-200"
                  )}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
