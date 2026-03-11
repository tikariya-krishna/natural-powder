import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, Search } from 'lucide-react';
import { api } from '../services/api.js';
import { useShop } from '../context/ShopContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

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

const AdminOrdersPage = () => {
  const { user, isAdmin } = useShop();
  const { addToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    api
      .get('/orders')
      .then((res) => setOrders(res.data || []))
      .catch(() => {
        addToast({
          variant: 'error',
          title: 'Orders not loaded',
          message: 'Could not load orders. Check your admin permissions or try again.',
        });
      })
      .finally(() => setLoading(false));
  }, [addToast]);

  const filtered = orders.filter((o) => {
    const matchStatus = statusFilter === 'all' || (o.status || '').toLowerCase() === statusFilter;
    const matchSearch =
      !search.trim() ||
      (o.user?.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (o.user?.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (o._id || '').toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
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
              All orders
            </h1>
            <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
              {orders.length} order{orders.length !== 1 ? 's' : ''} total
            </p>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by customer name, email or order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-full border border-amber-100 bg-white pl-9 pr-4 text-xs outline-none focus:border-amber-300 focus:ring-1 focus:ring-amber-300 dark:border-emerald-800 dark:bg-slate-900 dark:text-sand dark:focus:border-emerald-500 dark:focus:ring-emerald-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 rounded-full border border-amber-100 bg-white px-4 text-xs outline-none focus:border-amber-300 dark:border-emerald-800 dark:bg-slate-900 dark:text-sand dark:focus:border-emerald-500"
        >
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </motion.div>

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
                    Items
                  </th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Total
                  </th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Status
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
                        #{order._id.slice(-8)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-neutral-800 dark:text-sand">
                        {order.user?.name || '—'}
                      </p>
                      <p className="text-[11px] text-neutral-500">{order.user?.email || '—'}</p>
                    </td>
                    <td className="px-4 py-3 text-neutral-600 dark:text-neutral-300">
                      {(order.products || []).length} item(s)
                    </td>
                    <td className="px-4 py-3 font-semibold text-neutral-900 dark:text-sand">
                      ₹ {(order.totalPrice || 0).toFixed(0)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ${
                          statusColors[order.status] || statusColors.pending
                        }`}
                      >
                        {order.status || 'pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[11px] text-neutral-500 dark:text-neutral-400">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        to={`/admin/orders/${order._id}`}
                        className="inline-flex items-center gap-1 rounded-full bg-neutral-900 px-3 py-1.5 text-[11px] font-medium text-sand transition hover:bg-neutral-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                      >
                        <Package className="h-3.5 w-3.5" />
                        View
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

export default AdminOrdersPage;
