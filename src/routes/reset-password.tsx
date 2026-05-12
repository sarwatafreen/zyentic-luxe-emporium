import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AuthShell } from "@/components/site/AuthShell";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  component: ResetPage,
  head: () => ({ meta: [{ title: "Reset Password — Zyentic" }] }),
});

function ResetPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Password updated");
    navigate({ to: "/account" });
  };

  return (
    <AuthShell title="New Password" subtitle="Set a new password">
      <form onSubmit={onSubmit} className="space-y-4">
        <input type="password" required minLength={6} placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-foreground bg-transparent px-4 py-3 text-sm outline-none focus:bg-foreground/5" />
        <button disabled={loading} className="w-full bg-foreground text-background py-3 text-xs uppercase tracking-[0.3em] hover:bg-background hover:text-foreground border border-foreground transition disabled:opacity-50">
          {loading ? "Updating…" : "Update Password"}
        </button>
      </form>
    </AuthShell>
  );
}
