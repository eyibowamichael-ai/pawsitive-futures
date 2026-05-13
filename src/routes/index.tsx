import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import hero from "@/assets/hero.jpg";
import dog from "@/assets/dog.jpg";
import cat from "@/assets/cat.jpg";
import volunteers from "@/assets/volunteers.jpg";
import { Heart, PawPrint, HandHeart, Home as HomeIcon, ArrowRight, Sparkles } from "lucide-react";
import { usePageContent } from "@/lib/site-content";
import { supabase } from "@/integrations/supabase/client";

type FeaturedPet = { id: string; name: string; species: string; age: string; sex: string; story: string; photo_url: string | null };

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Animal Angels Mont Choisy — Rescue & Adopt in Mauritius" },
      { name: "description", content: "We rescue, sterilise and rehome stray dogs and cats in northern Mauritius. Adopt, foster, volunteer or donate to help." },
      { property: "og:title", content: "Animal Angels Mont Choisy" },
      { property: "og:description", content: "Giving stray dogs and cats in Mauritius the second chance they deserve." },
    ],
  }),
  component: Home,
});

function Home() {
  const c = usePageContent("home");
  const stats = [
    { n: c.stat_1_number, l: c.stat_1_label },
    { n: c.stat_2_number, l: c.stat_2_label },
    { n: c.stat_3_number, l: c.stat_3_label },
  ];
  const [featured, setFeatured] = useState<FeaturedPet[]>([]);
  useEffect(() => {
    supabase
      .from("pets")
      .select("id,name,species,age,sex,story,photo_url")
      .eq("status", "available")
      .order("sort_order")
      .limit(2)
      .then(({ data }) => setFeatured(data ?? []));
  }, []);
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-paper">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 pt-14 pb-20 lg:pt-20 lg:pb-32 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft text-primary px-3 py-1.5 text-xs font-medium tracking-wide">
              <Sparkles className="h-3.5 w-3.5" /> {c.hero_eyebrow}
            </span>
            <h1 className="mt-6 text-5xl sm:text-6xl lg:text-7xl font-display font-semibold leading-[1.02] text-balance text-ink">
              {c.hero_title_1}<br />
              <em className="text-coral not-italic font-display italic">{c.hero_title_2}</em>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed text-pretty">
              {c.hero_body}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link to="/adopt" className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-7 py-3.5 text-sm font-semibold hover:opacity-90 transition shadow-[var(--shadow-glow)]">
                {c.hero_cta_primary} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/donate" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-7 py-3.5 text-sm font-semibold hover:bg-muted transition">
                <Heart className="h-4 w-4 text-coral fill-coral" /> {c.hero_cta_secondary}
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-6 max-w-md">
              {stats.map((s) => (
                <div key={s.l}>
                  <div className="font-display text-3xl text-primary">{s.n}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden ring-glow">
              <img src={hero} alt="Volunteer hugging a rescue dog on a Mauritian beach" width={1600} height={1200} className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-6 -left-4 sm:-left-10 bg-card rounded-2xl p-5 shadow-[var(--shadow-soft)] max-w-[220px] hidden sm:block">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-coral/15 flex items-center justify-center">
                  <PawPrint className="h-5 w-5 text-coral" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">This week</div>
                  <div className="font-semibold text-sm">7 new rescues</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WAYS TO HELP */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8 py-24">
        <div className="flex items-end justify-between gap-8 flex-wrap mb-12">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.25em] text-coral font-semibold mb-3">How you can help</p>
            <h2 className="text-4xl sm:text-5xl font-display text-balance">Four simple ways to change a life.</h2>
          </div>
          <p className="text-muted-foreground max-w-md">Whether you have a home to share, a few hours a week, or a bit to spare — there's a way to make a real difference.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: HomeIcon, title: "Adopt", text: "Open your home to a rescue ready for love.", to: "/adopt", tone: "primary" },
            { icon: PawPrint, title: "Foster", text: "Give a temporary home while we find a forever one.", to: "/get-involved", tone: "accent" },
            { icon: HandHeart, title: "Volunteer", text: "Walks, feeds, transport, fundraising — every hand counts.", to: "/get-involved", tone: "primary" },
            { icon: Heart, title: "Donate", text: "Fund vet care, food and sterilisation programmes.", to: "/donate", tone: "coral" },
          ].map((c) => (
            <Link key={c.title} to={c.to} className="group relative rounded-3xl bg-card border border-border p-7 hover:-translate-y-1 hover:shadow-[var(--shadow-soft)] transition-all duration-300">
              <div className={`h-12 w-12 rounded-2xl flex items-center justify-center mb-5 ${c.tone === "coral" ? "bg-coral/15 text-coral" : c.tone === "accent" ? "bg-accent/40 text-primary" : "bg-primary-soft text-primary"}`}>
                <c.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl mb-2">{c.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{c.text}</p>
              <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                Learn more <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* MISSION SPLIT */}
      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-24 grid lg:grid-cols-2 gap-14 items-center">
          <div className="grid grid-cols-2 gap-4">
            <img src={dog} alt="Rescue dog portrait" loading="lazy" width={1024} height={1024} className="rounded-3xl aspect-square object-cover w-full" />
            <img src={cat} alt="Rescue cat portrait" loading="lazy" width={1024} height={1024} className="rounded-3xl aspect-square object-cover w-full mt-10" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-coral font-semibold mb-3">Our mission</p>
            <h2 className="text-4xl sm:text-5xl font-display text-balance leading-[1.05]">
              Compassion, paw by paw.
            </h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              We believe every stray we meet is someone — a personality, a heart, a
              future. From rescue and emergency vet care to sterilisation and
              adoption, we walk with each animal until they're truly safe.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                "Rescue & rehabilitate strays in northern Mauritius",
                "Sterilise to humanely reduce the stray population",
                "Match every animal with a loving forever family",
              ].map((t) => (
                <li key={t} className="flex gap-3 items-start">
                  <span className="mt-1 h-2 w-2 rounded-full bg-coral shrink-0" />
                  <span className="text-foreground/90">{t}</span>
                </li>
              ))}
            </ul>
            <Link to="/about" className="mt-9 inline-flex items-center gap-2 text-primary font-semibold border-b border-primary pb-1">
              Read our story <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* MEET OUR PETS */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 sm:px-8 py-24">
          <div className="mb-12 max-w-2xl">
            <p className="text-xs uppercase tracking-[0.25em] text-coral font-semibold mb-3">Meet our pets</p>
            <h2 className="text-4xl sm:text-5xl font-display text-balance">Looking for their forever family.</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {featured.map((p) => (
              <Link key={p.id} to="/adopt" className="group rounded-3xl overflow-hidden bg-card border border-border hover:-translate-y-1 hover:shadow-[var(--shadow-soft)] transition-all duration-300">
                {p.photo_url && (
                  <div className="aspect-[5/4] overflow-hidden">
                    <img src={p.photo_url} alt={p.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-display text-2xl">{p.name}</h3>
                    <span className="text-xs uppercase tracking-wider text-coral font-semibold">{p.species}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{p.age} · {p.sex}</p>
                  <p className="mt-3 text-sm text-foreground/80 line-clamp-3 leading-relaxed">{p.story}</p>
                  <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                    Meet {p.name} <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8 py-24">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-primary text-primary-foreground p-10 sm:p-16 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-4xl sm:text-5xl font-display text-balance leading-tight">
              {c.cta_title}
            </h2>
            <p className="mt-4 text-lg opacity-85 max-w-lg">
              {c.cta_body}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/donate" className="inline-flex items-center gap-2 rounded-full bg-coral px-7 py-3.5 text-sm font-semibold text-coral-foreground hover:opacity-90 transition">
                <Heart className="h-4 w-4 fill-current" /> Donate now
              </Link>
              <Link to="/get-involved" className="inline-flex items-center gap-2 rounded-full bg-white/10 ring-1 ring-white/30 px-7 py-3.5 text-sm font-semibold hover:bg-white/15 transition">
                Volunteer with us
              </Link>
            </div>
          </div>
          <div className="rounded-3xl overflow-hidden aspect-[4/3]">
            <img src={volunteers} alt="Volunteers walking rescue dogs" loading="lazy" width={1400} height={900} className="w-full h-full object-cover" />
          </div>
          <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-coral/30 blur-3xl pointer-events-none" />
        </div>
      </section>
    </>
  );
}
