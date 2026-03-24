import { WizardContainer } from "@/components/wizard/WizardContainer";
import { TrustSection } from "@/components/marketing/TrustSection";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { FaqSection } from "@/components/marketing/FaqSection";

export function HomePage() {
  return (
    <>
      <div className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-900">
          Free SSL Certificates
        </h1>
        <p className="mt-3 text-lg text-neutral-500">
          Powered by Let's Encrypt. No signup. No cost. 60 seconds.
        </p>
      </div>

      <WizardContainer />

      <TrustSection />
      <HowItWorks />
      <FaqSection />
    </>
  );
}
