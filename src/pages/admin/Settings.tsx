import { FormEvent, useEffect, useState } from "react";
import {
  Mail,
  MapPin,
  Phone,
  Save,
  Store,
  MessageCircle,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

interface Settings {
  business_name: string;
  whatsapp_number: string;
  phone_number: string;
  email: string;
  address: string;
}

const emptySettings: Settings = {
  business_name: "",
  whatsapp_number: "",
  phone_number: "",
  email: "",
  address: "",
};

export default function Settings() {
  const [settings, setSettings] =
    useState<Settings>(emptySettings);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);

      const { data, error: loadError } = await supabase
        .from("business_settings")
        .select(
          "business_name, whatsapp_number, phone_number, email, address",
        )
        .eq("id", 1)
        .maybeSingle();

      if (loadError) {
        setError(loadError.message);
      }

      if (data) {
        setSettings({
          business_name: data.business_name ?? "",
          whatsapp_number: data.whatsapp_number ?? "",
          phone_number: data.phone_number ?? "",
          email: data.email ?? "",
          address: data.address ?? "",
        });
      }

      setLoading(false);
    };

    loadSettings();
  }, []);

  const updateField = (
    field: keyof Settings,
    value: string,
  ) => {
    setSettings((current) => ({
      ...current,
      [field]: value,
    }));

    setSaved(false);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setSaving(true);
    setSaved(false);
    setError("");

    const payload = {
      id: 1,
      business_name: settings.business_name.trim(),
      whatsapp_number:
        settings.whatsapp_number.trim() || null,
      phone_number: settings.phone_number.trim() || null,
      email: settings.email.trim() || null,
      address: settings.address.trim() || null,
    };

    const { error: saveError } = await supabase
      .from("business_settings")
      .upsert(payload);

    setSaving(false);

    if (saveError) {
      setError(saveError.message);
      return;
    }

    setSaved(true);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="h-10 w-64 animate-pulse rounded bg-slate-200" />
        <div className="mt-8 h-[500px] animate-pulse rounded-2xl bg-slate-200" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-emerald-600">
            Business
          </p>

          <h1 className="mt-2 text-3xl font-black text-slate-900">
            Settings
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Update the contact information displayed across your
            website.
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

          {saved && (
            <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
              Settings saved successfully.
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Business Name
              </label>

              <div className="relative">
                <Store className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  value={settings.business_name}
                  onChange={(event) =>
                    updateField(
                      "business_name",
                      event.target.value,
                    )
                  }
                  required
                  placeholder="Your business name"
                  className="h-12 w-full rounded-xl border border-slate-200 pl-11 pr-4 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                WhatsApp Number
              </label>

              <div className="relative">
                <MessageCircle className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  type="tel"
                  value={settings.whatsapp_number}
                  onChange={(event) =>
                    updateField(
                      "whatsapp_number",
                      event.target.value,
                    )
                  }
                  placeholder="+27 00 000 0000"
                  className="h-12 w-full rounded-xl border border-slate-200 pl-11 pr-4 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>

              <p className="mt-2 text-xs text-slate-400">
                This number is used for customer WhatsApp enquiries.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Phone Number
              </label>

              <div className="relative">
                <Phone className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  type="tel"
                  value={settings.phone_number}
                  onChange={(event) =>
                    updateField(
                      "phone_number",
                      event.target.value,
                    )
                  }
                  placeholder="+27 00 000 0000"
                  className="h-12 w-full rounded-xl border border-slate-200 pl-11 pr-4 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Email Address
              </label>

              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  type="email"
                  value={settings.email}
                  onChange={(event) =>
                    updateField(
                      "email",
                      event.target.value,
                    )
                  }
                  placeholder="business@example.com"
                  className="h-12 w-full rounded-xl border border-slate-200 pl-11 pr-4 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Business Address
              </label>

              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3 top-4 h-5 w-5 text-slate-400" />

                <textarea
                  value={settings.address}
                  onChange={(event) =>
                    updateField(
                      "address",
                      event.target.value,
                    )
                  }
                  rows={4}
                  placeholder="Enter your business address"
                  className="w-full resize-y rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-slate-200 pt-6">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              <Save className="h-4 w-4" />

              {saving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}