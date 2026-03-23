import { Shield } from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export function Header() {
  return (
    <header className="fixed top-0 right-0 left-0 z-50 h-14 border-b border-border/50 bg-background/80 backdrop-blur-xl transition-colors">
      <div className="mx-auto flex h-full max-w-5xl items-center justify-between px-4">
        <a
          href="/"
          className="flex items-center gap-2 font-sans text-base font-semibold tracking-tight text-foreground transition-opacity hover:opacity-80"
          aria-label="freesslcert.net home"
        >
          <Shield className="size-5 text-primary-500" />
          <span>freesslcert.net</span>
        </a>

        <ThemeToggle />
      </div>
    </header>
  );
}
