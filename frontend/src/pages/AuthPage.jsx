import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { firebaseApp } from '../firebase/client.js';
import { useShop } from '../context/ShopContext.jsx';

const AuthPage = () => {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    remember: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);
  const { setUser, setToken, user } = useShop();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const toggleMode = () => {
    setMode((m) => (m === 'login' ? 'signup' : 'login'));
    setError('');
    setForgotPasswordMode(false);
    setForgotPasswordSuccess(false);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    const email = (form.email || '').trim();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    setLoading(true);
    setError('');
    setForgotPasswordSuccess(false);
    try {
      const auth = getAuth(firebaseApp);
      await sendPasswordResetEmail(auth, email);
      setForgotPasswordSuccess(true);
    } catch (err) {
      const code = err?.code;
      if (code === 'auth/user-not-found') {
        setError('No account found with this email. Please check the address or sign up.');
      } else if (code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else if (code === 'auth/too-many-requests') {
        setError('Too many attempts. Please try again later.');
      } else {
        setError('Could not send reset email. Please try again in a moment.');
      }
    } finally {
      setLoading(false);
    }
  };

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
      if (code === 'auth/popup-closed-by-user') {
        setError('Google sign-in was closed before completing. Please try again.');
      } else if (code === 'auth/network-request-failed') {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError('Could not sign you in with Google. Please try again in a moment.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (mode === 'signup' && form.password !== form.confirmPassword) {
        setLoading(false);
        setError('Passwords do not match.');
        return;
      }
      const auth = getAuth(firebaseApp);

      if (mode === 'login') {
        const cred = await signInWithEmailAndPassword(auth, form.email, form.password);
        const idToken = await cred.user.getIdToken();
        setToken(idToken);
        setUser({
          _id: cred.user.uid,
          name: cred.user.displayName || cred.user.email,
          email: cred.user.email,
          role: 'user',
        });
      } else {
        const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
        if (form.name) {
          await updateProfile(cred.user, { displayName: form.name });
        }
        const idToken = await cred.user.getIdToken();
        setToken(idToken);
        setUser({
          _id: cred.user.uid,
          name: form.name || cred.user.email,
          email: cred.user.email,
          role: 'user',
        });
      }
      navigate('/', { replace: true });
    } catch (err) {
      const code = err?.code;
      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password') {
        setError('Email or password is incorrect. Please try again.');
      } else if (code === 'auth/user-not-found') {
        setError('No account found for this email. Please check or create a new account.');
      } else if (code === 'auth/email-already-in-use') {
        setError('An account with this email already exists. Please log in instead.');
      } else if (code === 'auth/weak-password') {
        setError('Password is too weak. Please use at least 6 characters.');
      } else if (code === 'auth/network-request-failed') {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError('Something went wrong while signing you in. Please try again in a moment.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-page flex items-center justify-center py-10 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex w-full max-w-3xl flex-col gap-5 rounded-[2rem] border border-amber-100/80 bg-white/90 p-5 shadow-soft md:max-w-4xl md:p-7 dark:border-emerald-900/70 dark:bg-slate-950/90"
      >
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-sand via-amber-50 to-emerald-50 p-4 dark:from-emerald-950 dark:via-slate-950 dark:to-black">
          <div className="absolute inset-3 rounded-[1.4rem] border border-amber-100/80 bg-white/70 dark:border-emerald-900/70 dark:bg-slate-950/80" />
          <div className="relative z-10 flex h-full flex-col justify-between gap-4 p-4">
            <div className="space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-neutral-500 dark:text-neutral-300">
                Ritual account
              </p>
              <h1 className="font-display text-2xl text-neutral-900 md:text-[1.85rem] dark:text-sand">
                {mode === 'login' ? 'Welcome back to Prkriti' : 'Join the ritual circle'}
              </h1>
              <p className="max-w-md text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
                Save favourite powders, track ritual orders and unlock early access to limited
                harvest batches.
              </p>
            </div>

            {/* Organic powder illustration */}
            <div className="mt-3 grid grid-cols-[auto,1fr] items-center gap-3">
              <div className="relative h-20 w-20">
                <span className="absolute inset-0 rounded-full bg-gradient-to-br from-leaf/70 via-turmeric/80 to-earth/80 blur-sm opacity-70" />
                <span className="absolute inset-1.5 rounded-full bg-amber-50/90 shadow-soft dark:bg-slate-900/90" />
                <motion.div
                  initial={{ y: 6, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="relative flex h-full items-center justify-center"
                >
                  <svg
                    viewBox="0 0 80 80"
                    className="h-14 w-14 text-amber-900/90 dark:text-amber-100"
                  >
                    <defs>
                      <linearGradient id="powder" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFC94A" />
                        <stop offset="50%" stopColor="#F5E6C8" />
                        <stop offset="100%" stopColor="#3B7A57" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M10 52c8-8 18-12 30-12s22 4 30 12v6c0 4-3 7-7 7H17c-4 0-7-3-7-7v-6Z"
                      fill="url(#powder)"
                    />
                    <path
                      d="M24 40c4-6 10-10 16-10s12 4 16 10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeDasharray="4 4"
                      opacity="0.9"
                    />
                    <circle cx="36" cy="26" r="3" fill="#FFC94A" />
                    <circle cx="46" cy="22" r="2" fill="#F5E6C8" />
                    <circle cx="52" cy="30" r="2" fill="#3B7A57" />
                  </svg>
                </motion.div>
              </div>
              <div className="space-y-1 text-[11px] text-neutral-600 dark:text-neutral-300">
                <p className="font-semibold uppercase tracking-[0.26em] text-neutral-500 dark:text-neutral-400">
                  Powder ritual cloud
                </p>
                <p>
                  One place for skin, hair and inner‑wellness journeys crafted from pure botanicals.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-2xl bg-amber-50/80 p-4 text-xs shadow-sm dark:bg-slate-900/80">
          {forgotPasswordMode ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={forgotPasswordSuccess ? 'success' : 'form'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="space-y-3"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-neutral-500 dark:text-neutral-400">
                  Reset password
                </p>
                {forgotPasswordSuccess ? (
                  <>
                    <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/80 p-4 dark:border-emerald-800/80 dark:bg-emerald-950/40">
                      <p className="text-[11px] font-medium text-emerald-800 dark:text-emerald-100">
                        Check your email
                      </p>
                      <p className="mt-1 text-[11px] text-emerald-700 dark:text-emerald-200">
                        We sent a link to <strong>{form.email}</strong>. Click it to set a new password. If you don’t see it, check spam.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setForgotPasswordMode(false);
                        setForgotPasswordSuccess(false);
                        setError('');
                      }}
                      className="w-full rounded-full border border-amber-200 bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-700 transition hover:border-amber-300 hover:bg-amber-50 dark:border-emerald-800 dark:bg-slate-950 dark:text-sand dark:hover:border-emerald-500 dark:hover:bg-emerald-950/60"
                    >
                      Back to login
                    </button>
                  </>
                ) : (
                  <form onSubmit={handleForgotPassword} className="space-y-3">
                    <div>
                      <label className="mb-1 block text-[11px] uppercase tracking-[0.22em] text-neutral-500">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="Enter your account email"
                        value={form.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className="h-9 w-full rounded-full border border-amber-100 bg-white/80 px-3 text-xs outline-none focus:border-amber-300 focus:ring-1 focus:ring-amber-300 dark:border-emerald-800 dark:bg-slate-950 dark:text-sand dark:focus:border-emerald-500 dark:focus:ring-emerald-500"
                      />
                    </div>
                    {error && (
                      <p className="text-[11px] text-rose-600 dark:text-rose-300">{error}</p>
                    )}
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex h-9 w-full items-center justify-center rounded-full bg-neutral-900 text-[11px] font-semibold uppercase tracking-[0.22em] text-sand shadow-soft transition hover:bg-neutral-800 disabled:opacity-70 dark:bg-emerald-500 dark:text-emerald-50 dark:hover:bg-emerald-400"
                    >
                      {loading ? 'Sending…' : 'Send reset link'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setForgotPasswordMode(false);
                        setError('');
                      }}
                      className="w-full rounded-full border border-transparent py-1.5 text-[11px] font-medium text-neutral-600 underline underline-offset-4 hover:text-neutral-900 dark:text-neutral-300"
                    >
                      Back to login
                    </button>
                  </form>
                )}
              </motion.div>
            </AnimatePresence>
          ) : (
            <>
          <div className="flex gap-1 rounded-full bg-white/70 p-0.5 dark:bg-slate-800/80">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${
                mode === 'login'
                  ? 'bg-neutral-900 text-sand dark:bg-emerald-500 dark:text-emerald-50'
                  : 'text-neutral-500 dark:text-neutral-300'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`flex-1 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${
                mode === 'signup'
                  ? 'bg-neutral-900 text-sand dark:bg-emerald-500 dark:text-emerald-50'
                  : 'text-neutral-500 dark:text-neutral-300'
              }`}
            >
              Sign up
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.form
              key={mode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              onSubmit={handleSubmit}
              className="space-y-3"
            >
              {mode === 'signup' ? (
                <>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-[11px] uppercase tracking-[0.22em] text-neutral-500">
                        Name
                      </label>
                      <input
                        required
                        value={form.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className="h-9 w-full rounded-full border border-amber-100 bg-white/80 px-3 text-xs outline-none focus:border-amber-300 focus:ring-1 focus:ring-amber-300 dark:border-emerald-800 dark:bg-slate-950 dark:text-sand dark:focus:border-emerald-500 dark:focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[11px] uppercase tracking-[0.22em] text-neutral-500">
                        Email
                      </label>
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
                      <label className="mb-1 block text-[11px] uppercase tracking-[0.22em] text-neutral-500">
                        Password
                      </label>
                      <input
                        required
                        type="password"
                        value={form.password}
                        onChange={(e) => handleChange('password', e.target.value)}
                        className="h-9 w-full rounded-full border border-amber-100 bg-white/80 px-3 text-xs outline-none focus:border-amber-300 focus:ring-1 focus:ring-amber-300 dark:border-emerald-800 dark:bg-slate-950 dark:text-sand dark:focus:border-emerald-500 dark:focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[11px] uppercase tracking-[0.22em] text-neutral-500">
                        Confirm password
                      </label>
                      <input
                        required
                        type="password"
                        value={form.confirmPassword}
                        onChange={(e) => handleChange('confirmPassword', e.target.value)}
                        className="h-9 w-full rounded-full border border-amber-100 bg-white/80 px-3 text-xs outline-none focus:border-amber-300 focus:ring-1 focus:ring-amber-300 dark:border-emerald-800 dark:bg-slate-950 dark:text-sand dark:focus:border-emerald-500 dark:focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="mb-1 block text-[11px] uppercase tracking-[0.22em] text-neutral-500">
                      Email
                    </label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="h-9 w-full rounded-full border border-amber-100 bg-white/80 px-3 text-xs outline-none focus:border-amber-300 focus:ring-1 focus:ring-amber-300 dark:border-emerald-800 dark:bg-slate-950 dark:text-sand dark:focus:border-emerald-500 dark:focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] uppercase tracking-[0.22em] text-neutral-500">
                      Password
                    </label>
                    <input
                      required
                      type="password"
                      value={form.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      className="h-9 w-full rounded-full border border-amber-100 bg-white/80 px-3 text-xs outline-none focus:border-amber-300 focus:ring-1 focus:ring-amber-300 dark:border-emerald-800 dark:bg-slate-950 dark:text-sand dark:focus:border-emerald-500 dark:focus:ring-emerald-500"
                    />
                  </div>
                </>
              )}
              <div className="flex items-center justify-between gap-3 pt-1">
                <label className="inline-flex items-center gap-2 text-[11px] text-neutral-600 dark:text-neutral-300">
                  <input
                    type="checkbox"
                    checked={form.remember}
                    onChange={(e) => handleChange('remember', e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-amber-200 text-neutral-900 focus:ring-amber-300 dark:border-emerald-700 dark:text-emerald-400 dark:focus:ring-emerald-500"
                  />
                  <span>Remember me on this device</span>
                </label>
                {mode === 'login' && (
                  <button
                  type="button"
                  onClick={() => {
                    setForgotPasswordMode(true);
                    setError('');
                    setForgotPasswordSuccess(false);
                  }}
                  className="text-[11px] font-medium text-neutral-700 underline underline-offset-4 hover:text-neutral-900 dark:text-neutral-200"
                >
                  Forgot password?
                </button>
                )}
                
              </div>
              {error && (
                <p className="text-[11px] text-rose-600 dark:text-rose-300">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="mt-1 flex h-9 w-full items-center justify-center rounded-full bg-neutral-900 text-[11px] font-semibold uppercase tracking-[0.22em] text-sand shadow-soft transition hover:bg-neutral-800 disabled:opacity-70 dark:bg-emerald-500 dark:text-emerald-50 dark:hover:bg-emerald-400"
              >
                {loading && mode !== 'login'
                  ? 'Creating account…'
                  : loading && mode === 'login'
                  ? 'Signing in…'
                  : mode === 'login'
                  ? 'Login'
                  : 'Sign up'}
              </button>
              <div className="flex items-center gap-3 pt-2">
                <div className="h-px flex-1 bg-amber-200/80 dark:bg-emerald-900/60" />
                <span className="text-[10px] uppercase tracking-[0.22em] text-neutral-400 dark:text-neutral-500">
                  or
                </span>
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
                    <path
                      fill="#EA4335"
                      d="M9 7.3v3.1h4.3c-.2 1-.8 1.9-1.7 2.5l2.8 2.2C15.7 13.8 16.5 11.7 16.5 9c0-.5 0-1-.1-1.5H9z"
                    />
                    <path
                      fill="#34A853"
                      d="M5.2 10.6 4.5 11.1 2.3 12.8A7.48 7.48 0 0 0 9 16.5c2.1 0 3.9-.7 5.2-2.1l-2.8-2.2c-.7.5-1.6.8-2.4.8-1.9 0-3.6-1.3-4.1-3.1z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M2.3 5.2A7.45 7.45 0 0 0 1.5 9c0 1.1.3 2.1.8 3l2.7-2.1A3.84 3.84 0 0 1 4.8 9c0-.3.1-.6.2-.9L2.3 5.2z"
                    />
                    <path
                      fill="#4285F4"
                      d="M9 4.3c1 0 1.8.3 2.5 1l1.9-1.9C12.9 2.4 11.1 1.5 9 1.5 6.4 1.5 4.1 3 2.3 5.2l2.7 2.1C5.5 5.6 7.1 4.3 9 4.3z"
                    />
                  </svg>
                </span>
                <span>Continue with Google</span>
              </button>
              <p className="pt-1 text-[10px] leading-relaxed text-neutral-500 dark:text-neutral-400">
                By continuing, you agree to Prkriti&apos;s{' '}
                <span className="underline underline-offset-4">Terms of use</span> and{' '}
                <span className="underline underline-offset-4">Privacy policy</span>. Update this
                copy when you wire real legal pages.
              </p>
            </motion.form>
          </AnimatePresence>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;

