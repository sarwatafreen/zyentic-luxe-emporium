import { create } from "zustand";
import { persist } from "zustand/middleware";

type WishItem = { product_id: string; title: string; price: number; image: string; slug: string };

type State = {
  items: WishItem[];
  toggle: (item: WishItem) => void;
  has: (id: string) => boolean;
  remove: (id: string) => void;
  clear: () => void;
};

export const useWishlist = create<State>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (item) =>
        set((s) => ({
          items: s.items.find((i) => i.product_id === item.product_id)
            ? s.items.filter((i) => i.product_id !== item.product_id)
            : [...s.items, item],
        })),
      has: (id) => !!get().items.find((i) => i.product_id === id),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.product_id !== id) })),
      clear: () => set({ items: [] }),
    }),
    { name: "zyentic-wishlist" },
  ),
);
