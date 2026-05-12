import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/store/auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/account/")({
  component: ProfilePage,
});

function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({ full_name: "", phone: "", email: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("full_name,phone,email").eq("id", user.id).maybeSingle().then(({ data }) => {
      if (data) setProfile({ full_name: data.full_name ?? "", phone: data.phone ?? "", email: data.email ?? user.email ?? "" });
    });
  }, [user]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({ full_name: profile.full_name, phone: profile.phone }).eq("id", user.id);
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Profile saved");
  };

  return (
    <div>
      <h1 className="font-display text-3xl mb-6">Profile</h1>
      <form onSubmit={save} className="space-y-4 max-w-md">
        <input value={profile.email} disabled className="w-full border border-foreground/30 bg-muted/30 px-4 py-3 text-sm" />
        <input placeholder="Full name" value={profile.full_name} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} className="w-full border border-foreground bg-transparent px-4 py-3 text-sm" />
        <input placeholder="Phone" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="w-full border border-foreground bg-transparent px-4 py-3 text-sm" />
        <button disabled={saving} className="bg-foreground text-background px-8 py-3 text-xs uppercase tracking-[0.3em] hover:bg-background hover:text-foreground border border-foreground transition disabled:opacity-50">{saving ? "Saving…" : "Save"}</button>
      </form>
    </div>
  );
}
