import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Facebook, Instagram, Phone, MessageCircle, Send } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { usePageContent, useSiteSettings } from "@/lib/site-content";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Animal Angels Mont Choisy" },
      { name: "description", content: "Get in touch with Animal Angels Mont Choisy about adoption, fostering, volunteering or donations." },
      { property: "og:title", content: "Contact Animal Angels Mont Choisy" },
      { property: "og:description", content: "Call, WhatsApp or email us — we'd love to hear from you." },
    ],
  }),
  component: Contact,
});

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  subject: z.string().trim().max(200).optional().default(""),
  message: z.string().trim().min(1, "Message is required").max(2000),
});

function Contact() {
  const c = usePageContent("contact");
  const s = useSiteSettings();
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      name: fd.get("name"),
      email: fd.get("email"),
      subject: fd.get("subject") ?? "",
      message: fd.get("message"),
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("contact_submissions").insert(parsed.data);
    setSubmitting(false);
    if (error) {
      toast.error("Could not send. Please try again.");
      return;
    }
    setSent(true);
    (e.target as HTMLFormElement).reset();
  };

  const contactItems = [
    { icon: MapPin, label: "Where we are", value: s.address },
    { icon: Phone, label: "Phone", value: s.phone, href: `tel:${s.phone.replace(/\s/g, "")}` },
    { icon: MessageCircle, label: "WhatsApp", value: s.phone, href: s.whatsapp },
    { icon: Mail, label: "Email", value: s.email, href: `mailto:${s.email}` },
    { icon: Facebook, label: "Facebook", value: s.org_name, href: s.facebook_url },
    { icon: Instagram, label: "Instagram", value: s.org_name, href: s.instagram_url },
  ];

  return (
    <>
      <section className="bg-paper">
        <div className="mx-auto max-w-5xl px-5 sm:px-8 pt-20 pb-12 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-coral font-semibold">{c.hero_eyebrow}</p>
          <h1 className="mt-5 text-5xl sm:text-6xl font-display leading-[1.05] text-balance">{c.hero_title}</h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">{c.hero_body}</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 sm:px-8 py-16 grid lg:grid-cols-5 gap-10">
        <div className="lg:col-span-2 space-y-6">
          {contactItems.map((c) => (
            <div key={c.label} className="rounded-3xl bg-card border border-border p-6 flex gap-4">
              <div className="h-11 w-11 rounded-2xl bg-primary-soft text-primary flex items-center justify-center shrink-0">
                <c.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{c.label}</div>
                {c.href ? (
                  <a href={c.href} target="_blank" rel="noreferrer" className="font-semibold hover:text-primary">{c.value}</a>
                ) : (
                  <div className="font-semibold">{c.value}</div>
                )}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={onSubmit} className="lg:col-span-3 rounded-[2rem] bg-cream p-8 sm:p-10 space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Your name" name="name" />
            <Field label="Email" name="email" type="email" />
          </div>
          <Field label="Subject" name="subject" required={false} />
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Message</label>
            <textarea name="message" required rows={5} maxLength={2000} className="mt-2 w-full rounded-2xl bg-card border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
          </div>
          <button disabled={submitting} className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-7 py-3.5 text-sm font-semibold hover:opacity-90 disabled:opacity-50">
            <Send className="h-4 w-4" /> {submitting ? "Sending…" : "Send message"}
          </button>
          {sent && <p className="text-sm text-primary font-medium">Thank you! We'll be in touch soon. 🐾</p>}
        </form>
      </section>
    </>
  );
}

function Field({ label, name, type = "text", required = true }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label htmlFor={name} className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{label}</label>
      <input id={name} name={name} type={type} required={required} maxLength={255} className="mt-2 w-full rounded-2xl bg-card border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
    </div>
  );
}
