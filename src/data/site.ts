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

export const heroSlides = [
  {
    image: hero1,
    eyebrow: "Collection 2026",
    title: "Quiet Opulence",
    tagline: "Couture silhouettes crafted from the world's finest fabrics.",
  },
  {
    image: hero2,
    eyebrow: "Tailoring",
    title: "Precision in Black",
    tagline: "Sharp lines, masterful cuts, an enduring statement.",
  },
  {
    image: hero3,
    eyebrow: "Atelier",
    title: "Golden Hour",
    tagline: "Silk gowns made for moments that linger.",
  },
];

export const categories = [
  { name: "Accessories", image: catAccessories },
  { name: "Kidswear", image: catKidswear },
  { name: "Luxury", image: catLuxury },
  { name: "Luxury Pret", image: catPret },
  { name: "M.Luxe Fabrics", image: catFabrics },
  { name: "New Arrivals", image: catNew },
  { name: "Unstitched", image: catUnstitched },
];

export const galleryImages = [g1, g2, g3, g4, g5];

export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  hover: string;
};

export const products: Product[] = [
  { id: "1", name: "Noir Silk Gown", price: 1280, category: "Luxury", image: p1, hover: p3 },
  { id: "2", name: "Cashmere Trench", price: 980, category: "Luxury Pret", image: p2, hover: p6 },
  { id: "3", name: "Ivory Silk Blouse", price: 420, category: "Luxury Pret", image: p3, hover: p1 },
  { id: "4", name: "Tan Leather Tote", price: 760, category: "Accessories", image: p4, hover: p5 },
  { id: "5", name: "Gold Pendant", price: 340, category: "Accessories", image: p5, hover: p4 },
  { id: "6", name: "Tailored Wool Coat", price: 1150, category: "Luxury", image: p6, hover: p2 },
  { id: "7", name: "Rosé Embroidered Shawl", price: 290, category: "M.Luxe Fabrics", image: p7, hover: p3 },
  { id: "8", name: "Petit Ivoire Dress", price: 240, category: "Kidswear", image: p8, hover: p3 },
  { id: "9", name: "Ecru Slip Dress", price: 510, category: "New Arrivals", image: p3, hover: p1 },
  { id: "10", name: "Jewel-Tone Yardage", price: 180, category: "Unstitched", image: p7, hover: p1 },
];

export const promoMessages = [
  "Free Shipping Worldwide",
  "Luxury Collection 2026",
  "New Arrivals Available Now",
  "Exclusive Designer Collection",
  "Complimentary Gift Wrapping",
];
