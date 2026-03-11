import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { firebaseApp } from '../firebase/client.js';
import { useShop } from '../context/ShopContext.jsx';
import { AuthLayout } from '../components/AuthLayout.jsx';

const RegisterPage = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setUser, setToken, user } = useShop();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/', { replace: true });
  }, [user, navigate]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      const auth = getAuth(firebaseApp);
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      const idToken = await cred.user.getIdToken();
      setToken(idToken);
      setUser({
        _id: cred.user.uid,
        name: cred.user.displayName || cred.user.email,
        email: cred.user.email,
        role: 'user',
      });
      navigate('/', { replace: true });
    } catch (err) {
      const code = err?.code;
      if (code === 'auth/popup-closed-by-user') setError('Google sign-in was closed before completing. Please try again.');
      else if (code === 'auth/network-request-failed') setError('Network error. Please check your connection and try again.');
      else setError('Could not sign you in with Google. Please try again in a moment.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const auth = getAuth(firebaseApp);
      const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
      if (form.name) await updateProfile(cred.user, { displayName: form.name });
      const idToken = await cred.user.getIdToken();
      setToken(idToken);
      setUser({
        _id: cred.user.uid,
        name: form.name || cred.user.email,
        email: cred.user.email,
        role: 'user',
      });
      navigate('/', { replace: true });
    } catch (err) {
      const code = err?.code;
      if (code === 'auth/email-already-in-use') setError('An account with this email already exists. Please log in instead.');
      else if (code === 'auth/weak-password') setError('Password is too weak. Please use at least 6 characters.');
      else if (code === 'auth/network-request-failed') setError('Network error. Please check your connection and try again.');
      else setError('Something went wrong while creating your account. Please try again in a moment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Join the ritual circle"
      subtitle="Save favourite powders, track ritual orders and unlock early access to limited harvest batches."
    >
      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="space-y-3"
      >
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-[11px] uppercase tracking-[0.22em] text-neutral-500">Name</label>
            <input
              required
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="h-9 w-full rounded-full border border-amber-100 bg-white/80 px-3 text-xs outline-none focus:border-amber-300 focus:ring-1 focus:ring-amber-300 dark:border-emerald-800 dark:bg-slate-950 dark:text-sand dark:focus:border-emerald-500 dark:focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] uppercase tracking-[0.22em] text-neutral-500">Email</label>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="h-9 w-full rounded-full border border-amber-100 bg-white/80 px-3 text-xs outline-none focus:border-amber-300 focus:ring-1 focus:ring-amber-300 dark:border-emerald-800 dark:bg-slate-950 dark:text-sand dark:focus:border-emerald-500 dark:focus:ring-emerald-500"
            />
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-[11px] uppercase tracking-[0.22em] text-neutral-500">Password</label>
            <input
              required
              type="password"
              value={form.password}
              onChange={(e) => handleChange('password', e.target.value)}
              className="h-9 w-full rounded-full border border-amber-100 bg-white/80 px-3 text-xs outline-none focus:border-amber-300 focus:ring-1 focus:ring-amber-300 dark:border-emerald-800 dark:bg-slate-950 dark:text-sand dark:focus:border-emerald-500 dark:focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] uppercase tracking-[0.22em] text-neutral-500">Confirm password</label>
            <input
              required
              type="password"
              value={form.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              className="h-9 w-full rounded-full border border-amber-100 bg-white/80 px-3 text-xs outline-none focus:border-amber-300 focus:ring-1 focus:ring-amber-300 dark:border-emerald-800 dark:bg-slate-950 dark:text-sand dark:focus:border-emerald-500 dark:focus:ring-emerald-500"
            />
          </div>
        </div>
        {error && <p className="text-[11px] text-rose-600 dark:text-rose-300">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-1 flex h-9 w-full items-center justify-center rounded-full bg-neutral-900 text-[11px] font-semibold uppercase tracking-[0.22em] text-sand shadow-soft transition hover:bg-neutral-800 disabled:opacity-70 dark:bg-emerald-500 dark:text-emerald-50 dark:hover:bg-emerald-400"
        >
          {loading ? 'Creating account…' : 'Sign up'}
        </button>
      </motion.form>
      <div className="flex items-center gap-3 pt-2">
        <div className="h-px flex-1 bg-amber-200/80 dark:bg-emerald-900/60" />
        <span className="text-[10px] uppercase tracking-[0.22em] text-neutral-400 dark:text-neutral-500">or</span>
        <div className="h-px flex-1 bg-amber-200/80 dark:bg-emerald-900/60" />
      </div>
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="flex h-9 w-full items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-800 transition hover:bg-neutral-50 disabled:opacity-70 dark:border-emerald-800 dark:bg-slate-950 dark:text-sand dark:hover:bg-slate-900"
      >
        <span className="inline-flex h-4 w-4 items-center justify-center rounded-[2px] bg-white">
          <svg viewBox="0 0 18 18" aria-hidden="true" className="h-3.5 w-3.5">
            <path fill="#EA4335" d="M9 7.3v3.1h4.3c-.2 1-.8 1.9-1.7 2.5l2.8 2.2C15.7 13.8 16.5 11.7 16.5 9c0-.5 0-1-.1-1.5H9z" />
            <path fill="#34A853" d="M5.2 10.6 4.5 11.1 2.3 12.8A7.48 7.48 0 0 0 9 16.5c2.1 0 3.9-.7 5.2-2.1l-2.8-2.2c-.7.5-1.6.8-2.4.8-1.9 0-3.6-1.3-4.1-3.1z" />
            <path fill="#FBBC05" d="M2.3 5.2A7.45 7.45 0 0 0 1.5 9c0 1.1.3 2.1.8 3l2.7-2.1A3.84 3.84 0 0 1 4.8 9c0-.3.1-.6.2-.9L2.3 5.2z" />
            <path fill="#4285F4" d="M9 4.3c1 0 1.8.3 2.5 1l1.9-1.9C12.9 2.4 11.1 1.5 9 1.5 6.4 1.5 4.1 3 2.3 5.2l2.7 2.1C5.5 5.6 7.1 4.3 9 4.3z" />
          </svg>
        </span>
        <span>Continue with Google</span>
      </button>
      <p className="pt-3 text-center text-[11px] text-neutral-600 dark:text-neutral-400">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-neutral-900 underline underline-offset-4 hover:text-amber-700 dark:text-sand dark:hover:text-amber-300">
          Log in
        </Link>
      </p>
      <p className="pt-1 text-[10px] leading-relaxed text-neutral-500 dark:text-neutral-400">
        By continuing, you agree to Prkriti&apos;s <span className="underline underline-offset-4">Terms of use</span> and <span className="underline underline-offset-4">Privacy policy</span>.
      </p>
    </AuthLayout>
  );
};

export default RegisterPage;
