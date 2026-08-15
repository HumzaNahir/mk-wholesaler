import { SearchX, ShoppingBag, PackageOpen, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

type EmptyStateType = "search" | "cart" | "products" | "categories";

interface EmptyStateProps {
  type?: EmptyStateType;
  title?: string;
  message?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

const defaults: Record<
  EmptyStateType,
  {
    icon: typeof SearchX;
    title: string;
    message: string;
  }
> = {
  search: {
    icon: SearchX,
    title: "No products found",
    message: "Try searching for another product, brand or SKU.",
  },
  cart: {
    icon: ShoppingBag,
    title: "Your enquiry list is empty",
    message: "Browse our products and add items to your enquiry.",
  },
  products: {
    icon: PackageOpen,
    title: "No products available",
    message: "There are currently no products to display.",
  },
  categories: {
    icon: PackageOpen,
    title: "No categories available",
    message: "There are currently no categories to display.",
  },
};

export default function EmptyState({
  type = "products",
  title,
  message,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  const defaultState = defaults[type];
  const Icon = defaultState.icon;

  const finalTitle = title ?? defaultState.title;
  const finalMessage = message ?? defaultState.message;

  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm ring-1 ring-slate-200">
        <Icon className="h-7 w-7" />
      </div>

      <h3 className="mt-5 text-lg font-extrabold text-slate-900">
        {finalTitle}
      </h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        {finalMessage}
      </p>

      {onAction && actionLabel && (
        <button
          type="button"
          onClick={onAction}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          {actionLabel}
        </button>
      )}

      {!onAction && actionLabel && actionHref && (
        <Link
          to={actionHref}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          {actionLabel}
        </Link>
      )}
    </div>
  );
}