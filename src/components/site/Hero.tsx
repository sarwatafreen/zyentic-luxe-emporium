import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { heroSlides } from "@/data/site";

export function Hero() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % heroSlides.length), 6000);
    return () => clearInterval(t);
  }, []);

  const slide = heroSlides[i];

  return (
    <section className="relative h-[88vh] min-h-[600px] overflow-hidden border-b border-foreground">
      <AnimatePresence mode="sync">
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: [0.2, 0.8, 0.2, 1] }}
          className="absolute inset-0"
        >
          <img src={slide.image} alt="" className="h-full w-full object-cover" width={1920} height={1280} />
          <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-background/10 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 mx-auto max-w-[1600px] h-full px-6 md:px-12 flex items-center">
        <div className="max-w-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <p className="text-xs uppercase tracking-[0.4em] mb-6 flex items-center gap-3">
                <span className="w-10 h-px bg-foreground" />
                {slide.eyebrow}
              </p>
              <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[1] text-balance">
                {slide.title}
              </h1>
              <p className="mt-6 text-base md:text-lg max-w-md text-foreground/80">
                {slide.tagline}
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <a
                  href="#trending"
                  className="group inline-flex items-center gap-3 bg-foreground text-background px-7 py-4 text-xs uppercase tracking-[0.25em] hover:bg-background hover:text-foreground border border-foreground transition-colors duration-300"
                >
                  Shop Now
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="#picks"
                  className="inline-flex items-center gap-3 bg-background text-foreground px-7 py-4 text-xs uppercase tracking-[0.25em] hover:bg-foreground hover:text-background border border-foreground transition-colors duration-300"
                >
                  Explore Collection
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-8 left-6 md:left-12 z-10 flex gap-3">
        {heroSlides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            aria-label={`Slide ${idx + 1}`}
            className="h-px transition-all duration-500"
            style={{
              width: idx === i ? 56 : 24,
              backgroundColor: "var(--foreground)",
              opacity: idx === i ? 1 : 0.3,
            }}
          />
        ))}
      </div>

      <div className="absolute bottom-8 right-6 md:right-12 z-10 text-xs uppercase tracking-[0.3em]">
        {String(i + 1).padStart(2, "0")} <span className="opacity-40">/ {String(heroSlides.length).padStart(2, "0")}</span>
      </div>
    </section>
  );
}
