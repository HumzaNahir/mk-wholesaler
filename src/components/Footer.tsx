import { Link } from "react-router-dom";
import {
  MapPin,
  Phone,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Business */}
          <div>
            <h2 className="text-xl font-black">
              MK Wholesaler
            </h2>

            <p className="mt-3 max-w-sm text-sm leading-6 text-slate-400">
              Browse our catalogue of hardware, plumbing,
              electrical, tools, paint and other products.
              Contact us on WhatsApp for your enquiry.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400">
              Contact
            </h3>

            <div className="mt-4 space-y-4 text-sm text-slate-300">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />

                <span>
                  65 Beatrice Street
                  <br />
                  Durban 4001
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 shrink-0 text-emerald-400" />

                <span>Contact us for assistance</span>
              </div>

              <div className="flex items-center gap-3">
                <MessageCircle className="h-5 w-5 shrink-0 text-emerald-400" />

                <span>WhatsApp enquiries available</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400">
              Quick Links
            </h3>

            <div className="mt-4 flex flex-col gap-3 text-sm">
              <Link
                to="/"
                className="text-slate-400 transition hover:text-white"
              >
                Home
              </Link>

              <Link
                to="/categories"
                className="text-slate-400 transition hover:text-white"
              >
                Categories
              </Link>

              <Link
                to="/contact"
                className="text-slate-400 transition hover:text-white"
              >
                Contact
              </Link>

              {/* Admin Login */}
              <Link
                to="/admin/login"
                className="mt-2 inline-flex w-fit items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-400 transition hover:border-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-400"
              >
                <ShieldCheck className="h-4 w-4" />
                Admin Login
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 flex flex-col gap-3 border-t border-slate-800 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} MK Wholesaler. All
            rights reserved.
          </p>

          <p>
            Hardware