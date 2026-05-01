import { createFileRoute, Link } from "@tanstack/react-router";
import { HandHeart, Home, Car, Megaphone, PawPrint, Stethoscope } from "lucide-react";

export const Route = createFileRoute("/get-involved")({
  head: () => ({
    meta: [
      { title: "Get Involved — Mont Choisy Animal Angels" },
      { name: "description", content: "Foster, volunteer, transport or fundraise — find your way to help rescue animals in Mauritius." },
      { property: "og:title", content: "Get Involved — Mont Choisy Animal Angels" },
      { property: "og:description", content: "Many ways to help. Pick the one that fits your life." },
    ],
  }),
  component: GetInvolved,
});

const ways = [
  { icon: Home, title: "Foster", text: "Open your home temporarily to a rescue who needs space, time or recovery before adoption." },
  { icon: PawPrint, title: "Walk & socialise", text: "Help our dogs build confidence with regular walks and gentle socialising." },
  { icon: Car, title: "Drive for rescue", text: "Transport animals to vet appointments, fosters or adopters across Mauritius." },
  { icon: Stethoscope, title: "Vet & care support", text: "Veterinary professionals — your skills change lives. Get in touch." },
  { icon: Megaphone, title: "Fundraise", text: "Organise a bake sale, run an event, or share our story with your network." },
  { icon: HandHeart, title: "Donate supplies", text: "Food, blankets, leashes, crates — practical gifts that go straight to the animals." },
];

function GetInvolved() {
  return (
    <>
      <section className="bg-paper">
        <div className="mx-auto max-w-5xl px-5 sm:px-8 pt-20 pb-12 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-coral font-semibold">Get involved</p>
          <h1 className="mt-5 text-5xl sm:text-6xl font-display leading-[1.05] text-balance">
            Many hands. <em className="italic not-italic text-primary">More tails wagging.</em>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            You don't need experience — just willingness. Pick the way that
            fits your life and we'll welcome you in.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 sm:px-8 py-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {ways.map((w) => (
            <div key={w.title} className="rounded-3xl bg-card border border-border p-7 hover:border-primary/40 transition">
              <div className="h-12 w-12 rounded-2xl bg-primary-soft text-primary flex items-center justify-center mb-5">
                <w.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl mb-2">{w.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{w.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 sm:px-8 pb-24">
        <div className="rounded-[2rem] bg-primary text-primary-foreground p-10 sm:p-14 text-center">
          <h2 className="text-3xl sm:text-4xl font-display text-balance">Ready to start?</h2>
          <p className="mt-4 opacity-85 max-w-xl mx-auto">Send us a quick note about how you'd like to help — we'll match you with the right team.</p>
          <Link to="/contact" className="mt-8 inline-flex rounded-full bg-coral text-coral-foreground px-7 py-3.5 text-sm font-semibold">
            Sign me up
          </Link>
        </div>
      </section>
    </>
  );
}
