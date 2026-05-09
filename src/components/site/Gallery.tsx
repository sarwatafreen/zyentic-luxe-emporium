import { motion } from "framer-motion";
import { galleryImages } from "@/data/site";

export function Gallery() {
  return (
    <section className="border-b border-foreground py-20 md:py-28 bg-cream">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12">
        <div className="text-center mb-14 md:mb-20">
          <p className="text-xs uppercase tracking-[0.4em] mb-4">— Editorial —</p>
          <h2 className="font-display text-4xl md:text-6xl">The Maison Diary</h2>
        </div>

        <div className="grid grid-cols-12 gap-4 md:gap-6">
          <GItem src={galleryImages[0]} className="col-span-12 md:col-span-7 aspect-[4/5]" delay={0} />
          <div className="col-span-12 md:col-span-5 grid grid-rows-2 gap-4 md:gap-6">
            <GItem src={galleryImages[1]} className="aspect-[16/10]" delay={0.1} />
            <GItem src={galleryImages[3]} className="aspect-[16/10]" delay={0.2} />
          </div>
          <GItem src={galleryImages[2]} className="col-span-12 md:col-span-5 aspect-[4/5]" delay={0.15} />
          <GItem src={galleryImages[4]} className="col-span-12 md:col-span-7 aspect-[4/3]" delay={0.25} />
        </div>
      </div>
    </section>
  );
}

function GItem({ src, className, delay }: { src: string; className: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay, ease: [0.2, 0.8, 0.2, 1] }}
      className={`group relative overflow-hidden border border-foreground ${className}`}
    >
      <img src={src} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover img-zoom" />
    </motion.div>
  );
}
