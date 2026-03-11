import { getFirestore } from './firebaseAdmin.js';

export const COLLECTIONS = {
  USERS: 'users',
  PRODUCTS: 'products',
  ORDERS: 'orders',
  // Firestore collection storing app credentials (e.g. UPI). In your project this is named "credential".
  CREDENTIALS: 'credential',
};

export const getDb = () => getFirestore();

export const usersCol = () => getDb().collection(COLLECTIONS.USERS);
export const productsCol = () => getDb().collection(COLLECTIONS.PRODUCTS);
export const ordersCol = () => getDb().collection(COLLECTIONS.ORDERS);
export const credentialsCol = () => getDb().collection(COLLECTIONS.CREDENTIALS);
