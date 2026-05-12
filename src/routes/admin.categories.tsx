import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Cat = { id: string; name: string; slug: string; image_url: string | null; featured: boolean };
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const Route = createFileRoute("/admin/categories")({
  component: CategoriesAdmin,
});

function CategoriesAdmin() {
  const [list, setList] = useState<Cat[]>([]);
  const [form, setForm] = useState({ name: "", image_url: "", featured: false });
  const load = () => supabase.from("categories").select("*").order("name").then(({ data }) => setList((data ?? []) as Cat[]));
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!form.name) return;
    const { error } = await supabase.from("categories").insert({ name: form.name, slug: slugify(form.name), image_url: form.image_url || null, featured: form.featured });
    if (error) return toast.error(error.message);
    setForm({ name: "", image_url: "", featured: false }); load();
  };
  const remove = async (id: string) => {
    if (!confirm("Delete?")) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) toast.error(error.message); else load();
  };

  return (
    <div className="space-y-6">
      <div><p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">Manage</p><h1 className="font-display text-4xl">Categories</h1></div>
      <div className="border border-foreground p-4 grid md:grid-cols-[1fr_1fr_auto_auto] gap-3 items-center">
        <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border border-foreground px-3 py-2 text-sm" />
        <input placeholder="Image URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="border border-foreground px-3 py-2 text-sm" />
        <label className="text-xs uppercase tracking-[0.2em] flex items-center gap-2"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured</label>
        <button onClick={add} className="bg-foreground text-background px-5 py-2 text-xs uppercase tracking-[0.3em] flex items-center gap-2"><Plus size={14} /> Add</button>
      </div>
      <div className="border border-foreground">
        <table className="w-full text-sm">
          <thead className="border-b border-foreground text-xs uppercase tracking-[0.2em]"><tr><th className="p-3 text-left">Name</th><th className="p-3">Slug</th><th className="p-3">Featured</th><th></th></tr></thead>
          <tbody>
            {list.map((c) => (
              <tr key={c.id} className="border-b border-foreground/20">
                <td className="p-3 font-display">{c.name}</td>
                <td className="p-3 text-xs text-muted-foreground">{c.slug}</td>
                <td className="p-3 text-center text-xs">{c.featured ? "★" : ""}</td>
                <td className="p-3 text-right"><button onClick={() => remove(c.id)}><Trash2 size={14} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
