import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { firebaseApp } from '../firebase/client.js';

const WISHLIST_KEY = 'prkriti_wishlist';

const getWishlistKey = (userId) => (userId ? `${WISHLIST_KEY}_${userId}` : WISHLIST_KEY);

const loadWishlistFromStorage = (userId) => {
  try {
    const raw = typeof window !== 'undefined' && window.localStorage.getItem(getWishlistKey(userId));
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (_) {}
  return [];
};

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  const [authLoading, setAuthLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const wishlistLoadedForUser = useRef(null);

  // Load wishlist from localStorage when user is set
  useEffect(() => {
    if (!user) return;
    const list = loadWishlistFromStorage(user._id);
    setWishlist(list);
    wishlistLoadedForUser.current = user._id;
  }, [user?._id]);

  // Persist wishlist to localStorage whenever it changes (after we've loaded for this user)
  useEffect(() => {
    if (!user || wishlistLoadedForUser.current !== user._id) return;
    try {
      window.localStorage.setItem(getWishlistKey(user._id), JSON.stringify(wishlist));
    } catch (_) {}
  }, [wishlist]); // only run when wishlist changes so we don't overwrite with [] right after login

  // Attach Firebase auth listener once
  useEffect(() => {
    const auth = getAuth(firebaseApp);

    // We are starting an auth check
    setAuthLoading(true);

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        setUser(null);
        setToken('');
        setAuthLoading(false);
        return;
      }

      try {
        const idToken = await fbUser.getIdToken();
        setToken(idToken);
        window.localStorage.setItem('token', idToken);
        setUser({
          _id: fbUser.uid,
          name: fbUser.displayName || fbUser.email,
          email: fbUser.email,
          role: 'user',
        });
      } catch {
        setUser(null);
        setToken('');
        window.localStorage.removeItem('token');
      }
      // In either case, auth check for this user state is done
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // No extra /auth/me call – we trust Firebase user as the source of truth client-side.

  const addToCart = (product, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item.product._id === product._id ? { ...item, qty: item.qty + qty } : item
        );
      }
      return [...prev, { product, qty }];
    });
  };

  const updateCartQty = (productId, qty) => {
    setCart((prev) =>
      prev
        .map((item) => (item.product._id === productId ? { ...item, qty } : item))
        .filter((item) => item.qty > 0)
    );
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.product._id !== productId));
  };

  const clearCart = () => setCart([]);

  const addToWishlist = (product) => {
    setWishlist((prev) => {
      if (prev.some((p) => p._id === product._id)) return prev;
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlist((prev) => prev.filter((p) => p._id !== productId));
  };

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const inList = prev.some((p) => p._id === product._id);
      if (inList) return prev.filter((p) => p._id !== product._id);
      return [...prev, product];
    });
  };

  const isInWishlist = (productId) =>
    wishlist.some((p) => p._id === productId);

  const totals = useMemo(() => {
    const itemsCount = cart.reduce((sum, item) => sum + item.qty, 0);
    const subtotal = cart.reduce((sum, item) => sum + item.qty * item.product.price, 0);
    return { itemsCount, subtotal, total: subtotal };
  }, [cart]);

  const logout = () => {
    setUser(null);
    setToken('');
    setCart([]);
    setWishlist([]);
    wishlistLoadedForUser.current = null;
    window.localStorage.removeItem('token');
    const auth = getAuth(firebaseApp);
    signOut(auth).catch(() => {});
    setAuthLoading(false);
  };

  const adminEmail =
    import.meta.env.VITE_ADMIN_EMAIL &&
    import.meta.env.VITE_ADMIN_EMAIL.toString().toLowerCase().trim();

  const value = {
    user,
    token,
    setUser,
    setToken,
    cart,
    addToCart,
    updateCartQty,
    removeFromCart,
    clearCart,
    wishlist,
    setWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    totals,
    authLoading,
    isAdmin:
      !!user &&
      !!adminEmail &&
      user.email &&
      user.email.toString().toLowerCase().trim() === adminEmail,
    logout,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export const useShop = () => useContext(ShopContext);

