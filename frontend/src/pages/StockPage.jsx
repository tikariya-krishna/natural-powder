import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, AlertTriangle, CheckCircle2, Search } from 'lucide-react';
import { api } from '../services/api.js';
import { useShop } from '../context/ShopContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const StockPage = () => {
  const { user, isAdmin } = useShop();
  const { addToast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!user || !isAdmin) return;
    setLoading(true);
    api
      .get('/products')
      .then((res) => setProducts(res.data || []))
      .catch(() => {
        addToast({
          variant: 'error',
          title: 'Stock not loaded',
          message: 'Could not load stock data. Please refresh or try again later.',
        });
      })
      .finally(() => setLoading(false));
  }, [user, isAdmin, addToast]);

  if (!user || !isAdmin) {
    return (
      <div className="container-page py-16 text-center text-xs text-neutral-600 dark:text-neutral-300">
        Admin access only. Ensure you are logged in with an admin account.
      </div>
    );
  }

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (products || [])
      .map((p) => ({
        ...p,
        stock:
          typeof p.stock === 'number'
            ? p.stock
            : Number(p.stock || 0),
      }))
      .filter((p) =>
        term ? (p.name || '').toLowerCase().includes(term) || (p.category || '').toLowerCase().includes(term) : true
      )
      .sort((a, b) => (a.stock ?? 0) - (b.stock ?? 0));
  }, [products, search]);

  const summary = useMemo(() => {
    const totalSkus = products.length;
    let totalUnits = 0;
    let low = 0;
    let out = 0;
    (products || []).forEach((p) => {
      const s = typeof p.stock === 'number' ? p.stock : Number(p.stock || 0);
      totalUnits += s > 0 ? s : 0;
      if (s <= 0) out += 1;
      else if (s <= 5) low += 1;
    });
    return { totalSkus, totalUnits, low, out };
  }, [products]);

  return (
    <div className="container-page space-y-8">
      <div className="flex flex-col gap-2 pt-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-2xl text-neutral-900 md:text-3xl dark:text-sand">
            Stock overview
          </h1>
          <p className="mt-1 text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
            Track available packs for each powder and quickly spot low or out-of-stock items.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="flex items-center gap-3 rounded-2xl border border-amber-100/80 bg-white/90 p-4 text-xs shadow-soft dark:border-emerald-900/70 dark:bg-slate-950/90">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-50 text-amber-700 dark:bg-emerald-950/70 dark:text-emerald-300">
            <Package className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-500 dark:text-neutral-400">
              Total SKUs
            </p>
            <p className="mt-1 text-base font-semibold text-neutral-900 dark:text-sand">
              {summary.totalSkus}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-100/80 bg-white/90 p-4 text-xs shadow-soft dark:border-emerald-900/70 dark:bg-slate-950/90">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300">
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-500 dark:text-neutral-400">
              Total units in stock
            </p>
            <p className="mt-1 text-base font-semibold text-neutral-900 dark:text-sand">
              {summary.totalUnits}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-amber-100/80 bg-white/90 p-4 text-xs shadow-soft dark:border-emerald-900/70 dark:bg-slate-950/90">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950/70 dark:text-rose-300">
            <AlertTriangle className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-500 dark:text-neutral-400">
              Low / out of stock
            </p>
            <p className="mt-1 text-base font-semibold text-neutral-900 dark:text-sand">
              {summary.low} low · {summary.out} out
            </p>
          </div>
        </div>
      </div>

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-4 rounded-3xl border border-amber-100/80 bg-white/90 p-4 text-xs shadow-soft dark:border-emerald-900/70 dark:bg-slate-950/90"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-neutral-500 dark:text-neutral-400">
            Current stock
          </p>
          <div className="relative w-full max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or category…"
              className="h-9 w-full rounded-full border border-amber-100 bg-amber-50/70 pl-9 pr-3 text-xs outline-none focus:border-amber-300 focus:bg-white focus:ring-1 focus:ring-amber-300 dark:border-emerald-800 dark:bg-slate-900 dark:text-sand dark:focus:border-emerald-500 dark:focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-[11px]">
            <thead className="border-b border-amber-100/80 text-neutral-500 dark:border-emerald-900/70 dark:text-neutral-400">
              <tr>
                <th className="py-2 pr-4">Product</th>
                <th className="py-2 pr-4">Category</th>
                <th className="py-2 pr-4 text-right">Price (₹)</th>
                <th className="py-2 pr-4 text-right">Stock</th>
                <th className="py-2 pr-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="py-6 text-center text-neutral-500 dark:text-neutral-300" colSpan={5}>
                    Loading stock…
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td className="py-6 text-center text-neutral-500 dark:text-neutral-300" colSpan={5}>
                    No powders found for this search.
                  </td>
                </tr>
              ) : (
                rows.map((p) => {
                  const stock = p.stock ?? 0;
                  let status = 'Healthy';
                  let badgeClass =
                    'inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-200';
                  if (stock <= 0) {
                    status = 'Out of stock';
                    badgeClass =
                      'inline-flex items-center rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-700 dark:bg-rose-950/70 dark:text-rose-200';
                  } else if (stock <= 5) {
                    status = 'Low';
                    badgeClass =
                      'inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-800 dark:bg-amber-900/60 dark:text-amber-200';
                  }
                  return (
                    <tr key={p._id} className="border-b border-amber-50/80 last:border-0 dark:border-emerald-900/40">
                      <td className="py-2 pr-4">
                        <div className="max-w-[220px] truncate font-medium text-neutral-900 dark:text-sand">
                          {p.name}
                        </div>
                      </td>
                      <td className="py-2 pr-4 text-neutral-600 dark:text-neutral-300">
                        {p.category || '—'}
                      </td>
                      <td className="py-2 pr-4 text-right text-neutral-700 dark:text-neutral-200">
                        {p.price?.toFixed ? p.price.toFixed(0) : p.price ?? '—'}
                      </td>
                      <td className="py-2 pr-4 text-right text-neutral-800 dark:text-neutral-100">
                        {stock}
                      </td>
                      <td className="py-2 pr-2 text-right">
                        <span className={badgeClass}>{status}</span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </motion.section>
    </div>
  );
};

export default StockPage;

