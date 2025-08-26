import type { Route } from "./+types/home";
import Library from "~/components/Libary";
import HeroSection from "~/components/HeroSection";

export function meta({}: Route.MetaArgs) {
  return [{ title: "LingText" }, { name: "description", content: "LingText" }];
}

export default function Home() {
  return (
    <>
      <HeroSection />
      <Library onOpen={() => {}} />
    </>
  );
}
