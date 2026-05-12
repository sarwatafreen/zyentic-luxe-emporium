import { motion } from "framer-motion";

export function AuthShell({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md border border-foreground bg-background p-10"
      >
        <a href="/" className="block font-display text-2xl tracking-[0.3em] text-center uppercase mb-2">Zyentic</a>
        <h1 className="font-display text-3xl text-center mb-2">{title}</h1>
        {subtitle && <p className="text-center text-xs uppercase tracking-[0.25em] text-muted-foreground mb-8">{subtitle}</p>}
        {children}
      </motion.div>
    </div>
  );
}
