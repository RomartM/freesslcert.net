import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Calendar, Key, Building2 } from "lucide-react";
import type { CertificateOrder } from "@/types/certificate";

export interface CertificateCardProps {
  order: CertificateOrder;
}

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatKeyType(keyType: string): string {
  const map: Record<string, string> = {
    "rsa-2048": "RSA 2048-bit",
    "rsa-4096": "RSA 4096-bit",
    "ecdsa-p256": "ECDSA P-256",
    "ecdsa-p384": "ECDSA P-384",
  };
  return map[keyType] || keyType;
}

export function CertificateCard({ order }: CertificateCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-5 text-success" />
          <CardTitle>Certificate Details</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Domains
            </dt>
            <dd className="flex flex-wrap gap-1.5">
              {order.domains.map((domain) => (
                <Badge key={domain} variant="secondary">
                  {domain}
                </Badge>
              ))}
            </dd>
          </div>

          <div className="space-y-1.5">
            <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1">
              <Key className="size-3" aria-hidden="true" />
              Key Type
            </dt>
            <dd className="text-sm font-medium text-foreground">
              {formatKeyType(order.key_type)}
            </dd>
          </div>

          <div className="space-y-1.5">
            <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1">
              <Calendar className="size-3" aria-hidden="true" />
              Issued
            </dt>
            <dd className="text-sm font-medium text-foreground">
              {formatDate(order.issued_at)}
            </dd>
          </div>

          <div className="space-y-1.5">
            <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1">
              <Calendar className="size-3" aria-hidden="true" />
              Expires
            </dt>
            <dd className="text-sm font-medium text-foreground">
              {formatDate(order.expires_at)}
            </dd>
          </div>

          <div className="space-y-1.5">
            <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1">
              <Building2 className="size-3" aria-hidden="true" />
              Issuer
            </dt>
            <dd className="text-sm font-medium text-foreground">
              Let's Encrypt
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
