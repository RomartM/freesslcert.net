import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WizardStep } from "@/types/wizard";

export interface StepIndicatorProps {
  currentStep: WizardStep;
}

const STEPS: Array<{ key: WizardStep; number: number; label: string }> = [
  { key: "domain", number: 1, label: "Domain" },
  { key: "validation", number: 2, label: "Verify" },
  { key: "download", number: 3, label: "Download" },
];

function getStepIndex(step: WizardStep): number {
  return STEPS.findIndex((s) => s.key === step);
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const currentIndex = getStepIndex(currentStep);

  return (
    <nav aria-label="Wizard progress" className="w-full">
      <ol className="flex items-start">
        {STEPS.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <li
              key={step.key}
              className={cn(
                "flex items-center",
                index < STEPS.length - 1 ? "flex-1" : ""
              )}
            >
              {/* Circle + Label */}
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "flex size-9 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300",
                    isCompleted && "bg-primary-600 text-white",
                    isCurrent && "border-2 border-primary-500 bg-primary-50 text-primary-700",
                    !isCompleted && !isCurrent && "border border-neutral-300 bg-white text-neutral-400"
                  )}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  {isCompleted ? (
                    <Check className="size-4" strokeWidth={3} />
                  ) : (
                    <span>{step.number}</span>
                  )}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium whitespace-nowrap",
                    isCurrent && "text-primary-700",
                    isCompleted && "text-primary-600",
                    !isCurrent && !isCompleted && "text-neutral-400"
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {index < STEPS.length - 1 && (
                <div
                  className={cn(
                    "h-px flex-1 mx-3 mt-[18px] -translate-y-1/2",
                    index < currentIndex ? "bg-primary-500" : "bg-neutral-200"
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
