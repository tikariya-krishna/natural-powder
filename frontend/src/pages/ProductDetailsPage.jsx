import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Leaf, Loader2, MessageSquare } from 'lucide-react';
import { api } from '../services/api.js';
import { useShop } from '../context/ShopContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const formatReviewDate = (v) => {
  if (!v) return '';
  const d = typeof v === 'string' ? new Date(v) : v;
  return isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-IN', { dateStyle: 'medium' });
};

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [imgError, setImgError] = useState(false);
  const { addToCart, user } = useShop();
  const { addToast } = useToast();
  const [qty, setQty] = useState(1);
  const imageUrl = product && typeof product.image === 'string' && product.image.trim() ? product.image.trim() : null;
  const showImage = imageUrl && !imgError;

  useEffect(() => {
    setLoading(true);
    api
      .get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const reviews = product?.reviews || [];
  const hasUserReviewed = user && reviews.some((r) => r.userId === user._id);
  const stock =
    product && typeof product.stock === 'number'
      ? product.stock
      : Number(product?.stock || 0);
  const outOfStock = stock <= 0;

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) return;
    if (reviewRating < 1 || reviewRating > 5) {
      addToast({ variant: 'error', title: 'Invalid rating', message: 'Please select 1 to 5 stars.' });
      return;
    }
    setSubmittingReview(true);
    try {
      const res = await api.post(`/products/${id}/reviews`, {
        rating: reviewRating,
        comment: reviewComment.trim(),
      });
      setProduct(res.data);
      setReviewRating(0);
      setReviewComment('');
      addToast({
        variant: 'success',
        title: 'Thank you!',
        message: 'Your review has been published.',
      });
    } catch (err) {
      addToast({
        variant: 'error',
        title: 'Could not submit review',
        message: err.response?.data?.message || 'Please try again later.',
      });
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="container-page flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-leaf" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-page py-16 text-center text-sm text-neutral-600 dark:text-neutral-300">
        Powder not found.
      </div>
    );
  }

  return (
    <div className="container-page space-y-12">
      <div className="grid gap-10 pt-2 md:grid-cols-[minmax(0,_1.1fr)_minmax(0,_1fr)] md:items-start">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative overflow-hidden rounded-3xl border border-amber-100/80 bg-gradient-to-br from-sand via-amber-50 to-emerald-50 p-5 shadow-soft dark:border-emerald-900/70 dark:from-emerald-950 dark:via-slate-950 dark:to-black"
        >
          {showImage ? (
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-amber-100/80 bg-white/80 dark:border-emerald-900/70">
              <img
                src={imageUrl}
                alt={product.name || 'Product'}
                className="h-full w-full object-cover object-center"
                onError={() => setImgError(true)}
              />
            </div>
          ) : (
            <div className="absolute inset-6 rounded-[26px] border border-amber-100/80 bg-white/80 dark:border-emerald-900/70 dark:bg-slate-950/90" />
          )}
          <div className="relative z-10 flex h-full flex-col justify-between gap-6 p-5">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.26em] text-sand dark:bg-emerald-500 dark:text-emerald-50">
                <Leaf className="h-3.5 w-3.5" />
                {product.category}
              </div>
              <h1 className="font-display text-2xl text-neutral-900 md:text-3xl dark:text-sand">
                {product.name}
              </h1>
            </div>
            <p className="max-w-lg text-xs leading-relaxed text-neutral-700 dark:text-neutral-300">
              {product.description}
            </p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-neutral-500">
                  Price / 100g
                </p>
                <p className="mt-1 text-xl font-semibold text-earth dark:text-emerald-100">
                  ₹ {product.price.toFixed(0)}
                </p>
              </div>
              <div className="text-right text-[11px] uppercase tracking-[0.22em] text-neutral-600 dark:text-neutral-300">
                <p>{outOfStock ? 'Out of stock' : `In stock · ${stock} packs`}</p>
              </div>
              <div className="rounded-2xl bg-black/80 px-4 py-2 text-xs text-sand shadow-lg dark:bg-emerald-500/90">
                <div className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span>{(product.rating || 4.8).toFixed(1)}</span>
                </div>
                <p className="mt-0.5 text-[10px] uppercase tracking-[0.24em] text-amber-200/90">
                  {product.numReviews ?? 0} review{product.numReviews !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="space-y-6 rounded-3xl border border-amber-100/80 bg-white/90 p-6 shadow-soft dark:border-emerald-900/70 dark:bg-slate-950/90"
        >
          <div className="space-y-4 text-xs text-neutral-700 dark:text-neutral-200">
            <div>
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.28em] text-neutral-500">
                Benefits
              </h2>
              <ul className="mt-2 space-y-1.5">
                {(product.benefits || []).map((line) => (
                  <li key={line}>• {line}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.28em] text-neutral-500">
                Ingredients
              </h2>
              <ul className="mt-2 space-y-1.5">
                {(product.ingredients || []).map((line) => (
                  <li key={line}>• {line}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.28em] text-neutral-500">
                Usage ritual
              </h2>
              <p className="mt-2 leading-relaxed">
                Mix 1–2 tsp powder with rose water, yogurt or warm plant milk. Apply as a mask or
                sip as a latte. Always patch test on inner arm before full facial use.
              </p>
            </div>
          </div>

          <div className="space-y-4 border-t border-amber-100/70 pt-4 dark:border-emerald-900/70">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs text-neutral-600 dark:text-neutral-300">
                  Quantity (100g packs)
                </span>
                <div className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50/60 px-2 py-1 text-xs text-neutral-800 dark:border-emerald-800 dark:bg-slate-900 dark:text-sand">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="px-2 text-neutral-500 hover:text-neutral-800 dark:text-neutral-300 dark:hover:text-sand"
                  >
                    -
                  </button>
                  <span className="px-2">{qty}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setQty((q) => {
                        const next = q + 1;
                        if (!outOfStock && stock > 0) {
                          return Math.min(next, stock);
                        }
                        return next;
                      })
                    }
                    className="px-2 text-neutral-500 hover:text-neutral-800 dark:text-neutral-300 dark:hover:text-sand"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="text-right text-xs text-neutral-600 dark:text-neutral-300">
                <p className="uppercase tracking-[0.24em]">Subtotal</p>
                <p className="mt-1 text-base font-semibold text-earth dark:text-emerald-100">
                  ₹ {(qty * product.price).toFixed(0)}
                </p>
              </div>
            </div>
            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              disabled={outOfStock}
              onClick={() => {
                if (!outOfStock) addToCart(product, qty);
              }}
              className={`flex h-10 w-full items-center justify-center rounded-full text-xs font-semibold uppercase tracking-[0.22em] shadow-soft transition ${
                outOfStock
                  ? 'bg-neutral-300 text-neutral-600 opacity-70 dark:bg-slate-700 dark:text-neutral-300'
                  : 'bg-neutral-900 text-sand hover:bg-neutral-800 dark:bg-emerald-500 dark:text-emerald-50 dark:hover:bg-emerald-400'
              }`}
            >
              {outOfStock ? 'Out of stock' : 'Add to ritual bag'}
            </motion.button>
          </div>
        </motion.div>
      </div>

      <section className="space-y-6 rounded-3xl border border-amber-100/80 bg-white/90 p-6 shadow-soft dark:border-emerald-900/70 dark:bg-slate-950/90">
        <h2 className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-neutral-500 dark:text-neutral-400">
          <MessageSquare className="h-4 w-4" />
          Reviews & rating
        </h2>

        {user && !hasUserReviewed && (
          <motion.form
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmitReview}
            className="rounded-2xl border border-amber-100/80 bg-amber-50/50 p-4 dark:border-emerald-900/70 dark:bg-slate-900/50"
          >
            <p className="mb-3 text-xs font-medium text-neutral-800 dark:text-sand">
              How was this product? Share your experience.
            </p>
            <div className="mb-3 flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReviewRating(star)}
                  className="rounded p-0.5 transition hover:scale-110"
                  aria-label={`${star} star${star > 1 ? 's' : ''}`}
                >
                  <Star
                    className={`h-7 w-7 ${
                      star <= reviewRating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-amber-200 dark:text-amber-900/50'
                    }`}
                  />
                </button>
              ))}
            </div>
            <textarea
              placeholder="Your review (optional)..."
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              rows={3}
              maxLength={1000}
              className="mb-3 w-full rounded-xl border border-amber-100 bg-white px-3 py-2 text-xs outline-none focus:border-amber-300 focus:ring-1 focus:ring-amber-300 dark:border-emerald-800 dark:bg-slate-950 dark:text-sand dark:focus:border-emerald-500 dark:focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={submittingReview || reviewRating < 1}
              className="rounded-full bg-neutral-900 px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-sand transition hover:bg-neutral-800 disabled:opacity-50 dark:bg-emerald-600 dark:hover:bg-emerald-500"
            >
              {submittingReview ? 'Submitting…' : 'Submit review'}
            </button>
          </motion.form>
        )}

        {user && hasUserReviewed && (
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
            You have already reviewed this product. Thank you!
          </p>
        )}

        {!user && (
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
            Log in to leave a review after your purchase.
          </p>
        )}

        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
              No reviews yet. Be the first to share your experience!
            </p>
          ) : (
            [...reviews]
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((r, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-amber-100/60 bg-white/80 p-4 dark:border-emerald-900/50 dark:bg-slate-900/40"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-neutral-800 dark:text-sand">
                        {r.userName || 'Customer'}
                      </span>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-3.5 w-3.5 ${
                              star <= (r.rating || 0) ? 'fill-amber-400 text-amber-400' : 'text-amber-200 dark:text-amber-900/50'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-[10px] text-neutral-500 dark:text-neutral-400">
                      {formatReviewDate(r.createdAt)}
                    </span>
                  </div>
                  {r.comment && (
                    <p className="mt-2 text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
                      {r.comment}
                    </p>
                  )}
                </div>
              )))}
        </div>
      </section>
    </div>
  );
};

export default ProductDetailsPage;

