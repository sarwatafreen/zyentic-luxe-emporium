import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Eye, Heart, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/SiteLayout";
import { QuickViewDialog } from "@/components/site/QuickViewDialog";
import { supabase } from "@/integrations/supabase/client";
import { resolveAsset } from "@/lib/asset-resolver";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";

type Category = { id: string; name: string; slug: string; description: string | null; image_url: string | null };
type Product = {
  id: string; title: string; slug: string; price: number; discount_price: number | null;
  image_urls: string[]; category_id: string;
};

export const Route = createFileRoute("/category/$slug")({
  component: CategoryPage,
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug} — Zyentic` },
      { name: "description", content: `Explore the ${params.slug} collection at Zyentic.` },
    ],
  }),
});

function CategoryPage() {
  const { slug } = Route.useParams();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [otherCats, setOtherCats] = useState<{ name: string; slug: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFoundCat, setNotFoundCat] = useState(false);
  const [quickSlug, setQuickSlug] = useState<string | null>(null);
  const addToCart = useCart((s) => s.add);
  const wish = useWishlist();

  useEffect(() => {
    supabase.from("categories").select("name,slug").order("name").then(({ data }) => setOtherCats(data ?? []));
  }, []);

  useEffect(() => {
    setLoading(true);
    setNotFoundCat(false);
    (async () => {
      const { data: cat } = await supabase
        .from("categories")
        .select("id,name,slug,description,image_url")
        .eq("slug", slug)
        .maybeSingle();
      if (!cat) { setNotFoundCat(true); setLoading(false); return; }
      setCategory(cat as Category);
      const { data: prods } = await supabase
        .from("products")
        .select("id,title,slug,price,discount_price,image_urls,category_id")
        .eq("category_id", cat.id)
        .order("created_at", { ascending: false });
      setProducts((prods ?? []) as Product[]);
      setLoading(false);
    })();
  }, [slug]);

  if (notFoundCat) {
    return (
      <SiteLayout>
        <section className="py-32 text-center">
          <p className="text-xs uppercase tracking-[0.4em] mb-4 text-muted-foreground">404</p>
          <h1 className="font-display text-4xl md:text-5xl mb-6">Category not found</h1>
          <Link to="/shop" className="underline text-sm uppercase tracking-[0.3em]">Back to Shop</Link>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="relative border-b border-foreground overflow-hidden">
        {category?.image_url && (
          <div className="absolute inset-0">
            <img src={resolveAsset(category.image_url)} alt="" className="w-full h-full object-cover opacity-30" />
            <div className="absolute inset-0 bg-background/40" />
          </div>
        )}
        <div className="relative mx-auto max-w-[1600px] px-6 md:px-12 py-16 md:py-28">
          <p className="text-xs uppercase tracking-[0.4em] mb-4">
            <Link to="/shop" className="hover:underline">Shop</Link> · Category
          </p>
          <h1 className="font-display text-4xl md:text-6xl">{category?.name ?? slug}</h1>
          {category?.description && (
            <p className="mt-4 max-w-2xl text-muted-foreground">{category.description}</p>
          )}
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs uppercase tracking-[0.25em]">
            <Link to="/shop" className="text-muted-foreground hover:text-foreground">All</Link>
            {otherCats.map((c) => (
              <Link
                key={c.slug}
                to="/category/$slug"
                params={{ slug: c.slug }}
                className={c.slug === slug ? "text-foreground border-b border-foreground" : "text-muted-foreground hover:text-foreground"}
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-[1600px] px-6 md:px-12">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-7">
              {Array.from({ length: 8 }).map((_, i) => <div key={i} className="aspect-[3/4] border border-foreground/20 animate-pulse bg-muted/30" />)}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground mb-6">No products in this category yet.</p>
              <Link to="/shop" className="underline text-sm uppercase tracking-[0.3em]">Browse all products</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-7">
              {products.map((p, i) => {
                const img = resolveAsset(p.image_urls[0]);
                const hover = resolveAsset(p.image_urls[1] ?? p.image_urls[0]);
                const inWish = wish.has(p.id);
                return (
                  <motion.article key={p.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="group">
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
                        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-1">{category?.name}</p>
                        <Link to="/shop/$slug" params={{ slug: p.slug }} className="font-display text-lg leading-tight hover:underline">{p.title}</Link>
                      </div>
                      <p className="font-display text-lg whitespace-nowrap">${p.discount_price ?? p.price}</p>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}

void notFound;
