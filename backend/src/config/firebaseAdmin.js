import admin from 'firebase-admin';

let app;

export const getFirebaseAdmin = () => {
  if (app) return admin;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error('Firebase admin environment variables are not set correctly.');
  }

  app = admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });

  return admin;
};

/** @returns {FirebaseFirestore.Firestore} */
export const getFirestore = () => getFirebaseAdmin().firestore();

