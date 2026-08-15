import { Link } from "react-router-dom";
import { ShoppingBag, Plus, Package } from "lucide-react";
import type { Product } from "../types/database";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product, quantity?: number) => void;
}

export default function ProductCard({
  product,
  onAddToCart,
}: ProductCardProps) {
  const hasPrice =
    product.price !== null &&
    product.price !== undefined &&
    !Number.isNaN(Number(product.price));

  const formattedPrice = hasPrice
    ? `R${Number(product.price).toFixed(2)}`
    : "Contact for price";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <Link
        to={`/product/${product.id}`}
        className="relative block aspect-square overflow-hidden bg-slate-100"
        aria-label={`View ${product.name}`}
      >
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-slate-400">
            <Package className="h-12 w-12" />
            <span className="text-xs font-medium">
              No image available
            </span>
          </div>
        )}

        {product.brand && (
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-slate-700 shadow-sm backdrop-blur-sm">
            {product.brand}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        {product.sku && (
          <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-slate-400">
            SKU: {product.sku}
          </p>
        )}

        <Link to={`/product/${product.id}`}>
          <h3 className="line-clamp-2 text-sm font-bold leading-5 text-slate-900 transition group-hover:text-emerald-700 sm:text-base">
            {product.name}
          </h3>
        </Link>

        {product.description && (
          <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">
            {product.description}
          </p>
        )}

        <div className="mt-auto pt-4">
          <div className="flex items-end justify-between gap-2">
            <div>
              <p
                className={`font-extrabold ${
                  hasPrice
                    ? "text-lg text-slate-900"
                    : "text-sm text-emerald-700"
                }`}
              >
                {formattedPrice}
              </p>

              {hasPrice && product.unit && (
                <p className="mt-0.5 text-[11px] text-slate-400">
                  per {product.unit}
                </p>
              )}
            </div>

            {onAddToCart && (
              <button
                type="button"
                onClick={() => onAddToCart(product, 1)}
                aria-label={`Add ${product.name} to enquiry`}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white transition hover:bg-emerald-600 active:scale-95"
              >
                <Plus className="h-5 w-5" />
              </button>
            )}
          </div>

          {onAddToCart && (
            <button
              type="button"
              onClick={() => onAddToCart(product, 1)}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
            >
              <ShoppingBag className="h-4 w-4" />
              Add to Enquiry
            </button>
          )}
        </div>
      </div>
    </article>
  );
}