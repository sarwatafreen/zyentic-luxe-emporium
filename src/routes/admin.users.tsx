import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type Profile = { id: string; full_name: string | null; email: string | null; created_at: string };
type Role = { user_id: string; role: "admin" | "customer" };

export const Route = createFileRoute("/admin/users")({
  component: UsersAdmin,
});

function UsersAdmin() {
  const [list, setList] = useState<Profile[]>([]);
  const [roles, setRoles] = useState<Record<string, "admin" | "customer">>({});
  const [search, setSearch] = useState("");

  const load = async () => {
    const [{ data: profiles }, { data: roleRows }] = await Promise.all([
      supabase.from("profiles").select("id,full_name,email,created_at").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id,role"),
    ]);
    setList((profiles ?? []) as Profile[]);
    const map: Record<string, "admin" | "customer"> = {};
    (roleRows ?? []).forEach((r: Role) => { if (r.role === "admin" || !map[r.user_id]) map[r.user_id] = r.role; });
    setRoles(map);
  };
  useEffect(() => { load(); }, []);

  const toggleAdmin = async (userId: string) => {
    const isAdmin = roles[userId] === "admin";
    if (isAdmin) {
      const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", "admin");
      if (error) return toast.error(error.message);
    } else {
      const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: "admin" });
      if (error) return toast.error(error.message);
    }
    toast.success("Updated"); load();
  };

  const filtered = list.filter((p) => !search || (p.email ?? "").toLowerCase().includes(search.toLowerCase()) || (p.full_name ?? "").toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div><p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">Manage</p><h1 className="font-display text-4xl">Users</h1></div>
      <input placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full max-w-sm border border-foreground px-3 py-2 text-sm" />
      <div className="border border-foreground">
        <table className="w-full text-sm">
          <thead className="border-b border-foreground text-xs uppercase tracking-[0.2em]"><tr><th className="p-3 text-left">Name</th><th className="p-3 text-left">Email</th><th className="p-3">Role</th><th className="p-3"></th></tr></thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-foreground/20">
                <td className="p-3 font-display">{p.full_name || "—"}</td>
                <td className="p-3 text-muted-foreground">{p.email}</td>
                <td className="p-3 text-center text-xs uppercase tracking-[0.2em]">{roles[p.id] ?? "customer"}</td>
                <td className="p-3 text-right">
                  <button onClick={() => toggleAdmin(p.id)} className="text-xs uppercase tracking-[0.2em] border border-foreground px-3 py-1 hover:bg-foreground hover:text-background">
                    {roles[p.id] === "admin" ? "Revoke Admin" : "Make Admin"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
