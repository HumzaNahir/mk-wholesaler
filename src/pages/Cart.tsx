import { Link } from "react-router-dom";
import {
  ArrowLeft,
  MessageCircle,
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
} from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useCart } from "../hooks/useCart";
import EmptyState from "../components/EmptyState";

interface BusinessSettings {
  business_name: string;
  whatsapp_number: string | null;
}

export default function Cart() {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const [settings, setSettings] =
    useState<BusinessSettings | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      const { data } = await supabase
        .from("business_settings")
        .select("business_name, whatsapp_number")
        .eq("id", 1)
        .maybeSingle();

      setSettings(data);
    };

    loadSettings();
  }, []);

  const hasPrices = items.every(
    (item) =>
      item.product.price !== null &&
      item.product.price !== undefined,
  );

  const total = items.reduce((sum, item) => {
    if (
      item.product.price === null ||
      item.product.price === undefined
    ) {
      return sum;
    }

    return sum + Number(item.product.price) * item.quantity;
  }, 0);

  const sendWhatsAppEnquiry = () => {
    const number = settings?.whatsapp_number?.replace(/\D/g, "");

    if (!number || items.length === 0) return;

    const businessName =
      settings?.business_name || "our store";

    let message = `Hello ${businessName}, I would like to enquire about the following products:\n\n`;

    items.forEach((item, index) => {
      const product = item.product;

      message += `${index + 1}. ${product.name}\n`;
      message += `Quantity: ${item.quantity}\n`;

      if (
        product.price !== null &&
        product.price !== undefined
      ) {
        message += `Price: R${Number(product.price).toFixed(2)} ${
          product.unit ? `per ${product.unit}` : ""
        }\n`;
      } else {
        message += `Price: Contact for price\n`;
      }

      if (product.sku) {
        message += `SKU: ${product.sku}\n`;
      }

      message += "\n";
    });

    if (hasPrices) {
      message += `Estimated total: R${total.toFixed(2)}\n\n`;
    }

    message +=
      "Please confirm availability and delivery details.\n\nThank you.";

    const whatsappUrl = `https://wa.me/${number}?text=${encodeURIComponent(
      message,
    )}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <EmptyState
            type="cart"
            actionLabel="Browse Products"
            actionHref="/categories"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          to="/categories"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Continue Browsing
        </Link>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-emerald-600">
              WhatsApp Enquiry
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Your Enquiry List
            </h1>
          </div>

          <button
            type="button"
            onClick={clearCart}
            className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
            Clear All
          </button>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Items */}
          <div className="space-y-4">
            {items.map((item) => {
              const product = item.product;

              return (
                <div
                  key={product.id}
                  className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <Link
                    to={`/product/${product.id}`}
                    className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:h-28 sm:w-28"
                  >
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <ShoppingBag className="h-7 w-7 text-slate-300" />
                      </div>
                    )}
                  </Link>

                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between gap-3">
                      <div>
                        <Link
                          to={`/product/${product.id}`}
                          className="line-clamp-2 text-sm font-bold text-slate-900 hover:text-emerald-600 sm:text-base"
                        >
                          {product.name}
                        </Link>

                        {product.brand && (
                          <p className="mt-1 text-xs text-slate-400">
                            {product.brand}
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          removeFromCart(product.id)
                        }
                        aria-label={`Remove ${product.name}`}
                        className="shrink-0 text-slate-400 transition hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        {product.price !== null &&
                        product.price !== undefined ? (
                          <p className="text-sm font-bold text-slate-900">
                            R{Number(product.price).toFixed(2)}
                            {product.unit && (
                              <span className="ml-1 text-xs font-normal text-slate-400">
                                / {product.unit}
                              </span>
                            )}
                          </p>
                        ) : (
                          <p className="text-sm font-bold text-emerald-700">
                            Contact for price
                          </p>
                        )}
                      </div>

                      <div className="flex items-center overflow-hidden rounded-xl border border-slate-200">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              product.id,
                              Math.max(1, item.quantity - 1),
                            )
                          }
                          className="flex h-9 w-9 items-center justify-center text-slate-600 hover:bg-slate-100"
                        >
                          <Minus className="h-4 w-4" />
                        </button>

                        <span className="flex h-9 w-10 items-center justify-center border-x border-slate-200 text-sm font-bold">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              product.id,
                              item.quantity + 1,
                            )
                          }
                          className="flex h-9 w-9 items-center justify-center text-slate-600 hover:bg-slate-100"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
            <h2 className="text-lg font-black text-slate-900">
              Enquiry Summary
            </h2>

            <div className="mt-5 space-y-3 border-b border-slate-200 pb-5">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Items</span>
                <span className="font-bold text-slate-900">
                  {items.reduce(
                    (sum, item) => sum + item.quantity,
                    0,
                  )}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-slate-500">
                  Products
                </span>
                <span className="font-bold text-slate-900">
                  {items.length}
                </span>
              </div>
            </div>

            <div className="py-5">
              <div className="flex items-end justify-between gap-3">
                <span className="text-sm font-semibold text-slate-500">
                  Estimated Total
                </span>

                {hasPrices ? (
                  <span className="text-2xl font-black text-slate-900">
                    R{total.toFixed(2)}
                  </span>
                ) : (
                  <span className="text-right text-sm font-bold text-emerald-700">
                    Contact for price
                  </span>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={sendWhatsAppEnquiry}
              disabled={!settings?.whatsapp_number}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-4 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <MessageCircle className="h-5 w-5" />
              Enquire on WhatsApp
            </button>

            <p className="mt-3 text-center text-xs leading-5 text-slate-400">
              We'll confirm product availability and discuss
              delivery with you.
            </p>
          </aside>
        </div>
      </main>
    </div>
  );
}