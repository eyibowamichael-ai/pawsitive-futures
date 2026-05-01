import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Facebook, Send } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Mont Choisy Animal Angels" },
      { name: "description", content: "Get in touch with Mont Choisy Animal Angels about adoption, fostering, volunteering or donations." },
      { property: "og:title", content: "Contact Mont Choisy Animal Angels" },
      { property: "og:description", content: "We'd love to hear from you." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <>
      <section className="bg-paper">
        <div className="mx-auto max-w-5xl px-5 sm:px-8 pt-20 pb-12 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-coral font-semibold">Contact</p>
          <h1 className="mt-5 text-5xl sm:text-6xl font-display leading-[1.05] text-balance">
            Say hello.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Adoption questions, foster offers, donations, or just a kind word —
            we read every message.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 sm:px-8 py-16 grid lg:grid-cols-5 gap-10">
        <div className="lg:col-span-2 space-y-6">
          {[
            { icon: MapPin, label: "Where we are", value: "Mont Choisy, northern Mauritius" },
            { icon: Mail, label: "Email", value: "hello@montchoisyangels.org" },
            { icon: Facebook, label: "Facebook", value: "Mont Choisy Animal Angels", href: "https://www.facebook.com/share/1Nswsqm9CH/" },
          ].map((c) => (
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

        <form
          onSubmit={(e) => { e.preventDefault(); setSent(true); }}
          className="lg:col-span-3 rounded-[2rem] bg-cream p-8 sm:p-10 space-y-5"
        >
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Your name" name="name" />
            <Field label="Email" name="email" type="email" />
          </div>
          <Field label="Subject" name="subject" />
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Message</label>
            <textarea required rows={5} className="mt-2 w-full rounded-2xl bg-card border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
          </div>
          <button className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-7 py-3.5 text-sm font-semibold hover:opacity-90">
            <Send className="h-4 w-4" /> Send message
          </button>
          {sent && <p className="text-sm text-primary font-medium">Thank you! We'll be in touch soon. 🐾</p>}
        </form>
      </section>
    </>
  );
}

function Field({ label, name, type = "text" }: { label: string; name: string; type?: string }) {
  return (
    <div>
      <label htmlFor={name} className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{label}</label>
      <input id={name} name={name} type={type} required className="mt-2 w-full rounded-2xl bg-card border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
    </div>
  );
}
