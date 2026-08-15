import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Search, ShoppingBag, MessageCircle } from "lucide-react";

interface HeaderProps {
  businessName?: string;
  cartCount?: number;
}

export default function Header({
  businessName = "Hardware Catalogue",
  cartCount = 0,
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Categories", path: "/categories" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-8">
        {/* Logo / Business Name */}
        <Link
          to="/"
          className="flex min-w-0 items-center gap-3"
          onClick={() => setMenuOpen(false)}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
            <span className="text-lg font-black">H</span>
          </div>

          <div className="min-w-0">
            <p className="truncate text-base font-extrabold tracking-tight text-slate-900 sm:text-lg">
              {businessName}
            </p>
            <p className="hidden text-xs font-medium text-slate-500 sm:block">
              Hardware • Tools • Electrical
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm font-semibold transition-colors ${
                isActive(item.path)
                  ? "text-slate-900"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2 md:flex">
          <Link
            to="/categories"
            aria-label="Search products"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <Search className="h-5 w-5" />
          </Link>

          <Link
            to="/cart"
            aria-label={`Enquiry cart${cartCount > 0 ? `, ${cartCount} items` : ""}`}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <ShoppingBag className="h-5 w-5" />

            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-600 px-1 text-[10px] font-bold text-white">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          <Link
            to="/contact"
            className="ml-1 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 active:scale-[0.98]"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </Link>
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-1 md:hidden">
          <Link
            to="/cart"
            aria-label="Enquiry cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-700"
          >
            <ShoppingBag className="h-5 w-5" />

            {cartCount > 0 && (
              <span className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-600 px-1 text-[10px] font-bold text-white">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((previous) => !previous)}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-700 transition hover:bg-slate-100"
          >
            {menuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <nav className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className={`block rounded-xl px-4 py-3 text-sm font-semibold ${
                  isActive(item.path)
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {item.name}
              </Link>
            ))}

            <Link
              to="/categories"
              onClick={() => setMenuOpen(false)}
              className="mt-2 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              <Search className="h-4 w-4" />
              Search Products
            </Link>

            <Link
              to="/contact"
              onClick={() => setMenuOpen(false)}
              className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}