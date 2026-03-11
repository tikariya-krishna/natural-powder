import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Search,
  IndianRupee,
  XCircle,
  ExternalLink,
} from 'lucide-react';
import { api } from '../services/api.js';
import { useShop } from '../context/ShopContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const formatDate = (v) => {
  if (!v) return '—';
  const d = typeof v === 'string' ? new Date(v) : v;
  return isNaN(d.getTime()) ? '—' : d.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
};

const PAYMENT_DONE_STATUSES = ['paid', 'shipped', 'delivered'];

const isPaymentDone = (order) => PAYMENT_DONE_STATUSES.includes((order.status || '').toLowerCase());

const AdminPaymentsPage = () => {
  const { user, isAdmin } = useShop();
  const { addToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all | paid | unpaid

  useEffect(() => {
    api
      .get('/orders')
      .then((res) => setOrders(res.data || []))
      .catch(() => {
        addToast({
          variant: 'error',
          title: 'Payments not loaded',
          message: 'Could not load orders. Check your admin permissions or try again.',
        });
      })
      .finally(() => setLoading(false));
  }, [addToast]);

  const paidOrders = orders.filter(isPaymentDone);
  const unpaidOrders = orders.filter((o) => !isPaymentDone(o) && (o.status || '').toLowerCase() !== 'cancelled');
  const cancelledOrders = orders.filter((o) => (o.status || '').toLowerCase() === 'cancelled');

  const totalPaid = paidOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const totalUnpaid = unpaidOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

  const filtered = orders.filter((o) => {
    const matchFilter =
      filter === 'all' ||
      (filter === 'paid' && isPaymentDone(o)) ||
      (filter === 'unpaid' && !isPaymentDone(o) && (o.status || '').toLowerCase() !== 'cancelled') ||
      (filter === 'cancelled' && (o.status || '').toLowerCase() === 'cancelled');
    const matchSearch =
      !search.trim() ||
      (o.user?.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (o.user?.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (o._id || '').toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  if (!user || !isAdmin) {
    return (
      <div className="container-page py-16 text-center text-xs text-neutral-600 dark:text-neutral-300">
        Admin access only.
      </div>
    );
  }

  return (
    <div className="container-page space-y-6 pb-12">
      <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/admin"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-amber-200 bg-amber-50/80 text-neutral-600 transition hover:bg-amber-100 dark:border-emerald-800 dark:bg-slate-800 dark:text-sand dark:hover:bg-slate-700"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="font-display text-2xl text-neutral-900 md:text-3xl dark:text-sand">
              Payments
            </h1>
            <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
              See which orders are paid or pending
            </p>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/80 p-4 dark:border-emerald-800/80 dark:bg-emerald-950/40">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="h-5 w-5" />
            <span className="text-[11px] font-semibold uppercase tracking-wider">Paid</span>
          </div>
          <p className="mt-1 text-2xl font-bold text-emerald-900 dark:text-emerald-100">
            ₹ {totalPaid.toFixed(0)}
          </p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400">
            {paidOrders.length} order{paidOrders.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="rounded-2xl border border-amber-200/80 bg-amber-50/80 p-4 dark:border-amber-800/80 dark:bg-amber-950/40">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
            <Clock className="h-5 w-5" />
            <span className="text-[11px] font-semibold uppercase tracking-wider">Pending</span>
          </div>
          <p className="mt-1 text-2xl font-bold text-amber-900 dark:text-amber-100">
            ₹ {totalUnpaid.toFixed(0)}
          </p>
          <p className="text-[11px] text-amber-600 dark:text-amber-400">
            {unpaidOrders.length} order{unpaidOrders.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="rounded-2xl border border-amber-100/80 bg-white/90 p-4 dark:border-emerald-900/70 dark:bg-slate-950/90">
          <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
            <IndianRupee className="h-5 w-5" />
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total received</span>
          </div>
          <p className="mt-1 text-2xl font-bold text-neutral-900 dark:text-sand">
            ₹ {totalPaid.toFixed(0)}
          </p>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
            From paid / shipped / delivered
          </p>
        </div>
        <div className="rounded-2xl border border-neutral-200/80 bg-neutral-50/80 p-4 dark:border-neutral-700/80 dark:bg-neutral-900/40">
          <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
            <XCircle className="h-5 w-5" />
            <span className="text-[11px] font-semibold uppercase tracking-wider">Cancelled</span>
          </div>
          <p className="mt-1 text-2xl font-bold text-neutral-700 dark:text-neutral-300">
            {cancelledOrders.length}
          </p>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
            order{cancelledOrders.length !== 1 ? 's' : ''}
          </p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by customer or order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-full border border-amber-100 bg-white pl-9 pr-4 text-xs outline-none focus:border-amber-300 focus:ring-1 focus:ring-amber-300 dark:border-emerald-800 dark:bg-slate-900 dark:text-sand dark:focus:border-emerald-500 dark:focus:ring-emerald-500"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'all', label: 'All' },
            { value: 'paid', label: 'Paid' },
            { value: 'unpaid', label: 'Pending' },
            { value: 'cancelled', label: 'Cancelled' },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setFilter(opt.value)}
              className={`rounded-full px-4 py-2 text-[11px] font-medium transition ${
                filter === opt.value
                  ? 'bg-neutral-900 text-sand dark:bg-emerald-600 dark:text-white'
                  : 'bg-amber-50 text-neutral-700 hover:bg-amber-100 dark:bg-slate-800 dark:text-neutral-300 dark:hover:bg-slate-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center rounded-3xl border border-amber-100/80 bg-white/90 py-16 dark:border-emerald-900/70 dark:bg-slate-950/90">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-300 border-t-transparent dark:border-emerald-500" />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="overflow-hidden rounded-3xl border border-amber-100/80 bg-white/90 shadow-soft dark:border-emerald-900/70 dark:bg-slate-950/90"
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-xs">
              <thead>
                <tr className="border-b border-amber-100/80 bg-amber-50/50 dark:border-emerald-900/70 dark:bg-slate-900/50">
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Order
                  </th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Customer
                  </th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Amount
                  </th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Payment status
                  </th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Order status
                  </th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Date
                  </th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b border-amber-100/60 transition hover:bg-amber-50/30 dark:border-emerald-900/50 dark:hover:bg-slate-900/50"
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono text-[11px] text-neutral-600 dark:text-neutral-300">
                        #{order._id?.slice(-8)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-neutral-800 dark:text-sand">
                        {order.user?.name || '—'}
                      </p>
                      <p className="text-[11px] text-neutral-500">{order.user?.email || '—'}</p>
                    </td>
                    <td className="px-4 py-3 font-semibold text-neutral-900 dark:text-sand">
                      ₹ {(order.totalPrice || 0).toFixed(0)}
                    </td>
                    <td className="px-4 py-3">
                      {isPaymentDone(order) ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-medium text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Paid
                        </span>
                      ) : (order.status || '').toLowerCase() === 'cancelled' ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-0.5 text-[11px] font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                          <XCircle className="h-3.5 w-3.5" />
                          Cancelled
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-medium text-amber-800 dark:bg-amber-900/50 dark:text-amber-200">
                          <Clock className="h-3.5 w-3.5" />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 capitalize text-neutral-600 dark:text-neutral-300">
                      {order.status || '—'}
                    </td>
                    <td className="px-4 py-3 text-[11px] text-neutral-500 dark:text-neutral-400">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        to={`/admin/orders/${order._id}`}
                        className="inline-flex items-center gap-1 rounded-full bg-neutral-900 px-3 py-1.5 text-[11px] font-medium text-sand transition hover:bg-neutral-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        View order
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="py-16 text-center text-xs text-neutral-500 dark:text-neutral-400">
              {orders.length === 0
                ? 'No orders yet.'
                : 'No orders match your filters.'}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default AdminPaymentsPage;
