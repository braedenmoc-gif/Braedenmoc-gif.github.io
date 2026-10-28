import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { products, type Product } from '@/data/products';

export type CartLine = { id: string; qty: number };

export type CartContextValue = {
  lines: CartLine[];
  items: { product: Product; qty: number }[];
  count: number;
  subtotal: number;
  add: (id: string, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
  isOpen: boolean;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = 'nextsnap_cart_v1';

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setLines(JSON.parse(stored));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* ignore */
    }
  }, [lines]);

  const add: CartContextValue['add'] = (id, qty = 1) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.id === id);
      if (existing) {
        return prev.map((l) => (l.id === id ? { ...l, qty: l.qty + qty } : l));
      }
      return [...prev, { id, qty }];
    });
    setIsOpen(true);
  };

  const remove: CartContextValue['remove'] = (id) =>
    setLines((prev) => prev.filter((l) => l.id !== id));

  const setQty: CartContextValue['setQty'] = (id, qty) =>
    setLines((prev) =>
      prev
        .map((l) => (l.id === id ? { ...l, qty: Math.max(0, qty) } : l))
        .filter((l) => l.qty > 0)
    );

  const clear = () => setLines([]);

  const items = lines
    .map((l) => {
      const product = products.find((p) => p.id === l.id);
      return product ? { product, qty: l.qty } : null;
    })
    .filter(Boolean) as { product: Product; qty: number }[];

  const count = items.reduce((n, i) => n + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.product.price * i.qty, 0);

  return (
    <CartContext.Provider
      value={{ lines, items, count, subtotal, add, remove, setQty, clear, openCart: () => setIsOpen(true), closeCart: () => setIsOpen(false), isOpen }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
