import { FormEvent, useEffect, useState } from "react";
import {
  Edit3,
  FolderOpen,
  Plus,
  Save,
  Trash2,
  X,
  Eye,
  EyeOff,
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import ImageUpload from "../../components/ImageUpload";

interface Category {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
}

interface CategoryForm {
  name: string;
  description: string;
  image_url: string;
  sort_order: string;
  is_active: boolean;
}

const emptyForm: CategoryForm = {
  name: "",
  description: "",
  image_url: "",
  sort_order: "0",
  is_active: true,
};

export default function Categories() {
  const [categories, setCategories] =
    useState<Category[]>([]);

  const [form, setForm] =
    useState<CategoryForm>(emptyForm);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadCategories = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("categories")
      .select(
        "id, name, description, image_url, sort_order, is_active",
      )
      .order("sort_order", { ascending: true });

    if (!error) {
      setCategories((data ?? []) as Category[]);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const updateField = (
    field: keyof CategoryForm,
    value: string | boolean,
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const startEdit = (category: Category) => {
    setEditingId(category.id);

    setForm({
      name: category.name,
      description: category.description ?? "",
      image_url: category.image_url ?? "",
      sort_order: String(category.sort_order ?? 0),
      is_active: category.is_active,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!form.name.trim()) {
      window.alert("Category name is required.");
      return;
    }

    setSaving(true);

    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      image_url: form.image_url.trim() || null,
      sort_order: Number(form.sort_order) || 0,
      is_active: form.is_active,
    };

    const result = editingId
      ? await supabase
          .from("categories")
          .update(payload)
          .eq("id", editingId)
      : await supabase
          .from("categories")
          .insert(payload);

    if (result.error) {
      window.alert(result.error.message);
      setSaving(false);
      return;
    }

    resetForm();
    await loadCategories();

    setSaving(false);
  };

  const toggleActive = async (category: Category) => {
    const { error } = await supabase
      .from("categories")
      .update({
        is_active: !category.is_active,
      })
      .eq("id", category.id);

    if (!error) {
      setCategories((current) =>
        current.map((item) =>
          item.id === category.id
            ? {
                ...item,
                is_active: !item.is_active,
              }
            : item,
        ),
      );
    }
  };

  const deleteCategory = async (category: Category) => {
    const confirmed = window.confirm(
      `Delete "${category.name}"? Products assigned to this category may prevent deletion.`,
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", category.id);

    if (error) {
      window.alert(error.message);
      return;
    }

    setCategories((current) =>
      current.filter((item) => item.id !== category.id),
    );

    if (editingId === category.id) {
      resetForm();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-emerald-600">
            Catalogue
          </p>

          <h1 className="mt-2 text-3xl font-black text-slate-900">
            Categories
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Create and organise your product categories.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-black text-slate-900">
              {editingId
                ? "Edit Category"
                : "Add New Category"}
            </h2>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-900"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
            )}
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Category Name *
              </label>

              <input
                value={form.name}
                onChange={(event) =>
                  updateField("name", event.target.value)
                }
                required
                placeholder="e.g. Plumbing"
                className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Sort Order
              </label>

              <input
                type="number"
                value={form.sort_order}
                onChange={(event) =>
                  updateField(
                    "sort_order",
                    event.target.value,
                  )
                }
                className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              />
            </div>

            <div className="md:col-span-2">
              <ImageUpload
                value={form.image_url}
                onChange={(url) =>
                  updateField("image_url", url)
                }
                folder="categories"
                label="Category Image"
              />
            </div>

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
                rows={4}
                placeholder="Short description of this category..."
                className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              />
            </div>

            <label className="flex items-center gap-3 md:col-span-2">
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
                  Category is active
                </span>

                <span className="block text-xs text-slate-500">
                  Active categories are visible to customers.
                </span>
              </span>
            </label>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-600 disabled:opacity-60"
            >
              {editingId ? (
                <Save className="h-4 w-4" />
              ) : (
                <Plus className="h-4 w-4" />
              )}

              {saving
                ? "Saving..."
                : editingId
                  ? "Save Changes"
                  : "Add Category"}
            </button>
          </div>
        </form>

        <section className="mt-8">
          <h2 className="text-xl font-black text-slate-900">
            All Categories
          </h2>

          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {loading ? (
              <div className="p-10 text-center text-sm text-slate-500">
                Loading categories...
              </div>
            ) : categories.length === 0 ? (
              <div className="p-10 text-center">
                <FolderOpen className="mx-auto h-10 w-10 text-slate-300" />

                <p className="mt-4 font-bold text-slate-900">
                  No categories yet
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                        {category.image_url ? (
                          <img
                            src={category.image_url}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <FolderOpen className="h-6 w-6 text-slate-300" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold text-slate-900">
                            {category.name}
                          </h3>

                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold ${
                              category.is_active
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {category.is_active ? (
                              <Eye className="h-3 w-3" />
                            ) : (
                              <EyeOff className="h-3 w-3" />
                            )}

                            {category.is_active
                              ? "Active"
                              : "Hidden"}
                          </span>
                        </div>

                        <p className="mt-1 line-clamp-1 text-sm text-slate-500">
                          {category.description ||
                            "No description"}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() => toggleActive(category)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:text-emerald-600"
                      >
                        {category.is_active ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => startEdit(category)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:text-emerald-600"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteCategory(category)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}