import { Globe, ShieldCheck, Download } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  icon: typeof Globe;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    icon: Globe,
    title: "Enter Your Domain",
    description:
      "Type your domain name and choose your certificate type. We support single, wildcard, and multi-domain certificates.",
  },
  {
    icon: ShieldCheck,
    title: "Verify Ownership",
    description:
      "Prove you own the domain by placing a file on your server or adding a DNS record. We guide you through every step.",
  },
  {
    icon: Download,
    title: "Download Certificate",
    description:
      "Get your signed SSL certificate instantly. Download the files and install them on your web server.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-12" aria-labelledby="how-it-works-heading">
      <h2
        id="how-it-works-heading"
        className="text-2xl font-bold text-center text-foreground mb-8"
      >
        How It Works
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div
              key={step.title}
              className="flex flex-col items-center text-center space-y-3"
            >
              <div
                className={cn(
                  "relative flex size-14 items-center justify-center rounded-xl",
                  "bg-primary-50"
                )}
              >
                <Icon className="size-7 text-primary-500" aria-hidden="true" />
                <span
                  className={cn(
                    "absolute -top-2 -right-2 flex size-6 items-center justify-center",
                    "rounded-full bg-primary-500 text-xs font-bold text-white"
                  )}
                >
                  {index + 1}
                </span>
              </div>
              <h3 className="text-base font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                {step.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
