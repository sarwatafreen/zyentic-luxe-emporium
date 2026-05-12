import { createFileRoute, Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useWishlist } from "@/store/wishlist";

export const Route = createFileRoute("/wishlist")({
  component: WishlistPage,
  head: () => ({ meta: [{ title: "Wishlist — Zyentic" }] }),
});

function WishlistPage() {
  const { items, remove } = useWishlist();
  return (
    <SiteLayout>
      <section className="py-12 md:py-20">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <h1 className="font-display text-4xl md:text-5xl mb-10">Wishlist</h1>
          {items.length === 0 ? (
            <div className="border border-foreground p-12 text-center">
              <p className="text-muted-foreground mb-6">No saved items yet.</p>
              <Link to="/shop" className="inline-block border border-foreground px-8 py-3 text-xs uppercase tracking-[0.3em] hover:bg-foreground hover:text-background transition">Browse Collection</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-7">
              {items.map((it) => (
                <div key={it.product_id} className="group">
                  <div className="relative aspect-[3/4] border border-foreground overflow-hidden">
                    <Link to="/shop/$slug" params={{ slug: it.slug }}>
                      <img src={it.image} alt={it.title} className="h-full w-full object-cover img-zoom" />
                    </Link>
                    <button onClick={() => remove(it.product_id)} aria-label="Remove" className="absolute top-3 right-3 w-9 h-9 border border-foreground bg-background hover:bg-foreground hover:text-background transition flex items-center justify-center">
                      <X size={14} />
                    </button>
                  </div>
                  <div className="mt-4 flex justify-between">
                    <h3 className="font-display text-lg">{it.title}</h3>
                    <p className="font-display text-lg">${it.price}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
