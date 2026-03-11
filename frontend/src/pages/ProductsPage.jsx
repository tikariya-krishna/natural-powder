import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal } from 'lucide-react';
import { api } from '../services/api.js';
import ProductCard from '../components/ProductCard.jsx';
import { ProductSkeletonGrid } from '../components/LoadingSkeleton.jsx';
import { useToast } from '../context/ToastContext.jsx';

const categoryOptions = [
  { value: 'all', label: 'All powders' },
  { value: 'turmeric', label: 'Turmeric' },
  { value: 'neem', label: 'Neem' },
  { value: 'moringa', label: 'Moringa' },
  { value: 'sandalwood', label: 'Sandalwood' },
  { value: 'herbal-blend', label: 'Herbal blends' },
];

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();
  const [filters, setFilters] = useState({
    keyword: '',
    category: 'all',
    minPrice: '',
    maxPrice: '',
  });

  const fetchProducts = () => {
    setLoading(true);
    api
      .get('/products', {
        params: {
          keyword: filters.keyword || undefined,
          category: filters.category !== 'all' ? filters.category : undefined,
          minPrice: filters.minPrice || undefined,
          maxPrice: filters.maxPrice || undefined,
        },
      })
      .then((res) => setProducts(res.data))
      .catch(() => {
        addToast({
          variant: 'error',
          title: 'Could not load powders',
          message: 'Something went wrong while fetching powders. Adjust filters or try again.',
        });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleApply = () => {
    fetchProducts();
  };

  return (
    <div className="container-page space-y-8">
      <div className="flex flex-col gap-4 pt-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-2xl text-neutral-900 md:text-3xl dark:text-sand">
            Natural powder apothecary
          </h1>
          <p className="mt-1 max-w-md text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
            Browse our collection of single-origin and blended powders crafted for skin, hair and
            inner rituals.
          </p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="space-y-4 rounded-2xl border border-amber-100/80 bg-white/90 p-4 shadow-[0_12px_35px_rgba(15,23,42,0.05)] dark:border-emerald-900/70 dark:bg-slate-950/90"
      >
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search for turmeric, neem, moringa..."
              value={filters.keyword}
              onChange={(e) => handleChange('keyword', e.target.value)}
              className="h-9 w-full rounded-full border border-amber-100 bg-amber-50/60 pl-9 pr-3 text-xs text-neutral-800 outline-none ring-0 placeholder:text-neutral-400 focus:border-amber-300 focus:bg-white focus:ring-1 focus:ring-amber-300 dark:border-emerald-800 dark:bg-slate-900 dark:text-sand dark:focus:border-emerald-500 dark:focus:ring-emerald-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 rounded-full bg-amber-50/80 px-2 py-1 text-[10px] text-neutral-600 dark:bg-emerald-950/70 dark:text-neutral-300">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Filters
            </div>
            <select
              className="h-8 rounded-full border border-amber-100 bg-white px-3 text-[11px] text-neutral-700 outline-none focus:border-amber-300 focus:ring-1 focus:ring-amber-300 dark:border-emerald-800 dark:bg-slate-950 dark:text-neutral-200 dark:focus:border-emerald-500 dark:focus:ring-emerald-500"
              value={filters.category}
              onChange={(e) => handleChange('category', e.target.value)}
            >
              {categoryOptions.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Min ₹"
              value={filters.minPrice}
              onChange={(e) => handleChange('minPrice', e.target.value)}
              className="h-8 w-20 rounded-full border border-amber-100 bg-white px-3 text-[11px] text-neutral-700 outline-none focus:border-amber-300 focus:ring-1 focus:ring-amber-300 dark:border-emerald-800 dark:bg-slate-950 dark:text-neutral-200"
            />
            <input
              type="number"
              placeholder="Max ₹"
              value={filters.maxPrice}
              onChange={(e) => handleChange('maxPrice', e.target.value)}
              className="h-8 w-20 rounded-full border border-amber-100 bg-white px-3 text-[11px] text-neutral-700 outline-none focus:border-amber-300 focus:ring-1 focus:ring-amber-300 dark:border-emerald-800 dark:bg-slate-950 dark:text-neutral-200"
            />
            <button
              type="button"
              onClick={handleApply}
              className="inline-flex h-8 items-center rounded-full bg-neutral-900 px-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-sand transition hover:bg-neutral-800 dark:bg-emerald-500 dark:text-emerald-50 dark:hover:bg-emerald-400"
            >
              Apply
            </button>
          </div>
        </div>
      </motion.div>

      {loading ? (
        <ProductSkeletonGrid />
      ) : products.length === 0 ? (
        <div className="rounded-2xl border border-amber-100/80 bg-amber-50/70 p-8 text-center text-xs text-neutral-700 dark:border-emerald-900/70 dark:bg-slate-950/80 dark:text-neutral-200">
          No powders match your filters. Try widening your search or exploring another category.
        </div>
      ) : (
        <div className="grid gap-5 pb-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <ProductCard key={product._id} product={product} index={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;

