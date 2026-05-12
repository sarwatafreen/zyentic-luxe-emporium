import { createFileRoute, Outlet, Link, redirect } from "@tanstack/react-router";
import { useEffect } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useAuth } from "@/store/auth";

export const Route = createFileRoute("/account")({
  component: AccountLayout,
});

function AccountLayout() {
  const { user, loading } = useAuth();
  useEffect(() => {
    if (!loading && !user && typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }, [loading, user]);

  if (loading || !user) {
    return <SiteLayout><div className="min-h-[40vh] flex items-center justify-center text-muted-foreground">Loading…</div></SiteLayout>;
  }

  return (
    <SiteLayout>
      <section className="py-12 md:py-20">
        <div className="mx-auto max-w-[1200px] px-6 md:px-12 grid lg:grid-cols-[220px_1fr] gap-10">
          <aside className="space-y-1 text-xs uppercase tracking-[0.25em]">
            <Link to="/account" activeOptions={{ exact: true }} activeProps={{ className: "border-b border-foreground" }} className="block py-2 hover:text-foreground text-muted-foreground">Profile</Link>
            <Link to="/account/orders" activeProps={{ className: "border-b border-foreground" }} className="block py-2 hover:text-foreground text-muted-foreground">Orders</Link>
            <Link to="/wishlist" className="block py-2 hover:text-foreground text-muted-foreground">Wishlist</Link>
          </aside>
          <div><Outlet /></div>
        </div>
      </section>
    </SiteLayout>
  );
}

// suppress unused
void redirect;
