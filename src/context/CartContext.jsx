import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

const load = () => {
  try {
    return JSON.parse(localStorage.getItem("kk_cart")) || [];
  } catch {
    return [];
  }
};

export function CartProvider({ children }) {
  const [items, setItems] = useState(load);

  useEffect(() => {
    localStorage.setItem("kk_cart", JSON.stringify(items));
  }, [items]);

  // p = product object from API
  const add = (p, qty = 1) => {
    setItems((prev) => {
      const found = prev.find((i) => i.productId === p._id);
      if (found) {
        return prev.map((i) =>
          i.productId === p._id ? { ...i, quantity: Math.min(i.quantity + qty, p.quantity) } : i
        );
      }
      return [
        ...prev,
        {
          productId: p._id,
          name: p.name,
          price: p.price,
          unit: p.unit,
          image: p.image,
          max: p.quantity,
          farmerName: p.farmer?.name || "",
          quantity: Math.min(qty, p.quantity),
        },
      ];
    });
  };

  const setQty = (productId, qty) =>
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId ? { ...i, quantity: Math.max(1, Math.min(qty, i.max)) } : i
      )
    );

  const remove = (productId) => setItems((prev) => prev.filter((i) => i.productId !== productId));
  const clear = () => setItems([]);

  const count = items.reduce((s, i) => s + i.quantity, 0);
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, add, setQty, remove, clear, count, total }}>
      {children}
    </CartContext.Provider>
  );
}
