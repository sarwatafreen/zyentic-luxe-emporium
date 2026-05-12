import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Hero } from "@/components/site/Hero";
import { EditorsPicks } from "@/components/site/EditorsPicks";
import { Gallery } from "@/components/site/Gallery";
import { Trending } from "@/components/site/Trending";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Zyentic — Quiet Luxury, Couture Maison" },
      {
        name: "description",
        content:
          "Zyentic is a luxury fashion maison crafting couture-grade ready-to-wear, accessories, and fabrics. Discover the 2026 collection.",
      },
      { property: "og:title", content: "Zyentic — Quiet Luxury Maison" },
      { property: "og:description", content: "Couture-grade luxury fashion. 2026 collection now available." },
    ],
    links: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Inter:wght@300;400;500&display=swap",
      },
    ],
  }),
});

function Index() {
  return (
    <SiteLayout>
      <Hero />
      <EditorsPicks />
      <Gallery />
      <Trending />
    </SiteLayout>
  );
}
