import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import { useShop } from '../context/ShopContext.jsx';

const WishlistPage = () => {
  const { wishlist } = useShop();

  return (
    <div className="container-page space-y-8 pb-12">
      <div className="pt-2">
        <h1 className="font-display text-2xl text-neutral-900 md:text-3xl dark:text-sand">
          Wishlist
        </h1>
        <p className="mt-1 text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
          Powders you have saved. Click the heart on a card to remove, or add them to your bag.
        </p>
      </div>

      {wishlist.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center rounded-3xl border border-amber-100/80 bg-white/90 py-16 text-center dark:border-emerald-900/70 dark:bg-slate-950/90"
        >
          <Heart className="h-14 w-14 text-rose-200 dark:text-rose-900/50" />
          <p className="mt-4 text-sm font-medium text-neutral-600 dark:text-neutral-400">
            No powders saved yet
          </p>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-500">
            Use the heart on any product card to add it here.
          </p>
          <Link
            to="/products"
            className="mt-6 rounded-full bg-neutral-900 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-sand transition hover:bg-neutral-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
          >
            Browse powders
          </Link>
        </motion.div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {wishlist.map((product, index) => (
            <ProductCard key={product._id} product={product} index={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
