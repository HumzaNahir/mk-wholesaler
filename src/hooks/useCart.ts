import { useCallback, useEffect, useMemo, useState } from "react";
import type { CartItem, Product } from "../types/database";
import {
  addToCart,
  clearCart,
  getCart,
  removeFromCart,
  updateCartQuantity,
} from "../lib/cart";

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [initialized, setInitialized] = useState(false);

  const refreshCart = useCallback(() => {
    setItems(getCart());
  }, []);

  useEffect(() => {
    refreshCart();
    setInitialized(true);

    const handleCartUpdate = () => {
      refreshCart();
    };

    window.addEventListener("cart-updated", handleCartUpdate);

    return () => {
      window.removeEventListener(
        "cart-updated",
        handleCartUpdate,
      );
    };
  }, [refreshCart]);

  const addItem = useCallback(
    (product: Product, quantity = 1) => {
      if (quantity <= 0) return;

      const updated = addToCart({
        product,
        quantity,
      });

      setItems(updated);
    },
    [],
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      const updated = updateCartQuantity(
        productId,
        quantity,
      );

      setItems(updated);
    },
    [],
  );

  const removeItem = useCallback((productId: string) => {
    const updated = removeFromCart(productId);

    setItems(updated);
  }, []);

  const emptyCart = useCallback(() => {
    clearCart();
    setItems([]);
  }, []);

  const itemCount = useMemo(() => {
    return items.reduce(
      (total, item) => total + item.quantity,
      0,
    );
  }, [items]);

  const total = useMemo(() => {
    return items.reduce((sum, item) => {
      const price = Number(item.product.price ?? 0);

      return sum + price * item.quantity;
    }, 0);
  }, [items]);

  return {
    items,
    itemCount,
    total,
    initialized,

    addItem,
    updateQuantity,
    removeItem,
    clearCart: emptyCart,
    refreshCart,
  };
}