import { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Leaf, Moon, Sun, Heart, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext.jsx';
import { useShop } from '../context/ShopContext.jsx';

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium tracking-wide transition-colors ${
    isActive ? 'text-leaf' : 'text-neutral-600 hover:text-leaf dark:text-neutral-300'
  }`;

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { totals, cart, user, isAdmin, logout } = useShop();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-amber-100/60 bg-[color:var(--bg-soft)]/80 backdrop-blur-xl dark:border-emerald-900/50">
      <div className="container-page flex items-center justify-between py-3">
        <Link to="/" className="flex items-center gap-2">
          <motion.div
            initial={{ rotate: -12, scale: 0.9 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-leaf to-turmeric shadow-soft"
          >
            <Leaf className="h-5 w-5 text-sand" />
          </motion.div>
          <div className="leading-tight">
            <span className="block font-display text-base font-semibold tracking-[0.18em] text-neutral-900 dark:text-sand">
              PRKRITI
            </span>
            <span className="block text-[11px] uppercase tracking-[0.28em] text-neutral-500 dark:text-neutral-400">
              ORGANIC POWDERS
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/products" className={navLinkClass}>
            Powders
          </NavLink>
          <NavLink to="/about" className={navLinkClass}>
            Benefits
          </NavLink>
          {user && !isAdmin && (
            <NavLink to="/orders" className={navLinkClass}>
              My orders
            </NavLink>
          )}
          {isAdmin && (
            <>
              <NavLink to="/admin" end className={navLinkClass}>
                Admin
              </NavLink>
              <NavLink to="/admin/payments" className={navLinkClass}>
                Payments
              </NavLink>
            </>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="mr-1 inline-flex h-9 w-9 items-center justify-center rounded-full border border-amber-200/70 bg-amber-50/50 text-amber-700 shadow-sm transition hover:border-amber-300 hover:bg-amber-100/80 dark:border-emerald-700/70 dark:bg-emerald-950/70 dark:text-emerald-100"
          >
            {theme === 'light' ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-amber-200/70 bg-white/80 text-neutral-800 shadow-sm transition hover:border-amber-300 hover:bg-amber-50 md:hidden dark:border-emerald-800 dark:bg-slate-900 dark:text-neutral-200 dark:hover:border-emerald-500 dark:hover:bg-emerald-900/50"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>

          {user ? (
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="hidden h-9 items-center gap-2 rounded-full border border-amber-200/70 bg-white/80 px-3 text-xs font-medium uppercase tracking-[0.16em] text-neutral-700 transition hover:border-amber-300 hover:bg-amber-50 md:inline-flex dark:border-emerald-800 dark:bg-slate-900 dark:text-neutral-200 dark:hover:border-emerald-500 dark:hover:bg-emerald-900/50"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-semibold text-emerald-800 dark:bg-emerald-900/70 dark:text-emerald-100">
                {(user.name || user.email || '?')
                  .split(' ')
                  .map((p) => p[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </span>
              <span className="max-w-[120px] truncate text-[11px]">
                {user.name || user.email}
              </span>
              <span className="text-[10px] opacity-80">Profile</span>
            </button>
          ) : (
            <Link
              to="/login"
              className="hidden h-9 items-center gap-2 rounded-full border border-amber-200/70 bg-white/80 px-3 text-xs font-medium uppercase tracking-[0.16em] text-neutral-700 transition hover:border-amber-300 hover:bg-amber-50 md:inline-flex dark:border-emerald-800 dark:bg-slate-900 dark:text-neutral-200 dark:hover:border-emerald-500 dark:hover:bg-emerald-900/50"
            >
              <span>Login</span>
            </Link>
          )}

          <Link
            to="/wishlist"
            className="hidden h-9 items-center gap-1 rounded-full border border-transparent px-3 text-xs font-medium uppercase tracking-[0.16em] text-neutral-600 transition hover:border-rose-200/60 hover:bg-rose-50/70 md:inline-flex dark:text-neutral-200 dark:hover:border-rose-500/60 dark:hover:bg-rose-950/40"
          >
            <Heart className="h-4 w-4" />
            Wishlist
          </Link>

          <Link
            to="/cart"
            className="relative inline-flex items-center gap-2 rounded-full bg-neutral-900 px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-sand shadow-soft transition hover:bg-neutral-800 dark:bg-emerald-500 dark:text-emerald-50 dark:hover:bg-emerald-400"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Cart</span>
            {totals.itemsCount > 0 && (
              <motion.span
                key={location.pathname + cart.length}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-turmeric text-[11px] text-neutral-900"
              >
                {totals.itemsCount}
              </motion.span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-amber-100/70 bg-[color:var(--bg-soft)]/95 pb-3 pt-2 shadow-sm dark:border-emerald-900/60 dark:bg-black/70 md:hidden">
          <div className="container-page flex flex-col gap-2 text-sm">
            <NavLink
              to="/"
              className={navLinkClass}
              onClick={() => setMobileOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/products"
              className={navLinkClass}
              onClick={() => setMobileOpen(false)}
            >
              Powders
            </NavLink>
            <NavLink
              to="/about"
              className={navLinkClass}
              onClick={() => setMobileOpen(false)}
            >
              Benefits
            </NavLink>
            {user && !isAdmin && (
              <NavLink
                to="/orders"
                className={navLinkClass}
                onClick={() => setMobileOpen(false)}
              >
                My orders
              </NavLink>
            )}
            {isAdmin && (
              <>
                <NavLink
                  to="/admin"
                  end
                  className={navLinkClass}
                  onClick={() => setMobileOpen(false)}
                >
                  Admin
                </NavLink>
                <NavLink
                  to="/admin/payments"
                  className={navLinkClass}
                  onClick={() => setMobileOpen(false)}
                >
                  Payments
                </NavLink>
              </>
            )}

            <div className="mt-2 flex items-center justify-between">
              <Link
                to="/wishlist"
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center gap-1 text-xs font-medium uppercase tracking-[0.16em] text-neutral-600 dark:text-neutral-200"
              >
                <Heart className="h-4 w-4" />
                Wishlist
              </Link>
              {user ? (
                <Link
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-700 underline underline-offset-4 dark:text-neutral-200"
                >
                  Profile
                </Link>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-700 underline underline-offset-4 dark:text-neutral-200"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

