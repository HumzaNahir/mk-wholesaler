import { useCallback, useEffect, useMemo, useState } from "react";
import type { CartItem, Product } from "../types/database";

import {
  addToCart as addProductToCart,
  clearCart as clearStoredCart,
  getCart,
  removeFromCart as removeProductFromCart,
  updateCartQuantity as updateStoredCartQuantity,
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

    window.addEventListener(
      "cart-updated",
      handleCartUpdate,
    );

    return () => {
      window.removeEventListener(
        "cart-updated",
        handleCartUpdate,
      );
    };
  }, [refreshCart]);

  const addToCart = useCallback(
    (product: Product, quantity = 1) => {
      if (quantity <= 0) return;

      const updated = addProductToCart({
        product,
        quantity,
      });

      setItems(updated);
    },
    [],
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      const updated = updateStoredCartQuantity(
        productId,
        quantity,
      );

      setItems(updated);
    },
    [],
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      const updated =
        removeProductFromCart(productId);

      setItems(updated);
    },
    [],
  );

  const clearCart = useCallback(() => {
    clearStoredCart();
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

    // Main API
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart,

    // Aliases for components that use the alternative names
    addItem: addToCart,
    removeItem: removeFromCart,
  };
}