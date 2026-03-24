import { Routes, Route } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageShell } from "@/components/layout/PageShell";
import { HomePage } from "@/pages/HomePage";
import { PrivacyPage } from "@/pages/PrivacyPage";
import { TermsPage } from "@/pages/TermsPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

function App() {
  return (
    <div className="min-h-screen bg-neutral-50/50">
      <Header />
      <main className="pt-24 pb-20">
        <PageShell>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </PageShell>
      </main>
      <Footer />
    </div>
  );
}

export default App;
