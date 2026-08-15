import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";

interface FooterProps {
  businessName?: string;
  whatsappNumber?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
}

export default function Footer({
  businessName = "Hardware Catalogue",
  whatsappNumber,
  phoneNumber,
  email,
  address,
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  const cleanWhatsAppNumber = whatsappNumber?.replace(/\D/g, "");

  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Business */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-950">
                <span className="text-lg font-black">H</span>
              </div>

              <span className="text-xl font-extrabold tracking-tight">
                {businessName}
              </span>
            </Link>

            <p className="mt-5 max-w-md text-sm leading-6 text-slate-400">
              Browse our range of hardware, tools, plumbing, electrical
              supplies, paint and more. Build your enquiry list and contact us
              directly on WhatsApp.
            </p>

            {cleanWhatsAppNumber && (
              <a
                href={`https://wa.me/${cleanWhatsAppNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp Us
              </a>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Quick Links
            </h3>

            <nav className="mt-5 space-y-3">
              <Link
                to="/"
                className="block text-sm text-slate-400 transition hover:text-white"
              >
                Home
              </Link>

              <Link
                to="/categories"
                className="block text-sm text-slate-400 transition hover:text-white"
              >
                Categories
              </Link>

              <Link
                to="/cart"
                className="block text-sm text-slate-400 transition hover:text-white"
              >
                My Enquiry
              </Link>

              <Link
                to="/contact"
                className="block text-sm text-slate-400 transition hover:text-white"
              >
                Contact
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Contact
            </h3>

            <div className="mt-5 space-y-4">
              {address && (
                <div className="flex gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  <span className="text-sm leading-5 text-slate-400">
                    {address}
                  </span>
                </div>
              )}

              {phoneNumber && (
                <a
                  href={`tel:${phoneNumber}`}
                  className="flex gap-3 text-sm text-slate-400 transition hover:text-white"
                >
                  <Phone className="h-4 w-4 shrink-0 text-emerald-400" />
                  <span>{phoneNumber}</span>
                </a>
              )}

              {email && (
                <a
                  href={`mailto:${email}`}
                  className="flex gap-3 break-all text-sm text-slate-400 transition hover:text-white"
                >
                  <Mail className="h-4 w-4 shrink-0 text-emerald-400" />
                  <span>{email}</span>
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-6">
          <div className="flex flex-col gap-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {currentYear} {businessName}. All rights reserved.
            </p>

            <p>Quality products. Reliable service.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}