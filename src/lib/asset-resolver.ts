// Resolve seeded `/src/assets/<file>` paths to bundled URLs, pass through real URLs.
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";
import catAccessories from "@/assets/cat-accessories.jpg";
import catKidswear from "@/assets/cat-kidswear.jpg";
import catLuxury from "@/assets/cat-luxury.jpg";
import catPret from "@/assets/cat-pret.jpg";
import catFabrics from "@/assets/cat-fabrics.jpg";
import catNew from "@/assets/cat-new.jpg";
import catUnstitched from "@/assets/cat-unstitched.jpg";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";
import g5 from "@/assets/gallery-5.jpg";
import p1 from "@/assets/p1.jpg";
import p2 from "@/assets/p2.jpg";
import p3 from "@/assets/p3.jpg";
import p4 from "@/assets/p4.jpg";
import p5 from "@/assets/p5.jpg";
import p6 from "@/assets/p6.jpg";
import p7 from "@/assets/p7.jpg";
import p8 from "@/assets/p8.jpg";

const map: Record<string, string> = {
  "hero-1.jpg": hero1, "hero-2.jpg": hero2, "hero-3.jpg": hero3,
  "cat-accessories.jpg": catAccessories, "cat-kidswear.jpg": catKidswear,
  "cat-luxury.jpg": catLuxury, "cat-pret.jpg": catPret,
  "cat-fabrics.jpg": catFabrics, "cat-new.jpg": catNew,
  "cat-unstitched.jpg": catUnstitched,
  "gallery-1.jpg": g1, "gallery-2.jpg": g2, "gallery-3.jpg": g3,
  "gallery-4.jpg": g4, "gallery-5.jpg": g5,
  "p1.jpg": p1, "p2.jpg": p2, "p3.jpg": p3, "p4.jpg": p4,
  "p5.jpg": p5, "p6.jpg": p6, "p7.jpg": p7, "p8.jpg": p8,
};

export function resolveAsset(url: string | null | undefined): string {
  if (!url) return "";
  if (url.startsWith("/src/assets/")) {
    const file = url.replace("/src/assets/", "");
    return map[file] ?? url;
  }
  return url;
}
