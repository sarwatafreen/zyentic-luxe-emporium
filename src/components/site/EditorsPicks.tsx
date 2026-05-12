import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { resolveAsset } from "@/lib/asset-resolver";

type Cat = { id: string; name: string; slug: string; image_url: string | null };

export function EditorsPicks() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [cats, setCats] = useState<Cat[]>([]);

  useEffect(() => {
    supabase
      .from("categories")
      .select("id,name,slug,image_url")
      .order("name", { ascending: true })
      .then(({ data }) => setCats((data ?? []) as Cat[]));
  }, []);

  const scroll = (dir: "l" | "r") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "l" ? -420 : 420, behavior: "smooth" });
  };

  return (
    <section id="picks" className="border-b border-foreground py-20 md:py-28">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12">
        <div className="flex items-end justify-between mb-12 md:mb-16">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] mb-4 flex items-center gap-3">
              <span className="w-10 h-px bg-foreground" /> Curated
            </p>
            <h2 className="font-display text-4xl md:text-6xl">Editor's Picks</h2>
          </div>
          <div className="hidden md:flex gap-3">
            <button onClick={() => scroll("l")} aria-label="Previous" className="w-12 h-12 border border-foreground flex items-center justify-center hover:bg-foreground hover:text-background transition">
              <ArrowLeft size={16} strokeWidth={1.25} />
            </button>
            <button onClick={() => scroll("r")} aria-label="Next" className="w-12 h-12 border border-foreground flex items-center justify-center hover:bg-foreground hover:text-background transition">
              <ArrowRight size={16} strokeWidth={1.25} />
            </button>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex gap-5 overflow-x-auto scroll-smooth px-6 md:px-12 pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {cats.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: i * 0.06 }}
            className="shrink-0 w-[280px] md:w-[360px]"
          >
            <Link to="/category/$slug" params={{ slug: c.slug }} className="group relative block aspect-[3/4] border border-foreground overflow-hidden">
              <img src={resolveAsset(c.image_url)} alt={c.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover img-zoom" />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-background">
                <p className="text-[10px] uppercase tracking-[0.4em] opacity-70 mb-2">Collection</p>
                <h3 className="font-display text-2xl md:text-3xl">{c.name}</h3>
                <span className="mt-3 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                  Discover <ArrowRight size={12} />
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
