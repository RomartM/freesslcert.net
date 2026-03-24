import { useWizardStore } from "@/stores/wizard-store";
import { CertificateCard } from "@/components/certificate/CertificateCard";
import { DownloadButtons } from "@/components/certificate/DownloadButtons";
import { InstallGuide } from "@/components/certificate/InstallGuide";
import { AutoClearWarning } from "@/components/certificate/AutoClearWarning";
import { Button } from "@/components/ui/button";
import { CheckCircle2, RotateCcw } from "lucide-react";

export function StepDownload() {
  const certificateData = useWizardStore((s) => s.certificateData);
  const reset = useWizardStore((s) => s.reset);

  if (!certificateData) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-sm text-neutral-500">
          No certificate data available. Please start over.
        </p>
        <Button onClick={reset} variant="outline" className="min-h-11 rounded-lg transition-colors duration-150">
          <RotateCcw className="size-4" />
          Start Over
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Success banner */}
      <div className="flex flex-col items-center gap-3 py-4">
        <div className="flex size-16 items-center justify-center rounded-full bg-primary-100">
          <CheckCircle2 className="size-8 text-primary-600" aria-hidden="true" />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-semibold tracking-tight text-neutral-900">
            Certificate Issued
          </h2>
          <p className="text-sm text-neutral-500">
            Your SSL certificate is ready. Download the files below.
          </p>
        </div>
      </div>

      <AutoClearWarning />

      <CertificateCard order={certificateData} />

      <DownloadButtons order={certificateData} />

      <InstallGuide />

      {/* Generate Another */}
      <div className="flex justify-center pt-4 pb-2">
        <Button
          variant="outline"
          size="lg"
          onClick={reset}
          className="min-h-11 rounded-lg transition-colors duration-150"
          aria-label="Generate another certificate"
        >
          <RotateCcw className="size-4" />
          Generate Another Certificate
        </Button>
      </div>
    </div>
  );
}
