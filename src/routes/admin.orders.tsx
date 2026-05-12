import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";
type Order = { id: string; user_id: string; total_amount: number; order_status: OrderStatus; payment_status: string; created_at: string };
const STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"] as const;

export const Route = createFileRoute("/admin/orders")({
  component: OrdersAdmin,
});

function OrdersAdmin() {
  const [list, setList] = useState<Order[]>([]);
  const [filter, setFilter] = useState<string>("all");

  const load = () => {
    let q = supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (filter !== "all") q = q.eq("order_status", filter as OrderStatus);
    q.then(({ data }) => setList((data ?? []) as Order[]));
  };
  useEffect(() => { load(); }, [filter]);

  const update = async (id: string, status: string) => {
    const { error } = await supabase.from("orders").update({ order_status: status as OrderStatus }).eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Updated"); load(); }
  };

  return (
    <div className="space-y-6">
      <div><p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">Manage</p><h1 className="font-display text-4xl">Orders</h1></div>
      <div className="flex gap-2 flex-wrap text-xs uppercase tracking-[0.2em]">
        {["all", ...STATUSES].map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1 border border-foreground ${filter === s ? "bg-foreground text-background" : ""}`}>{s}</button>
        ))}
      </div>
      <div className="border border-foreground">
        <table className="w-full text-sm">
          <thead className="border-b border-foreground text-xs uppercase tracking-[0.2em]"><tr><th className="p-3 text-left">Order</th><th className="p-3">User</th><th className="p-3 text-right">Total</th><th className="p-3">Status</th><th className="p-3">Date</th></tr></thead>
          <tbody>
            {list.map((o) => (
              <tr key={o.id} className="border-b border-foreground/20">
                <td className="p-3 font-mono text-xs">#{o.id.slice(0, 8)}</td>
                <td className="p-3 font-mono text-xs">{o.user_id.slice(0, 8)}</td>
                <td className="p-3 text-right font-display">${o.total_amount}</td>
                <td className="p-3">
                  <select value={o.order_status} onChange={(e) => update(o.id, e.target.value)} className="border border-foreground bg-background px-2 py-1 text-xs uppercase tracking-[0.2em]">
                    {STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </td>
                <td className="p-3 text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No orders.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
