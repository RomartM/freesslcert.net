import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WizardStep } from "@/types/wizard";

export interface StepIndicatorProps {
  currentStep: WizardStep;
}

const STEPS: Array<{
  key: WizardStep;
  number: number;
  label: string;
}> = [
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
      <ol className="flex items-center justify-between">
        {STEPS.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <li key={step.key} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300",
                    isCompleted &&
                      "bg-primary-600 text-white",
                    isCurrent &&
                      "border-2 border-primary-500 text-primary-600",
                    !isCompleted &&
                      !isCurrent &&
                      "bg-neutral-100 text-neutral-400"
                  )}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  {isCompleted ? (
                    <Check className="size-4" />
                  ) : (
                    <span>{step.number}</span>
                  )}
                </div>
                <span
                  className={cn(
                    "hidden text-xs font-medium transition-colors duration-200 md:block",
                    isCurrent && "text-foreground",
                    isCompleted && "text-primary-600",
                    !isCurrent &&
                      !isCompleted &&
                      "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={cn(
                    "mx-2 h-px flex-1 transition-colors duration-300 sm:mx-4",
                    index < currentIndex
                      ? "bg-primary-500"
                      : "bg-neutral-200"
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
