import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import HomePage from './pages/HomePage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import ProductDetailsPage from './pages/ProductDetailsPage.jsx';
import CartPage from './pages/CartPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';
import AdminOrdersPage from './pages/AdminOrdersPage.jsx';
import AdminOrderDetailPage from './pages/AdminOrderDetailPage.jsx';
import AdminPaymentsPage from './pages/AdminPaymentsPage.jsx';
import MyOrdersPage from './pages/MyOrdersPage.jsx';
import WishlistPage from './pages/WishlistPage.jsx';
import BenefitsPage from './pages/BenefitsPage.jsx';
import PageTransition from './components/PageTransition.jsx';
import AiChatWidget from './components/AiChatWidget.jsx';
import { useShop } from './context/ShopContext.jsx';
import FullPageLoader from './components/FullPageLoader.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import StockPage from './pages/StockPage.jsx';

function App() {
  const location = useLocation();

  const { user, authLoading } = useShop();

  if (authLoading) {
    return <FullPageLoader />;
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col bg-[radial-gradient(circle_at_top,_#fdf4d5,_transparent_55%),_radial-gradient(circle_at_bottom,_#e6f2e8,_transparent_55%)] dark:bg-[radial-gradient(circle_at_top,_#111827,_transparent_55%),_radial-gradient(circle_at_bottom,_#022c22,_transparent_55%)]">
        <main className="flex-1">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/auth" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
          <AiChatWidget />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[radial-gradient(circle_at_top,_#fdf4d5,_transparent_55%),_radial-gradient(circle_at_bottom,_#e6f2e8,_transparent_55%)] dark:bg-[radial-gradient(circle_at_top,_#111827,_transparent_55%),_radial-gradient(circle_at_bottom,_#022c22,_transparent_55%)]">
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <PageTransition>
                  <HomePage />
                </PageTransition>
              }
            />
            <Route
              path="/products"
              element={
                <PageTransition>
                  <ProductsPage />
                </PageTransition>
              }
            />
            <Route
              path="/products/:id"
              element={
                <PageTransition>
                  <ProductDetailsPage />
                </PageTransition>
              }
            />
            <Route
              path="/cart"
              element={
                <PageTransition>
                  <CartPage />
                </PageTransition>
              }
            />
            <Route
              path="/checkout"
              element={
                <PageTransition>
                  <CheckoutPage />
                </PageTransition>
              }
            />
            <Route
              path="/about"
              element={
                <PageTransition>
                  <BenefitsPage />
                </PageTransition>
              }
            />
            <Route
              path="/orders"
              element={
                <PageTransition>
                  <MyOrdersPage />
                </PageTransition>
              }
            />
            <Route
              path="/wishlist"
              element={
                <PageTransition>
                  <WishlistPage />
                </PageTransition>
              }
            />
            <Route
              path="/profile"
              element={
                <PageTransition>
                  <ProfilePage />
                </PageTransition>
              }
            />
            <Route
              path="/admin"
              element={
                <PageTransition>
                  <AdminDashboardPage />
                </PageTransition>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <PageTransition>
                  <AdminOrdersPage />
                </PageTransition>
              }
            />
            <Route
              path="/admin/orders/:id"
              element={
                <PageTransition>
                  <AdminOrderDetailPage />
                </PageTransition>
              }
            />
            <Route
              path="/admin/payments"
              element={
                <PageTransition>
                  <AdminPaymentsPage />
                </PageTransition>
              }
            />
            <Route
              path="/admin/stock"
              element={
                <PageTransition>
                  <StockPage />
                </PageTransition>
              }
            />
          </Routes>
        </AnimatePresence>
        <AiChatWidget />
      </main>
      <Footer />
    </div>
  );
}

export default App;
