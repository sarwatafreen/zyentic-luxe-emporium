import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Banner = { id: string; title: string; subtitle: string | null; image_url: string; button_text: string | null; button_link: string | null; active: boolean; sort_order: number };

export const Route = createFileRoute("/admin/banners")({
  component: BannersAdmin,
});

function BannersAdmin() {
  const [list, setList] = useState<Banner[]>([]);
  const [form, setForm] = useState({ title: "", subtitle: "", image_url: "", button_text: "", button_link: "", active: true });
  const load = () => supabase.from("banners").select("*").order("sort_order").then(({ data }) => setList((data ?? []) as Banner[]));
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!form.title || !form.image_url) return toast.error("Title and image required");
    const { error } = await supabase.from("banners").insert(form);
    if (error) return toast.error(error.message);
    setForm({ title: "", subtitle: "", image_url: "", button_text: "", button_link: "", active: true }); load();
  };
  const toggle = async (b: Banner) => {
    await supabase.from("banners").update({ active: !b.active }).eq("id", b.id); load();
  };
  const remove = async (id: string) => {
    if (!confirm("Delete?")) return;
    await supabase.from("banners").delete().eq("id", id); load();
  };

  return (
    <div className="space-y-6">
      <div><p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">Manage</p><h1 className="font-display text-4xl">Banners</h1></div>
      <div className="border border-foreground p-4 space-y-3">
        <div className="grid md:grid-cols-2 gap-3">
          <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="border border-foreground px-3 py-2 text-sm" />
          <input placeholder="Subtitle" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} className="border border-foreground px-3 py-2 text-sm" />
          <input placeholder="Image URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="border border-foreground px-3 py-2 text-sm md:col-span-2" />
          <input placeholder="Button text" value={form.button_text} onChange={(e) => setForm({ ...form, button_text: e.target.value })} className="border border-foreground px-3 py-2 text-sm" />
          <input placeholder="Button link" value={form.button_link} onChange={(e) => setForm({ ...form, button_link: e.target.value })} className="border border-foreground px-3 py-2 text-sm" />
        </div>
        <button onClick={add} className="bg-foreground text-background px-5 py-2 text-xs uppercase tracking-[0.3em] flex items-center gap-2"><Plus size={14} /> Add Banner</button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {list.map((b) => (
          <div key={b.id} className="border border-foreground overflow-hidden">
            <img src={b.image_url} alt={b.title} className="w-full h-44 object-cover" />
            <div className="p-4 space-y-2">
              <h3 className="font-display text-xl">{b.title}</h3>
              <p className="text-xs text-muted-foreground">{b.subtitle}</p>
              <div className="flex gap-2 pt-2">
                <button onClick={() => toggle(b)} className={`text-xs uppercase tracking-[0.2em] px-3 py-1 border border-foreground ${b.active ? "bg-foreground text-background" : ""}`}>{b.active ? "Active" : "Inactive"}</button>
                <button onClick={() => remove(b.id)} className="text-xs uppercase tracking-[0.2em] px-3 py-1 border border-foreground hover:bg-foreground hover:text-background ml-auto flex items-center gap-1"><Trash2 size={12} /> Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
