import { FaInstagram, FaFacebookF, FaTiktok, FaPinterestP } from "react-icons/fa";
import { ArrowRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <h3 className="font-display text-3xl tracking-[0.3em] mb-5">ZYENTIC</h3>
            <p className="text-sm leading-relaxed opacity-70 max-w-xs">
              A maison of quiet luxury — couture craftsmanship, considered design,
              and timeless silhouettes for the modern collector.
            </p>
            <div className="flex gap-3 mt-8">
              {[FaInstagram, FaFacebookF, FaTiktok, FaPinterestP].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social"
                  className="w-10 h-10 border border-background/40 flex items-center justify-center hover:bg-background hover:text-foreground transition"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          <FooterCol title="Quick Links" items={["Home", "Shop", "Collections", "About", "Contact"]} />
          <FooterCol
            title="Customer Care"
            items={["FAQs", "Shipping Policy", "Return Policy", "Privacy Policy"]}
          />

          <div className="md:col-span-3">
            <p className="text-[10px] uppercase tracking-[0.4em] mb-5 opacity-60">Newsletter</p>
            <p className="font-display text-2xl mb-5 leading-snug">
              Receive the journal.
            </p>
            <form className="flex border border-background/40">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-background/50"
              />
              <button
                aria-label="Subscribe"
                className="px-4 hover:bg-background hover:text-foreground transition border-l border-background/40"
              >
                <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-background/20 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] uppercase tracking-[0.3em] opacity-60">
          <p>© 2026 Zyentic Maison</p>
          <p>Paris · Milano · New York</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="md:col-span-2">
      <p className="text-[10px] uppercase tracking-[0.4em] mb-5 opacity-60">{title}</p>
      <ul className="space-y-3">
        {items.map((it) => (
          <li key={it}>
            <a href="#" className="relative inline-block text-sm underline-grow">
              {it}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
