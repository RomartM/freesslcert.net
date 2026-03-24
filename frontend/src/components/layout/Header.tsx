import { Lock } from "lucide-react";
import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-neutral-100">
      <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2.5 transition-opacity duration-150 hover:opacity-70">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary-600 text-white">
            <Lock className="size-4" />
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-neutral-900">
            freesslcert.net
          </span>
        </Link>
      </div>
    </header>
  );
}
