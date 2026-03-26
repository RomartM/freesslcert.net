import { WizardContainer } from "@/components/wizard/WizardContainer";
import { TrustSection } from "@/components/marketing/TrustSection";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { FaqSection } from "@/components/marketing/FaqSection";

export function HomePage() {
  return (
    <>
      <div className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-green-600">
          Free SSL Certificates
        </h1>
        <p className="mt-3 text-[17px] text-neutral-400 font-light">
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
