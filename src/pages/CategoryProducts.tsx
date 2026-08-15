import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, SlidersHorizontal } from "lucide-react";
import { supabase } from "../lib/supabase";
import ProductCard, {
  ProductCardData,
} from "../components/ProductCard";
import SearchBar from "../components/SearchBar";
import LoadingSkeleton from "../components/LoadingSkeleton";
import EmptyState from "../components/EmptyState";
import { useCart } from "../hooks/useCart";

interface CategoryData {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
}

export default function CategoryProducts() {
  const { id } = useParams<{ id: string }>();

  const [category, setCategory] = useState<CategoryData | null>(null);
  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();

  useEffect(() => {
    if (!id) return;

    const loadCategory = async () => {
      setLoading(true);

      const [categoryResult, productsResult] = await Promise.all([
        supabase
          .from("categories")
          .select("id, name, description, image_url")
          .eq("id", id)
          .eq("is_active", true)
          .maybeSingle(),

        supabase
          .from("products")
          .select(
            "id, name, description, sku, brand, price, unit, image_url, created_at",
          )
          .eq("category_id", id)
          .eq("is_active", true)
          .order("created_at", { ascending: false }),
      ]);

      if (!categoryResult.error) {
        setCategory(categoryResult.data);
      }

      if (!productsResult.error) {
        setProducts(productsResult.data ?? []);
      }

      setLoading(false);
    };

    loadCategory();
  }, [id]);

  const filteredProducts = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    let result = products.filter((product) => {
      if (!searchValue) return true;

      return (
        product.name.toLowerCase().includes(searchValue) ||
        product.sku?.toLowerCase().includes(searchValue) ||
        product.brand?.toLowerCase().includes(searchValue) ||
        product.description?.toLowerCase().includes(searchValue)
      );
    });

    result = [...result].sort((a, b) => {
      if (sort === "name-asc") {
        return a.name.localeCompare(b.name);
      }

      if (sort === "name-desc") {
        return b.name.localeCompare(a.name);
      }

      if (sort === "price-low") {
        return (a.price ?? Infinity) - (b.price ?? Infinity);
      }

      if (sort === "price-high") {
        return (b.price ?? -Infinity) - (a.price ?? -Infinity);
      }

      return 0;
    });

    return result;
  }, [products, search, sort]);

  if (!loading && !category) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-2xl">
          <EmptyState
            title="Category not found"
            message="This category may have been removed or is no longer available."
            actionLabel="Back to Categories"
            actionHref="/categories"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Category Header */}
      <section className="bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <Link
            to="/categories"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            All Categories
          </Link>

          {loading ? (
            <div className="mt-7 space-y-3">
              <div className="h-10 w-64 animate-pulse rounded-lg bg-white/10" />
              <div className="h-5 w-96 max-w-full animate-pulse rounded bg-white/10" />
            </div>
          ) : (
            <>
              <h1 className="mt-7 text-4xl font-black tracking-tight text-white sm:text-5xl">
                {category?.name}
              </h1>

              {category?.description && (
                <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                  {category.description}
                </p>
              )}
            </>
          )}
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Search and Filters */}
        <div className="flex flex-col gap-3 lg:flex-row">
          <SearchBar
            value={search}
            onChange={setSearch}
            className="flex-1"
            placeholder="Search products in this category..."
          />

          <div className="relative">
            <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              aria-label="Sort products"
              className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-10 pr-10 text-sm font-semibold text-slate-700 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 lg:w-56"
            >
              <option value="newest">Newest</option>
              <option value="name-asc">Name: A–Z</option>
              <option value="name-desc">Name: Z–A</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {!loading && (
          <div className="mt-6">
            <p className="text-sm font-semibold text-slate-500">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "product" : "products"}
            </p>
          </div>
        )}

        <div className="mt-6">
          {loading ? (
            <LoadingSkeleton type="product" count={8} />
          ) : filteredProducts.length === 0 ? (
            <EmptyState
              type="search"
              actionLabel={search ? "Clear Search" : undefined}
              onAction={search ? () => setSearch("") : undefined}
            />
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}