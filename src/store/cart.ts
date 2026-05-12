import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  product_id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
  color?: string;
};

type CartState = {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (product_id: string) => void;
  setQty: (product_id: string, qty: number) => void;
  clear: () => void;
  total: () => number;
  count: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) =>
        set((s) => {
          const existing = s.items.find((i) => i.product_id === item.product_id);
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.product_id === item.product_id
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i,
              ),
            };
          }
          return { items: [...s.items, item] };
        }),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.product_id !== id) })),
      setQty: (id, qty) =>
        set((s) => ({
          items: s.items.map((i) => (i.product_id === id ? { ...i, quantity: Math.max(1, qty) } : i)),
        })),
      clear: () => set({ items: [] }),
      total: () => get().items.reduce((s, i) => s + i.price * i.quantity, 0),
      count: () => get().items.reduce((s, i) => s + i.quantity, 0),
    }),
    { name: "zyentic-cart" },
  ),
);
