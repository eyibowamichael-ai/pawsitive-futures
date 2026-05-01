import { createFileRoute } from "@tanstack/react-router";
import { Heart, Stethoscope, Utensils, Home } from "lucide-react";

export const Route = createFileRoute("/donate")({
  head: () => ({
    meta: [
      { title: "Donate — Animal Angels Mont Choisy" },
      { name: "description", content: "Your donation funds vet care, food, sterilisation and rescue for stray animals in Mauritius." },
      { property: "og:title", content: "Donate — Animal Angels Mont Choisy" },
      { property: "og:description", content: "Help us rescue, heal and rehome more animals." },
    ],
  }),
  component: Donate,
});

const tiers = [
  { amount: "Rs 500", title: "A bowl of hope", text: "Feeds a rescue dog or cat for a week.", icon: Utensils },
  { amount: "Rs 1,500", title: "Vaccines & care", text: "Covers core vaccinations for one animal.", icon: Stethoscope },
  { amount: "Rs 4,000", title: "A second chance", text: "Funds a sterilisation — humanely reducing strays.", icon: Heart },
  { amount: "Rs 10,000", title: "Safe haven", text: "Supports a month of foster care, food and meds.", icon: Home },
];

function Donate() {
  return (
    <>
      <section className="bg-paper">
        <div className="mx-auto max-w-5xl px-5 sm:px-8 pt-20 pb-12 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-coral font-semibold">Donate</p>
          <h1 className="mt-5 text-5xl sm:text-6xl font-display leading-[1.05] text-balance">
            Every rupee becomes <em className="italic not-italic text-primary">care.</em>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            We're 100% volunteer-run, so your donation goes directly to vet bills,
            food, sterilisation and the practical things rescue takes.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 sm:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {tiers.map((t) => (
            <div key={t.amount} className="rounded-3xl bg-card border border-border p-7 hover:border-coral/50 transition">
              <div className="h-12 w-12 rounded-2xl bg-coral/15 text-coral flex items-center justify-center mb-5">
                <t.icon className="h-6 w-6" />
              </div>
              <div className="font-display text-3xl text-primary">{t.amount}</div>
              <div className="font-semibold mt-2">{t.title}</div>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{t.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 sm:px-8 pb-24">
        <div className="rounded-[2rem] bg-cream p-10 sm:p-14 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-display">How to give</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              We accept donations by bank transfer and direct contribution. Send
              us a message and we'll share the details — and a heartfelt thank
              you from the angels themselves.
            </p>
          </div>
          <div className="rounded-2xl bg-card border border-border p-6 space-y-3 text-sm">
            <div className="flex justify-between gap-4"><span className="text-muted-foreground">Beneficiary</span><span className="font-semibold text-right">Animal Angels Mont Choisy</span></div>
            <div className="flex justify-between gap-4"><span className="text-muted-foreground">WhatsApp</span><span className="font-semibold text-right">+230 5820 0966</span></div>
            <div className="flex justify-between gap-4"><span className="text-muted-foreground">Email</span><span className="font-semibold text-right">animalangels.mc@gmail.com</span></div>
            <div className="pt-3 border-t border-border grid gap-2">
              <a href="https://wa.me/23058200966?text=Hello%20Animal%20Angels%2C%20I%27d%20like%20to%20donate." target="_blank" rel="noreferrer" className="inline-flex w-full justify-center rounded-full bg-coral text-coral-foreground px-6 py-3 font-semibold">
                Message us on WhatsApp
              </a>
              <a href="mailto:animalangels.mc@gmail.com" className="inline-flex w-full justify-center rounded-full border border-border px-6 py-3 font-semibold hover:bg-muted">
                Email for bank details
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
