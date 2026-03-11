## Prkriti Organic Powders – Project Flow & Improvements

This document complements `README.md` by describing the **end‑to‑end flow** of the website and a **prioritized list of improvements** you can implement next.

---

### 1. High‑level flows

#### 1.1 Visitor flow (unauthenticated)

1. **First visit**
   - App boots and `ShopContext` checks for a stored JWT.
   - If no valid token: user sees only the **Auth screen** (login/signup), with hero text + vector powder illustration and form stacked vertically.
2. **Authentication**
   - **Login**: email + password; optional “Remember me”.
   - **Signup**: name, email, password, confirm password.
   - On success: token is stored in `localStorage`, user is cached in context, and user is redirected to **Home**.
3. **Error handling**
   - Clear inline error messages (bad credentials, password mismatch, server unreachable).
   - Global toast system (`ToastProvider`) is available for cross‑page messages.

#### 1.2 Authenticated user flow

1. **Home**
   - Organic hero with CTA.
   - Featured powders fetched from `/api/products`.
   - Ritual categories and brand story.
2. **Products**
   - `/products`: grid with search, category + price filters.
   - On error, a toast indicates that products could not be loaded.
3. **Product details**
   - `/products/:id`: powder hero, benefits, ingredients, usage ritual, rating display.
   - Animated quantity control and “Add to ritual bag”.
4. **Cart**
   - `/cart`: editable line items with quantity steppers and live price summary.
5. **Checkout**
   - `/checkout`: address form, order summary.
   - On submit, POST to `/api/orders` and show **success** or **failure** toast.
6. **Account / session**
   - Navbar shows user name/email + logout.
   - Logout clears token, user, cart, wishlist and returns to Auth view.

#### 1.3 Admin flow

1. **Access**
   - Admin signs in with an account whose `role` is `'admin'`.
2. **Admin dashboard**
   - Product editor (create / update / delete powders).
   - Orders list with status control (pending, paid, shipped, delivered, cancelled).
3. **Back‑office actions**
   - Admin uses dashboard to maintain catalog and update order statuses after payment or shipping.

---

### 2. Current implementation snapshot

- **Backend**
  - Models: `User`, `Product`, `Order`.
  - Auth: `/api/auth/signup`, `/api/auth/login`, `/api/auth/me` with JWT.
  - Products: `/api/products` (filtering), `/api/products/:id`, admin CRUD.
  - Orders: create, list own, admin list, update status.
- **Frontend**
  - React + Vite + Tailwind 3, Framer Motion, Axios, React Router.
  - Contexts: `ThemeContext` (light/dark), `ShopContext` (user, token, cart, wishlist, totals, auth loading, logout), `ToastContext` (global toasts).
  - Pages: Home, Products, Product Details, Cart, Checkout, Auth, Wishlist (placeholder), Admin dashboard.
  - UI: organic gradients, animated hero, staggered cards, creative auth illustration, loader, responsive navbar with mobile menu.

---

### 3. Improvement backlog (prioritized)

#### 3.1 Must‑have (stability & core UX)

1. **Forgot password flow**
   - Backend:
     - `POST /api/auth/forgot-password` – accept email, create reset token / OTP, send mail.
     - `POST /api/auth/reset-password` – verify token, set new password.
   - Frontend:
     - Replace current alert on “Forgot password?” with:
       - Email capture screen + success/error toasts.
       - Reset form at `/reset-password/:token`.
2. **Admin route protection (frontend)**
   - Add a `ProtectedAdminRoute` wrapper that:
     - Checks `user?.role === 'admin'`.
     - Redirects non‑admins to Home and shows a toast: “Admin access only.”
3. **Consistent API error surface**
   - Standardize backend error format `{ message, code }` for all routes.
   - In Axios interceptor, map unknown errors to friendly messages and optionally log raw errors for debugging.

#### 3.2 Should‑have (e‑commerce depth)

4. **Wishlist persistence**
   - Backend:
     - Add wishlist endpoints (`GET`/`POST`/`DELETE`) using the `wishlist` field on `User`.
   - Frontend:
     - Wire `ProductCard` heart button to these endpoints.
     - Update `WishlistPage` to show actual server data, not just in‑memory state.
5. **Ratings & reviews**
   - Backend:
     - Add review schema (per user + product) and endpoints to create/update reviews.
   - Frontend:
     - Turn `ProductDetailsPage` review placeholder into a list + review form.
     - Prevent duplicate reviews per user; show clear messages for constraints.
6. **Order history & profile settings**
   - Backend:
     - Reuse `/api/orders/my` and add `/api/users/me` update route.
   - Frontend:
     - Add account page with “My orders” and basic profile/address editing.

#### 3.3 Nice‑to‑have (refinement & growth)

7. **SEO & content**
   - Add per‑route `<title>` and meta descriptions.
   - Add structured data (JSON‑LD) on product pages.
   - Add “Rituals & Guides” and “Ingredients” content pages.
8. **Performance**
   - Code‑split heavy routes (`AdminDashboardPage`, `ProductDetailsPage`, `CheckoutPage`) with `React.lazy` + `Suspense`, using the organic loader.
   - Implement lightweight caching (or a query library) for product lists and details.
9. **Analytics & personalization**
   - Add a small tracking layer (page views, product views, add‑to‑cart, checkout steps).
   - Use wishlist + view data to power “Recommended for you” and “Recently viewed”.

---

### 4. How to use this document

- Treat items in **3.1** as the next concrete milestones to ship.
- When opening new tickets/tasks, reference the exact bullet from this file so intent stays aligned with the original UX and brand direction.
- Update this file as you implement features, moving items from “Must‑have” to “Done” and expanding new ideas under “Nice‑to‑have”.

