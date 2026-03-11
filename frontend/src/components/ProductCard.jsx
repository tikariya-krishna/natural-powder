import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext.jsx';

const ProductCard = ({ product, index = 0 }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useShop();
  const inWishlist = isInWishlist(product._id);
  const stock = typeof product.stock === 'number' ? product.stock : Number(product.stock || 0);
  const outOfStock = stock <= 0;
  const imageUrl = typeof product.image === 'string' && product.image.trim() ? product.image.trim() : null;
  const [imgError, setImgError] = useState(false);
  const showImage = imageUrl && !imgError;

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8%' }}
      transition={{ delay: index * 0.04, duration: 0.5, ease: 'easeOut' }}
      className="group relative overflow-hidden rounded-2xl border border-amber-100/70 bg-white/90 shadow-[0_18px_45px_rgba(15,23,42,0.06)] transition hover:-translate-y-1.5 hover:shadow-[0_26px_60px_rgba(15,23,42,0.12)] dark:border-emerald-900/60 dark:bg-slate-950/90"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-sand/40 dark:bg-slate-900/80">
        {showImage ? (
          <img
            src={imageUrl}
            alt={product.name || 'Product'}
            className="h-full w-full object-cover object-center"
            onError={() => setImgError(true)}
          />
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50/60 via-transparent to-emerald-50/70 dark:from-emerald-950/60 dark:to-slate-950/80" />
            <div className="absolute inset-4 rounded-[1.2rem] border border-amber-100/70 dark:border-emerald-900/70" />
            <div className="relative flex h-full flex-col items-center justify-center gap-2 p-4">
              <span className="rounded-full bg-neutral-900/90 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.25em] text-sand shadow-soft dark:bg-emerald-500/90 dark:text-emerald-50">
                {product.category}
              </span>
              <p className="px-4 text-center text-[11px] leading-relaxed text-neutral-600 dark:text-neutral-300 line-clamp-3">
                {product.description}
              </p>
            </div>
          </>
        )}
      </div>

      <div className="flex flex-col gap-3 px-4 pb-4 pt-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link
              to={`/products/${product._id}`}
              className="text-sm font-semibold tracking-wide text-neutral-900 hover:text-leaf dark:text-sand"
            >
              {product.name}
            </Link>
            <p className="mt-1 text-[11px] uppercase tracking-[0.26em] text-neutral-500">
              {product.benefits?.[0] || 'Single-origin botanical powder'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleWishlistClick}
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border shadow-sm transition group-hover:opacity-100 ${
              inWishlist
                ? 'border-rose-300 bg-rose-100 text-rose-600 opacity-100 dark:border-rose-700 dark:bg-rose-950/70 dark:text-rose-300'
                : 'border-rose-100/70 bg-rose-50/70 text-rose-500 opacity-0 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-200'
            }`}
          >
            <Heart className={`h-4 w-4 ${inWishlist ? 'fill-current' : ''}`} />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-earth dark:text-emerald-100">
              ₹ {product.price.toFixed(0)}
              <span className="ml-1 text-[10px] font-normal text-neutral-500 dark:text-neutral-400">
                / 100g
              </span>
            </p>
            <div className="mt-1 flex items-center gap-1 text-[11px] text-amber-700 dark:text-amber-300">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span>
                {product.rating?.toFixed(1) || '4.8'} ({product.numReviews || 128} reviews)
              </span>
            </div>
            <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-neutral-500 dark:text-neutral-400">
              {outOfStock ? 'Out of stock' : `In stock · ${stock} packs`}
            </p>
          </div>
          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            disabled={outOfStock}
            onClick={() => {
              if (!outOfStock) addToCart(product, 1);
            }}
            className={`inline-flex items-center rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] transition ${
              outOfStock
                ? 'bg-neutral-300 text-neutral-600 opacity-70 dark:bg-slate-700 dark:text-neutral-300'
                : 'bg-neutral-900 text-sand hover:bg-neutral-800 dark:bg-emerald-500 dark:text-emerald-50 dark:hover:bg-emerald-400'
            }`}
          >
            {outOfStock ? 'Out of stock' : 'Add to bag'}
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
};

export default ProductCard;

