import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CopyBlock } from "@/components/validation/CopyBlock";

const NGINX_SNIPPET = `server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate     /path/to/fullchain.pem;
    ssl_certificate_key /path/to/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
}`;

const APACHE_SNIPPET = `<VirtualHost *:443>
    ServerName your-domain.com

    SSLEngine on
    SSLCertificateFile    /path/to/cert.pem
    SSLCertificateKeyFile /path/to/privkey.pem
    SSLCertificateChainFile /path/to/chain.pem
</VirtualHost>`;

const NODEJS_SNIPPET = `const https = require('https');
const fs = require('fs');

const options = {
  cert: fs.readFileSync('/path/to/fullchain.pem'),
  key: fs.readFileSync('/path/to/privkey.pem')
};

https.createServer(options, app).listen(443);`;

const CADDY_SNIPPET = `your-domain.com {
    tls /path/to/fullchain.pem /path/to/privkey.pem
    reverse_proxy localhost:3000
}`;

interface GuideTab {
  value: string;
  label: string;
  snippet: string;
}

const guides: GuideTab[] = [
  { value: "nginx", label: "Nginx", snippet: NGINX_SNIPPET },
  { value: "apache", label: "Apache", snippet: APACHE_SNIPPET },
  { value: "nodejs", label: "Node.js", snippet: NODEJS_SNIPPET },
  { value: "caddy", label: "Caddy", snippet: CADDY_SNIPPET },
];

export function InstallGuide() {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">
        Installation Guide
      </h3>
      <Tabs defaultValue="nginx">
        <TabsList>
          {guides.map((guide) => (
            <TabsTrigger key={guide.value} value={guide.value}>
              {guide.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {guides.map((guide) => (
          <TabsContent key={guide.value} value={guide.value}>
            <div className="pt-3">
              <CopyBlock
                label={`${guide.label} configuration`}
                value={guide.snippet}
              />
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
