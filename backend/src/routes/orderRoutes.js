import express from 'express';
import asyncHandler from 'express-async-handler';
import { ordersCol, productsCol } from '../config/firestoreCollections.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { serializeForJson } from '../utils/firestoreSerialize.js';

const router = express.Router();

const toOrder = (id, data) => ({
  _id: id,
  ...data,
  user: { name: data.userName, email: data.userEmail },
});

async function enrichOrdersWithProductNames(orders) {
  const productIds = new Set();
  orders.forEach((o) => (o.products || []).forEach((p) => p.product && productIds.add(p.product)));
  const namesById = {};
  if (productIds.size > 0) {
    const snap = await productsCol().get();
    snap.docs.forEach((d) => { namesById[d.id] = d.data().name || d.id; });
  }
  return orders.map((o) => ({
    ...o,
    products: (o.products || []).map((p) => ({
      ...p,
      name: namesById[p.product] || `Product ${p.product}`,
    })),
  }));
}

// POST /api/orders - create order
router.post(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const { products, totalPrice, address } = req.body;

    if (!products || products.length === 0) {
      res.status(400);
      throw new Error('No products in order');
    }

    const col = ordersCol();
    // Basic validation so totalPrice is numeric
    const orderData = {
      userId: req.user._id,
      userEmail: req.user.email || '',
      userName: req.user.name || '',
      products,
      totalPrice: Number(totalPrice),
      status: 'pending',
      address: address || {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Stock management: ensure we have enough stock for each product, then decrement.
    const productDocs = [];
    for (const item of products) {
      const ref = productsCol().doc(item.product);
      const doc = await ref.get();
      if (!doc.exists) {
        res.status(400);
        throw new Error('One of the products in your bag no longer exists.');
      }
      productDocs.push({ ref, doc, requestedQty: Number(item.qty || 0) });
    }

    for (const { doc, requestedQty } of productDocs) {
      const data = doc.data();
      const currentStockRaw = data.stock ?? 0;
      const currentStock =
        typeof currentStockRaw === 'number'
          ? currentStockRaw
          : Number(currentStockRaw) || 0;
      if (requestedQty <= 0) {
        res.status(400);
        throw new Error('Invalid quantity for one of the products.');
      }
      if (currentStock < requestedQty) {
        res.status(400);
        throw new Error(
          `Not enough stock for "${data.name || 'this product'}". Only ${currentStock} left.`
        );
      }
    }

    // All good – decrement stock
    for (const { ref, doc, requestedQty } of productDocs) {
      const data = doc.data();
      const currentStockRaw = data.stock ?? 0;
      const currentStock =
        typeof currentStockRaw === 'number'
          ? currentStockRaw
          : Number(currentStockRaw) || 0;
      await ref.update({
        stock: currentStock - requestedQty,
        updatedAt: new Date(),
      });
    }

    const ref = await col.add(orderData);
    const doc = await ref.get();
    res.status(201).json(serializeForJson(toOrder(doc.id, doc.data())));
  })
);

// GET /api/orders/my - get logged-in user's orders (with product names)
router.get(
  '/my',
  protect,
  asyncHandler(async (req, res) => {
    const col = ordersCol();
    const snapshot = await col
      .where('userId', '==', req.user._id)
      .orderBy('createdAt', 'desc')
      .get();
    let orders = snapshot.docs.map((doc) => toOrder(doc.id, doc.data()));
    orders = await enrichOrdersWithProductNames(orders);
    res.json(serializeForJson(orders));
  })
);

// GET /api/orders/:id - admin get single order (with product names)
router.get(
  '/:id',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const col = ordersCol();
    const doc = await col.doc(req.params.id).get();
    if (!doc.exists) {
      res.status(404);
      throw new Error('Order not found');
    }
    const data = doc.data();
    const products = data.products || [];
    const productIds = [...new Set(products.map((p) => p.product).filter(Boolean))];
    const namesById = {};
    if (productIds.length > 0) {
      const snap = await productsCol().get();
      snap.docs.forEach((d) => {
        namesById[d.id] = d.data().name || d.id;
      });
    }
    const enrichedProducts = products.map((p) => ({
      ...p,
      name: namesById[p.product] || `Product ${p.product}`,
    }));
    const order = toOrder(doc.id, { ...data, products: enrichedProducts });
    res.json(serializeForJson(order));
  })
);

// GET /api/orders - admin list all (must be after /:id so "my" and list are not caught as id)
router.get(
  '/',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const col = ordersCol();
    const snapshot = await col.orderBy('createdAt', 'desc').get();
    const orders = snapshot.docs.map((doc) => toOrder(doc.id, doc.data()));
    res.json(serializeForJson(orders));
  })
);

// PUT /api/orders/:id/status - admin update status
router.put(
  '/:id/status',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const { status } = req.body;
    const col = ordersCol();
    const ref = col.doc(req.params.id);
    const doc = await ref.get();
    if (!doc.exists) {
      res.status(404);
      throw new Error('Order not found');
    }
    const data = doc.data();
    const currentStatus = (data.status || 'pending').toLowerCase();
    const valid = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];
    const newStatus = valid.includes(status) ? status : data.status;

    // If we are cancelling an order that wasn't already cancelled, re-add stock.
    if (newStatus === 'cancelled' && currentStatus !== 'cancelled') {
      const items = Array.isArray(data.products) ? data.products : [];
      for (const item of items) {
        const qty = Number(item.qty || 0);
        if (!item.product || qty <= 0) continue;
        const pRef = productsCol().doc(item.product);
        const pDoc = await pRef.get();
        if (!pDoc.exists) continue;
        const pData = pDoc.data();
        const currentStockRaw = pData.stock ?? 0;
        const currentStock =
          typeof currentStockRaw === 'number'
            ? currentStockRaw
            : Number(currentStockRaw) || 0;
        await pRef.update({
          stock: currentStock + qty,
          updatedAt: new Date(),
        });
      }
    }

    await ref.update({ status: newStatus, updatedAt: new Date() });
    const updated = await ref.get();
    res.json(serializeForJson(toOrder(updated.id, updated.data())));
  })
);

export default router;
