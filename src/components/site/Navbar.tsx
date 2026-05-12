import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, Search, Heart, User, ShoppingBag, X, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/store/auth";
import { useCart } from "@/store/cart";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "Wishlist", to: "/wishlist" },
  { label: "Cart", to: "/cart" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const { user, role, signOut } = useAuth();
  const cartCount = useCart((s) => s.count());
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={false}
        animate={{
          backgroundColor: scrolled ? "color-mix(in oklab, var(--background) 75%, transparent)" : "var(--background)",
          backdropFilter: scrolled ? "blur(14px)" : "blur(0px)",
        }}
        className="sticky top-0 z-40 border-b border-foreground"
      >
        <div className="mx-auto flex h-16 md:h-20 max-w-[1600px] items-center px-4 md:px-8">
          <div className="flex items-center gap-3 md:gap-5 flex-1">
            <button aria-label="Menu" onClick={() => setDrawerOpen(true)} className="hover:opacity-60 transition">
              <Menu size={22} strokeWidth={1.25} />
            </button>
            <button aria-label="Search" onClick={() => setSearchOpen((s) => !s)} className="hidden md:flex items-center gap-2 border border-foreground rounded-full px-4 py-2 text-xs uppercase tracking-[0.2em] hover:bg-foreground hover:text-background transition">
              <Search size={14} strokeWidth={1.5} />
              <span>Search</span>
            </button>
          </div>

          <Link to="/" className="font-display text-2xl md:text-3xl tracking-[0.3em] uppercase">
            Zyentic
          </Link>

          <div className="flex items-center gap-4 md:gap-6 flex-1 justify-end">
            <Link to="/wishlist" aria-label="Wishlist" className="hover:opacity-60 transition hidden sm:block">
              <Heart size={20} strokeWidth={1.25} />
            </Link>
            <div className="relative">
              <button aria-label="Account" onClick={() => setAccountOpen((s) => !s)} className="hover:opacity-60 transition">
                <User size={20} strokeWidth={1.25} />
              </button>
              <AnimatePresence>
                {accountOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="absolute right-0 top-full mt-3 w-56 border border-foreground bg-background z-50"
                    onMouseLeave={() => setAccountOpen(false)}
                  >
                    {user ? (
                      <>
                        <div className="px-4 py-3 border-b border-foreground/20">
                          <p className="text-xs uppercase tracking-[0.2em] truncate">{user.email}</p>
                        </div>
                        <Link to="/account" onClick={() => setAccountOpen(false)} className="block px-4 py-3 text-xs uppercase tracking-[0.2em] hover:bg-foreground hover:text-background transition">My Account</Link>
                        <Link to="/account/orders" onClick={() => setAccountOpen(false)} className="block px-4 py-3 text-xs uppercase tracking-[0.2em] hover:bg-foreground hover:text-background transition">My Orders</Link>
                        {role === "admin" && (
                          <Link to="/admin" onClick={() => setAccountOpen(false)} className="block px-4 py-3 text-xs uppercase tracking-[0.2em] hover:bg-foreground hover:text-background transition border-t border-foreground/20">
                            <LayoutDashboard size={12} className="inline mr-2" />
                            Admin
                          </Link>
                        )}
                        <button onClick={async () => { await signOut(); setAccountOpen(false); navigate({ to: "/" }); }} className="block w-full text-left px-4 py-3 text-xs uppercase tracking-[0.2em] hover:bg-foreground hover:text-background transition border-t border-foreground/20">
                          <LogOut size={12} className="inline mr-2" />
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link to="/login" onClick={() => setAccountOpen(false)} className="block px-4 py-3 text-xs uppercase tracking-[0.2em] hover:bg-foreground hover:text-background transition">Login</Link>
                        <Link to="/register" onClick={() => setAccountOpen(false)} className="block px-4 py-3 text-xs uppercase tracking-[0.2em] hover:bg-foreground hover:text-background transition">Register</Link>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Link to="/cart" aria-label="Cart" className="relative hover:opacity-60 transition">
              <ShoppingBag size={20} strokeWidth={1.25} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-foreground text-background text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        <AnimatePresence>
          {searchOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-foreground overflow-hidden">
              <div className="mx-auto max-w-[1600px] px-4 md:px-8 py-4 flex items-center gap-3">
                <Search size={16} strokeWidth={1.5} />
                <input
                  autoFocus
                  placeholder="Search the maison…"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const q = (e.target as HTMLInputElement).value;
                      navigate({ to: "/shop", search: { q } as never });
                      setSearchOpen(false);
                    }
                  }}
                  className="flex-1 bg-transparent outline-none text-sm tracking-wide placeholder:text-muted-foreground"
                />
                <button onClick={() => setSearchOpen(false)} aria-label="Close">
                  <X size={18} strokeWidth={1.25} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} exit={{ opacity: 0 }} onClick={() => setDrawerOpen(false)} className="fixed inset-0 z-50 bg-foreground" />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
              className="fixed inset-y-0 left-0 z-50 w-full sm:w-[420px] bg-background border-r border-foreground flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-foreground">
                <span className="font-display text-xl tracking-[0.3em]">ZYENTIC</span>
                <button onClick={() => setDrawerOpen(false)} aria-label="Close">
                  <X size={22} strokeWidth={1.25} />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto px-6 py-8 space-y-1">
                {navLinks.map((l, i) => (
                  <motion.div key={l.label} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.05 }}>
                    <Link to={l.to} onClick={() => setDrawerOpen(false)} className="block font-display text-3xl py-3 border-b border-foreground/20 hover:pl-2 transition-all duration-300">
                      {l.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
              <div className="px-6 py-6 border-t border-foreground text-xs uppercase tracking-[0.25em] text-muted-foreground">
                <p>Atelier · Paris · Milano</p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
