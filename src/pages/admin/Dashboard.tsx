import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  FolderOpen,
  Settings,
  Plus,
  ArrowRight,
  LogOut,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

interface Stats {
  products: number;
  categories: number;
  activeProducts: number;
  activeCategories: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    products: 0,
    categories: 0,
    activeProducts: 0,
    activeCategories: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);

      const [
        productsResult,
        categoriesResult,
        activeProductsResult,
        activeCategoriesResult,
      ] = await Promise.all([
        supabase
          .from("products")
          .select("id", { count: "exact", head: true }),

        supabase
          .from("categories")
          .select("id", { count: "exact", head: true }),

        supabase
          .from("products")
          .select("id", { count: "exact", head: true })
          .eq("is_active", true),

        supabase
          .from("categories")
          .select("id", { count: "exact", head: true })
          .eq("is_active", true),
      ]);

      setStats({
        products: productsResult.count ?? 0,
        categories: categoriesResult.count ?? 0,
        activeProducts: activeProductsResult.count ?? 0,
        activeCategories: activeCategoriesResult.count ?? 0,
      });

      setLoading(false);
    };

    loadStats();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  };

  const statCards = [
    {
      title: "Total Products",
      value: stats.products,
      active: stats.activeProducts,
      icon: Package,
      href: "/admin/products",
    },
    {
      title: "Total Categories",
      value: stats.categories,
      active: stats.activeCategories,
      icon: FolderOpen,
      href: "/admin/categories",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-emerald-600">
              Administration
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Dashboard
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Manage your catalogue and business settings.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-red-200 hover:text-red-600"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {statCards.map((card) => {
            const Icon = card.icon;

            return (
              <Link
                key={card.title}
                to={card.href}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <Icon className="h-6 w-6" />
                  </div>

                  <ArrowRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-emerald-500" />
                </div>

                <p className="mt-6 text-sm font-semibold text-slate-500">
                  {card.title}
                </p>

                <p className="mt-1 text-4xl font-black text-slate-900">
                  {loading ? "—" : card.value}
                </p>

                <p className="mt-2 text-xs font-semibold text-emerald-600">
                  {loading ? "Loading..." : `${card.active} active`}
                </p>
              </Link>
            );
          })}
        </div>

        <section className="mt-8">
          <h2 className="text-xl font-black text-slate-900">
            Quick Actions
          </h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <Link
              to="/admin/products/new"
              className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-300 hover:shadow-md"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Plus className="h-5 w-5" />
              </div>

              <div>
                <p className="font-bold text-slate-900">
                  Add Product
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Create a new catalogue item
                </p>
              </div>
            </Link>

            <Link
              to="/admin/categories"
              className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-300 hover:shadow-md"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                <FolderOpen className="h-5 w-5" />
              </div>

              <div>
                <p className="font-bold text-slate-900">
                  Categories
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Organise your catalogue
                </p>
              </div>
            </Link>

            <Link
              to="/admin/settings"
              className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-300 hover:shadow-md"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                <Settings className="h-5 w-5" />
              </div>

              <div>
                <p className="font-bold text-slate-900">
                  Settings
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Business contact details
                </p>
              </div>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}