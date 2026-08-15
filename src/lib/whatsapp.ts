import type { CartItem } from "../types/database";

function cleanWhatsAppNumber(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function createWhatsAppMessage(
  items: CartItem[],
): string {
  if (items.length === 0) {
    return "Hello, I would like to enquire about your products.";
  }

  const lines: string[] = [
    "Hello, I would like to enquire about the following products:",
    "",
  ];

  items.forEach((item, index) => {
    const product = item.product;

    const price =
      product.price !== null &&
      product.price !== undefined
        ? `R${Number(product.price).toFixed(2)}`
        : "Price on enquiry";

    lines.push(
      `${index + 1}. ${product.name}`,
      `   Quantity: ${item.quantity}`,
      `   Price: ${price}`,
      "",
    );
  });

  lines.push(
    "Please let me know about availability and delivery.",
    "",
    "Thank you.",
  );

  return lines.join("\n");
}

export function createWhatsAppUrl(
  phoneNumber: string,
  items: CartItem[],
): string {
  const phone = cleanWhatsAppNumber(phoneNumber);
  const message = createWhatsAppMessage(items);

  return `https://wa.me/${phone}?text=${encodeURIComponent(
    message,
  )}`;
}

export function openWhatsApp(
  phoneNumber: string,
  items: CartItem[],
): void {
  const url = createWhatsAppUrl(phoneNumber, items);

  window.open(url, "_blank", "noopener,noreferrer");
}