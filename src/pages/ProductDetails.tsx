import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  MessageCircle,
  Package,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { useCart } from "../hooks/useCart";
import QuantitySelector from "../components/QuantitySelector";
import ProductCard, {
  ProductCardData,
} from "../components/ProductCard";
import LoadingSkeleton from "../components/LoadingSkeleton";
import EmptyState from "../components/EmptyState";

interface Product extends ProductCardData {
  category_id: string;
}

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<
    ProductCardData[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const { addToCart } = useCart();

  useEffect(() => {
    if (!id) return;

    const loadProduct = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("products")
        .select(
          "id, category_id, name, description, sku, brand, price, unit, image_url",
        )
        .eq("id", id)
        .eq("is_active", true)
        .maybeSingle();

      if (!error && data) {
        setProduct(data);

        const { data: related } = await supabase
          .from("products")
          .select(
            "id, name, description, sku, brand, price, unit, image_url",
          )
          .eq("category_id", data.category_id)
          .eq("is_active", true)
          .neq("id", data.id)
          .limit(4);

        setRelatedProducts(related ?? []);
      } else {
        setProduct(null);
      }

      setLoading(false);
    };

    loadProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;

    addToCart(product, quantity);
    setAdded(true);

    window.setTimeout(() => {
      setAdded(false);
    }, 2500);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-3xl bg-slate-200" />
          <div className="space-y-5">
            <div className="h-5 w-24 animate-pulse rounded bg-slate-200" />
            <div className="h-12 w-3/4 animate-pulse rounded bg-slate-200" />
            <div className="h-6 w-1/3 animate-pulse rounded bg-slate-200" />
            <div className="h-24 w-full animate-pulse rounded bg-slate-200" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-2xl">
          <EmptyState
            title="Product not found"
            message="This product may have been removed or is no longer available."
            actionLabel="Browse Categories"
            actionHref="/categories"
          />
        </div>
      </div>
    );
  }

  const hasPrice =
    product.price !== null &&
    product.price !== undefined &&
    !Number.isNaN(Number(product.price));

  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          to="/categories"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Categories
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Image */}
          <div className="overflow-hidden rounded-3xl bg-slate-100">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="aspect-square h-full w-full object-cover"
              />
            ) : (
              <div className="flex aspect-square w-full flex-col items-center justify-center gap-3 text-slate-400">
                <Package className="h-20 w-20" />
                <span className="text-sm font-semibold">
                  No image available
                </span>
              </div>
            )}
          </div>

          {/* Information */}
          <div className="flex flex-col justify-center">
            {product.brand && (
              <p className="text-sm font-bold uppercase tracking-wider text-emerald-600">
                {product.brand}
              </p>
            )}

            <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              {product.name}
            </h1>

            {product.sku && (
              <p className="mt-3 text-xs font-medium uppercase tracking-wide text-slate-400">
                SKU: {product.sku}
              </p>
            )}

            <div className="mt-7 border-y border-slate-200 py-6">
              {hasPrice ? (
                <div>
                  <span className="text-3xl font-black text-slate-900">
                    R{Number(product.price).toFixed(2)}
                  </span>

                  {product.unit && (
                    <span className="ml-2 text-sm text-slate-500">
                      per {product.unit}
                    </span>
                  )}
                </div>
              ) : (
                <p className="text-xl font-bold text-emerald-700">
                  Contact for price
                </p>
              )}
            </div>

            {product.description && (
              <div className="mt-6">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                  Description
                </h2>

                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
                  {product.description}
                </p>
              </div>
            )}

            <div className="mt-8">
              <p className="mb-3 text-sm font-bold text-slate-900">
                Quantity
              </p>

              <QuantitySelector
                quantity={quantity}
                onChange={setQuantity}
              />
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 text-sm font-bold text-white shadow-sm transition ${
                added
                  ? "bg-emerald-700"
                  : "bg-slate-900 hover:bg-emerald-600"
              }`}
            >
              {added ? (
                <>
                  <CheckCircle2 className="h-5 w-5" />
                  Added to Enquiry
                </>
              ) : (
                <>
                  <MessageCircle className="h-5 w-5" />
                  Add to WhatsApp Enquiry
                </>
              )}
            </button>

            <p className="mt-3 text-center text-xs text-slate-400">
              Add this product to your enquiry list, then contact us on
              WhatsApp.
            </p>
          </div>
        </div>

        {/* Related */}
        {relatedProducts.length > 0 && (
          <section className="mt-20 border-t border-slate-200 pt-12">
            <h2 className="text-2xl font-black text-slate-900">
              You May Also Like
            </h2>

            <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}