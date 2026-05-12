import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { resolveAsset } from "@/lib/asset-resolver";

type Banner = {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string;
  button_text: string | null;
  button_link: string | null;
};

export function Hero() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [i, setI] = useState(0);

  useEffect(() => {
    supabase
      .from("banners")
      .select("id,title,subtitle,image_url,button_text,button_link")
      .eq("active", true)
      .order("sort_order", { ascending: true })
      .then(({ data }) => setBanners((data ?? []) as Banner[]));
  }, []);

  useEffect(() => {
    if (banners.length < 2) return;
    const t = setInterval(() => setI((p) => (p + 1) % banners.length), 6000);
    return () => clearInterval(t);
  }, [banners.length]);

  if (!banners.length) return <div className="h-[80vh] bg-muted/20" />;
  const slide = banners[i];

  return (
    <section className="relative h-[88vh] w-full overflow-hidden border-b border-foreground">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.2, 0.8, 0.2, 1] }}
          className="absolute inset-0"
        >
          <img
            src={resolveAsset(slide.image_url)}
            alt={slide.title}
            className="h-full w-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/40" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 flex h-full max-w-[1600px] flex-col justify-end px-4 pb-20 md:px-12 md:pb-32 mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9 }}
            className="max-w-2xl text-background"
          >
            <p className="text-xs uppercase tracking-[0.3em] mb-4">Maison · Collection</p>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95]">
              {slide.title}
            </h1>
            {slide.subtitle && (
              <p className="mt-6 max-w-md text-sm md:text-base opacity-90">{slide.subtitle}</p>
            )}
            {slide.button_text && slide.button_link && (
              <Link
                to={slide.button_link}
                className="mt-8 inline-block border border-background px-8 py-3 text-xs uppercase tracking-[0.25em] hover:bg-background hover:text-foreground transition"
              >
                {slide.button_text}
              </Link>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* slide indicators */}
      <div className="absolute bottom-8 right-8 z-10 flex gap-2">
        {banners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            aria-label={`Slide ${idx + 1}`}
            className={`h-[2px] w-10 transition ${idx === i ? "bg-background" : "bg-background/40"}`}
          />
        ))}
      </div>
    </section>
  );
}
