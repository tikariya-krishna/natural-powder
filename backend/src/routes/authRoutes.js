import express from 'express';
import asyncHandler from 'express-async-handler';
import { protect } from '../middleware/authMiddleware.js';
import { serializeForJson } from '../utils/firestoreSerialize.js';

const router = express.Router();

// Current user (Firebase token verified, user from Firestore)
router.get(
  '/me',
  protect,
  asyncHandler(async (req, res) => {
    res.json(serializeForJson(req.user));
  })
);

export default router;
