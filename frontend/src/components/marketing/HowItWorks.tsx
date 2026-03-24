import { Globe, ShieldCheck, Download } from "lucide-react";

const steps = [
  {
    icon: Globe,
    title: "Enter Your Domain",
    description: "Type your domain name and select your certificate type.",
  },
  {
    icon: ShieldCheck,
    title: "Verify Ownership",
    description: "Prove you own the domain via HTTP file or DNS record.",
  },
  {
    icon: Download,
    title: "Download Certificate",
    description: "Get your SSL certificate files ready to install.",
  },
];

export function HowItWorks() {
  return (
    <section className="mt-16" aria-labelledby="how-it-works-heading">
      <h2
        id="how-it-works-heading"
        className="text-xl font-semibold tracking-tight text-neutral-900 text-center mb-8"
      >
        How It Works
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div key={step.title} className="text-center">
              <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                <Icon className="size-5" aria-hidden="true" />
              </div>
              <h3 className="text-sm font-semibold text-neutral-900">{step.title}</h3>
              <p className="mt-1 text-sm text-neutral-500 leading-relaxed">{step.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
