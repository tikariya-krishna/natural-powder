import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plus, Save, Trash2, List, CreditCard } from 'lucide-react';
import { api } from '../services/api.js';
import { useShop } from '../context/ShopContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const emptyProduct = {
  name: '',
  description: '',
  price: '',
  category: 'turmeric',
  benefits: '',
  ingredients: '',
  image: '',
  stock: '',
};

const AdminDashboardPage = () => {
  const { user, isAdmin } = useShop();
  const { addToast } = useToast();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [editing, setEditing] = useState(emptyProduct);
  const [editingId, setEditingId] = useState('');

  useEffect(() => {
    api
      .get('/products')
      .then((res) => setProducts(res.data))
      .catch(() => {
        addToast({
          variant: 'error',
          title: 'Products not loaded',
          message: 'Could not load products for the admin panel. Please refresh or try again later.',
        });
      });
    api
      .get('/orders')
      .then((res) => setOrders(res.data))
      .catch(() => {
        addToast({
          variant: 'error',
          title: 'Orders not loaded',
          message: 'Could not load orders. Check your admin permissions or try again.',
        });
      });
  }, []);

  if (!user || !isAdmin) {
    return (
      <div className="container-page py-16 text-center text-xs text-neutral-600 dark:text-neutral-300">
        Admin access only. Ensure you are logged in with an admin account.
      </div>
    );
  }

  const resetForm = () => {
    setEditing(emptyProduct);
    setEditingId('');
  };

  const handleChange = (field, value) => {
    setEditing((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const price = Number(editing.price);
    const stock = Number(editing.stock || 0);

    if (!editing.name.trim() || !editing.description.trim()) {
      addToast({
        variant: 'error',
        title: 'Missing details',
        message: 'Please provide at least a name and description for the product.',
      });
      return;
    }

    if (Number.isNaN(price) || price <= 0) {
      addToast({
        variant: 'error',
        title: 'Invalid price',
        message: 'Price must be a positive number.',
      });
      return;
    }

    if (Number.isNaN(stock) || stock < 0) {
      addToast({
        variant: 'error',
        title: 'Invalid stock',
        message: 'Stock cannot be negative.',
      });
      return;
    }

    const payload = {
      ...editing,
      price,
      stock,
      benefits: editing.benefits
        ? editing.benefits.split('\n').map((v) => v.trim()).filter(Boolean)
        : [],
      ingredients: editing.ingredients
        ? editing.ingredients.split('\n').map((v) => v.trim()).filter(Boolean)
        : [],
    };

    try {
      if (editingId) {
        const res = await api.put(`/products/${editingId}`, payload);
        setProducts((prev) => prev.map((p) => (p._id === editingId ? res.data : p)));
        addToast({
          variant: 'success',
          title: 'Product updated',
          message: `"${res.data.name}" has been updated.`,
        });
      } else {
        const res = await api.post('/products', payload);
        setProducts((prev) => [res.data, ...prev]);
        addToast({
          variant: 'success',
          title: 'Product created',
          message: `"${res.data.name}" has been added to your catalog.`,
        });
      }
      resetForm();
    } catch (error) {
      addToast({
        variant: 'error',
        title: 'Save failed',
        message: 'We could not save this product. Please check your details or try again.',
      });
    }
  };

  const startEdit = (product) => {
    setEditingId(product._id);
    setEditing({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      benefits: (product.benefits || []).join('\n'),
      ingredients: (product.ingredients || []).join('\n'),
      image: product.image || '',
      stock: product.stock ?? '',
    });
  };

  const removeProduct = async (id) => {
    try {
      const product = products.find((p) => p._id === id);
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      if (editingId === id) resetForm();
      addToast({
        variant: 'success',
        title: 'Product removed',
        message: product ? `"${product.name}" has been deleted.` : 'Product has been deleted.',
      });
    } catch {
      addToast({
        variant: 'error',
        title: 'Delete failed',
        message: 'We could not delete this product. Please try again.',
      });
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      const res = await api.put(`/orders/${id}/status`, { status });
      setOrders((prev) => prev.map((o) => (o._id === id ? res.data : o)));
      addToast({
        variant: 'success',
        title: 'Order updated',
        message: `Order status set to "${res.data.status}".`,
      });
    } catch {
      addToast({
        variant: 'error',
        title: 'Update failed',
        message: 'Could not update order status. Please try again.',
      });
    }
  };

  return (
    <div className="container-page space-y-8">
      <div className="flex flex-col gap-2 pt-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-2xl text-neutral-900 md:text-3xl dark:text-sand">
            Admin dashboard
          </h1>
          <p className="mt-1 text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
            Manage powders and monitor orders from a single, minimal surface.
          </p>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-[minmax(0,_1.3fr)_minmax(0,_1.3fr)]">
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="space-y-4 rounded-3xl border border-amber-100/80 bg-white/90 p-5 text-xs shadow-soft dark:border-emerald-900/70 dark:bg-slate-950/90"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-neutral-500">
              Product editor
            </p>
            <div className="flex items-center gap-2">
              <Link
                to="/admin/stock"
                className="hidden items-center gap-1 rounded-full border border-amber-100 bg-white px-3 py-1 text-[11px] font-medium text-neutral-700 transition hover:border-amber-300 hover:bg-amber-50 md:inline-flex dark:border-emerald-800 dark:bg-slate-900 dark:text-neutral-200 dark:hover:border-emerald-500 dark:hover:bg-emerald-900/60"
              >
                <List className="h-3.5 w-3.5" />
                Stock
              </Link>
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-medium text-neutral-700 dark:bg-slate-900 dark:text-neutral-200"
              >
                <Plus className="h-3.5 w-3.5" />
                New
              </button>
            </div>
          </div>
          <form onSubmit={handleSave} className="space-y-3">
            <input
              required
              placeholder="Name"
              value={editing.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="h-9 w-full rounded-full border border-amber-100 bg-amber-50/70 px-3 text-xs outline-none focus:border-amber-300 focus:bg-white focus:ring-1 focus:ring-amber-300 dark:border-emerald-800 dark:bg-slate-900 dark:text-sand dark:focus:border-emerald-500 dark:focus:ring-emerald-500"
            />
            <textarea
              placeholder="Description"
              value={editing.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              className="w-full rounded-2xl border border-amber-100 bg-amber-50/70 px-3 py-2 text-xs outline-none focus:border-amber-300 focus:bg-white focus:ring-1 focus:ring-amber-300 dark:border-emerald-800 dark:bg-slate-900 dark:text-sand dark:focus:border-emerald-500 dark:focus:ring-emerald-500"
            />
            <div className="grid gap-3 md:grid-cols-3">
              <input
                type="number"
                placeholder="Price (₹)"
                value={editing.price}
                onChange={(e) => handleChange('price', e.target.value)}
                className="h-9 w-full rounded-full border border-amber-100 bg-amber-50/70 px-3 text-xs outline-none focus:border-amber-300 focus:bg-white focus:ring-1 focus:ring-amber-300 dark:border-emerald-800 dark:bg-slate-900 dark:text-sand dark:focus:border-emerald-500 dark:focus:ring-emerald-500"
              />
              <select
                value={editing.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="h-9 w-full rounded-full border border-amber-100 bg-amber-50/70 px-3 text-xs outline-none focus:border-amber-300 focus:bg-white focus:ring-1 focus:ring-amber-300 dark:border-emerald-800 dark:bg-slate-900 dark:text-sand dark:focus:border-emerald-500 dark:focus:ring-emerald-500"
              >
                <option value="turmeric">Turmeric</option>
                <option value="neem">Neem</option>
                <option value="moringa">Moringa</option>
                <option value="sandalwood">Sandalwood</option>
                <option value="herbal-blend">Herbal blend</option>
                <option value="other">Other</option>
              </select>
              <input
                type="number"
                placeholder="Stock"
                value={editing.stock}
                onChange={(e) => handleChange('stock', e.target.value)}
                className="h-9 w-full rounded-full border border-amber-100 bg-amber-50/70 px-3 text-xs outline-none focus:border-amber-300 focus:bg-white focus:ring-1 focus:ring-amber-300 dark:border-emerald-800 dark:bg-slate-900 dark:text-sand dark:focus:border-emerald-500 dark:focus:ring-emerald-500"
              />
            </div>
            <input
              placeholder="Image URL"
              value={editing.image}
              onChange={(e) => handleChange('image', e.target.value)}
              className="h-9 w-full rounded-full border border-amber-100 bg-amber-50/70 px-3 text-xs outline-none focus:border-amber-300 focus:bg-white focus:ring-1 focus:ring-amber-300 dark:border-emerald-800 dark:bg-slate-900 dark:text-sand dark:focus:border-emerald-500 dark:focus:ring-emerald-500"
            />
            <textarea
              placeholder="Benefits (one per line)"
              value={editing.benefits}
              onChange={(e) => handleChange('benefits', e.target.value)}
              rows={3}
              className="w-full rounded-2xl border border-amber-100 bg-amber-50/70 px-3 py-2 text-xs outline-none focus:border-amber-300 focus:bg-white focus:ring-1 focus:ring-amber-300 dark:border-emerald-800 dark:bg-slate-900 dark:text-sand dark:focus:border-emerald-500 dark:focus:ring-emerald-500"
            />
            <textarea
              placeholder="Ingredients (one per line)"
              value={editing.ingredients}
              onChange={(e) => handleChange('ingredients', e.target.value)}
              rows={3}
              className="w-full rounded-2xl border border-amber-100 bg-amber-50/70 px-3 py-2 text-xs outline-none focus:border-amber-300 focus:bg-white focus:ring-1 focus:ring-amber-300 dark:border-emerald-800 dark:bg-slate-900 dark:text-sand dark:focus:border-emerald-500 dark:focus:ring-emerald-500"
            />
            <div className="flex items-center justify-between pt-1">
              <button
                type="submit"
                className="inline-flex items-center gap-1 rounded-full bg-neutral-900 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-sand shadow-soft transition hover:bg-neutral-800 dark:bg-emerald-500 dark:text-emerald-50 dark:hover:bg-emerald-400"
              >
                <Save className="h-3.5 w-3.5" />
                {editingId ? 'Update' : 'Create'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-[11px] text-neutral-500 underline underline-offset-4"
                >
                  Cancel edit
                </button>
              )}
            </div>
          </form>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="space-y-4 rounded-3xl border border-amber-100/80 bg-white/90 p-5 text-xs shadow-soft dark:border-emerald-900/70 dark:bg-slate-950/90"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-neutral-500">
              Orders
            </p>
            <div className="flex items-center gap-2">
              <Link
                to="/admin/payments"
                className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5 text-[11px] font-medium text-amber-900 transition hover:bg-amber-200 dark:bg-slate-800 dark:text-sand dark:hover:bg-slate-700"
              >
                <CreditCard className="h-3.5 w-3.5" />
                Payments
              </Link>
              <Link
                to="/admin/orders"
                className="inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-3 py-1.5 text-[11px] font-medium text-sand transition hover:bg-neutral-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
              >
                <List className="h-3.5 w-3.5" />
                All orders
              </Link>
            </div>
          </div>
          <div className="space-y-3 max-h-80 overflow-auto pr-1">
            {orders.map((order) => (
              <div
                key={order._id}
                className="space-y-1 rounded-2xl border border-amber-100 bg-amber-50/60 p-3 dark:border-emerald-900/70 dark:bg-slate-900/80"
              >
                <div className="flex justify-between">
                  <span className="text-[11px] font-semibold text-neutral-800 dark:text-sand">
                    {order.user?.name || 'Guest'}
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    ₹ {(order.totalPrice || 0).toFixed(0)}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500">
                  {order.products?.length ?? 0} items • {order.status}
                </p>
                <div className="mt-1 flex gap-2">
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                    className="h-7 flex-1 rounded-full border border-amber-100 bg-white px-2 text-[11px] outline-none focus:border-amber-300 focus:ring-1 focus:ring-amber-300 dark:border-emerald-800 dark:bg-slate-950 dark:text-sand dark:focus:border-emerald-500 dark:focus:ring-emerald-500"
                  >
                    <option value="pending">pending</option>
                    <option value="paid">paid</option>
                    <option value="shipped">shipped</option>
                    <option value="delivered">delivered</option>
                    <option value="cancelled">cancelled</option>
                  </select>
                  <Link
                    to={`/admin/orders/${order._id}`}
                    className="inline-flex h-7 items-center rounded-full bg-neutral-800 px-2.5 text-[11px] font-medium text-sand hover:bg-neutral-700 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <p className="text-[11px] text-neutral-500 dark:text-neutral-300">
                No orders yet. They will show here as customers check out.
              </p>
            )}
          </div>

          <p className="pt-1 text-[11px] text-neutral-500 dark:text-neutral-400">
            Tip: hook up CSV export, filters and search as your order volume grows.
          </p>
        </motion.section>
      </div>

      <section className="space-y-3 rounded-3xl border border-amber-100/80 bg-white/90 p-5 text-[11px] text-neutral-600 shadow-soft dark:border-emerald-900/70 dark:bg-slate-950/90 dark:text-neutral-300">
        <p className="font-semibold uppercase tracking-[0.28em] text-neutral-500">
          Products
        </p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <div
              key={p._id}
              className="flex items-center justify-between rounded-2xl border border-amber-100 bg-amber-50/70 px-3 py-2 dark:border-emerald-900/70 dark:bg-slate-900/80"
            >
              <div className="pr-2">
                <p className="text-xs font-semibold text-neutral-800 dark:text-sand">
                  {p.name}
                </p>
                <p className="text-[11px] text-neutral-500">
                  ₹ {p.price.toFixed(0)} • stock {p.stock ?? 0}
                </p>
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => startEdit(p)}
                  className="rounded-full bg-white px-2 py-1 text-[11px] text-neutral-700 shadow-sm dark:bg-slate-950 dark:text-sand"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => removeProduct(p._id)}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-rose-50 text-rose-600 shadow-sm dark:bg-rose-950/50 dark:text-rose-300"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboardPage;

