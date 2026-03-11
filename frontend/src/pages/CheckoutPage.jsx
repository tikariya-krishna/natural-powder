import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, X, Package } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useShop } from '../context/ShopContext.jsx';
import { api } from '../services/api.js';
import { useToast } from '../context/ToastContext.jsx';
import { buildUpiUrl, useUpiConfig } from '../utils/upiQr.js';

const emptyAddress = {
  fullName: '',
  street: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
  phone: '',
};

const CheckoutPage = () => {
  const { cart, totals, clearCart } = useShop();
  const [address, setAddress] = useState(emptyAddress);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [paymentOrder, setPaymentOrder] = useState(null); // { _id, totalPrice }
  const { addToast } = useToast();
  const { upiId, upiName } = useUpiConfig();

  const handleChange = (field, value) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cart.length) return;
    setSubmitting(true);
    try {
      const res = await api.post('/orders', {
        products: cart.map((item) => ({
          product: item.product._id,
          qty: item.qty,
          price: item.product.price,
        })),
        totalPrice: totals.total,
        address,
      });
      setPaymentOrder({ _id: res.data._id, totalPrice: totals.total });
      setSuccess(true);
      addToast({
        variant: 'success',
        title: 'Order placed',
        message: 'Scan the QR code below to complete payment.',
      });
    } catch (err) {
      addToast({
        variant: 'error',
        title: 'Checkout failed',
        message:
          'We could not create your order right now. Please review your details or try again shortly.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleClosePayment = () => {
    setPaymentOrder(null);
    clearCart();
    setSuccess(false);
    setAddress(emptyAddress);
  };

  if (!cart.length && !success) {
    return (
      <div className="container-page py-16 text-center text-xs text-neutral-600 dark:text-neutral-300">
        Your ritual bag is empty – add powders before checking out.
      </div>
    );
  }

  return (
    <div className="container-page space-y-8">
      <div className="flex flex-col gap-2 pt-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-2xl text-neutral-900 md:text-3xl dark:text-sand">
            Checkout
          </h1>
          <p className="mt-1 text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
            Share your delivery details; we will handle the rest with care.
          </p>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-[minmax(0,_1.5fr)_minmax(0,_1fr)]">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-4 rounded-3xl border border-amber-100/80 bg-white/90 p-6 text-xs shadow-soft dark:border-emerald-900/70 dark:bg-slate-950/90"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-neutral-500">
            Address
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-1 block text-[11px] uppercase tracking-[0.22em] text-neutral-500">
                Full name
              </label>
              <input
                required
                value={address.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                className="h-9 w-full rounded-full border border-amber-100 bg-amber-50/60 px-3 text-xs outline-none focus:border-amber-300 focus:bg-white focus:ring-1 focus:ring-amber-300 dark:border-emerald-800 dark:bg-slate-900 dark:text-sand dark:focus:border-emerald-500 dark:focus:ring-emerald-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-[11px] uppercase tracking-[0.22em] text-neutral-500">
                Street
              </label>
              <input
                required
                value={address.street}
                onChange={(e) => handleChange('street', e.target.value)}
                className="h-9 w-full rounded-full border border-amber-100 bg-amber-50/60 px-3 text-xs outline-none focus:border-amber-300 focus:bg-white focus:ring-1 focus:ring-amber-300 dark:border-emerald-800 dark:bg-slate-900 dark:text-sand dark:focus:border-emerald-500 dark:focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] uppercase tracking-[0.22em] text-neutral-500">
                City
              </label>
              <input
                required
                value={address.city}
                onChange={(e) => handleChange('city', e.target.value)}
                className="h-9 w-full rounded-full border border-amber-100 bg-amber-50/60 px-3 text-xs outline-none focus:border-amber-300 focus:bg-white focus:ring-1 focus:ring-amber-300 dark:border-emerald-800 dark:bg-slate-900 dark:text-sand dark:focus:border-emerald-500 dark:focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] uppercase tracking-[0.22em] text-neutral-500">
                State
              </label>
              <input
                required
                value={address.state}
                onChange={(e) => handleChange('state', e.target.value)}
                className="h-9 w-full rounded-full border border-amber-100 bg-amber-50/60 px-3 text-xs outline-none focus:border-amber-300 focus:bg-white focus:ring-1 focus:ring-amber-300 dark:border-emerald-800 dark:bg-slate-900 dark:text-sand dark:focus:border-emerald-500 dark:focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] uppercase tracking-[0.22em] text-neutral-500">
                Postal code
              </label>
              <input
                required
                value={address.postalCode}
                onChange={(e) => handleChange('postalCode', e.target.value)}
                className="h-9 w-full rounded-full border border-amber-100 bg-amber-50/60 px-3 text-xs outline-none focus:border-amber-300 focus:bg-white focus:ring-1 focus:ring-amber-300 dark:border-emerald-800 dark:bg-slate-900 dark:text-sand dark:focus:border-emerald-500 dark:focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] uppercase tracking-[0.22em] text-neutral-500">
                Country
              </label>
              <input
                required
                value={address.country}
                onChange={(e) => handleChange('country', e.target.value)}
                className="h-9 w-full rounded-full border border-amber-100 bg-amber-50/60 px-3 text-xs outline-none focus:border-amber-300 focus:bg-white focus:ring-1 focus:ring-amber-300 dark:border-emerald-800 dark:bg-slate-900 dark:text-sand dark:focus:border-emerald-500 dark:focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] uppercase tracking-[0.22em] text-neutral-500">
                Phone
              </label>
              <input
                required
                value={address.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="h-9 w-full rounded-full border border-amber-100 bg-amber-50/60 px-3 text-xs outline-none focus:border-amber-300 focus:bg-white focus:ring-1 focus:ring-amber-300 dark:border-emerald-800 dark:bg-slate-900 dark:text-sand dark:focus:border-emerald-500 dark:focus:ring-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-1 flex h-9 w-full items-center justify-center rounded-full bg-neutral-900 text-[11px] font-semibold uppercase tracking-[0.22em] text-sand shadow-soft transition hover:bg-neutral-800 disabled:opacity-70 dark:bg-emerald-500 dark:text-emerald-50 dark:hover:bg-emerald-400"
          >
            {submitting ? 'Placing order…' : 'Place order'}
          </button>

          {success && !paymentOrder && (
            <div className="mt-3 flex items-center gap-2 rounded-2xl bg-emerald-50 px-3 py-2 text-[11px] text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-100">
              <CheckCircle2 className="h-4 w-4" />
              Order created successfully.
            </div>
          )}
        </motion.form>

        <motion.aside
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="space-y-4 rounded-3xl border border-amber-100/80 bg-white/90 p-5 text-xs text-neutral-700 shadow-soft dark:border-emerald-900/70 dark:bg-slate-950/90 dark:text-neutral-200"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-neutral-500">
            Order summary
          </p>
          <div className="space-y-2">
            {cart.map((item) => (
              <div key={item.product._id} className="flex justify-between">
                <span>
                  {item.qty} × {item.product.name}
                </span>
                <span>₹ {(item.qty * item.product.price).toFixed(0)}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between border-t border-amber-100/70 pt-3 text-sm font-semibold text-neutral-900 dark:border-emerald-900/70 dark:text-sand">
            <span>Total</span>
            <span>₹ {totals.total.toFixed(0)}</span>
          </div>
          <div className="mt-2 rounded-2xl bg-amber-50/80 p-3 text-[11px] text-neutral-700 dark:bg-slate-900/80 dark:text-neutral-200">
            Pay via UPI when you place order. A QR code will appear for the exact amount.
          </div>
        </motion.aside>
      </div>

      {/* Payment QR modal */}
      <AnimatePresence>
        {paymentOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            onClick={handleClosePayment}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="relative flex max-w-sm flex-col items-center rounded-3xl border border-amber-100/80 bg-white p-6 shadow-2xl dark:border-emerald-900/70 dark:bg-slate-950"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={handleClosePayment}
                className="absolute right-3 top-3 rounded-full p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-slate-800 dark:hover:text-sand"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mt-1 flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-5 w-5" />
                <span className="text-sm font-semibold">Order placed</span>
              </div>
              <p className="mt-2 text-center text-sm text-neutral-600 dark:text-neutral-300">
                Scan to pay <span className="font-bold text-neutral-900 dark:text-sand">₹ {paymentOrder.totalPrice.toFixed(0)}</span>
              </p>

              {upiId ? (
                <>
                  <div className="mt-4 rounded-2xl border-2 border-neutral-200 bg-white p-4 dark:border-emerald-800 dark:bg-slate-900">
                    <QRCodeSVG
                      value={buildUpiUrl(
                        upiId,
                        upiName,
                        paymentOrder.totalPrice,
                        `Order ${paymentOrder._id}`
                      )}
                      size={200}
                      level="M"
                      includeMargin={false}
                    />
                  </div>
                  <p className="mt-3 text-[11px] text-neutral-500">
                    Or pay manually: <span className="font-mono font-semibold">{upiId}</span>
                  </p>
                  <p className="mt-1 text-[10px] text-neutral-400">
                    Use GPay, PhonePe, Paytm or any UPI app
                  </p>
                </>
              ) : (
                <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-center text-xs text-amber-900 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-100">
                  <p className="font-semibold">UPI not configured</p>
                  <p className="mt-1">
                    Add <code className="rounded bg-amber-200 px-1 dark:bg-amber-900">VITE_UPI_ID</code> and{' '}
                    <code className="rounded bg-amber-200 px-1 dark:bg-amber-900">VITE_UPI_NAME</code> to your
                    frontend <code className="rounded bg-amber-200 px-1 dark:bg-amber-900">.env</code> file.
                  </p>
                  <p className="mt-2 text-[11px]">
                    Amount to pay: <strong>₹ {paymentOrder.totalPrice.toFixed(0)}</strong>
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={handleClosePayment}
                className="mt-6 w-full rounded-full bg-neutral-900 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-sand transition hover:bg-neutral-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
              >
                I&apos;ve paid
              </button>
              <Link
                to="/orders"
                onClick={handleClosePayment}
                className="mt-2 flex w-full items-center justify-center gap-2 py-2 text-[11px] font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-sand"
              >
                <Package className="h-4 w-4" />
                View order history
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CheckoutPage;
