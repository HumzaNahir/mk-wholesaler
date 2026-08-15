import { useEffect, useState } from "react";
import {
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ArrowRight,
} from "lucide-react";
import { supabase } from "../lib/supabase";

interface BusinessSettings {
  business_name: string;
  whatsapp_number: string | null;
  phone_number: string | null;
  email: string | null;
  address: string | null;
}

export default function Contact() {
  const [settings, setSettings] =
    useState<BusinessSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      const { data } = await supabase
        .from("business_settings")
        .select(
          "business_name, whatsapp_number, phone_number, email, address",
        )
        .eq("id", 1)
        .maybeSingle();

      setSettings(data);
      setLoading(false);
    };

    loadSettings();
  }, []);

  const whatsappNumber =
    settings?.whatsapp_number?.replace(/\D/g, "");

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <p className="text-sm font-bold uppercase tracking-wider text-emerald-400">
            Get in Touch
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight text-white sm:text-5xl">
            Contact Us
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
            Have a question about a product, availability or delivery?
            Contact us directly and we'll be happy to assist.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-40 animate-pulse rounded-2xl bg-slate-200"
              />
            ))}
          </div>
        ) : (
          <>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {whatsappNumber && (
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <MessageCircle className="h-6 w-6" />
                  </div>

                  <h2 className="mt-5 font-bold text-slate-900">
                    WhatsApp
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Chat with us directly
                  </p>

                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-emerald-600">
                    Message Us
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </span>
                </a>
              )}

              {settings?.phone_number && (
                <a
                  href={`tel:${settings.phone_number}`}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                    <Phone className="h-6 w-6" />
                  </div>

                  <h2 className="mt-5 font-bold text-slate-900">
                    Phone
                  </h2>

                  <p className="mt-1 break-all text-sm text-slate-500">
                    {settings.phone_number}
                  </p>

                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-slate-700">
                    Call Us
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </span>
                </a>
              )}

              {settings?.email && (
                <a
                  href={`mailto:${settings.email}`}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                    <Mail className="h-6 w-6" />
                  </div>

                  <h2 className="mt-5 font-bold text-slate-900">
                    Email
                  </h2>

                  <p className="mt-1 break-all text-sm text-slate-500">
                    {settings.email}
                  </p>

                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-slate-700">
                    Email Us
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </span>
                </a>
              )}

              {settings?.address && (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                    <MapPin className="h-6 w-6" />
                  </div>

                  <h2 className="mt-5 font-bold text-slate-900">
                    Visit Us
                  </h2>

                  <p className="mt-1 text-sm leading-5 text-slate-500">
                    {settings.address}
                  </p>
                </div>
              )}
            </div>

            <section className="mt-10 overflow-hidden rounded-3xl bg-slate-900">
              <div className="grid items-center gap-8 p-8 sm:p-10 lg:grid-cols-2 lg:p-14">
                <div>
                  <p className="text-sm font-bold uppercase tracking-wider text-emerald-400">
                    Need Help?
                  </p>

                  <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
                    Looking for a specific product?
                  </h2>

                  <p className="mt-4 text-sm leading-6 text-slate-300">
                    Browse our catalogue and add the products you need
                    to your enquiry list. You can then send the complete
                    enquiry to us on WhatsApp.
                  </p>
                </div>

                <div className="lg:flex lg:justify-end">
                  <a
                    href="/categories"
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-emerald-600"
                  >
                    Browse Products
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}