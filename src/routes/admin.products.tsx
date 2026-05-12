import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { resolveAsset } from "@/lib/asset-resolver";

type Product = { id: string; title: string; slug: string; price: number; stock: number; trending: boolean; featured: boolean; image_urls: string[]; category_id: string | null };

export const Route = createFileRoute("/admin/products")({
  component: ProductsAdmin,
});

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function ProductsAdmin() {
  const [list, setList] = useState<Product[]>([]);
  const [cats, setCats] = useState<{ id: string; name: string }[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState({ title: "", price: 0, stock: 0, category_id: "", trending: false, featured: false, image_url: "", description: "" });

  const load = () => supabase.from("products").select("*").order("created_at", { ascending: false }).then(({ data }) => setList((data ?? []) as Product[]));
  useEffect(() => {
    load();
    supabase.from("categories").select("id,name").then(({ data }) => setCats(data ?? []));
  }, []);

  const openNew = () => { setEditing(null); setForm({ title: "", price: 0, stock: 0, category_id: "", trending: false, featured: false, image_url: "", description: "" }); setOpen(true); };
  const openEdit = (p: Product) => { setEditing(p); setForm({ title: p.title, price: p.price, stock: p.stock, category_id: p.category_id ?? "", trending: p.trending, featured: p.featured, image_url: p.image_urls[0] ?? "", description: "" }); setOpen(true); };

  const save = async () => {
    const payload = {
      title: form.title,
      slug: slugify(form.title),
      price: form.price,
      stock: form.stock,
      trending: form.trending,
      featured: form.featured,
      category_id: form.category_id || null,
      image_urls: form.image_url ? [form.image_url] : [],
      description: form.description,
    };
    const { error } = editing
      ? await supabase.from("products").update(payload).eq("id", editing.id)
      : await supabase.from("products").insert(payload);
    if (error) return toast.error(error.message);
    toast.success(editing ? "Updated" : "Created");
    setOpen(false); load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted"); load();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">Manage</p>
          <h1 className="font-display text-4xl">Products</h1>
        </div>
        <button onClick={openNew} className="bg-foreground text-background px-5 py-3 text-xs uppercase tracking-[0.3em] flex items-center gap-2 hover:bg-background hover:text-foreground border border-foreground transition"><Plus size={14} /> New</button>
      </div>
      <div className="border border-foreground">
        <table className="w-full text-sm">
          <thead className="border-b border-foreground text-xs uppercase tracking-[0.2em]">
            <tr><th className="p-3 text-left">Item</th><th className="p-3 text-right">Price</th><th className="p-3 text-right">Stock</th><th className="p-3 text-center">Flags</th><th className="p-3"></th></tr>
          </thead>
          <tbody>
            {list.map((p) => (
              <tr key={p.id} className="border-b border-foreground/20">
                <td className="p-3 flex items-center gap-3">
                  {p.image_urls[0] && <img src={resolveAsset(p.image_urls[0])} alt="" className="w-12 h-16 object-cover" />}
                  <div>
                    <p className="font-display">{p.title}</p>
                    <p className="text-xs text-muted-foreground">{p.slug}</p>
                  </div>
                </td>
                <td className="p-3 text-right">${p.price}</td>
                <td className="p-3 text-right">{p.stock}</td>
                <td className="p-3 text-center text-xs">{[p.trending && "TRD", p.featured && "FTD"].filter(Boolean).join(" · ")}</td>
                <td className="p-3 text-right space-x-2">
                  <button onClick={() => openEdit(p)} className="text-xs uppercase tracking-[0.2em] hover:underline">Edit</button>
                  <button onClick={() => remove(p.id)} aria-label="Delete" className="text-muted-foreground hover:text-foreground"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 bg-foreground/40 z-50 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-background border border-foreground max-w-lg w-full p-6 space-y-3 max-h-[90vh] overflow-y-auto">
            <h2 className="font-display text-2xl mb-2">{editing ? "Edit Product" : "New Product"}</h2>
            <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full border border-foreground px-3 py-2 text-sm" />
            <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border border-foreground px-3 py-2 text-sm h-24" />
            <div className="grid grid-cols-2 gap-2">
              <input type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className="border border-foreground px-3 py-2 text-sm" />
              <input type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} className="border border-foreground px-3 py-2 text-sm" />
            </div>
            <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="w-full border border-foreground px-3 py-2 text-sm">
              <option value="">— Category —</option>
              {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <input placeholder="Image URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="w-full border border-foreground px-3 py-2 text-sm" />
            <div className="flex gap-4 text-xs uppercase tracking-[0.2em]">
              <label className="flex items-center gap-2"><input type="checkbox" checked={form.trending} onChange={(e) => setForm({ ...form, trending: e.target.checked })} /> Trending</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured</label>
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={() => setOpen(false)} className="flex-1 border border-foreground py-3 text-xs uppercase tracking-[0.3em]">Cancel</button>
              <button onClick={save} className="flex-1 bg-foreground text-background py-3 text-xs uppercase tracking-[0.3em]">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
