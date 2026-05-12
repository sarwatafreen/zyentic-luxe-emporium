import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useCart } from "@/store/cart";
import { useAuth } from "@/store/auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
  head: () => ({ meta: [{ title: "Checkout — Zyentic" }] }),
});

function CheckoutPage() {
  const { items, total, clear } = useCart();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ full_name: "", phone: "", line1: "", city: "", country: "", postal: "" });

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/login" });
  }, [authLoading, user, navigate]);

  if (items.length === 0) {
    return (
      <SiteLayout>
        <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4">
          <p className="text-muted-foreground">Your cart is empty.</p>
          <Link to="/shop" className="border border-foreground px-6 py-3 text-xs uppercase tracking-[0.3em] hover:bg-foreground hover:text-background">Browse</Link>
        </div>
      </SiteLayout>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    const totalAmount = total();
    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        total_amount: totalAmount,
        phone: form.phone,
        shipping_address: { full_name: form.full_name, line1: form.line1, city: form.city, country: form.country, postal: form.postal },
      })
      .select()
      .single();
    if (error || !order) { setSubmitting(false); toast.error(error?.message ?? "Order failed"); return; }

    const { error: itemsError } = await supabase.from("order_items").insert(
      items.map((it) => ({ order_id: order.id, product_id: it.product_id, quantity: it.quantity, price: it.price, size: it.size, color: it.color })),
    );
    setSubmitting(false);
    if (itemsError) { toast.error(itemsError.message); return; }
    clear();
    toast.success("Order placed!");
    navigate({ to: "/account/orders" });
  };

  return (
    <SiteLayout>
      <section className="py-12 md:py-20">
        <div className="mx-auto max-w-[1200px] px-6 md:px-12 grid lg:grid-cols-[1fr_400px] gap-10">
          <form onSubmit={submit} className="space-y-4">
            <h1 className="font-display text-4xl mb-6">Checkout</h1>
            <input required placeholder="Full name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="w-full border border-foreground bg-transparent px-4 py-3 text-sm" />
            <input required placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full border border-foreground bg-transparent px-4 py-3 text-sm" />
            <input required placeholder="Address line 1" value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} className="w-full border border-foreground bg-transparent px-4 py-3 text-sm" />
            <div className="grid grid-cols-2 gap-3">
              <input required placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="border border-foreground bg-transparent px-4 py-3 text-sm" />
              <input required placeholder="Postal code" value={form.postal} onChange={(e) => setForm({ ...form, postal: e.target.value })} className="border border-foreground bg-transparent px-4 py-3 text-sm" />
            </div>
            <input required placeholder="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="w-full border border-foreground bg-transparent px-4 py-3 text-sm" />
            <button disabled={submitting} className="w-full bg-foreground text-background py-4 text-xs uppercase tracking-[0.3em] hover:bg-background hover:text-foreground border border-foreground transition disabled:opacity-50">
              {submitting ? "Placing order…" : `Place Order · $${total().toFixed(2)}`}
            </button>
          </form>
          <aside className="border border-foreground p-6 h-fit space-y-3">
            <h2 className="font-display text-2xl mb-4">Summary</h2>
            {items.map((it) => (
              <div key={it.product_id} className="flex gap-3 text-sm">
                <img src={it.image} alt="" className="w-12 h-16 object-cover" />
                <div className="flex-1">
                  <p className="font-display">{it.title}</p>
                  <p className="text-xs text-muted-foreground">×{it.quantity}</p>
                </div>
                <p>${(it.price * it.quantity).toFixed(2)}</p>
              </div>
            ))}
            <div className="border-t border-foreground pt-3 flex justify-between font-display text-xl">
              <span>Total</span><span>${total().toFixed(2)}</span>
            </div>
          </aside>
        </div>
      </section>
    </SiteLayout>
  );
}
