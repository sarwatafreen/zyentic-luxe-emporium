import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Heart, ShoppingBag, Minus, Plus, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { resolveAsset } from "@/lib/asset-resolver";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";

type Product = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  price: number;
  discount_price: number | null;
  stock: number;
  image_urls: string[];
  sizes: string[];
  colors: string[];
  category: { name: string; slug: string } | null;
};

type QuickViewDialogProps = {
  slug: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function QuickViewDialog({ slug, open, onOpenChange }: QuickViewDialogProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [active, setActive] = useState(0);
  const [size, setSize] = useState<string | undefined>();
  const [color, setColor] = useState<string | undefined>();
  const [qty, setQty] = useState(1);
  const addToCart = useCart((s) => s.add);
  const wish = useWishlist();

  useEffect(() => {
    if (!slug || !open) {
      setProduct(null);
      setActive(0);
      setSize(undefined);
      setColor(undefined);
      setQty(1);
      return;
    }
    supabase
      .from("products")
      .select(
        "id,title,slug,description,price,discount_price,stock,image_urls,sizes,colors,category:categories(name,slug)"
      )
      .eq("slug", slug)
      .maybeSingle()
      .then(({ data }) => {
        setProduct(data as unknown as Product);
        setActive(0);
        setSize(undefined);
        setColor(undefined);
        setQty(1);
      });
  }, [slug, open]);

  const handleAdd = () => {
    if (!product) return;
    const price = product.discount_price ?? product.price;
    const img = resolveAsset(product.image_urls[active] ?? product.image_urls[0]);
    addToCart({
      product_id: product.id,
      title: product.title,
      price,
      image: img,
      quantity: qty,
      size,
      color,
    });
    toast.success(`Added ${product.title}`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-full p-0 gap-0 overflow-hidden sm:rounded-lg border border-foreground">
        <DialogTitle className="sr-only">
          {product?.title ?? "Quick View"}
        </DialogTitle>
        <DialogDescription className="sr-only">
          Quick preview of product details
        </DialogDescription>
        <AnimatePresence mode="wait">
          {product ? (
            <motion.div
              key={product.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="grid md:grid-cols-2"
            >
              {/* Images */}
              <div className="bg-muted border-b md:border-b-0 md:border-r border-foreground">
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={resolveAsset(product.image_urls[active] ?? product.image_urls[0])}
                    alt={product.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                {product.image_urls.length > 1 && (
                  <div className="grid grid-cols-4 gap-px bg-foreground border-t border-foreground">
                    {product.image_urls.map((u, i) => (
                      <button
                        key={i}
                        onClick={() => setActive(i)}
                        className={`aspect-square overflow-hidden bg-background ${
                          i === active ? "ring-1 ring-foreground ring-inset" : "opacity-60 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={resolveAsset(u)}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="p-6 md:p-10 flex flex-col justify-center space-y-6">
                <div>
                  {product.category && (
                    <Link
                      to="/shop"
                      search={{ q: "", cat: product.category.slug }}
                      className="text-xs uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground"
                      onClick={() => onOpenChange(false)}
                    >
                      {product.category.name}
                    </Link>
                  )}
                  <h2 className="font-display text-3xl md:text-4xl mt-2">
                    {product.title}
                  </h2>
                  <p className="font-display text-xl mt-3">
                    ${product.discount_price ?? product.price}
                    {product.discount_price && (
                      <span className="ml-3 line-through text-muted-foreground text-base">
                        ${product.price}
                      </span>
                    )}
                  </p>
                </div>

                {product.description && (
                  <p className="text-sm leading-relaxed text-muted-foreground line-clamp-4">
                    {product.description}
                  </p>
                )}

                {product.sizes.length > 0 && (
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] mb-3">Size</p>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((s) => (
                        <button
                          key={s}
                          onClick={() => setSize(s)}
                          className={`min-w-[44px] px-4 py-2 text-xs uppercase tracking-[0.2em] border transition ${
                            size === s
                              ? "border-foreground bg-foreground text-background"
                              : "border-foreground/30 hover:border-foreground"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {product.colors.length > 0 && (
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] mb-3">Color</p>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((c) => (
                        <button
                          key={c}
                          onClick={() => setColor(c)}
                          className={`px-4 py-2 text-xs uppercase tracking-[0.2em] border transition ${
                            color === c
                              ? "border-foreground bg-foreground text-background"
                              : "border-foreground/30 hover:border-foreground"
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-foreground">
                    <button
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="px-3 py-3 hover:bg-foreground hover:text-background transition"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-5 font-display text-lg">{qty}</span>
                    <button
                      onClick={() => setQty(qty + 1)}
                      className="px-3 py-3 hover:bg-foreground hover:text-background transition"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {product.stock} in stock
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={handleAdd}
                    className="flex-1 border border-foreground py-4 text-xs uppercase tracking-[0.3em] hover:bg-foreground hover:text-background transition flex items-center justify-center gap-2"
                  >
                    <ShoppingBag size={14} /> Add to Cart
                  </button>
                  <button
                    onClick={() => {
                      if (!product) return;
                      const price = product.discount_price ?? product.price;
                      const img = resolveAsset(product.image_urls[active] ?? product.image_urls[0]);
                      wish.toggle({
                        product_id: product.id,
                        title: product.title,
                        price,
                        image: img,
                        slug: product.slug,
                      });
                      toast.success(
                        wish.has(product.id)
                          ? `Removed ${product.title} from wishlist`
                          : `Added ${product.title} to wishlist`
                      );
                    }}
                    aria-label="Wishlist"
                    className={`w-14 border border-foreground flex items-center justify-center transition ${
                      wish.has(product.id)
                        ? "bg-foreground text-background"
                        : "hover:bg-foreground hover:text-background"
                    }`}
                  >
                    <Heart
                      size={16}
                      fill={wish.has(product.id) ? "currentColor" : "none"}
                    />
                  </button>
                </div>

                <Link
                  to="/shop/$slug"
                  params={{ slug: product.slug }}
                  onClick={() => onOpenChange(false)}
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground transition pt-2"
                >
                  View Full Details <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid md:grid-cols-2"
            >
              <div className="aspect-[3/4] bg-muted animate-pulse border-b md:border-b-0 md:border-r border-foreground" />
              <div className="p-6 md:p-10 space-y-6">
                <div className="h-6 bg-muted animate-pulse w-1/3" />
                <div className="h-10 bg-muted animate-pulse w-2/3" />
                <div className="h-20 bg-muted animate-pulse w-full" />
                <div className="h-10 bg-muted animate-pulse w-1/2" />
                <div className="h-12 bg-muted animate-pulse w-full" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
