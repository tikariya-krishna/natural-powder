import express from 'express';
import asyncHandler from 'express-async-handler';
import { productsCol } from '../config/firestoreCollections.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { serializeForJson } from '../utils/firestoreSerialize.js';

const router = express.Router();

const toProduct = (id, data) => ({ _id: id, ...data });

// GET /api/products
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { keyword = '', category, minPrice, maxPrice } = req.query;
    const col = productsCol();
    const snapshot = await col.orderBy('createdAt', 'desc').get();
    let products = snapshot.docs.map((doc) => toProduct(doc.id, doc.data()));

    if (keyword && keyword.trim()) {
      const k = keyword.toLowerCase().trim();
      products = products.filter((p) => (p.name || '').toLowerCase().includes(k));
    }
    if (category && category !== 'all') {
      products = products.filter((p) => p.category === category);
    }
    if (minPrice != null && minPrice !== '') {
      const min = Number(minPrice);
      if (!Number.isNaN(min)) products = products.filter((p) => (p.price || 0) >= min);
    }
    if (maxPrice != null && maxPrice !== '') {
      const max = Number(maxPrice);
      if (!Number.isNaN(max)) products = products.filter((p) => (p.price || 0) <= max);
    }

    res.json(serializeForJson(products));
  })
);

// GET /api/products/:id
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const col = productsCol();
    const doc = await col.doc(req.params.id).get();
    if (!doc.exists) {
      res.status(404);
      throw new Error('Product not found');
    }
    res.json(serializeForJson(toProduct(doc.id, doc.data())));
  })
);

// POST /api/products/:id/reviews - add review (logged-in user, e.g. after payment)
router.post(
  '/:id/reviews',
  protect,
  asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;
    const numRating = Number(rating);
    if (Number.isNaN(numRating) || numRating < 1 || numRating > 5) {
      res.status(400);
      throw new Error('Rating must be between 1 and 5');
    }
    const col = productsCol();
    const ref = col.doc(req.params.id);
    const doc = await ref.get();
    if (!doc.exists) {
      res.status(404);
      throw new Error('Product not found');
    }
    const data = doc.data();
    const reviews = Array.isArray(data.reviews) ? [...data.reviews] : [];
    const newReview = {
      userId: req.user._id,
      userName: req.user.name || 'Customer',
      rating: numRating,
      comment: typeof comment === 'string' ? comment.trim().slice(0, 1000) : '',
      createdAt: new Date(),
    };
    reviews.push(newReview);
    const sum = reviews.reduce((s, r) => s + (r.rating || 0), 0);
    const avgRating = reviews.length ? sum / reviews.length : 0;
    await ref.update({
      reviews,
      rating: Math.round(avgRating * 10) / 10,
      numReviews: reviews.length,
      updatedAt: new Date(),
    });
    const updated = await ref.get();
    res.status(201).json(serializeForJson(toProduct(updated.id, updated.data())));
  })
);

// POST /api/products (admin)
router.post(
  '/',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const col = productsCol();
    const data = {
      ...req.body,
      rating: req.body.rating ?? 0,
      numReviews: req.body.numReviews ?? 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const ref = await col.add(data);
    const doc = await ref.get();
    res.status(201).json(serializeForJson(toProduct(doc.id, doc.data())));
  })
);

// PUT /api/products/:id (admin)
router.put(
  '/:id',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const col = productsCol();
    const ref = col.doc(req.params.id);
    const doc = await ref.get();
    if (!doc.exists) {
      res.status(404);
      throw new Error('Product not found');
    }
    const update = { ...req.body, updatedAt: new Date() };
    await ref.update(update);
    const updated = await ref.get();
    res.json(serializeForJson(toProduct(updated.id, updated.data())));
  })
);

// DELETE /api/products/:id (admin)
router.delete(
  '/:id',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const col = productsCol();
    const ref = col.doc(req.params.id);
    const doc = await ref.get();
    if (!doc.exists) {
      res.status(404);
      throw new Error('Product not found');
    }
    await ref.delete();
    res.json({ message: 'Product removed' });
  })
);

export default router;
