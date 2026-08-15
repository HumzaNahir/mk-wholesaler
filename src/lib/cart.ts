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