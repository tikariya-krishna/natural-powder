## Prkriti Organic Powders – Architecture & Flow

This document explains **how the frontend and backend are structured**, how data flows between them, and which main tools/libraries are used in each part.

---

### 1. Backend (Node.js + Express + MongoDB)

#### 1.1 Entry point – `server.js`

- **Responsibilities**
  - Load environment variables with `dotenv`.
  - Connect to MongoDB via `connectDB` (`src/config/db.js`).
  - Configure middleware:
    - `cors` – allow requests from `CLIENT_URL`.
    - `express.json` / `express.urlencoded` – parse JSON and form bodies.
    - `cookie-parser` – ready for cookie-based auth if needed.
    - `morgan` – request logging.
  - Mount route modules:
    - `/api/auth` → `authRoutes.js`
    - `/api/products` → `productRoutes.js`
    - `/api/orders` → `orderRoutes.js`
  - Attach error handlers:
    - `notFound` – 404 handler.
    - `errorHandler` – standardized JSON error response.

- **Tech used**
  - `express`, `cors`, `morgan`, `cookie-parser`, `dotenv`.

#### 1.2 Database config – `src/config/db.js`

- Connects to MongoDB using `mongoose.connect(process.env.MONGO_URI)`.
- Handles connection success/failure and terminates the process if the DB cannot be reached.

#### 1.3 Models

1. **User – `src/models/User.js`**
   - Fields:
     - `name`, `email` (unique), `password`, `role` (`user` or `admin`), `wishlist` (array of product IDs).
   - Hooks:
     - `pre('save')` – hashes passwords with `bcryptjs`.
   - Methods:
     - `matchPassword` – compare plaintext password to hashed password.
   - Used in:
     - `authRoutes` for login/signup.
     - `authMiddleware` to attach `req.user`.

2. **Product – `src/models/Product.js`**
   - Fields:
     - Basic info: `name`, `description`, `price`, `category`.
     - Content: `benefits[]`, `ingredients[]`, `image`, `stock`.
     - Ratings: `rating`, `numReviews`.
   - Used in:
     - `productRoutes` for listing, filtering, details, and admin CRUD.
     - `Order` model via references.

3. **Order – `src/models/Order.js`**
   - Fields:
     - `user` – reference to `User`.
     - `products` – array of `{ product, qty, price }`.
     - `totalPrice`, `status`.
     - `address` – structured shipping address fields.
   - Used in:
     - `orderRoutes` to create orders, list user/admin orders, and update status.

#### 1.4 Middleware

1. **Auth – `src/middleware/authMiddleware.js`**
   - `protect`:
     - Reads JWT from `Authorization: Bearer <token>`.
     - Verifies with `jsonwebtoken` and loads user (without password).
     - Attaches `req.user` or throws 401 if invalid.
   - `admin`:
     - Ensures `req.user.role === 'admin'`; otherwise 403.

2. **Error – `src/middleware/errorMiddleware.js`**
   - `notFound`:
     - Creates a 404 error when route not matched.
   - `errorHandler`:
     - Normalises error responses to `{ message, stack? }`.

#### 1.5 Routes

1. **Auth routes – `src/routes/authRoutes.js`**
   - `POST /api/auth/signup`:
     - Validates unique email, creates user, returns user info + JWT.
   - `POST /api/auth/login`:
     - Validates credentials, returns user info + JWT.
   - `GET /api/auth/me`:
     - Requires `protect`, returns current user.
   - Libraries:
     - `express-async-handler` for clean async error handling.

2. **Product routes – `src/routes/productRoutes.js`**
   - `GET /api/products`:
     - Supports filters: `keyword`, `category`, `minPrice`, `maxPrice`.
   - `GET /api/products/:id`:
     - Returns a single product by ID.
   - `POST /api/products` (admin):
     - Creates a product document.
   - `PUT /api/products/:id` (admin):
     - Updates product.
   - `DELETE /api/products/:id` (admin):
     - Removes product.

3. **Order routes – `src/routes/orderRoutes.js`**
   - `POST /api/orders` (auth):
     - Creates an order from cart data and shipping address.
   - `GET /api/orders/my` (auth):
     - Lists orders belonging to the logged-in user.
   - `GET /api/orders` (admin):
     - Lists all orders with user + product info populated.
   - `PUT /api/orders/:id/status` (admin):
     - Updates order `status`.

---

### 2. Frontend (React + Vite + Tailwind + Framer Motion)

#### 2.1 Entry & providers – `src/main.jsx`

- Sets up application root with:
  - `BrowserRouter` – client-side routing.
  - `ThemeProvider` – light/dark theme using Tailwind `dark` mode.
  - `ToastProvider` – global toasts for user messages.
  - `ShopProvider` – auth, cart, wishlist, totals, and session loading state.

#### 2.2 Global layout – `src/App.jsx`

- Uses `useLocation` + `AnimatePresence` to animate page transitions.
- Wraps content between:
  - `Navbar` – header/nav with brand, theme toggle, cart, login/logout.
  - `Footer` – brand footer with social icons.
- **Session gating**
  - If `authLoading` is true → show `FullPageLoader`.
  - If `user` is null → show only `AuthPage` (login/signup).
  - If `user` exists → full route tree is available.
- Routes:
  - `/` → `HomePage`
  - `/products` → `ProductsPage`
  - `/products/:id` → `ProductDetailsPage`
  - `/cart` → `CartPage`
  - `/checkout` → `CheckoutPage`
  - `/wishlist` → `WishlistPage` (client-only for now)
  - `/admin` → `AdminDashboardPage`

#### 2.3 Service layer – `src/services/api.js`

- `axios` instance configured with:
  - `baseURL` from `VITE_API_URL` or `http://localhost:5000/api`.
  - Request interceptor that injects `Authorization: Bearer <token>` from `localStorage`.
- Used by:
  - `AuthPage`, `HomePage`, `ProductsPage`, `ProductDetailsPage`, `CheckoutPage`, `AdminDashboardPage`, and `ShopContext`.

#### 2.4 Contexts

1. **Theme – `ThemeContext.jsx`**
   - Holds `theme` (`light`/`dark`) and `toggleTheme`.
   - Persists theme in `localStorage` and toggles `document.documentElement.classList`.

2. **Shop – `ShopContext.jsx`**
   - State:
     - `user`, `token`, `authLoading`.
     - `cart` (local), `wishlist` (local), computed `totals`.
   - Effects:
     - Persists token to `localStorage`.
     - When token exists, fetches `/auth/me` to restore session; sets `authLoading` while in progress.
   - Methods:
     - `addToCart`, `updateCartQty`, `removeFromCart`.
     - `setUser`, `setToken`.
     - `logout` – clears user, token, cart, wishlist, and sets `authLoading` false.

3. **Toast – `ToastContext.jsx`**
   - State:
     - `toasts[]` – small objects containing `{ id, variant, title, message }`.
   - Methods:
     - `addToast({ variant, title, message, duration? })` – pushes a toast and auto-removes it after a timeout.
   - UI:
     - Animated stack of toasts at the top center of the viewport.
   - Used by pages to show **user-friendly success/error messages**.

#### 2.5 Core components

- **Navbar – `components/Navbar.jsx`**
  - Desktop nav: Home, Powders, Benefits, Admin.
  - Theme toggle.
  - Login/logout pill that reflects auth state.
  - Wishlist and animated cart pill with item count.
  - Mobile:
    - Hamburger menu (`Menu`/`X`) that toggles a slide-down menu with links and login/logout.

- **Footer – `components/Footer.jsx`**
  - Brand lockup and tagline.
  - Social icon buttons.

- **AnimatedHero – `components/AnimatedHero.jsx`**
  - Large animated hero with brand copy, CTAs, and vector-like ritual card.
  - Floating gradient “powder particles” using Framer Motion.

- **PageTransition – `components/PageTransition.jsx`**
  - Wraps page content with fade/slide transitions between routes.

- **ProductCard / CategoryCard / LoadingSkeleton**
  - Reusable product UI with hover animations and quick add-to-cart (`ProductCard`).
  - Category highlight tiles (`CategoryCard`).
  - Shimmering skeletons for loading states (`LoadingSkeleton`, `ProductSkeletonGrid`).

- **FullPageLoader – `components/FullPageLoader.jsx`**
  - Full-screen loader used during session restore.
  - Floating leaf icon + organic progress bar.

#### 2.6 Key pages

1. **Auth – `pages/AuthPage.jsx`**
   - Illustration block:
     - “Ritual account” text, welcome copy, and custom SVG powder illustration.
   - Form block:
     - Tabs for Login / Sign up.
     - Fields:
       - Login: email, password, remember me, “Forgot password?” placeholder.
       - Signup: name, email, password, confirm password, remember me.
     - Client validation:
       - Password == confirm password.
     - Error handling:
       - Shows backend message if present.
       - Friendly fallbacks for common HTTP errors (401, 400, network).

2. **Home – `pages/HomePage.jsx`**
   - Hero, featured powders, categories, and educational section.
   - Calls `/products` to fetch featured items.
   - Shows toast if fetching products fails.

3. **Products – `pages/ProductsPage.jsx`**
   - Search, filters, and product grid.
   - On fetch error, shows a toast describing the issue.

4. **Product details – `pages/ProductDetailsPage.jsx`**
   - Rich product hero and detail layout.
   - Quantity control and animated “Add to ritual bag” button.
   - Placeholder reviews section.

5. **Cart – `pages/CartPage.jsx`**
   - Editable cart lines, quantity steppers, removable items.
   - Order summary sidebar.

6. **Checkout – `pages/CheckoutPage.jsx`**
   - Address form and order summary.
   - Submits order via `/api/orders`.
   - Success and error states are reflected via inline UI and toasts.

7. **Admin – `pages/AdminDashboardPage.jsx`**
   - Product editor:
     - Form to create/update products.
     - Product list with inline “Edit” and “Delete”.
   - Orders view:
     - Scrollable list of orders with status dropdowns.

8. **Wishlist – `pages/WishlistPage.jsx`**
   - Currently uses client-only `wishlist` from context.
   - Ready to be wired up to server‑side wishlist endpoints.

---

### 3. How frontend & backend talk to each other

1. **Authentication**
   - User submits login/signup form from `AuthPage`.
   - Frontend → `POST /api/auth/login` or `POST /api/auth/signup` via Axios.
   - Backend:
     - Validates credentials, returns `{ _id, name, email, role, token }`.
   - Frontend:
     - Stores `token` in `ShopContext` + `localStorage`.
     - Redirects to `/` and `ShopContext` uses `/auth/me` to keep session up‑to‑date.

2. **Product browsing**
   - Home / Products call `GET /api/products` with optional query params.
   - Product details call `GET /api/products/:id`.

3. **Cart & checkout**
   - Cart is currently stored in `ShopContext` only (front-end state).
   - Checkout submits a derived payload to `POST /api/orders`:
     - Products, quantities, unit prices, and address.
   - Backend creates and persists the order, returning the document.

4. **Admin operations**
   - Admin dashboard uses:
     - `GET /api/products`, `POST /api/products`, `PUT /api/products/:id`, `DELETE /api/products/:id`.
     - `GET /api/orders`, `PUT /api/orders/:id/status`.
   - All admin routes require a valid admin JWT; guarded by `protect` + `admin` middleware.

---

### 4. Extending this architecture

- Use the **improvement roadmap** in `PROJECT_FLOW_AND_IMPROVEMENTS.md` to plan:
  - Forgot‑password flow using new auth routes and a reset page.
  - Server‑side wishlist and ratings using the existing User/Product schema extensions.
  - Account / profile pages that consume `/api/auth/me` and new user routes.
- When adding new features, prefer:
  - Backend: new Express route modules and Mongoose models where needed.
  - Frontend: new pages/components that call `api`, manage state in `ShopContext`, and surface user feedback with `ToastContext`.

