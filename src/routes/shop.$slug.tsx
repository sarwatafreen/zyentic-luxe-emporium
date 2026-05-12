import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { resolveAsset } from "@/lib/asset-resolver";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";

type Product = {
  id: string; title: string; slug: string; description: string | null;
  price: number; discount_price: number | null; stock: number;
  image_urls: string[]; sizes: string[]; colors: string[];
  category: { name: string; slug: string } | null;
};

export const Route = createFileRoute("/shop/$slug")({
  component: ProductPage,
  head: ({ params }) => ({ meta: [{ title: `${params.slug} — Zyentic` }] }),
});

function ProductPage() {
  const { slug } = Route.useParams();
  const [p, setP] = useState<Product | null>(null);
  const [active, setActive] = useState(0);
  const [size, setSize] = useState<string | undefined>();
  const [color, setColor] = useState<string | undefined>();
  const [qty, setQty] = useState(1);
  const addToCart = useCart((s) => s.add);
  const wish = useWishlist();
  const navigate = useNavigate();

  useEffect(() => {
    supabase
      .from("products")
      .select("id,title,slug,description,price,discount_price,stock,image_urls,sizes,colors,category:categories(name,slug)")
      .eq("slug", slug)
      .maybeSingle()
      .then(({ data }) => setP(data as unknown as Product));
  }, [slug]);

  if (!p) {
    return (
      <SiteLayout>
        <div className="min-h-[60vh] flex items-center justify-center text-muted-foreground">Loading…</div>
      </SiteLayout>
    );
  }

  const price = p.discount_price ?? p.price;
  const img = resolveAsset(p.image_urls[active] ?? p.image_urls[0]);

  const handleAdd = () => {
    addToCart({ product_id: p.id, title: p.title, price, image: img, quantity: qty, size, color });
    toast.success(`Added ${p.title}`);
  };

  const handleBuyNow = () => {
    handleAdd();
    navigate({ to: "/checkout" });
  };

  return (
    <SiteLayout>
      <section className="border-b border-foreground py-12 md:py-16">
        <div className="mx-auto max-w-[1600px] px-6 md:px-12 grid lg:grid-cols-2 gap-10 lg:gap-16">
          <div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="aspect-[3/4] border border-foreground overflow-hidden mb-4">
              <img src={img} alt={p.title} className="h-full w-full object-cover" />
            </motion.div>
            <div className="grid grid-cols-4 gap-3">
              {p.image_urls.map((u, i) => (
                <button key={i} onClick={() => setActive(i)} className={`aspect-square border overflow-hidden ${i === active ? "border-foreground" : "border-foreground/20"}`}>
                  <img src={resolveAsset(u)} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              {p.category && <Link to="/shop" search={{ q: "", cat: p.category.slug }} className="text-xs uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground">{p.category.name}</Link>}
              <h1 className="font-display text-4xl md:text-5xl mt-2">{p.title}</h1>
              <p className="font-display text-2xl mt-3">
                ${price}
                {p.discount_price && <span className="ml-3 line-through text-muted-foreground text-base">${p.price}</span>}
              </p>
            </div>

            {p.description && <p className="text-sm leading-relaxed text-muted-foreground">{p.description}</p>}

            {p.sizes.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-[0.25em] mb-3">Size</p>
                <div className="flex flex-wrap gap-2">
                  {p.sizes.map((s) => (
                    <button key={s} onClick={() => setSize(s)} className={`min-w-[44px] px-4 py-2 text-xs uppercase tracking-[0.2em] border ${size === s ? "border-foreground bg-foreground text-background" : "border-foreground/30 hover:border-foreground"}`}>{s}</button>
                  ))}
                </div>
              </div>
            )}

            {p.colors.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-[0.25em] mb-3">Color</p>
                <div className="flex flex-wrap gap-2">
                  {p.colors.map((c) => (
                    <button key={c} onClick={() => setColor(c)} className={`px-4 py-2 text-xs uppercase tracking-[0.2em] border ${color === c ? "border-foreground bg-foreground text-background" : "border-foreground/30 hover:border-foreground"}`}>{c}</button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-4">
              <div className="flex items-center border border-foreground">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-3 hover:bg-foreground hover:text-background transition"><Minus size={14} /></button>
                <span className="px-5 font-display text-lg">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="px-3 py-3 hover:bg-foreground hover:text-background transition"><Plus size={14} /></button>
              </div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{p.stock} in stock</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button onClick={handleAdd} className="flex-1 border border-foreground py-4 text-xs uppercase tracking-[0.3em] hover:bg-foreground hover:text-background transition flex items-center justify-center gap-2">
                <ShoppingBag size={14} /> Add to Cart
              </button>
              <button onClick={handleBuyNow} className="flex-1 bg-foreground text-background py-4 text-xs uppercase tracking-[0.3em] hover:bg-background hover:text-foreground border border-foreground transition">
                Buy Now
              </button>
              <button
                onClick={() => wish.toggle({ product_id: p.id, title: p.title, price, image: img, slug: p.slug })}
                aria-label="Wishlist"
                className={`w-14 border border-foreground flex items-center justify-center transition ${wish.has(p.id) ? "bg-foreground text-background" : "hover:bg-foreground hover:text-background"}`}
              >
                <Heart size={16} fill={wish.has(p.id) ? "currentColor" : "none"} />
              </button>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
