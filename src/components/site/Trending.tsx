import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag } from "lucide-react";
import { categories, products } from "@/data/site";

const tabs = ["All", ...categories.map((c) => c.name)];

export function Trending() {
  const [tab, setTab] = useState("All");
  const filtered = tab === "All" ? products : products.filter((p) => p.category === tab);

  return (
    <section id="trending" className="border-b border-foreground py-20 md:py-28">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12">
        <div className="text-center mb-10 md:mb-14">
          <p className="text-xs uppercase tracking-[0.4em] mb-4">— Selected for you —</p>
          <h2 className="font-display text-4xl md:text-6xl">Most Trending</h2>
        </div>

        <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 mb-12 md:mb-16">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative text-xs uppercase tracking-[0.25em] py-2 transition ${
                tab === t ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
              {tab === t && (
                <motion.span
                  layoutId="tab-underline"
                  className="absolute left-0 right-0 bottom-0 h-px bg-foreground"
                />
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-7"
          >
            {filtered.map((p, i) => (
              <motion.article
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group"
              >
                <div className="relative aspect-[3/4] border border-foreground overflow-hidden bg-muted">
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 group-hover:opacity-0"
                  />
                  <img
                    src={p.hover}
                    alt=""
                    aria-hidden
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                  />
                  <button
                    aria-label="Wishlist"
                    className="absolute top-3 right-3 w-9 h-9 border border-foreground bg-background flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-500 hover:bg-foreground hover:text-background"
                  >
                    <Heart size={14} strokeWidth={1.5} />
                  </button>
                  <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                    <button className="w-full bg-foreground text-background py-3 text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-2 hover:bg-background hover:text-foreground border border-foreground transition-colors">
                      <ShoppingBag size={12} strokeWidth={1.5} />
                      Add to Cart
                    </button>
                  </div>
                </div>
                <div className="mt-4 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-1">
                      {p.category}
                    </p>
                    <h3 className="font-display text-lg leading-tight">{p.name}</h3>
                  </div>
                  <p className="font-display text-lg whitespace-nowrap">${p.price}</p>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
