import { ShieldCheck, BookOpen, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useLocalePath } from "@/hooks/useLocalePath";

interface RelatedTool {
  icon: typeof ShieldCheck;
  title: string;
  description: string;
  path: string;
}

const TOOLS: RelatedTool[] = [
  {
    icon: ShieldCheck,
    title: "SSL Certificate Checker",
    description:
      "Verify any SSL certificate — expiration, issuer, chain, protocol.",
    path: "/ssl-checker",
  },
  {
    icon: BookOpen,
    title: "SSL vs TLS Explained",
    description:
      "Learn the difference between SSL and TLS and which versions to use.",
    path: "/ssl-vs-tls",
  },
];

export function RelatedTools() {
  const localePath = useLocalePath();

  return (
    <section className="mt-16" aria-labelledby="related-tools-heading">
      <h2
        id="related-tools-heading"
        className="text-xl font-semibold tracking-tight text-neutral-900 text-center mb-6"
      >
        Related tools
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TOOLS.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.path}
              to={localePath(tool.path)}
              className="group flex items-start gap-4 rounded-lg border border-neutral-200/60 p-5 transition-all duration-150 hover:border-primary-300 hover:shadow-sm"
            >
              <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                <Icon className="size-5" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-neutral-900 flex items-center gap-1.5">
                  {tool.title}
                  <ArrowRight
                    className="size-3.5 text-neutral-400 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-primary-600"
                    aria-hidden="true"
                  />
                </h3>
                <p className="mt-1 text-sm text-neutral-500 leading-relaxed">
                  {tool.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
