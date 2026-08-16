import {
  FormEvent,
  useEffect,
  useState,
} from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Trash2,
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import ImageUpload from "../../components/ImageUpload";

interface Category {
  id: string;
  name: string;
}

interface ProductFormData {
  name: string;
  description: string;
  brand: string;
  price: string;
  unit: string;
  category_id: string;
  image_url: string;
  is_active: boolean;
}

const emptyForm: ProductFormData = {
  name: "",
  description: "",
  brand: "",
  price: "",
  unit: "",
  category_id: "",
  image_url: "",
  is_active: true,
};

export default function ProductForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const editing = Boolean(id);

  const [form, setForm] =
    useState<ProductFormData>(emptyForm);

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const categoriesPromise = supabase
        .from("categories")
        .select("id, name")
        .order("sort_order", {
          ascending: true,
        });

      if (!editing || !id) {
        const { data } = await categoriesPromise;

        setCategories(data ?? []);
        return;
      }

      setLoading(true);

      const [categoriesResult, productResult] =
        await Promise.all([
          categoriesPromise,

          supabase
            .from("products")
            .select(
              "name, description, brand, price, unit, category_id, image_url, is_active",
            )
            .eq("id", id)
            .maybeSingle(),
        ]);

      setCategories(categoriesResult.data ?? []);

      if (productResult.data) {
        const product = productResult.data;

        setForm({
          name: product.name ?? "",
          description: product.description ?? "",
          brand: product.brand ?? "",
          price:
            product.price !== null &&
            product.price !== undefined
              ? String(product.price)
              : "",
          unit: product.unit ?? "",
          category_id: product.category_id ?? "",
          image_url: product.image_url ?? "",
          is_active: product.is_active ?? true,
        });
      }

      setLoading(false);
    };

    loadData();
  }, [editing, id]);

  const updateField = (
    field: keyof ProductFormData,
    value: string | boolean,
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setError("");

    if (!form.name.trim()) {
      setError("Product name is required.");
      return;
    }

    if (!form.category_id) {
      setError("Please select a category.");
      return;
    }

    if (
      form.price.trim() !== "" &&
      (Number.isNaN(Number(form.price)) ||
        Number(form.price) < 0)
    ) {
      setError("Please enter a valid price.");
      return;
    }

    setSaving(true);

    const payload = {
      name: form.name.trim(),
      description:
        form.description.trim() || null,
      brand: form.brand.trim() || null,
      price:
        form.price.trim() === ""
          ? null
          : Number(form.price),
      unit: form.unit.trim() || null,
      category_id: form.category_id,
      image_url: form.image_url.trim() || null,
      is_active: form.is_active,
    };

    const result =
      editing && id
        ? await supabase
            .from("products")
            .update(payload)
            .eq("id", id)
        : await supabase
            .from("products")
            .insert(payload);

    if (result.error) {
      setError(result.error.message);
      setSaving(false);
      return;
    }

    navigate("/admin/products");
  };

  const handleDelete = async () => {
    if (!id) return;

    const confirmed = window.confirm(
      "Delete this product permanently?",
    );

    if (!confirmed) return;

    setSaving(true);

    const { error: deleteError } =
      await supabase
        .from("products")
        .delete()
        .eq("id", id);

    if (deleteError) {
      setError(deleteError.message);
      setSaving(false);
      return;
    }

    navigate("/admin/products");
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="h-10 w-64 animate-pulse rounded bg-slate-200" />

        <div className="mt-8 h-[600px] animate-pulse rounded-2xl bg-slate-200" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">

        <Link
          to="/admin/products"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Link>

        <div className="mt-7">
          <h1 className="text-3xl font-black text-slate-900">
            {editing
              ? "Edit Product"
              : "Add Product"}
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            {editing
              ? "Update the product information."
              : "Add a new product to your catalogue."}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        >
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">

            {/* Product name */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Product Name *
              </label>

              <input
                value={form.name}
                onChange={(event) =>
                  updateField(
                    "name",
                    event.target.value,
                  )
                }
                required
                placeholder="e.g. PVC Elbow 20mm"
                className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              />
            </div>

            {/* Category */}
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Category *
              </label>

              <select
                value={form.category_id}
                onChange={(event) =>
                  updateField(
                    "category_id",
                    event.target.value,
                  )
                }
                required
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              >
                <option value="">
                  Select category
                </option>

                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Brand */}
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Brand
              </label>

              <input
                value={form.brand}
                onChange={(event) =>
                  updateField(
                    "brand",
                    event.target.value,
                  )
                }
                placeholder="Optional brand"
                className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              />
            </div>

            {/* Price */}
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Price (R)
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(event) =>
                  updateField(
                    "price",
                    event.target.value,
                  )
                }
                placeholder="e.g. 49.99"
                className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              />
            </div>

            {/* Unit */}
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Unit
              </label>

              <input
                value={form.unit}
                onChange={(event) =>
                  updateField(
                    "unit",
                    event.target.value,
                  )
                }
                placeholder="piece, box, litre, etc."
                className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              />
            </div>

            {/* IMAGE UPLOAD */}
            <div className="md:col-span-2">
              <ImageUpload
                value={form.image_url}
                onChange={(url) =>
                  updateField(
                    "image_url",
                    url,
                  )
                }
                folder="products"
                label="Product Image"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Description
              </label>

              <textarea
                value={form.description}
                onChange={(event) =>
                  updateField(
                    "description",
                    event.target.value,
                  )
                }
                rows={6}
                placeholder="Describe the product..."
                className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              />
            </div>

            {/* Active */}
            <label className="flex cursor-pointer items-center gap-3 md:col-span-2">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(event) =>
                  updateField(
                    "is_active",
                    event.target.checked,
                  )
                }
                className="h-5 w-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />

              <span>
                <span className="block text-sm font-bold text-slate-900">
                  Product is active
                </span>

                <span className="block text-xs text-slate-500">
                  Active products are visible to customers.
                </span>
              </span>
            </label>
          </div>

          {/* Buttons */}
          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-between">

            {editing ? (
              <button
                type="button"
                onClick={handleDelete}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-5 py-3 text-sm font-bold text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
                Delete Product
              </button>
            ) : (
              <div />
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/admin/products"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save className="h-4 w-4" />

                {saving
                  ? "Saving..."
                  : editing
                    ? "Save Changes"
                    : "Create Product"}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}