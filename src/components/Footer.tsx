import { Link } from "react-router-dom";
import {
  MapPin,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">

          {/* Business */}
          <div>
            <h2 className="text-xl font-black">
              MK Wholesaler
            </h2>

            <p className="mt-3 max-w-sm text-sm leading-6 text-slate-400">
              Your trusted catalogue for hardware, plumbing,
              tools, electrical products, paint and more.
            </p>
          </div>

          {/* Address */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400">
              Visit Us
            </h3>

            <div className="mt-4 flex items-start gap-3 text-sm text-slate-300">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />

              <span>
                65 Beatrice Street
                <br />
                Durban 4001
              </span>
            </div>

            <div className="mt-4 flex items-center gap-3 text-sm text-slate-300">
              <MessageCircle className="h-5 w-5 text-emerald-400" />
              WhatsApp enquiries available
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400">
              Quick Links
            </h3>

            <div className="mt-4 flex flex-col gap-3">
              <Link
                to="/"
                className="text-sm text-slate-400 hover:text-white"
              >
                Home
              </Link>

              <Link
                to="/categories"
                className="text-sm text-slate-400 hover:text-white"
              >
                Categories
              </Link>

              <Link
                to="/contact"
                className="text-sm text-slate-400 hover:text-white"
              >
                Contact
              </Link>

              {/* ADMIN LOGIN */}
              <Link
                to="/admin/login"
                className="mt-3 inline-flex w-fit items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg transition hover:bg-emerald-500"
              >
                <ShieldCheck className="h-4 w-4" />
                Admin Login
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-800 pt-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} MK Wholesaler. All rights reserved.
        </div>
      </div>
    </footer>
  );
}