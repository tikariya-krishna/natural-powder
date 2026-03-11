import asyncHandler from 'express-async-handler';
import { getFirebaseAdmin } from '../config/firebaseAdmin.js';
import { usersCol } from '../config/firestoreCollections.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }

  try {
    const admin = getFirebaseAdmin();
    const decoded = await admin.auth().verifyIdToken(token);

    const uid = decoded.uid;
    const email = decoded.email || null;
    const name = decoded.name || (email ? email.split('@')[0] : 'Guest');

    const col = usersCol();
    const userRef = col.doc(uid);
    const userSnap = await userRef.get();

    let userData;
    if (userSnap.exists) {
      userData = { _id: uid, ...userSnap.data() };
    } else {
      const adminEmail = (process.env.ADMIN_EMAIL || '').toLowerCase().trim();
      const role = adminEmail && email && email.toLowerCase() === adminEmail ? 'admin' : 'user';
      await userRef.set({
        email,
        name,
        role,
        wishlist: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      userData = { _id: uid, email, name, role, wishlist: [] };
    }

    req.user = userData;
    next();
  } catch (error) {
    console.error('verifyIdToken error:', error.message);
    res.status(401);
    throw new Error('Not authorized, token invalid');
  }
});

export const admin = (req, res, next) => {
  const adminEmail = (process.env.ADMIN_EMAIL || '').toLowerCase().trim();

  if (
    req.user &&
    (req.user.role === 'admin' || (adminEmail && req.user.email && req.user.email.toLowerCase() === adminEmail))
  ) {
    next();
  } else {
    res.status(403);
    throw new Error('Admin access only');
  }
};
