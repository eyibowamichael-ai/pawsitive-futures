import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import dogPlaceholder from "@/assets/dog.jpg";
import catPlaceholder from "@/assets/cat.jpg";
import { Heart, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/adopt")({
  head: () => ({
    meta: [
      { title: "Adopt — Animal Angels Mont Choisy" },
      { name: "description", content: "Meet the dogs and cats waiting for a forever home with Animal Angels Mont Choisy in Mauritius." },
      { property: "og:title", content: "Adopt a rescue — Animal Angels Mont Choisy" },
      { property: "og:description", content: "Our adoptable dogs and cats are ready to meet their family." },
    ],
  }),
  component: Adopt,
});

type Pet = {
  id: string;
  name: string;
  species: string;
  age: string;
  sex: string;
  story: string;
  photo_url: string | null;
};

function Adopt() {
  const [pets, setPets] = useState<Pet[] | null>(null);

  useEffect(() => {
    supabase
      .from("pets")
      .select("id,name,species,age,sex,story,photo_url")
      .eq("status", "available")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })
      .then(({ data }) => setPets(data ?? []));
  }, []);

  const fallback = (species: string) => (species === "Cat" ? catPlaceholder : dogPlaceholder);

  return (
    <>
      <section className="bg-paper">
        <div className="mx-auto max-w-5xl px-5 sm:px-8 pt-20 pb-12 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-coral font-semibold">Adopt</p>
          <h1 className="mt-5 text-5xl sm:text-6xl font-display leading-[1.05] text-balance">
            Meet your next best friend.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            All our angels are vaccinated, sterilised and adored. Adoption is
            free of charge — what matters is finding the right family.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 sm:px-8 py-16">
        {pets === null ? (
          <p className="text-center text-muted-foreground">Loading our angels…</p>
        ) : pets.length === 0 ? (
          <div className="text-center max-w-xl mx-auto">
            <p className="text-muted-foreground">
              No pets are listed right now. Please check back soon, or get in touch — we always have animals in our care.
            </p>
            <Link to="/contact" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
              Contact us <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((p) => (
              <article key={p.id} className="group rounded-3xl overflow-hidden bg-card border border-border hover:-translate-y-1 hover:shadow-[var(--shadow-soft)] transition-all">
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={p.photo_url ?? fallback(p.species)}
                    alt={`${p.name}, a rescue ${p.species.toLowerCase()}`}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-display text-2xl">{p.name}</h3>
                    <span className="text-xs uppercase tracking-wider text-coral font-semibold">{p.species}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{p.age} · {p.sex}</p>
                  <p className="mt-3 text-sm text-foreground/80 leading-relaxed">{p.story}</p>
                  <Link to="/contact" className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                    Ask about {p.name} <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-5 sm:px-8 pb-24">
        <div className="rounded-[2rem] bg-cream p-10 sm:p-14 grid md:grid-cols-3 gap-10">
          <div>
            <Heart className="h-7 w-7 text-coral mb-4" />
            <h3 className="font-display text-2xl">How adoption works</h3>
            <p className="mt-3 text-sm text-muted-foreground">A gentle, careful process designed to set every match up for success.</p>
          </div>
          <ol className="md:col-span-2 grid sm:grid-cols-3 gap-6 text-sm">
            {[
              { n: "01", t: "Reach out", d: "Tell us about your home and the animal you'd like to meet." },
              { n: "02", t: "Meet & greet", d: "Spend time together — we want to be sure it clicks." },
              { n: "03", t: "Welcome home", d: "Sign the adoption form and start your new life together." },
            ].map((s) => (
              <li key={s.n}>
                <div className="font-display text-3xl text-primary">{s.n}</div>
                <div className="font-semibold mt-2">{s.t}</div>
                <p className="text-muted-foreground mt-1">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
