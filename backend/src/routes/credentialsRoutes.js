import express from 'express';
import asyncHandler from 'express-async-handler';
import { credentialsCol } from '../config/firestoreCollections.js';

const router = express.Router();

// GET /api/credentials/upi - fetch UPI config (public)
router.get(
  '/upi',
  asyncHandler(async (req, res) => {
    const docId = 'FlYBtWVEvKSfel8oSIb8';
    const doc = await credentialsCol().doc(docId).get();

    if (!doc.exists) {
      return res.json({
        upiId: '',
        upiName: 'Prkriti Organics',
      });
    }

    const data = doc.data() || {};

    // Support both camelCase (upiId) and snake_case (upi_id) field names.
    const upiId = data.upiId || data.upi_id || '';
    const upiName = data.upiName || data.upi_name || 'Prkriti Organics';

    res.json({ upiId, upiName });
  })
);

export default router;

