import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Edit3,
  Plus,
  Search,
  Trash2,
  Package,
  Eye,
  EyeOff,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

interface Product {
  id: string;
  name: string;
  brand: string | null;
  price: number | null;
  unit: string | null;
  image_url: string | null;
  is_active: boolean;
  category_id: string | null;
  categories:
    | {
        name: string;
      }
    | null;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const loadProducts = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select(
        "id, name, brand, price, unit, image_url, is_active, category_id, categories(name)",
      )
      .order("created_at", { ascending: false });

    if (!error) {
      setProducts((data ?? []) as Product[]);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const value = search.toLowerCase().trim();

    if (!value) return true;

    return (
      product.name.toLowerCase().includes(value) ||
      product.brand?.toLowerCase().includes(value) ||
      product.categories?.name.toLowerCase().includes(value)
    );
  });

  const toggleActive = async (product: Product) => {
    const { error } = await supabase
      .from("products")
      .update({
        is_active: !product.is_active,
      })
      .eq("id", product.id);

    if (!error) {
      setProducts((current) =>
        current.map((item) =>
          item.id === product.id
            ? { ...item, is_active: !item.is_active }
            : item,
        ),
      );
    }
  };

  const deleteProduct = async (product: Product) => {
    const confirmed = window.confirm(
      `Delete "${product.name}"? This cannot be undone.`,
    );

    if (!confirmed) return;

    setDeleting(product.id);

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", product.id);

    if (!error) {
      setProducts((current) =>
        current.filter((item) => item.id !== product.id),
      );
    } else {
      window.alert(error.message);
    }

    setDeleting(null);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-emerald-600">
              Catalogue
            </p>

            <h1 className="mt-2 text-3xl font-black text-slate-900">
              Products
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Add, edit, hide and delete catalogue products.
            </p>
          </div>

          <Link
            to="/admin/products/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-600"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Link>
        </div>

        <div className="relative mt-7">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products, brand or category..."
            className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
          />
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="p-10 text-center text-sm text-slate-500">
              Loading products...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-10 text-center">
              <Package className="mx-auto h-10 w-10 text-slate-300" />

              <p className="mt-4 font-bold text-slate-900">
                No products found
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Try another search or add a new product.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                      Product
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                      Category
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                      Price
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                            {product.image_url ? (
                              <img
                                src={product.image_url}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <Package className="h-5 w-5 text-slate-300" />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="font-bold text-slate-900">
                              {product.name}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              {product.brand || "No brand"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {product.categories?.name || "Uncategorised"}
                      </td>

                      <td className="px-5 py-4 text-sm font-bold text-slate-900">
                        {product.price !== null
                          ? `R${Number(product.price).toFixed(2)}`
                          : "Contact"}
                      </td>

                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => toggleActive(product)}
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
                            product.is_active
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {product.is_active ? (
                            <Eye className="h-3.5 w-3.5" />
                          ) : (
                            <EyeOff className="h-3.5 w-3.5" />
                          )}

                          {product.is_active
                            ? "Active"
                            : "Hidden"}
                        </button>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <Link
                            to={`/admin/products/${product.id}/edit`}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:border-emerald-300 hover:text-emerald-600"
                            aria-label={`Edit ${product.name}`}
                          >
                            <Edit3 className="h-4 w-4" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => deleteProduct(product)}
                            disabled={deleting === product.id}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-red-200 hover:text-red-600 disabled:opacity-50"
                            aria-label={`Delete ${product.name}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}