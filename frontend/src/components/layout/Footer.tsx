import { Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background transition-colors">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-4 py-6 sm:flex-row sm:justify-between">
        <p className="text-xs text-muted-foreground">
          Powered by{" "}
          <a
            href="https://letsencrypt.org"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 transition-colors hover:text-foreground"
          >
            Let's Encrypt
          </a>
        </p>

        <nav
          className="flex items-center gap-4"
          aria-label="Footer navigation"
        >
          <a
            href="#privacy"
            className="text-xs text-muted-foreground underline-offset-2 transition-colors hover:text-foreground hover:underline"
          >
            Privacy
          </a>
          <a
            href="#terms"
            className="text-xs text-muted-foreground underline-offset-2 transition-colors hover:text-foreground hover:underline"
          >
            Terms
          </a>
          <a
            href="https://github.com/freesslcert"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="GitHub repository"
          >
            <Github className="size-4" />
          </a>
        </nav>
      </div>
    </footer>
  );
}
