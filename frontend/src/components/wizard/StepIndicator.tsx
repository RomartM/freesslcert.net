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
    <nav aria-label="Progress" className="w-full mb-4">
      <ol className="flex items-center">
        {STEPS.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <li key={step.key} className="flex items-center flex-1 last:flex-none">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "flex size-6 items-center justify-center rounded-full text-[11px] font-semibold transition-all duration-150",
                    isCompleted && "bg-primary-600 text-white",
                    isCurrent && "bg-primary-600 text-white",
                    !isCompleted && !isCurrent && "bg-neutral-200 text-neutral-400"
                  )}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  {isCompleted ? <Check className="size-3" strokeWidth={3} /> : index + 1}
                </div>
                <span
                  className={cn(
                    "text-[13px] font-medium hidden sm:inline",
                    (isCurrent || isCompleted) ? "text-neutral-900" : "text-neutral-400"
                  )}
                >
                  {step.label}
                </span>
              </div>

              {index < STEPS.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-px mx-3",
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
