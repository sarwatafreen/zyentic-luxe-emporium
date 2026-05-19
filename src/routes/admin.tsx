import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { LayoutDashboard, Package, Tag, Image, ShoppingBag, Users, Home } from "lucide-react";
import { useAuth } from "@/store/auth";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const { user, role, loading, refreshRole } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user && typeof window !== "undefined") window.location.href = "/login";
  }, [user, loading]);

  useEffect(() => {
    if (!user) return;
    if (role === "admin") return;
    void refreshRole(user.id);
  }, [user, role, refreshRole]);

  if (loading || !user) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>;
  if (role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 text-center">
        <div>
          <h1 className="font-display text-3xl mb-2">Access denied</h1>
          <p className="text-sm text-muted-foreground mb-6">You need an admin role to view this area.</p>
          <Link to="/" className="border border-foreground px-6 py-3 text-xs uppercase tracking-[0.3em] hover:bg-foreground hover:text-background">Home</Link>
        </div>
      </div>
    );
  }

  const items = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { to: "/admin/products", label: "Products", icon: Package },
    { to: "/admin/categories", label: "Categories", icon: Tag },
    { to: "/admin/banners", label: "Banners", icon: Image },
    { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
    { to: "/admin/users", label: "Users", icon: Users },
  ];

  return (
    <div className="min-h-screen grid lg:grid-cols-[260px_1fr] bg-background">
      <aside className="border-r border-foreground p-6 space-y-6 lg:sticky lg:top-0 lg:h-screen">
        <Link to="/" className="font-display text-xl tracking-[0.3em] uppercase block">Zyentic</Link>
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Admin</p>
        <nav className="space-y-1">
          {items.map((it) => (
            <Link key={it.to} to={it.to} activeOptions={it.exact ? { exact: true } : undefined} activeProps={{ className: "bg-foreground text-background" }} className="flex items-center gap-3 px-3 py-2 text-xs uppercase tracking-[0.2em] hover:bg-foreground hover:text-background transition">
              <it.icon size={14} />
              {it.label}
            </Link>
          ))}
        </nav>
        <Link to="/" className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground mt-8"><Home size={12} /> Back to site</Link>
      </aside>
      <main className="p-6 md:p-10"><Outlet /></main>
    </div>
  );
}
