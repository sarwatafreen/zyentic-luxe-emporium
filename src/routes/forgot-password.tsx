import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AuthShell } from "@/components/site/AuthShell";
import { useAuth } from "@/store/auth";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPage,
  head: () => ({ meta: [{ title: "Forgot Password — Zyentic" }] }),
});

function ForgotPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { resetPassword } = useAuth();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await resetPassword(email);
    setLoading(false);
    if (error) return toast.error(error);
    setSent(true);
  };

  return (
    <AuthShell title="Reset Password" subtitle="We'll email you a secure link">
      {sent ? (
        <p className="text-center text-sm text-muted-foreground">If an account exists for {email}, a reset link is on its way.</p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-foreground bg-transparent px-4 py-3 text-sm outline-none focus:bg-foreground/5" />
          <button disabled={loading} className="w-full bg-foreground text-background py-3 text-xs uppercase tracking-[0.3em] hover:bg-background hover:text-foreground border border-foreground transition disabled:opacity-50">
            {loading ? "Sending…" : "Send Reset Link"}
          </button>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground text-center">
            <Link to="/login" className="hover:text-foreground">Back to sign in</Link>
          </p>
        </form>
      )}
    </AuthShell>
  );
}
