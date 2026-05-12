import { createFileRoute, Link } from "@tanstack/react-router";
import volunteers from "@/assets/volunteers.jpg";
import { Compass, Heart, Shield, Sprout } from "lucide-react";
import { usePageContent } from "@/lib/site-content";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Animal Angels Mont Choisy" },
      { name: "description", content: "Animal Angels Mont Choisy is a nonprofit caring for stray dogs and cats in northern Mauritius." },
      { property: "og:title", content: "About Animal Angels Mont Choisy" },
      { property: "og:description", content: "Our story, our mission and the volunteers behind the rescue." },
    ],
  }),
  component: About,
});

function About() {
  const c = usePageContent("about");
  return (
    <>
      <section className="bg-paper">
        <div className="mx-auto max-w-5xl px-5 sm:px-8 pt-20 pb-16 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-coral font-semibold">{c.hero_eyebrow}</p>
          <h1 className="mt-5 text-5xl sm:text-6xl font-display leading-[1.05] text-balance">{c.hero_title}</h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">{c.hero_body}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 sm:px-8 py-20 grid lg:grid-cols-2 gap-14 items-center">
        <div className="rounded-[2rem] overflow-hidden">
          <img src={volunteers} alt="Volunteers caring for rescue dogs" loading="lazy" width={1400} height={900} className="w-full h-full object-cover aspect-[5/4]" />
        </div>
        <div>
          <h2 className="text-4xl font-display text-balance">{c.section_title}</h2>
          <p className="mt-5 text-muted-foreground leading-relaxed">{c.section_body_1}</p>
          <p className="mt-4 text-muted-foreground leading-relaxed">{c.section_body_2}</p>
        </div>
      </section>

      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-20">
          <h2 className="text-4xl font-display text-center mb-14">What guides us</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Heart, title: "Compassion first", text: "Every decision starts with the animal's wellbeing." },
              { icon: Shield, title: "Lifelong safety", text: "We follow up on every adoption — for life." },
              { icon: Sprout, title: "Sustainable rescue", text: "Sterilisation to humanely reduce strays over time." },
              { icon: Compass, title: "Transparent care", text: "Open about our work, our needs and our results." },
            ].map((v) => (
              <div key={v.title} className="rounded-3xl bg-card p-7 border border-border">
                <div className="h-11 w-11 rounded-2xl bg-primary-soft text-primary flex items-center justify-center mb-4">
                  <v.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-xl mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 sm:px-8 py-20 text-center">
        <h2 className="text-3xl sm:text-4xl font-display text-balance">Want to be part of the story?</h2>
        <p className="mt-4 text-muted-foreground">There's a place for you here — whether you can give an hour, a home, or a hand.</p>
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <Link to="/get-involved" className="rounded-full bg-primary text-primary-foreground px-7 py-3.5 text-sm font-semibold">Get involved</Link>
          <Link to="/contact" className="rounded-full border border-border px-7 py-3.5 text-sm font-semibold hover:bg-muted">Contact us</Link>
        </div>
      </section>
    </>
  );
}
