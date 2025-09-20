import type { Route } from "./+types/home";
import Library from "~/components/Libary";
import HeroSection from "~/components/HeroSection";
import PurposeSection from "~/components/PurposeSection";
import UsageGuideSection from "~/components/UsageGuideSection";
import TechAndPrivacySection from "~/components/TechAndPrivacySection";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Alternativa gratuita a LingQ | LingText" },
    {
      name: "description",
      content:
        "LingText es una alternativa gratuita a LingQ que te permite aprender inglés leyendo textos locales o por URL, con traducción instantánea, TTS y repaso.",
    },
  ];
}

export const links: Route.LinksFunction = () => [
  {
    rel: "canonical",
    href: "https://lingtext.org",
  },
];

export default function Home() {
  return (
    <>
      <HeroSection />
      <Library />
      <PurposeSection />
      <UsageGuideSection />
      <TechAndPrivacySection />
    </>
  );
}
