## Prkriti Organic Powders – MERN E‑commerce

Premium organic / ayurvedic powders store built with **MongoDB, Express, React (Vite), Node, Tailwind, Framer Motion, Axios, JWT**.

### 1. Project structure

- **backend**
  - `server.js` – Express app, CORS, JWT, route mounting.
  - `src/config/db.js` – Mongo connection.
  - `src/models/User.js` – name, email, password (hashed), role, wishlist.
  - `src/models/Product.js` – name, description, price, category, benefits, ingredients, image, stock, rating, numReviews.
  - `src/models/Order.js` – user, products, totalPrice, status, address.
  - `src/middleware/authMiddleware.js` – JWT `protect`, `admin`.
  - `src/middleware/errorMiddleware.js` – 404 + error handler.
  - `src/routes/authRoutes.js` – `/signup`, `/login`, `/me`.
  - `src/routes/productRoutes.js` – list, filter, CRUD (admin).
  - `src/routes/orderRoutes.js` – create order, my orders, manage orders (admin).
- **frontend**
  - `src/main.jsx` – React root, `BrowserRouter`, `ThemeProvider`, `ShopProvider`.
  - `src/App.jsx` – routes, page transitions, layout shell.
  - `src/context/ThemeContext.jsx` – light/dark mode (Tailwind `dark` class).
  - `src/context/ShopContext.jsx` – user/token, cart, totals, wishlist placeholder.
  - `src/services/api.js` – Axios instance, JWT header.
  - `src/components` – `Navbar`, `Footer`, `AnimatedHero`, `ProductCard`, `CategoryCard`, `PageTransition`, `LoadingSkeleton`.
  - `src/pages` – `HomePage`, `ProductsPage`, `ProductDetailsPage`, `CartPage`, `CheckoutPage`, `AuthPage`, `AdminDashboardPage` (you can extend them further).

### 2. Website flow (UX overview)

- **Landing (Home)**  
  - Animated hero with brand story, CTA to **Shop powders** and **Explore rituals**.  
  - Featured products grid (staggered cards, hover effects).  
  - Ritual categories (turmeric, neem, moringa, sandalwood) and benefits + testimonial block.
- **Browse products (`/products`)**  
  - Product grid with search, category and price filters.  
  - Each card shows image area, key benefit, price, rating; hover raises card and reveals quick‑add to cart.
- **Product details (`/products/:id`)**  
  - Large hero for powder, benefits, ingredients, usage rituals.  
  - Rating snippet and reviews section placeholder.  
  - Prominent animated **Add to cart** button and quantity control.
- **Cart (`/cart`)**  
  - Line items with image/summary, quantity stepper, remove action.  
  - Subtotal and total summary on the side.  
  - Micro‑animations on quantity change and summary updates; CTA to **Checkout**.
- **Checkout (`/checkout`)**  
  - Address + contact form on left, order summary on right.  
  - On submit, hits `/api/orders` with cart + address; shows success state and a placeholder “payment integration” block.
- **Auth (`/auth`)**  
  - Split‑card login / signup with smooth tab / card animation.  
  - Signup → `/api/auth/signup`, Login → `/api/auth/login`; JWT stored in localStorage and injected via Axios.
- **Admin (`/admin`)**  
  - Simple dashboard surface for products and orders.  
  - Add / edit / delete products (name, description, price, category, benefits, ingredients, stock, image URL).  
  - Orders table with ability to update status (pending / paid / shipped / delivered / cancelled).  
  - In a real deployment you’d gate this client route by `user.role === 'admin'` and server‑side `admin` middleware (already in place).

### 3. Backend API (summary)

- **Auth**
  - `POST /api/auth/signup` – `{ name, email, password }` → `{ user, token }`
  - `POST /api/auth/login` – `{ email, password }` → `{ user, token }`
  - `GET /api/auth/me` – current user (JWT `Authorization: Bearer <token>`).
- **Products**
  - `GET /api/products?keyword=&category=&minPrice=&maxPrice=` – list/filter products.
  - `GET /api/products/:id` – single product.
  - `POST /api/products` (admin) – create product.
  - `PUT /api/products/:id` (admin) – update product.
  - `DELETE /api/products/:id` (admin) – delete product.
- **Orders**
  - `POST /api/orders` (auth) – create order `{ products, totalPrice, address }`.
  - `GET /api/orders/my` (auth) – current user’s orders.
  - `GET /api/orders` (admin) – all orders with user + product info.
  - `PUT /api/orders/:id/status` (admin) – update order status.

You can extend this with wishlist and rating endpoints using the existing User/Product schema fields.

### 4. Styling & animation

- **Tailwind**: configured in `tailwind.config.js` with custom colours:
  - `leaf` (leaf green), `earth` (earthy brown), `sand` (beige), `turmeric` (warm yellow).
  - `darkMode: 'class'` with theme toggled via `ThemeContext`.
- **Framer Motion**:
  - Page transitions via `PageTransition` + `AnimatePresence` in `App.jsx`.
  - Animated hero copy, CTA buttons and floating “leaf / powder” particles in `AnimatedHero`.
  - Staggered product cards and scroll‑in sections on home and product grids.
  - Button tap / cart micro‑interactions.

### 5. Running the project locally

1. **Start MongoDB**
   - Ensure a MongoDB instance is running (default `mongodb://localhost:27017` is used in `.env.example`).

2. **Backend setup**
   - Copy env file:
     - `cd backend`
     - `cp .env.example .env` (on Windows PowerShell: `copy .env.example .env`)
     - Set `MONGO_URI` and `JWT_SECRET` as needed.
   - Install deps:
     - `npm install`
   - Run dev server:
     - `npm run dev`  
   - API will be on `http://localhost:5000`.

3. **Frontend setup**
   - In another terminal:
     - `cd frontend`
     - `npm install`
   - Optionally set `VITE_API_URL` in a `frontend/.env` (default is `http://localhost:5000/api`).
   - Run dev:
     - `npm run dev`
   - Open the printed Vite URL (usually `http://localhost:5173`).

### 6. Example product data (for seeding)

You can insert products via Mongo shell/Compass or by POSTing to `/api/products` as an admin. Example document:

```json
{
  "name": "Single-Origin Lakadong Turmeric Powder",
  "description": "High-curcumin Lakadong turmeric, stone-ground in small batches for masks, lattes and tonics.",
  "price": 520,
  "category": "turmeric",
  "benefits": [
    "Brightens and evens skin tone",
    "Powerful antioxidant and anti-inflammatory",
    "Supports digestion and joint comfort"
  ],
  "ingredients": [
    "100% Lakadong Curcuma longa rhizome"
  ],
  "image": "/images/turmeric-lakadong.jpg",
  "stock": 80
}
```

### 7. Extending and hardening

- Add proper **admin-only client guard** and 401/403 handling.
- Wire wishlist and rating to dedicated API endpoints and persist per user.
- Integrate a payment provider (Razorpay/Stripe) on the checkout confirmation step.
- Add meta tags and structured data for stronger SEO (category + product pages).

### 8. Recommended improvements & roadmap

- **UX & flows**
  - Add order history and profile pages so customers can view past ritual purchases and saved addresses.
  - Implement a richer reviews system (title, body, rating, photos) and surface it on product detail pages.
  - Introduce content pages (ritual guides, ingredient glossary, sourcing story) to deepen brand storytelling and SEO.
- **Performance & DX**
  - Enable code-splitting for larger routes (admin, product details) using React lazy + suspense to reduce initial bundle size.
  - Add image optimization (responsive sizes, modern formats, CDN) for product and hero imagery.
  - Plug in proper logging and monitoring (e.g. Winston + a hosted log service) on the backend.
- **Security & robustness**
  - Add refresh tokens / token rotation and stricter password policies, plus rate limiting on auth endpoints.
  - Enforce HTTPS, secure cookies (if you switch to cookie-based auth) and CORS rules per environment.
  - Add validation middleware (e.g. Zod/Joi) for all incoming request bodies, especially admin/product mutations.
- **Data & personalization**
  - Persist wishlist server-side and use it to drive personalized “Recommended for you” carousels.
  - Track basic analytics (anonymous) for product views and conversions to prioritise high-performing powders.
  - Add a “ritual builder” that bundles multiple powders into curated sets with pricing rules.




