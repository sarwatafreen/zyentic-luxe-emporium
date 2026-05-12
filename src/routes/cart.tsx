import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, X } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useCart } from "@/store/cart";

export const Route = createFileRoute("/cart")({
  component: CartPage,
  head: () => ({ meta: [{ title: "Cart — Zyentic" }] }),
});

function CartPage() {
  const { items, setQty, remove, total } = useCart();

  return (
    <SiteLayout>
      <section className="py-12 md:py-20">
        <div className="mx-auto max-w-[1200px] px-6 md:px-12">
          <h1 className="font-display text-4xl md:text-5xl mb-8">Your Cart</h1>
          {items.length === 0 ? (
            <div className="border border-foreground p-12 text-center">
              <p className="text-muted-foreground mb-6">Your cart is empty.</p>
              <Link to="/shop" className="inline-block border border-foreground px-8 py-3 text-xs uppercase tracking-[0.3em] hover:bg-foreground hover:text-background transition">Continue Shopping</Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-[1fr_360px] gap-10">
              <div className="space-y-4">
                {items.map((it) => (
                  <div key={it.product_id} className="flex gap-4 border border-foreground p-4">
                    <img src={it.image} alt={it.title} className="w-24 h-32 object-cover" />
                    <div className="flex-1">
                      <h3 className="font-display text-xl">{it.title}</h3>
                      {(it.size || it.color) && (
                        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mt-1">
                          {[it.size, it.color].filter(Boolean).join(" · ")}
                        </p>
                      )}
                      <p className="font-display text-lg mt-2">${it.price}</p>
                      <div className="mt-3 flex items-center gap-3">
                        <div className="flex items-center border border-foreground">
                          <button onClick={() => setQty(it.product_id, it.quantity - 1)} className="px-2 py-1 hover:bg-foreground hover:text-background"><Minus size={12} /></button>
                          <span className="px-3 text-sm">{it.quantity}</span>
                          <button onClick={() => setQty(it.product_id, it.quantity + 1)} className="px-2 py-1 hover:bg-foreground hover:text-background"><Plus size={12} /></button>
                        </div>
                        <button onClick={() => remove(it.product_id)} aria-label="Remove" className="text-muted-foreground hover:text-foreground">
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                    <p className="font-display text-xl">${(it.price * it.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <aside className="border border-foreground p-6 h-fit space-y-4">
                <h2 className="font-display text-2xl">Summary</h2>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground uppercase tracking-[0.2em] text-xs">Subtotal</span><span className="font-display text-lg">${total().toFixed(2)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground uppercase tracking-[0.2em] text-xs">Shipping</span><span className="text-xs uppercase tracking-[0.25em]">Complimentary</span></div>
                <div className="flex justify-between border-t border-foreground pt-4"><span className="font-display text-xl">Total</span><span className="font-display text-xl">${total().toFixed(2)}</span></div>
                <Link to="/checkout" className="block text-center bg-foreground text-background py-4 text-xs uppercase tracking-[0.3em] hover:bg-background hover:text-foreground border border-foreground transition">Checkout</Link>
              </aside>
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
