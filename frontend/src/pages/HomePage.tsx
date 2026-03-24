import { WizardContainer } from "@/components/wizard/WizardContainer";
import { TrustSection } from "@/components/marketing/TrustSection";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { FaqSection } from "@/components/marketing/FaqSection";

export function HomePage() {
  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-900">
          Free SSL Certificates
        </h1>
        <p className="mt-2 text-base text-neutral-500">
          Powered by Let&#39;s Encrypt. No signup. No cost.
        </p>
      </div>

      <WizardContainer />

      <TrustSection />
      <HowItWorks />
      <FaqSection />
    </>
  );
}
