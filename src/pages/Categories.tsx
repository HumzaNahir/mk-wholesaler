import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import CategoryCard, {
  CategoryCardData,
} from "../components/CategoryCard";
import SearchBar from "../components/SearchBar";
import LoadingSkeleton from "../components/LoadingSkeleton";
import EmptyState from "../components/EmptyState";

export default function Categories() {
  const [categories, setCategories] = useState<CategoryCardData[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("categories")
        .select("id, name, description, image_url")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (!error) {
        setCategories(data ?? []);
      }

      setLoading(false);
    };

    loadCategories();
  }, []);

  const filteredCategories = categories.filter((category) => {
    const searchValue = search.toLowerCase().trim();

    if (!searchValue) return true;

    return (
      category.name.toLowerCase().includes(searchValue) ||
      category.description?.toLowerCase().includes(searchValue)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <p className="text-sm font-bold uppercase tracking-wider text-emerald-400">
            Catalogue
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight text-white sm:text-5xl">
            Browse Categories
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
            Explore our product range by category and find exactly what
            you're looking for.
          </p>

          <div className="mt-7 max-w-2xl">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search categories..."
            />
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {!loading && (
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-500">
              {filteredCategories.length}{" "}
              {filteredCategories.length === 1
                ? "category"
                : "categories"}
            </p>
          </div>
        )}

        {loading ? (
          <LoadingSkeleton type="category" count={8} />
        ) : filteredCategories.length === 0 ? (
          <EmptyState
            type="search"
            title="No categories found"
            message="Try searching for another category."
            actionLabel={search ? "Clear Search" : undefined}
            onAction={search ? () => setSearch("") : undefined}
          />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredCategories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}