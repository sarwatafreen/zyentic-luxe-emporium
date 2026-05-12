import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SiteLayout } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { resolveAsset } from "@/lib/asset-resolver";

type Product = {
  id: string; title: string; slug: string; price: number; discount_price: number | null;
  image_urls: string[]; category: { name: string; slug: string } | null;
};

export const Route = createFileRoute("/shop")({
  component: ShopPage,
  validateSearch: (s: Record<string, unknown>) => ({ q: (s.q as string) || "", cat: (s.cat as string) || "" }),
  head: () => ({ meta: [{ title: "Shop — Zyentic" }, { name: "description", content: "Discover the full Zyentic collection." }] }),
});

function ShopPage() {
  const { q, cat } = Route.useSearch();
  const [products, setProducts] = useState<Product[]>([]);
  const [cats, setCats] = useState<{ name: string; slug: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("categories").select("name,slug").then(({ data }) => setCats(data ?? []));
  }, []);

  useEffect(() => {
    setLoading(true);
    let query = supabase
      .from("products")
      .select("id,title,slug,price,discount_price,image_urls,category:categories(name,slug)")
      .order("created_at", { ascending: false });
    if (q) query = query.ilike("title", `%${q}%`);
    query.then(({ data }) => {
      let list = (data ?? []) as unknown as Product[];
      if (cat) list = list.filter((p) => p.category?.slug === cat);
      setProducts(list);
      setLoading(false);
    });
  }, [q, cat]);

  return (
    <SiteLayout>
      <section className="border-b border-foreground py-12 md:py-20">
        <div className="mx-auto max-w-[1600px] px-6 md:px-12">
          <p className="text-xs uppercase tracking-[0.4em] mb-4">Maison · Atelier</p>
          <h1 className="font-display text-4xl md:text-6xl">{q ? `Results for "${q}"` : "The Collection"}</h1>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs uppercase tracking-[0.25em]">
            <Link to="/shop" className={!cat ? "text-foreground border-b border-foreground" : "text-muted-foreground hover:text-foreground"}>All</Link>
            {cats.map((c) => (
              <Link key={c.slug} to="/shop" search={{ q: "", cat: c.slug }} className={cat === c.slug ? "text-foreground border-b border-foreground" : "text-muted-foreground hover:text-foreground"}>{c.name}</Link>
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
            <p className="text-center text-muted-foreground py-20">No products found.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-7">
              {products.map((p, i) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                  <Link to="/shop/$slug" params={{ slug: p.slug }} className="group block">
                    <div className="relative aspect-[3/4] border border-foreground overflow-hidden">
                      <img src={resolveAsset(p.image_urls[0])} alt={p.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover img-zoom" />
                    </div>
                    <div className="mt-4 flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-1">{p.category?.name}</p>
                        <h3 className="font-display text-lg">{p.title}</h3>
                      </div>
                      <p className="font-display text-lg">${p.discount_price ?? p.price}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
