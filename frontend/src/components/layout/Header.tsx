import { Lock } from "lucide-react";

export function Header() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-neutral-200 bg-white">
      <div className="mx-auto flex h-14 max-w-5xl items-center px-4">
        <a href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <Lock className="size-5 text-primary-600" />
          <span className="text-base font-semibold text-neutral-900">
            freesslcert.net
          </span>
        </a>
      </div>
    </header>
  );
}
