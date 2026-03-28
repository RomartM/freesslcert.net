import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageShell } from "@/components/layout/PageShell";
import { HomePage } from "@/pages/HomePage";

const PrivacyPage = lazy(() =>
  import("@/pages/PrivacyPage").then((m) => ({ default: m.PrivacyPage }))
);
const TermsPage = lazy(() =>
  import("@/pages/TermsPage").then((m) => ({ default: m.TermsPage }))
);
const NotFoundPage = lazy(() =>
  import("@/pages/NotFoundPage").then((m) => ({ default: m.NotFoundPage }))
);
const AboutPage = lazy(() =>
  import("@/pages/AboutPage").then((m) => ({ default: m.AboutPage }))
);
const FAQPage = lazy(() =>
  import("@/pages/FAQPage").then((m) => ({ default: m.FAQPage }))
);
const NginxSSLGuidePage = lazy(() =>
  import("@/pages/NginxSSLGuidePage").then((m) => ({
    default: m.NginxSSLGuidePage,
  }))
);
const ApacheSSLGuidePage = lazy(() =>
  import("@/pages/ApacheSSLGuidePage").then((m) => ({
    default: m.ApacheSSLGuidePage,
  }))
);
const WordPressSSLGuidePage = lazy(() =>
  import("@/pages/WordPressSSLGuidePage").then((m) => ({
    default: m.WordPressSSLGuidePage,
  }))
);
const NodejsSSLGuidePage = lazy(() =>
  import("@/pages/NodejsSSLGuidePage").then((m) => ({
    default: m.NodejsSSLGuidePage,
  }))
);
const SSLvsTLSPage = lazy(() =>
  import("@/pages/SSLvsTLSPage").then((m) => ({
    default: m.SSLvsTLSPage,
  }))
);
const SSLCheckerPage = lazy(() =>
  import("@/pages/SSLCheckerPage").then((m) => ({
    default: m.SSLCheckerPage,
  }))
);

function App() {
  return (
    <div className="min-h-screen bg-neutral-50/50">
      <Header />
      <main className="pt-24 pb-20">
        <PageShell>
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/guides/nginx-ssl" element={<NginxSSLGuidePage />} />
              <Route
                path="/guides/apache-ssl"
                element={<ApacheSSLGuidePage />}
              />
              <Route
                path="/guides/wordpress-ssl"
                element={<WordPressSSLGuidePage />}
              />
              <Route
                path="/guides/nodejs-ssl"
                element={<NodejsSSLGuidePage />}
              />
              <Route path="/ssl-vs-tls" element={<SSLvsTLSPage />} />
              <Route path="/ssl-checker" element={<SSLCheckerPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </PageShell>
      </main>
      <Footer />
    </div>
  );
}

export default App;
