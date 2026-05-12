import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AuthShell } from "@/components/site/AuthShell";
import { useAuth } from "@/store/auth";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
  head: () => ({ meta: [{ title: "Register — Zyentic" }] }),
});

function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    setLoading(true);
    const { error } = await signUp(email, password, fullName);
    setLoading(false);
    if (error) return toast.error(error);
    toast.success("Check your email to verify your account");
    navigate({ to: "/login" });
  };

  return (
    <AuthShell title="Create Account" subtitle="Begin your atelier journey">
      <form onSubmit={onSubmit} className="space-y-4">
        <input required placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full border border-foreground bg-transparent px-4 py-3 text-sm outline-none focus:bg-foreground/5" />
        <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-foreground bg-transparent px-4 py-3 text-sm outline-none focus:bg-foreground/5" />
        <input type="password" required minLength={6} placeholder="Password (6+ chars)" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-foreground bg-transparent px-4 py-3 text-sm outline-none focus:bg-foreground/5" />
        <button disabled={loading} className="w-full bg-foreground text-background py-3 text-xs uppercase tracking-[0.3em] hover:bg-background hover:text-foreground border border-foreground transition disabled:opacity-50">
          {loading ? "Creating…" : "Create Account"}
        </button>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground text-center">
          Already a member? <Link to="/login" className="text-foreground hover:underline">Sign in</Link>
        </p>
      </form>
    </AuthShell>
  );
}
