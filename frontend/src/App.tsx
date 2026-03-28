import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageShell } from "@/components/layout/PageShell";
import { LocaleLayout } from "@/components/layout/LocaleLayout";
import { HomePage } from "@/pages/HomePage";
import type { ReactNode } from "react";

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
const BlogIndexPage = lazy(() =>
  import("@/pages/BlogIndexPage").then((m) => ({
    default: m.BlogIndexPage,
  }))
);
const WhyHTTPSMatters = lazy(() =>
  import("@/pages/blog/WhyHTTPSMatters").then((m) => ({
    default: m.WhyHTTPSMatters,
  }))
);
const LetsEncryptGuide = lazy(() =>
  import("@/pages/blog/LetsEncryptGuide").then((m) => ({
    default: m.LetsEncryptGuide,
  }))
);
const SSLCertificateTypes = lazy(() =>
  import("@/pages/blog/SSLCertificateTypes").then((m) => ({
    default: m.SSLCertificateTypes,
  }))
);

/**
 * Generates the page route elements used in both the English (no prefix)
 * and localized (/:lang prefix) route groups.
 *
 * Paths are relative (no leading slash) so they resolve correctly
 * under both the root layout and the /:lang layout.
 */
function pageRoutes(): ReactNode {
  return (
    <>
      <Route index element={<HomePage />} />
      <Route path="about" element={<AboutPage />} />
      <Route path="faq" element={<FAQPage />} />
      <Route path="guides/nginx-ssl" element={<NginxSSLGuidePage />} />
      <Route path="guides/apache-ssl" element={<ApacheSSLGuidePage />} />
      <Route path="guides/wordpress-ssl" element={<WordPressSSLGuidePage />} />
      <Route path="guides/nodejs-ssl" element={<NodejsSSLGuidePage />} />
      <Route path="ssl-vs-tls" element={<SSLvsTLSPage />} />
      <Route path="ssl-checker" element={<SSLCheckerPage />} />
      <Route path="blog" element={<BlogIndexPage />} />
      <Route
        path="blog/why-https-matters-2026"
        element={<WhyHTTPSMatters />}
      />
      <Route
        path="blog/lets-encrypt-guide"
        element={<LetsEncryptGuide />}
      />
      <Route
        path="blog/ssl-certificate-types-explained"
        element={<SSLCertificateTypes />}
      />
      <Route path="privacy" element={<PrivacyPage />} />
      <Route path="terms" element={<TermsPage />} />
    </>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-neutral-50/50">
      <Header />
      <main className="pt-24 pb-20">
        <PageShell>
          <Suspense fallback={null}>
            <Routes>
              {/* English (default, no prefix) */}
              <Route element={<LocaleLayout />}>
                {pageRoutes()}
              </Route>

              {/* Localized (with /:lang prefix) */}
              <Route path="/:lang" element={<LocaleLayout />}>
                {pageRoutes()}
              </Route>

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
