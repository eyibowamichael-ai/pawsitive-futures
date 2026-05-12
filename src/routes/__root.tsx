import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Toaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-display text-primary">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Animal Angels Mont Choisy — Rescue, Care & Adoption in Mauritius" },
      { name: "description", content: "Animal Angels Mont Choisy is a nonprofit rescuing, caring for and rehoming stray dogs and cats in Mauritius. Adopt, foster, volunteer or donate today." },
      { name: "author", content: "Animal Angels Mont Choisy" },
      { property: "og:title", content: "Animal Angels Mont Choisy — Rescue, Care & Adoption in Mauritius" },
      { property: "og:description", content: "Animal Angels Mont Choisy is a nonprofit rescuing, caring for and rehoming stray dogs and cats in Mauritius. Adopt, foster, volunteer or donate today." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Animal Angels Mont Choisy — Rescue, Care & Adoption in Mauritius" },
      { name: "twitter:description", content: "Animal Angels Mont Choisy is a nonprofit rescuing, caring for and rehoming stray dogs and cats in Mauritius. Adopt, foster, volunteer or donate today." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/aff3b291-18f2-4339-a029-2216618c89c3" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/aff3b291-18f2-4339-a029-2216618c89c3" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
      <Toaster />
    </div>
  );
}
