# Firebase Setup – Step-by-Step Guide

This project uses **Firebase** for everything: **Authentication**, **Firestore** (products, orders, users). There is no MongoDB; all data lives in Firebase.

---

## 1. Create a Firebase project

1. Go to [Firebase Console](https://console.firebase.google.com/) and sign in.
2. Click **Add project** (or **Create a project**).
3. Enter a project name (e.g. `prkriti-organics`) and follow the steps (Google Analytics optional).
4. Once the project is created, open it.

---

## 2. Enable Authentication (Email/Password)

1. In the left sidebar, go to **Build → Authentication**.
2. Click **Get started** if prompted.
3. Open the **Sign-in method** tab.
4. Click **Email/Password**, turn **Enable** on, then **Save**.

---

## 3. Enable Firestore Database

1. In the left sidebar, go to **Build → Firestore Database**.
2. Click **Create database**.
3. Choose **Start in production mode** (the backend uses the Admin SDK and does not rely on client-side rules for API access).
4. Pick a Firestore location (e.g. `us-central1` or closest to you). This cannot be changed later.
5. Click **Enable**. Firestore will create a default database.

**Collections** (created automatically when the app runs):

- **`users`** – One document per user, document ID = Firebase Auth UID. Fields: `email`, `name`, `role` (`user` or `admin`), `wishlist`, `createdAt`, `updatedAt`.
- **`products`** – One document per product (auto-generated IDs). Fields: `name`, `description`, `price`, `category`, `benefits`, `ingredients`, `image`, `stock`, `rating`, `numReviews`, `createdAt`, `updatedAt`.
- **`orders`** – One document per order (auto-generated IDs). Fields: `userId`, `userEmail`, `userName`, `products`, `totalPrice`, `status`, `address`, `createdAt`, `updatedAt`.

---

## 4. Create a Firestore index (for “My orders”)

The “My orders” feature uses a query: `orders` where `userId == currentUser` ordered by `createdAt` descending.

1. When you first use **My orders** (or the admin orders list), Firestore may return an error in the backend console.
2. The error message will contain a **link** to create the required index in the Firebase Console (e.g. “The query requires an index”).
3. Open that link in your browser and click **Create index**. Wait until the index status is **Enabled**.

If you prefer to create it manually:

1. Go to **Firestore Database → Indexes**.
2. Click **Create index**.
3. Collection: **`orders`**.
4. Add two fields:
   - **`userId`** – Ascending  
   - **`createdAt`** – Descending  
5. Query scope: **Collection**.  
6. Click **Create**.

---

## 5. Register a Web app and get config

1. In **Project settings** (gear icon), open **General**.
2. Under **Your apps**, click the **Web** icon (`</>`).
3. Register an app nickname (e.g. `Prkriti Web`) and optionally set up Firebase Hosting. Click **Register app**.
4. Copy the `firebaseConfig` object (e.g. `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`). You will use these in the **frontend** `.env`.

---

## 6. Generate a service account key (for backend)

The backend uses the **Firebase Admin SDK** to verify Auth tokens and read/write Firestore.

1. In **Project settings**, open the **Service accounts** tab.
2. Click **Generate new private key** and confirm. A JSON file will download.
3. Open the JSON file and note:
   - **`project_id`**
   - **`client_email`**
   - **`private_key`** (full string, including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`).

---

## 7. Backend environment variables

In the **backend** folder, create or edit `.env`:

```env
PORT=5000
CLIENT_URL=http://localhost:5173

# Firebase Admin SDK (from service account JSON)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY_LINES_HERE\n-----END PRIVATE KEY-----\n"

# Admin: set this email to grant admin access (dashboard, add/edit products, orders)
ADMIN_EMAIL=your-admin-email@example.com
```

- **FIREBASE_PROJECT_ID** – same as `project_id` in the service account JSON.
- **FIREBASE_CLIENT_EMAIL** – same as `client_email`.
- **FIREBASE_PRIVATE_KEY** – paste the `private_key` value. Keep the quotes. Use real newlines inside the string, or `\n` for line breaks (depending on your OS/env). Ensure there are no extra spaces.

You do **not** need `MONGO_URI` or any MongoDB variables; the app uses only Firebase.

---

## 8. Frontend environment variables

In the **frontend** folder, create or edit `.env`:

```env
# From Firebase Web app config (step 5)
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Backend API base URL
VITE_API_URL=http://localhost:5000/api

# Same as backend: email that should see the Admin tab and have admin rights
VITE_ADMIN_EMAIL=your-admin-email@example.com

# UPI payment QR code (optional – for checkout)
VITE_UPI_ID=your-upi-id@paytm
VITE_UPI_NAME=Prkriti Organics
```

Use the same admin email as in the backend `ADMIN_EMAIL`.

- **VITE_UPI_ID** – Your UPI ID (e.g. `username@paytm`, `username@ybl` for PhonePe, `username@okaxis` for GPay). When the user places an order, a QR code appears for the exact amount; scanning opens any UPI app with the amount pre-filled.
- **VITE_UPI_NAME** – Display name shown in the UPI payment request (e.g. your business name).

---

## 9. Install and run

**Backend**

```bash
cd backend
npm install
npm run dev
```

**Frontend** (in another terminal)

```bash
cd frontend
npm install
npm run dev
```

Open the frontend URL (e.g. `http://localhost:5173`).

---

## 10. What to do in order (checklist)

| Step | Action |
|------|--------|
| 1 | Create Firebase project. |
| 2 | Enable **Email/Password** in Authentication. |
| 3 | Create **Firestore** database (production mode), choose location. |
| 4 | (After first “My orders” use) Create Firestore index for `orders` (`userId` + `createdAt` desc) using the link in the error or manually. |
| 5 | Add **Web app** in project settings and copy `firebaseConfig`. |
| 6 | Generate **service account** private key and copy `project_id`, `client_email`, `private_key`. |
| 7 | Set **backend** `.env`: `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`, `ADMIN_EMAIL`. |
| 8 | Set **frontend** `.env`: all `VITE_FIREBASE_*`, `VITE_API_URL`, `VITE_ADMIN_EMAIL`. |
| 9 | Run `npm install` and `npm run dev` in both `backend` and `frontend`. |
| 10 | Sign up with the admin email (same as `ADMIN_EMAIL`). The first login will create a user in Firestore with `role: 'admin'`. |
| 11 | Use **Admin** tab to add products. Products and orders are stored in Firestore. |
| 12 | (Optional) Add `VITE_UPI_ID` and `VITE_UPI_NAME` to frontend `.env` so checkout shows a UPI QR code for the order amount. |

---

## 11. Summary: where data lives

| Data | Where it lives |
|------|----------------|
| **Users (auth)** | Firebase Authentication. |
| **User profile / role** | Firestore `users` collection (doc ID = Auth UID). Created on first login. |
| **Products** | Firestore `products` collection. Added/edited via Admin panel. |
| **Orders** | Firestore `orders` collection. Created at checkout; listed under “My orders” and in Admin. |

There is no MongoDB in this setup; everything is stored in Firebase (Auth + Firestore).
