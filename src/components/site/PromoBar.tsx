import { promoMessages } from "@/data/site";

export function PromoBar() {
  const items = [...promoMessages, ...promoMessages];
  return (
    <div className="bg-foreground text-background overflow-hidden border-b border-foreground">
      <div className="flex whitespace-nowrap marquee py-2 text-[11px] uppercase tracking-[0.25em]">
        {items.map((m, i) => (
          <span key={i} className="mx-8 flex items-center gap-8">
            {m}
            <span className="opacity-50">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
