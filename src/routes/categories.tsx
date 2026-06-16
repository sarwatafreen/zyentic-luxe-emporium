import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SiteLayout } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { resolveAsset } from "@/lib/asset-resolver";

type Cat = { id: string; name: string; slug: string; description: string | null; image_url: string | null; count?: number };

export const Route = createFileRoute("/categories")({
  component: CategoriesPage,
  head: () => ({
    meta: [
      { title: "Categories — Zyentic" },
      { name: "description", content: "Browse all Zyentic categories." },
    ],
  }),
});

function CategoriesPage() {
  const [cats, setCats] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("categories")
        .select("id,name,slug,description,image_url")
        .order("name");
      const list = (data ?? []) as Cat[];
      const withCount = await Promise.all(
        list.map(async (c) => {
          const { count } = await supabase
            .from("products")
            .select("id", { count: "exact", head: true })
            .eq("category_id", c.id);
          return { ...c, count: count ?? 0 };
        }),
      );
      setCats(withCount);
      setLoading(false);
    })();
  }, []);

  return (
    <SiteLayout>
      <section className="border-b border-foreground py-12 md:py-20">
        <div className="mx-auto max-w-[1600px] px-6 md:px-12">
          <p className="text-xs uppercase tracking-[0.4em] mb-4">Maison · Atelier</p>
          <h1 className="font-display text-4xl md:text-6xl">All Categories</h1>
          <p className="mt-4 text-muted-foreground max-w-2xl">Choose a category to explore its curated pieces.</p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-[1600px] px-6 md:px-12">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">
              {Array.from({ length: 6 }).map((_, i) => <div key={i} className="aspect-[4/5] border border-foreground/20 animate-pulse bg-muted/30" />)}
            </div>
          ) : cats.length === 0 ? (
            <p className="text-center text-muted-foreground py-20">No categories yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">
              {cats.map((c, i) => (
                <motion.div key={c.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Link to="/category/$slug" params={{ slug: c.slug }} className="group block relative aspect-[4/5] border border-foreground overflow-hidden bg-muted">
                    {c.image_url && (
                      <img src={resolveAsset(c.image_url)} alt={c.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                      <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">{c.count} {c.count === 1 ? "piece" : "pieces"}</p>
                      <h2 className="font-display text-2xl md:text-3xl mb-2">{c.name}</h2>
                      {c.description && <p className="text-sm text-muted-foreground line-clamp-2">{c.description}</p>}
                      <span className="mt-4 inline-block text-[10px] uppercase tracking-[0.3em] border-b border-foreground pb-1 group-hover:translate-x-1 transition-transform">Explore →</span>
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
