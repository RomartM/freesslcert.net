import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageShell } from "@/components/layout/PageShell";
import { WizardContainer } from "@/components/wizard/WizardContainer";
import { TrustSection } from "@/components/marketing/TrustSection";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { FaqSection } from "@/components/marketing/FaqSection";
import { PrivacySection } from "@/components/marketing/PrivacySection";
import { TermsSection } from "@/components/marketing/TermsSection";

function App() {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 transition-colors dark:bg-neutral-950 dark:text-neutral-100">
      <Header />
      <main className="pt-20 pb-16">
        <PageShell>
          {/* Hero */}
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Free SSL Certificates
            </h1>
            <p className="mt-3 text-lg text-neutral-500 dark:text-neutral-400">
              Powered by Let's Encrypt. No signup. No cost. 60 seconds.
            </p>
          </div>

          <WizardContainer />

          <TrustSection />
          <HowItWorks />
          <FaqSection />
          <PrivacySection />
          <TermsSection />
        </PageShell>
      </main>
      <Footer />
    </div>
  );
}

export default App;
