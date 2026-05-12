import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { AuthShell } from "@/components/site/AuthShell";
import { useAuth } from "@/store/auth";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({ meta: [{ title: "Sign In — Zyentic" }] }),
});

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { if (user) navigate({ to: "/account" }); }, [user, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) toast.error(error);
    else { toast.success("Welcome back"); navigate({ to: "/account" }); }
  };

  return (
    <AuthShell title="Sign In" subtitle="Welcome back to the maison">
      <form onSubmit={onSubmit} className="space-y-4">
        <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-foreground bg-transparent px-4 py-3 text-sm outline-none focus:bg-foreground/5" />
        <input type="password" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-foreground bg-transparent px-4 py-3 text-sm outline-none focus:bg-foreground/5" />
        <button disabled={loading} className="w-full bg-foreground text-background py-3 text-xs uppercase tracking-[0.3em] hover:bg-background hover:text-foreground border border-foreground transition disabled:opacity-50">
          {loading ? "Signing in…" : "Sign In"}
        </button>
        <div className="flex justify-between text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <Link to="/forgot-password" className="hover:text-foreground">Forgot password?</Link>
          <Link to="/register" className="hover:text-foreground">Register</Link>
        </div>
      </form>
    </AuthShell>
  );
}
