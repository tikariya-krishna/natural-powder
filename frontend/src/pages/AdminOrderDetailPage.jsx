import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  MapPin,
  Package,
  User,
  Phone,
  Mail,
  CreditCard,
} from 'lucide-react';
import { api } from '../services/api.js';
import { useShop } from '../context/ShopContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

const statusColors = {
  pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200',
  paid: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200',
  shipped: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200',
  delivered: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200',
  cancelled: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300',
};

const formatDate = (v) => {
  if (!v) return '—';
  const d = typeof v === 'string' ? new Date(v) : v;
  return isNaN(d.getTime()) ? '—' : d.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
};

const AdminOrderDetailPage = () => {
  const { id } = useParams();
  const { user, isAdmin } = useShop();
  const { addToast } = useToast();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!id) return;
    api
      .get(`/orders/${id}`)
      .then((res) => setOrder(res.data))
      .catch(() => {
        addToast({
          variant: 'error',
          title: 'Order not found',
          message: 'Could not load this order. It may have been deleted or you may not have access.',
        });
      })
      .finally(() => setLoading(false));
  }, [id, addToast]);

  const updateStatus = async (newStatus) => {
    if (!order || updating) return;
    setUpdating(true);
    try {
      const res = await api.put(`/orders/${order._id}/status`, { status: newStatus });
      setOrder(res.data);
      addToast({
        variant: 'success',
        title: 'Status updated',
        message: `Order status set to "${res.data.status}".`,
      });
    } catch {
      addToast({
        variant: 'error',
        title: 'Update failed',
        message: 'Could not update order status. Please try again.',
      });
    } finally {
      setUpdating(false);
    }
  };

  if (!user || !isAdmin) {
    return (
      <div className="container-page py-16 text-center text-xs text-neutral-600 dark:text-neutral-300">
        Admin access only.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container-page flex min-h-[40vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-amber-300 border-t-transparent dark:border-emerald-500" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container-page space-y-4 py-16">
        <Link
          to="/admin/orders"
          className="inline-flex items-center gap-2 text-xs font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-sand"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to orders
        </Link>
        <p className="text-center text-sm text-neutral-500">Order not found.</p>
      </div>
    );
  }

  const address = order.address || {};

  return (
    <div className="container-page space-y-6 pb-12">
      <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/orders"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-amber-200 bg-amber-50/80 text-neutral-600 transition hover:bg-amber-100 dark:border-emerald-800 dark:bg-slate-800 dark:text-sand dark:hover:bg-slate-700"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="font-display text-2xl text-neutral-900 md:text-3xl dark:text-sand">
              Order #{order._id?.slice(-8) || '—'}
            </h1>
            <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
              Placed {formatDate(order.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium capitalize ${
              statusColors[order.status] || statusColors.pending
            }`}
          >
            {order.status || 'pending'}
          </span>
          <select
            value={order.status || 'pending'}
            onChange={(e) => updateStatus(e.target.value)}
            disabled={updating}
            className="h-9 rounded-full border border-amber-200 bg-white px-4 text-xs font-medium outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 dark:border-emerald-700 dark:bg-slate-900 dark:text-sand dark:focus:border-emerald-500 dark:focus:ring-emerald-500 disabled:opacity-60"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Order items */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="lg:col-span-3 space-y-4 rounded-3xl border border-amber-100/80 bg-white/90 p-5 shadow-soft dark:border-emerald-900/70 dark:bg-slate-950/90"
        >
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-neutral-500">
            <Package className="h-4 w-4" />
            Order items
          </div>
          <div className="space-y-2">
            {(order.products || []).map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-2xl border border-amber-100/70 bg-amber-50/50 px-4 py-3 dark:border-emerald-900/50 dark:bg-slate-900/50"
              >
                <div>
                  <p className="text-xs font-medium text-neutral-800 dark:text-sand">
                    {item.name ?? `Product ${item.product || idx + 1}`}
                  </p>
                  <p className="text-[11px] text-neutral-500">
                    Qty: {item.qty} × ₹ {(item.price || 0).toFixed(0)}
                  </p>
                </div>
                <p className="text-sm font-semibold text-neutral-900 dark:text-sand">
                  ₹ {((item.qty || 0) * (item.price || 0)).toFixed(0)}
                </p>
              </div>
            ))}
          </div>
          <div className="flex justify-between border-t border-amber-100/80 pt-3 text-sm font-semibold dark:border-emerald-900/70">
            <span className="text-neutral-700 dark:text-sand">Total</span>
            <span className="text-neutral-900 dark:text-sand">
              ₹ {(order.totalPrice || 0).toFixed(0)}
            </span>
          </div>
        </motion.section>

        {/* Customer & shipping */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="lg:col-span-2 space-y-4"
        >
          <section className="rounded-3xl border border-amber-100/80 bg-white/90 p-5 shadow-soft dark:border-emerald-900/70 dark:bg-slate-950/90">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-neutral-500">
              <User className="h-4 w-4" />
              Customer
            </div>
            <div className="mt-3 space-y-2 text-xs">
              <p className="flex items-center gap-2 font-medium text-neutral-800 dark:text-sand">
                <User className="h-3.5 w-3.5 text-neutral-400" />
                {order.user?.name || '—'}
              </p>
              <p className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300">
                <Mail className="h-3.5 w-3.5 text-neutral-400" />
                <a
                  href={`mailto:${order.user?.email}`}
                  className="hover:underline"
                >
                  {order.user?.email || '—'}
                </a>
              </p>
            </div>
          </section>

          <section className="rounded-3xl border border-amber-100/80 bg-white/90 p-5 shadow-soft dark:border-emerald-900/70 dark:bg-slate-950/90">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-neutral-500">
              <MapPin className="h-4 w-4" />
              Shipping address
            </div>
            <div className="mt-3 space-y-1.5 text-xs text-neutral-700 dark:text-neutral-300">
              <p className="font-medium text-neutral-900 dark:text-sand">
                {address.fullName || '—'}
              </p>
              {address.street && <p>{address.street}</p>}
              <p>
                {[address.city, address.state, address.postalCode].filter(Boolean).join(', ')}
                {address.country && `, ${address.country}`}
              </p>
              {address.phone && (
                <p className="flex items-center gap-2 pt-1">
                  <Phone className="h-3.5 w-3.5" />
                  <a href={`tel:${address.phone}`} className="hover:underline">
                    {address.phone}
                  </a>
                </p>
              )}
              {!address.fullName && !address.street && (
                <p className="text-neutral-500">No address provided.</p>
              )}
            </div>
          </section>

          <section className="rounded-3xl border border-amber-100/80 bg-amber-50/50 p-5 dark:border-emerald-900/70 dark:bg-slate-900/50">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-neutral-500">
              <CreditCard className="h-4 w-4" />
              Payment
            </div>
            <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-300">
              UPI / collect on delivery. Mark as <strong>Paid</strong> when payment is received.
            </p>
          </section>
        </motion.div>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-[11px] text-neutral-500 dark:text-neutral-400">
        <span>Order ID: <code className="rounded bg-amber-100 px-1.5 py-0.5 dark:bg-slate-800">{order._id}</code></span>
        {order.updatedAt && (
          <span>Last updated: {formatDate(order.updatedAt)}</span>
        )}
      </div>
    </div>
  );
};

export default AdminOrderDetailPage;
