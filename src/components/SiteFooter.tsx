import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo.jpeg";
import { Facebook, Instagram, Mail, MapPin, Phone, MessageCircle } from "lucide-react";
import { useSiteSettings } from "@/lib/site-content";

export function SiteFooter() {
  const s = useSiteSettings();
  return (
    <footer className="mt-24 bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="h-14 w-14 rounded-full bg-white p-1" />
            <div>
              <div className="font-display text-xl">{s.org_name}</div>
              <div className="text-xs uppercase tracking-[0.25em] opacity-70">{s.org_tagline}</div>
            </div>
          </div>
          <p className="mt-5 max-w-md text-sm leading-relaxed opacity-80">{s.footer_about}</p>
        </div>

        <div>
          <h4 className="font-display text-base mb-4">Explore</h4>
          <ul className="space-y-2 text-sm opacity-80">
            <li><Link to="/about" className="hover:opacity-100">About us</Link></li>
            <li><Link to="/adopt" className="hover:opacity-100">Adopt</Link></li>
            <li><Link to="/get-involved" className="hover:opacity-100">Volunteer</Link></li>
            <li><Link to="/donate" className="hover:opacity-100">Donate</Link></li>
            <li><Link to="/contact" className="hover:opacity-100">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-base mb-4">Reach us</h4>
          <ul className="space-y-3 text-sm opacity-80">
            <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 shrink-0" />{s.address}</li>
            <li className="flex items-start gap-2"><Phone className="h-4 w-4 mt-0.5 shrink-0" />{s.phone}</li>
            <li className="flex items-start gap-2"><Mail className="h-4 w-4 mt-0.5 shrink-0" />{s.email}</li>
            <li className="flex flex-wrap gap-3 pt-2">
              <a href={s.whatsapp} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:opacity-100">
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
              <a href={s.facebook_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:opacity-100">
                <Facebook className="h-4 w-4" /> Facebook
              </a>
              <a href={s.instagram_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:opacity-100">
                <Instagram className="h-4 w-4" /> Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-6 text-xs opacity-60 flex flex-col sm:flex-row gap-2 justify-between">
          <span>© {new Date().getFullYear()} {s.org_name} {s.org_tagline}. All rights reserved.</span>
          <span>Made with care in Mauritius 🐾</span>
        </div>
      </div>
    </footer>
  );
}
