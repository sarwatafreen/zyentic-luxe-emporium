import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Eye, Heart, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { resolveAsset } from "@/lib/asset-resolver";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";

type Product = {
  id: string;
  title: string;
  slug: string;
  price: number;
  discount_price: number | null;
  image_urls: string[];
  category: { name: string; slug: string } | null;
};

export function Trending() {
  const [products, setProducts] = useState<Product[]>([]);
  const [tab, setTab] = useState("All");
  const addToCart = useCart((s) => s.add);
  const wish = useWishlist();

  useEffect(() => {
    supabase
      .from("products")
      .select("id,title,slug,price,discount_price,image_urls,category:categories(name,slug)")
      .eq("trending", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => setProducts((data ?? []) as unknown as Product[]));
  }, []);

  const tabs = ["All", ...Array.from(new Set(products.map((p) => p.category?.name).filter(Boolean) as string[]))];
  const filtered = tab === "All" ? products : products.filter((p) => p.category?.name === tab);

  return (
    <section id="trending" className="border-b border-foreground py-20 md:py-28">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12">
        <div className="text-center mb-10 md:mb-14">
          <p className="text-xs uppercase tracking-[0.4em] mb-4">— Selected for you —</p>
          <h2 className="font-display text-4xl md:text-6xl">Most Trending</h2>
        </div>

        <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 mb-12 md:mb-16">
          {tabs.map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`relative text-xs uppercase tracking-[0.25em] py-2 transition ${tab === t ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              {t}
              {tab === t && <motion.span layoutId="tab-underline" className="absolute left-0 right-0 bottom-0 h-px bg-foreground" />}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.4 }} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-7">
            {filtered.map((p, i) => {
              const img = resolveAsset(p.image_urls[0]);
              const hover = resolveAsset(p.image_urls[1] ?? p.image_urls[0]);
              const inWish = wish.has(p.id);
              return (
                <motion.article key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="group">
                  <div className="relative aspect-[3/4] border border-foreground overflow-hidden bg-muted">
                    <Link to="/shop/$slug" params={{ slug: p.slug }} className="block absolute inset-0">
                      <img src={img} alt={p.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 group-hover:opacity-0" />
                      <img src={hover} alt="" aria-hidden loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
                    </Link>
                    <button
                      aria-label="Wishlist"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const was = wish.has(p.id);
                        wish.toggle({ product_id: p.id, title: p.title, price: p.price, image: img, slug: p.slug });
                        toast.success(was ? `Removed ${p.title} from wishlist` : `Added ${p.title} to wishlist`);
                      }}
                      className={`absolute top-3 right-3 z-10 w-9 h-9 border border-foreground flex items-center justify-center transition-all duration-300 ${inWish ? "bg-foreground text-background" : "bg-background hover:bg-foreground hover:text-background"}`}
                    >
                      <Heart size={14} strokeWidth={1.5} fill={inWish ? "currentColor" : "none"} />
                    </button>
                    <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          addToCart({ product_id: p.id, title: p.title, price: p.discount_price ?? p.price, image: img, quantity: 1 });
                          toast.success(`Added ${p.title}`);
                        }}
                        className="w-full bg-foreground text-background py-3 text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-2 hover:bg-background hover:text-foreground border border-foreground transition-colors"
                      >
                        <ShoppingBag size={12} strokeWidth={1.5} />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-1">{p.category?.name}</p>
                      <Link to="/shop/$slug" params={{ slug: p.slug }} className="font-display text-lg leading-tight hover:underline">{p.title}</Link>
                    </div>
                    <p className="font-display text-lg whitespace-nowrap">${p.discount_price ?? p.price}</p>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
