import { Link } from "@tanstack/react-router";
import { useState } from "react";
import logo from "@/assets/logo.jpeg";
import { Menu, X, Heart } from "lucide-react";
import { useSiteSettings } from "@/lib/site-content";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/adopt", label: "Adopt" },
  { to: "/get-involved", label: "Get Involved" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const settings = useSiteSettings();
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border/60">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <img src={logo} alt={`${settings.org_name} logo`} className="h-12 w-12 rounded-full object-cover ring-1 ring-border" />
          <div className="leading-tight">
            <div className="font-display text-lg text-primary font-semibold tracking-tight">{settings.org_name}</div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{settings.org_tagline}</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="px-4 py-2 rounded-full text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary-soft/50 transition-colors"
              activeProps={{ className: "px-4 py-2 rounded-full text-sm font-semibold text-primary bg-primary-soft/70" }}
              activeOptions={{ exact: true }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/donate"
            className="hidden sm:inline-flex items-center gap-2 rounded-full bg-coral px-5 py-2.5 text-sm font-semibold text-coral-foreground hover:opacity-90 transition shadow-[var(--shadow-soft)]"
          >
            <Heart className="h-4 w-4 fill-current" /> {settings.donate_label}
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden p-2 rounded-full hover:bg-muted"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background">
          <div className="px-5 py-4 flex flex-col gap-1">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-xl text-base font-medium text-foreground hover:bg-muted"
                activeProps={{ className: "px-4 py-3 rounded-xl text-base font-semibold text-primary bg-primary-soft/60" }}
                activeOptions={{ exact: true }}
              >
                {n.label}
              </Link>
            ))}
            <Link
              to="/donate"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-coral px-5 py-3 text-sm font-semibold text-coral-foreground"
            >
              <Heart className="h-4 w-4 fill-current" /> {settings.donate_label}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
