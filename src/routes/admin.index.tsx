import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const [stats, setStats] = useState({ orders: 0, revenue: 0, users: 0, products: 0 });
  const [recent, setRecent] = useState<{ id: string; total_amount: number; order_status: string; created_at: string }[]>([]);

  useEffect(() => {
    (async () => {
      const [ordersRes, productsRes, usersRes, recentRes] = await Promise.all([
        supabase.from("orders").select("total_amount", { count: "exact" }),
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("id,total_amount,order_status,created_at").order("created_at", { ascending: false }).limit(8),
      ]);
      const revenue = (ordersRes.data ?? []).reduce((s, o) => s + Number(o.total_amount), 0);
      setStats({
        orders: ordersRes.count ?? 0,
        revenue,
        users: usersRes.count ?? 0,
        products: productsRes.count ?? 0,
      });
      setRecent((recentRes.data ?? []) as typeof recent);
    })();
  }, []);

  const cards = [
    { label: "Orders", value: stats.orders },
    { label: "Revenue", value: `$${stats.revenue.toFixed(2)}` },
    { label: "Customers", value: stats.users },
    { label: "Products", value: stats.products },
  ];

  return (
    <div className="space-y-10">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">Overview</p>
        <h1 className="font-display text-4xl">Dashboard</h1>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="border border-foreground p-6 backdrop-blur bg-background/60">
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{c.label}</p>
            <p className="font-display text-3xl mt-2">{c.value}</p>
          </motion.div>
        ))}
      </div>
      <div>
        <h2 className="font-display text-2xl mb-4">Recent Orders</h2>
        <div className="border border-foreground">
          <table className="w-full text-sm">
            <thead className="border-b border-foreground text-xs uppercase tracking-[0.2em]">
              <tr><th className="p-3 text-left">Order</th><th className="p-3 text-left">Status</th><th className="p-3 text-right">Total</th><th className="p-3 text-right">Date</th></tr>
            </thead>
            <tbody>
              {recent.map((o) => (
                <tr key={o.id} className="border-b border-foreground/20">
                  <td className="p-3">#{o.id.slice(0, 8)}</td>
                  <td className="p-3 uppercase text-xs tracking-[0.2em]">{o.order_status}</td>
                  <td className="p-3 text-right font-display">${o.total_amount}</td>
                  <td className="p-3 text-right text-muted-foreground text-xs">{new Date(o.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {recent.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">No orders yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
