import type { CartItem } from "../types/database";

const CART_STORAGE_KEY = "hardware_catalogue_cart";

export function getCart(): CartItem[] {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);

    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed as CartItem[];
  } catch (error) {
    console.error("Could not load cart:", error);
    return [];
  }
}

export function saveCart(items: CartItem[]): void {
  try {
    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify(items),
    );

    window.dispatchEvent(new Event("cart-updated"));
  } catch (error) {
    console.error("Could not save cart:", error);
  }
}

export function addToCart(item: CartItem): CartItem[] {
  const cart = getCart();

  const existingIndex = cart.findIndex(
    (cartItem) => cartItem.product.id === item.product.id,
  );

  if (existingIndex >= 0) {
    cart[existingIndex] = {
      ...cart[existingIndex],
      quantity:
        cart[existingIndex].quantity + item.quantity,
    };
  } else {
    cart.push(item);
  }

  saveCart(cart);

  return cart;
}

export function updateCartQuantity(
  productId: string,
  quantity: number,
): CartItem[] {
  if (quantity <= 0) {
    return removeFromCart(productId);
  }

  const cart = getCart();

  const updated = cart.map((item) =>
    item.product.id === productId
      ? {
          ...item,
          quantity,
        }
      : item,
  );

  saveCart(updated);

  return updated;
}

export function removeFromCart(
  productId: string,
): CartItem[] {
  const updated = getCart().filter(
    (item) => item.product.id !== productId,
  );

  saveCart(updated);

  return updated;
}

export function clearCart(): void {
  saveCart([]);
}

export function getCartItemCount(): number {
  return getCart().reduce(
    (total, item) => total + item.quantity,
    0,
  );
}

export function getCartTotal(): number {
  return getCart().reduce((total, item) => {
    const price = Number(item.product.price ?? 0);

    return total + price * item.quantity;
  }, 0);
}