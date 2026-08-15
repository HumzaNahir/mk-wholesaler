import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  MessageCircle,
  ShieldCheck,
  Truck,
  Wrench,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import CategoryCard, {
  CategoryCardData,
} from "../components/CategoryCard";
import ProductCard, {
  ProductCardData,
} from "../components/ProductCard";
import LoadingSkeleton from "../components/LoadingSkeleton";
import EmptyState from "../components/EmptyState";
import { useCart } from "../hooks/useCart";

interface BusinessSettings {
  business_name: string;
  whatsapp_number: string | null;
  address: string | null;
}

export default function Home() {
  const [categories, setCategories] = useState<CategoryCardData[]>([]);
  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();

  useEffect(() => {
    const loadHomeData = async () => {
      setLoading(true);

      const [categoriesResult, productsResult, settingsResult] =
        await Promise.all([
          supabase
            .from("categories")
            .select("id, name, description, image_url")
            .eq("is_active", true)
            .order("sort_order", { ascending: true })
            .limit(8),

          supabase
            .from("products")
            .select(
              "id, name, description, sku, brand, price, unit, image_url",
            )
            .eq("is_active", true)
            .order("created_at", { ascending: false })
            .limit(8),

          supabase
            .from("business_settings")
            .select("business_name, whatsapp_number, address")
            .eq("id", 1)
            .maybeSingle(),
        ]);

      if (!categoriesResult.error) {
        setCategories(categoriesResult.data ?? []);
      }

      if (!productsResult.error) {
        setProducts(productsResult.data ?? []);
      }

      if (!settingsResult.error) {
        setSettings(settingsResult.data);
      }

      setLoading(false);
    };

    loadHomeData();
  }, []);

  const whatsappNumber = settings?.whatsapp_number?.replace(/\D/g, "");

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.18),_transparent_35%)]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-2 lg:px-8">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-emerald-300">
              <ShieldCheck className="h-4 w-4" />
              Quality products. Reliable service.
            </div>

            <h1 className="max-w-3xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              Everything You Need.
              <span className="block text-emerald-400">
                All in One Place.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
              Browse our range of hardware, tools, plumbing, paint,
              electrical supplies and more. Build your enquiry list and
              contact us directly on WhatsApp.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/categories"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-emerald-600"
              >
                Browse Products
                <ArrowRight className="h-4 w-4" />
              </Link>

              {whatsappNumber && (
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  <MessageCircle className="h-4 w-4" />
                  Contact Us
                </a>
              )}
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="relative mx-auto max-w-md">
              <div className="absolute -inset-6 rounded-[2rem] bg-emerald-500/10 blur-2xl" />

              <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur">
                <Wrench className="h-20 w-20 text-emerald-400" />

                <h2 className="mt-8 text-2xl font-black text-white">
                  Hardware & More
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Find the products you need quickly and conveniently.
                </p>

                <div className="mt-8 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-white/5 p-4">
                    <p className="text-2xl font-black text-white">700+</p>
                    <p className="mt-1 text-xs text-slate-400">
                      Products
                    </p>
                  </div>

                  <div className="rounded-xl bg-white/5 p-4">
                    <p className="text-2xl font-black text-white">Easy</p>
                    <p className="mt-1 text-xs text-slate-400">
                      WhatsApp Enquiries
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-slate-100 bg-slate-50">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 py-8 sm:px-6 md:grid-cols-3 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
              <Wrench className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">
                Wide Product Range
              </p>
              <p className="text-xs text-slate-500">
                Hardware, tools and more
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
              <MessageCircle className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">
                Easy Enquiries
              </p>
              <p className="text-xs text-slate-500">
                Contact us directly on WhatsApp
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
              <Truck className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">
                Delivery Available
              </p>
              <p className="text-xs text-slate-500">
                Discuss delivery with us
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-emerald-600">
              Explore
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
              Shop by Category
            </h2>
          </div>

          <Link
            to="/categories"
            className="hidden items-center gap-1 text-sm font-bold text-slate-600 transition hover:text-emerald-600 sm:flex"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8">
          {loading ? (
            <LoadingSkeleton type="category" count={4} />
          ) : categories.length === 0 ? (
            <EmptyState type="categories" />
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          )}
        </div>

        <Link
          to="/categories"
          className="mt-6 flex items-center justify-center gap-2 text-sm font-bold text-emerald-600 sm:hidden"
        >
          View all categories
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      {/* Products */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-emerald-600">
                Featured
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                Latest Products
              </h2>
            </div>

            <Link
              to="/categories"
              className="hidden items-center gap-1 text-sm font-bold text-slate-600 transition hover:text-emerald-600 sm:flex"
            >
              Browse all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8">
            {loading ? (
              <LoadingSkeleton type="product" count={8} />
            ) : products.length === 0 ? (
              <EmptyState type="products" />
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={addToCart}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}