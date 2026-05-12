import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// ===== Site Settings (header / footer / branding) =====

export type SiteSettings = {
  org_name: string;
  org_tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  facebook_url: string;
  instagram_url: string;
  footer_about: string;
  donate_label: string;
};

export const defaultSettings: SiteSettings = {
  org_name: "Animal Angels",
  org_tagline: "Mont Choisy · Mauritius",
  phone: "+230 5820 0966",
  whatsapp: "https://wa.me/23058200966",
  email: "animalangels.mc@gmail.com",
  address: "95 Morcellement Mont Choisy",
  facebook_url: "https://www.facebook.com/share/1Nswsqm9CH/",
  instagram_url: "https://www.instagram.com/animal_angels_montchoisy/",
  footer_about:
    "A registered nonprofit in northern Mauritius, giving stray and abandoned dogs and cats the second chance they deserve — through rescue, sterilisation, care and loving homes.",
  donate_label: "Donate",
};

export const SETTINGS_KEY = "global";

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  useEffect(() => {
    let active = true;
    supabase
      .from("site_settings")
      .select("value")
      .eq("key", SETTINGS_KEY)
      .maybeSingle()
      .then(({ data }) => {
        if (!active || !data?.value) return;
        setSettings({ ...defaultSettings, ...(data.value as Partial<SiteSettings>) });
      });
    return () => {
      active = false;
    };
  }, []);
  return settings;
}

// ===== Page Content =====

export type PageContentMap = Record<string, string>;

export const defaultPageContent: Record<string, PageContentMap> = {
  home: {
    hero_eyebrow: "A second chance for every paw",
    hero_title_1: "Every animal",
    hero_title_2: "deserves to be loved.",
    hero_body:
      "We're a community of volunteers in Mont Choisy, Mauritius — rescuing stray and abandoned dogs and cats, caring for them, and matching them with families who'll love them for life.",
    hero_cta_primary: "Find your companion",
    hero_cta_secondary: "Donate",
    stat_1_number: "300+",
    stat_1_label: "Animals rescued",
    stat_2_number: "180+",
    stat_2_label: "Forever homes",
    stat_3_number: "24/7",
    stat_3_label: "Volunteer care",
    cta_title: "Become an Angel today.",
    cta_body: "Join the volunteers, fosters and donors making rescue possible in Mont Choisy.",
  },
  about: {
    hero_eyebrow: "Our story",
    hero_title: "Born from the simple idea that no animal should suffer alone.",
    hero_body:
      "Animal Angels Mont Choisy is a registered nonprofit based at 95 Morcellement Mont Choisy, in the north of Mauritius. We came together because we couldn't look away — and because every wagging tail and gentle purr we save is worth it.",
    section_title: "A small group, a big heart.",
    section_body_1:
      "What began with a handful of neighbours feeding strays has grown into an organised network of fosters, drivers, vets and donors. We coordinate daily — from emergency rescues to vaccinations, sterilisations and the careful matching of each animal with the right home.",
    section_body_2:
      "We don't have a fancy facility or a big budget. What we have is each other, and a community that believes kindness multiplies.",
  },
  contact: {
    hero_eyebrow: "Contact",
    hero_title: "Say hello.",
    hero_body:
      "Adoption questions, foster offers, donations, or just a kind word — we read every message.",
  },
};

export function usePageContent(page: keyof typeof defaultPageContent) {
  const [content, setContent] = useState<PageContentMap>(defaultPageContent[page]);
  useEffect(() => {
    let active = true;
    supabase
      .from("page_content")
      .select("key,value")
      .eq("page", page)
      .then(({ data }) => {
        if (!active || !data) return;
        const merged = { ...defaultPageContent[page] };
        for (const row of data) {
          if (row.value) merged[row.key] = row.value;
        }
        setContent(merged);
      });
    return () => {
      active = false;
    };
  }, [page]);
  return content;
}
