import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { useShop } from '../context/ShopContext.jsx';

const CartPage = () => {
  const { cart, updateCartQty, removeFromCart, totals } = useShop();

  return (
    <div className="container-page space-y-8">
      <div className="flex flex-col gap-2 pt-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-2xl text-neutral-900 md:text-3xl dark:text-sand">
            Your ritual bag
          </h1>
          <p className="mt-1 text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
            Adjust quantities or remove powders before you check out.
          </p>
        </div>
      </div>

      {cart.length === 0 ? (
        <div className="rounded-2xl border border-amber-100/80 bg-amber-50/70 p-8 text-center text-xs text-neutral-700 dark:border-emerald-900/70 dark:bg-slate-950/80 dark:text-neutral-200">
          Your ritual bag is empty.{' '}
          <Link to="/products" className="underline underline-offset-4">
            Browse powders
          </Link>
          .
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-[minmax(0,_1.5fr)_minmax(0,_1fr)]">
          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {cart.map((item) => (
                <motion.article
                  key={item.product._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="flex gap-4 rounded-2xl border border-amber-100/80 bg-white/90 p-4 shadow-[0_10px_28px_rgba(15,23,42,0.05)] dark:border-emerald-900/70 dark:bg-slate-950/90"
                >
                  <div className="hidden h-20 w-24 rounded-xl bg-sand/50 sm:block dark:bg-slate-900/80" />
                  <div className="flex flex-1 flex-col gap-2 text-xs">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-neutral-900 dark:text-sand">
                          {item.product.name}
                        </p>
                        <p className="mt-0.5 text-[11px] uppercase tracking-[0.26em] text-neutral-500">
                          {item.product.category}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.product._id)}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-amber-100 text-neutral-400 transition hover:border-amber-300 hover:text-neutral-700 dark:border-emerald-900 dark:hover:border-emerald-500 dark:hover:text-sand"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50/70 px-2 py-1 text-xs text-neutral-800 dark:border-emerald-800 dark:bg-slate-900 dark:text-sand">
                        <button
                          type="button"
                          onClick={() =>
                            updateCartQty(item.product._id, Math.max(1, item.qty - 1))
                          }
                          className="px-2 text-neutral-500 hover:text-neutral-800 dark:text-neutral-300 dark:hover:text-sand"
                        >
                          -
                        </button>
                        <span className="px-2">{item.qty}</span>
                        <button
                          type="button"
                          onClick={() => updateCartQty(item.product._id, item.qty + 1)}
                          className="px-2 text-neutral-500 hover:text-neutral-800 dark:text-neutral-300 dark:hover:text-sand"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-neutral-600 dark:text-neutral-300">
                          ₹ {item.product.price.toFixed(0)} / 100g
                        </p>
                        <p className="text-sm font-semibold text-earth dark:text-emerald-100">
                          ₹ {(item.product.price * item.qty).toFixed(0)}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>

          <aside className="space-y-4 rounded-2xl border border-amber-100/80 bg-white/90 p-5 text-xs text-neutral-700 shadow-soft dark:border-emerald-900/70 dark:bg-slate-950/90 dark:text-neutral-200">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-neutral-500">
              Order summary
            </p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Items</span>
                <span>{totals.itemsCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹ {totals.subtotal.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
            </div>
            <div className="mt-1 flex justify-between border-t border-amber-100/70 pt-3 text-sm font-semibold text-neutral-900 dark:border-emerald-900/70 dark:text-sand">
              <span>Total</span>
              <span>₹ {totals.total.toFixed(0)}</span>
            </div>
            <Link
              to="/checkout"
              className="mt-2 flex h-9 items-center justify-center rounded-full bg-neutral-900 text-[11px] font-semibold uppercase tracking-[0.22em] text-sand shadow-soft transition hover:bg-neutral-800 dark:bg-emerald-500 dark:text-emerald-50 dark:hover:bg-emerald-400"
            >
              Proceed to checkout
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
};

export default CartPage;

