import { create } from "zustand";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AuthState = {
  user: User | null;
  session: Session | null;
  role: "admin" | "customer" | null;
  loading: boolean;
  init: () => void;
  refreshRole: (userId?: string) => Promise<"admin" | "customer" | null>;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
};

let initialized = false;

async function loadRole(userId: string): Promise<"admin" | "customer" | null> {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);
  if (error) {
    console.error("Failed to load user role", error);
    return null;
  }
  if (!data?.length) return null;
  return data.some((r) => r.role === "admin") ? "admin" : "customer";
}

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  role: null,
  loading: true,

  init: () => {
    if (initialized) return;
    initialized = true;

    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, user: session?.user ?? null });
      if (session?.user) {
        // defer to avoid deadlock per supabase docs
        setTimeout(async () => {
          const role = await loadRole(session.user.id);
          set({ role, loading: false });
        }, 0);
      } else {
        set({ role: null, loading: false });
      }
    });

    supabase.auth.getSession().then(async ({ data }) => {
      set({ session: data.session, user: data.session?.user ?? null });
      if (data.session?.user) {
        const role = await loadRole(data.session.user.id);
        set({ role });
      }
      set({ loading: false });
    });
  },

  refreshRole: async (userId) => {
    const activeUserId = userId ?? get().user?.id;
    if (!activeUserId) {
      set({ role: null, loading: false });
      return null;
    }

    set({ loading: true });
    const role = await loadRole(activeUserId);
    set({ role, loading: false });
    return role;
  },

  signIn: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message };
  },

  signUp: async (email, password, fullName) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
        data: { full_name: fullName },
      },
    });
    return { error: error?.message };
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null, role: null });
  },

  resetPassword: async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error: error?.message };
  },
}));
