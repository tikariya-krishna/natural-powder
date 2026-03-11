import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  Package,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  XCircle,
  QrCode,
  MessageSquare,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { api } from '../services/api.js';
import { useToast } from '../context/ToastContext.jsx';
import { buildUpiUrl, useUpiConfig } from '../utils/upiQr.js';

const formatDate = (v) => {
  if (!v) return '—';
  const d = typeof v === 'string' ? new Date(v) : v;
  return isNaN(d.getTime()) ? '—' : d.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
};

const STATUS_CONFIG = {
  pending: {
    label: 'Pending payment',
    icon: Clock,
    className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200',
  },
  paid: {
    label: 'Paid',
    icon: CheckCircle2,
    className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200',
  },
  shipped: {
    label: 'Shipped',
    icon: Truck,
    className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200',
  },
  delivered: {
    label: 'Delivered',
    icon: CheckCircle2,
    className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200',
  },
  cancelled: {
    label: 'Cancelled',
    icon: XCircle,
    className: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300',
  },
};

const getStatusConfig = (status) => STATUS_CONFIG[status?.toLowerCase()] || STATUS_CONFIG.pending;

const isPaymentDone = (status) => ['paid', 'shipped', 'delivered'].includes((status || '').toLowerCase());
const isPending = (status) => (status || '').toLowerCase() === 'pending';

const MyOrdersPage = () => {
  const { addToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const { upiId, upiName } = useUpiConfig();

  useEffect(() => {
    api
      .get('/orders/my')
      .then((res) => setOrders(res.data || []))
      .catch(() => {
        addToast({
          variant: 'error',
          title: 'Could not load orders',
          message: 'Please try again later.',
        });
      })
      .finally(() => setLoading(false));
  }, [addToast]);

  const toggleExpand = (id) => setExpandedId((prev) => (prev === id ? null : id));

  return (
    <div className="container-page space-y-6 pb-12">
      <div className="pt-2">
        <h1 className="font-display text-2xl text-neutral-900 md:text-3xl dark:text-sand">
          My orders
        </h1>
        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
          View order history and complete payment for pending orders.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center rounded-3xl border border-amber-100/80 bg-white/90 py-20 dark:border-emerald-900/70 dark:bg-slate-950/90">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-amber-300 border-t-transparent dark:border-emerald-500" />
        </div>
      ) : orders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-3xl border border-amber-100/80 bg-white/90 py-16 text-center dark:border-emerald-900/70 dark:bg-slate-950/90"
        >
          <Package className="mx-auto h-12 w-12 text-neutral-300 dark:text-neutral-600" />
          <p className="mt-3 text-sm font-medium text-neutral-600 dark:text-neutral-400">
            No orders yet
          </p>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-500">
            Your orders will appear here after you checkout.
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const config = getStatusConfig(order.status);
            const StatusIcon = config.icon;
            const paid = isPaymentDone(order.status);
            const pending = isPending(order.status);
            const expanded = expandedId === order._id;
            const address = order.address || {};

            return (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="overflow-hidden rounded-3xl border border-amber-100/80 bg-white/90 shadow-soft dark:border-emerald-900/70 dark:bg-slate-950/90"
              >
                <button
                  type="button"
                  onClick={() => toggleExpand(order._id)}
                  className="flex w-full items-center justify-between gap-4 p-4 text-left transition hover:bg-amber-50/50 dark:hover:bg-slate-900/50"
                >
                  <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3 sm:gap-4">
                    <div>
                      <p className="text-xs font-semibold text-neutral-900 dark:text-sand">
                        Order #{order._id?.slice(-8)}
                      </p>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                        {formatDate(order.createdAt)} · {(order.products || []).length} item(s)
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-neutral-900 dark:text-sand">
                      ₹ {(order.totalPrice || 0).toFixed(0)}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium ${config.className}`}
                    >
                      <StatusIcon className="h-3.5 w-3.5" />
                      {config.label}
                    </span>
                  </div>
                  {expanded ? (
                    <ChevronUp className="h-5 w-5 shrink-0 text-neutral-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 shrink-0 text-neutral-400" />
                  )}
                </button>

                <AnimatePresence>
                  {expanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="border-t border-amber-100/80 dark:border-emerald-900/70"
                    >
                      <div className="p-4 pt-3 space-y-4">
                        {/* Order items */}
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                            Items
                          </p>
                          <div className="mt-2 space-y-1.5">
                            {(order.products || []).map((item, idx) => (
                              <div
                                key={idx}
                                className="flex justify-between rounded-xl bg-amber-50/70 px-3 py-2 text-xs dark:bg-slate-900/50"
                              >
                                <span className="text-neutral-700 dark:text-neutral-300">
                                  {item.name || `Product`} × {item.qty}
                                </span>
                                <span className="font-medium text-neutral-900 dark:text-sand">
                                  ₹ {((item.qty || 0) * (item.price || 0)).toFixed(0)}
                                </span>
                              </div>
                            ))}
                          </div>
                          <div className="mt-2 flex justify-between border-t border-amber-100/80 pt-2 text-sm font-semibold dark:border-emerald-900/50">
                            <span>Total</span>
                            <span className="text-neutral-900 dark:text-sand">
                              ₹ {(order.totalPrice || 0).toFixed(0)}
                            </span>
                          </div>
                        </div>

                        {/* Shipping address */}
                        {(address.fullName || address.street) && (
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                              Delivery address
                            </p>
                            <div className="mt-1.5 flex gap-2 text-xs text-neutral-700 dark:text-neutral-300">
                              <MapPin className="h-4 w-4 shrink-0 text-neutral-400" />
                              <span>
                                {address.fullName}
                                {address.street && `, ${address.street}`}
                                {address.city && `, ${address.city}`}
                                {address.state && ` ${address.state}`}
                                {address.postalCode && ` - ${address.postalCode}`}
                                {address.country && `, ${address.country}`}
                                {address.phone && ` · ${address.phone}`}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Payment section */}
                        {pending && (
                          <div className="rounded-2xl border-2 border-amber-200/80 bg-amber-50/80 p-4 dark:border-amber-800/80 dark:bg-amber-950/30">
                            <p className="flex items-center gap-2 text-xs font-semibold text-amber-900 dark:text-amber-100">
                              <QrCode className="h-4 w-4" />
                              Complete payment
                            </p>
                            <p className="mt-1 text-[11px] text-amber-800/90 dark:text-amber-200/90">
                              Scan the QR code below to pay ₹ {(order.totalPrice || 0).toFixed(0)}. After payment, we will update the order status.
                            </p>
                            {upiId ? (
                              <div className="mt-4 flex flex-col items-center">
                                <div className="rounded-2xl border-2 border-neutral-200 bg-white p-4 dark:border-emerald-800 dark:bg-slate-900">
                                  <QRCodeSVG
                                    value={buildUpiUrl(
                                      upiId,
                                      upiName,
                                      order.totalPrice || 0,
                                      `Order ${order._id}`
                                    )}
                                    size={180}
                                    level="M"
                                    includeMargin={false}
                                  />
                                </div>
                                <p className="mt-2 text-[11px] text-neutral-500">
                                  UPI ID: <span className="font-mono font-medium">{upiId}</span>
                                </p>
                              </div>
                            ) : (
                              <p className="mt-3 text-[11px] text-amber-800 dark:text-amber-200">
                                Amount to pay: <strong>₹ {(order.totalPrice || 0).toFixed(0)}</strong>
                                <br />
                                Pay via your bank or UPI app and mention Order #{order._id?.slice(-8)}.
                              </p>
                            )}
                          </div>
                        )}

                        {paid && (
                          <>
                            <div className="flex items-center gap-3 rounded-2xl border border-emerald-200/80 bg-emerald-50/80 p-4 dark:border-emerald-800/80 dark:bg-emerald-950/30">
                              <CheckCircle2 className="h-8 w-8 shrink-0 text-emerald-600 dark:text-emerald-400" />
                              <div>
                                <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">
                                  Payment successful
                                </p>
                                <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
                                  {order.status?.toLowerCase() === 'shipped'
                                    ? 'Your order has been shipped.'
                                    : order.status?.toLowerCase() === 'delivered'
                                      ? 'Your order has been delivered.'
                                      : 'We have received your payment.'}
                                </p>
                              </div>
                            </div>
                            <div className="rounded-2xl border border-amber-100/80 bg-amber-50/50 p-4 dark:border-emerald-900/70 dark:bg-slate-900/40">
                              <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
                                <MessageSquare className="h-4 w-4" />
                                Review your experience
                              </p>
                              <p className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400">
                                Help others by reviewing the products you received.
                              </p>
                              <div className="mt-3 flex flex-wrap gap-2">
                                {(order.products || []).map((item, idx) => (
                                  <Link
                                    key={idx}
                                    to={`/products/${item.product}`}
                                    className="inline-flex items-center rounded-full bg-neutral-900 px-3 py-1.5 text-[11px] font-medium text-sand transition hover:bg-neutral-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                                  >
                                    Review {item.name || 'product'}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </>
                        )}

                        {order.status?.toLowerCase() === 'cancelled' && (
                          <div className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-900/50">
                            <XCircle className="h-8 w-8 shrink-0 text-neutral-500" />
                            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                              This order was cancelled.
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
