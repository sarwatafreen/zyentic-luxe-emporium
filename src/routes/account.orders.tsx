import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/store/auth";
import { supabase } from "@/integrations/supabase/client";
import { resolveAsset } from "@/lib/asset-resolver";

type Order = {
  id: string; total_amount: number; order_status: string; payment_status: string; created_at: string;
  order_items: { id: string; quantity: number; price: number; product: { title: string; image_urls: string[] } | null }[];
};

export const Route = createFileRoute("/account/orders")({
  component: OrdersPage,
});

function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("orders")
      .select("id,total_amount,order_status,payment_status,created_at,order_items(id,quantity,price,product:products(title,image_urls))")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => setOrders((data ?? []) as unknown as Order[]));
  }, [user]);

  return (
    <div>
      <h1 className="font-display text-3xl mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <p className="text-muted-foreground">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="border border-foreground p-5">
              <div className="flex justify-between flex-wrap gap-2 mb-3">
                <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">#{o.id.slice(0, 8)} · {new Date(o.created_at).toLocaleDateString()}</p>
                <p className="text-xs uppercase tracking-[0.25em] border border-foreground px-3 py-1">{o.order_status}</p>
              </div>
              <div className="space-y-2">
                {o.order_items.map((it) => (
                  <div key={it.id} className="flex gap-3 items-center text-sm">
                    {it.product?.image_urls[0] && <img src={resolveAsset(it.product.image_urls[0])} alt="" className="w-12 h-16 object-cover" />}
                    <p className="flex-1 font-display">{it.product?.title ?? "Item"} ×{it.quantity}</p>
                    <p>${(it.price * it.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-foreground/20 mt-3 pt-3 flex justify-between font-display text-lg">
                <span>Total</span><span>${o.total_amount.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
