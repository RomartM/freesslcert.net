import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useClipboard } from "@/hooks/useClipboard";
import { certificatesApi } from "@/api/certificates";
import { Download, Copy, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { CertificateOrder } from "@/types/certificate";

export interface DownloadButtonsProps {
  order: CertificateOrder;
}

function triggerFileDownload(content: string, filename: string): void {
  const blob = new Blob([content], { type: "application/x-pem-file" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function triggerBlobDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

interface DownloadItem {
  id: string;
  label: string;
  filename: string;
  content: string | undefined;
  format?: string;
}

export function DownloadButtons({ order }: DownloadButtonsProps) {
  const [loadingFormat, setLoadingFormat] = useState<string | null>(null);
  const { copied, copy } = useClipboard();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const downloadItems: DownloadItem[] = [
    {
      id: "cert",
      label: "Certificate (.pem)",
      filename: "cert.pem",
      content: order.certificate,
    },
    {
      id: "key",
      label: "Private Key (.key)",
      filename: "privkey.key",
      content: order.private_key,
    },
    {
      id: "ca",
      label: "CA Bundle (.pem)",
      filename: "ca-bundle.pem",
      content: order.ca_bundle,
    },
    {
      id: "fullchain",
      label: "Full Chain (.pem)",
      filename: "fullchain.pem",
      content:
        order.certificate && order.ca_bundle
          ? `${order.certificate}\n${order.ca_bundle}`
          : undefined,
    },
  ];

  const handleDownload = (item: DownloadItem) => {
    if (item.content) {
      triggerFileDownload(item.content, item.filename);
    }
  };

  const handlePkcs12Download = async () => {
    setLoadingFormat("pkcs12");
    try {
      const blob = await certificatesApi.downloadCertificate(
        order.id,
        "pkcs12"
      );
      triggerBlobDownload(blob as Blob, "certificate.p12");
    } catch {
      toast.error("Failed to download PKCS12 file");
    } finally {
      setLoadingFormat(null);
    }
  };

  const handleCopy = async (id: string, content: string) => {
    setCopiedField(id);
    await copy(content);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const copyableItems = downloadItems.filter(
    (item) => item.content && item.id !== "fullchain"
  );

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-foreground">
        Download Files
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {downloadItems.map((item) => (
          <Button
            key={item.id}
            variant="outline"
            size="lg"
            onClick={() => handleDownload(item)}
            disabled={!item.content}
            className="justify-start gap-2"
            aria-label={`Download ${item.label}`}
          >
            <Download className="size-4 shrink-0" />
            <span className="truncate">{item.label}</span>
          </Button>
        ))}

        <Button
          variant="outline"
          size="lg"
          onClick={handlePkcs12Download}
          disabled={loadingFormat === "pkcs12"}
          className="justify-start gap-2"
          aria-label="Download PKCS12 bundle"
        >
          {loadingFormat === "pkcs12" ? (
            <Loader2 className="size-4 animate-spin shrink-0" />
          ) : (
            <Download className="size-4 shrink-0" />
          )}
          <span className="truncate">PKCS12 (.p12)</span>
        </Button>
      </div>

      {copyableItems.length > 0 && (
        <>
          <h3 className="text-sm font-semibold text-foreground pt-2">
            Copy to Clipboard
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {copyableItems.map((item) => {
              const isCopied = copiedField === item.id && copied;
              return (
                <Button
                  key={`copy-${item.id}`}
                  variant="ghost"
                  size="lg"
                  onClick={() => handleCopy(item.id, item.content!)}
                  className="justify-start gap-2"
                  aria-label={`Copy ${item.label} to clipboard`}
                >
                  {isCopied ? (
                    <Check className="size-4 text-success shrink-0" />
                  ) : (
                    <Copy className="size-4 shrink-0" />
                  )}
                  <span className="truncate">{item.label}</span>
                </Button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
