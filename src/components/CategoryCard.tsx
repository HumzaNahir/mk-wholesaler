import { Link } from "react-router-dom";
import { ArrowRight, Package } from "lucide-react";

export interface CategoryCardData {
  id: string;
  name: string;
  description?: string | null;
  image_url?: string | null;
}

interface CategoryCardProps {
  category: CategoryCardData;
  productCount?: number;
}

export default function CategoryCard({
  category,
  productCount,
}: CategoryCardProps) {
  return (
    <Link
      to={`/category/${category.id}`}
      className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        {category.image_url ? (
          <img
            src={category.image_url}
            alt={category.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-400">
            <Package className="h-12 w-12" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />

        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-lg font-extrabold text-white drop-shadow-sm">
            {category.name}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {category.description && (
          <p className="line-clamp-2 text-sm leading-5 text-slate-500">
            {category.description}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between">
          {productCount !== undefined ? (
            <span className="text-xs font-semibold text-slate-400">
              {productCount} {productCount === 1 ? "product" : "products"}
            </span>
          ) : (
            <span className="text-xs font-semibold text-slate-400">
              Browse products
            </span>
          )}

          <span className="flex items-center gap-1 text-sm font-bold text-emerald-600 transition group-hover:gap-2">
            View
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}