import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, User, Heart, ShoppingBag, ShieldCheck, LogOut } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext.jsx';
import { getAuth, updateProfile } from 'firebase/auth';
import { firebaseApp } from '../firebase/client.js';

const ProfilePage = () => {
  const { user, isAdmin, logout, setUser } = useShop();
  const navigate = useNavigate();

  if (!user) {
    return null;
  }

  const initials =
    (user.name || user.email || '')
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'PR';

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState(user.name || '');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  return (
    <div className="container-page pb-16">
      <div className="mx-auto max-w-5xl pt-4 md:pt-6">
        <div className="overflow-hidden rounded-[1.75rem] border border-amber-100/70 bg-white/90 shadow-soft backdrop-blur-sm dark:border-emerald-900/70 dark:bg-slate-950/95">
          <div className="grid gap-0 md:grid-cols-[220px,minmax(0,1fr)]">
            {/* Sidebar */}
            <aside className="border-b border-amber-100/80 bg-amber-50/40 p-4 text-xs dark:border-emerald-900/60 dark:bg-slate-950 md:border-b-0 md:border-r">
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-neutral-500 dark:text-neutral-400">
                My ritual space
              </p>
              <nav className="space-y-1">
                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-xl bg-white px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-900 shadow-soft dark:bg-slate-900 dark:text-sand"
                >
                  <span className="flex items-center gap-2">
                    <User className="h-3.5 w-3.5" />
                    My profile
                  </span>
                </button>
                <Link
                  to="/orders"
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-600 hover:bg-amber-50 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-slate-900/70"
                >
                  <span className="flex items-center gap-2">
                    <ShoppingBag className="h-3.5 w-3.5" />
                    My orders
                  </span>
                </Link>
                <Link
                  to="/wishlist"
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-600 hover:bg-amber-50 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-slate-900/70"
                >
                  <span className="flex items-center gap-2">
                    <Heart className="h-3.5 w-3.5" />
                    Wishlist
                  </span>
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-600 hover:bg-amber-50 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-slate-900/70"
                  >
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Admin dashboard
                    </span>
                  </Link>
                )}
              </nav>

              <div className="mt-6 border-t border-amber-100/80 pt-4 text-[11px] dark:border-emerald-900/60">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left font-semibold uppercase tracking-[0.22em] text-rose-600 hover:bg-rose-50/80 dark:text-rose-300 dark:hover:bg-rose-950/40"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign out
                </button>
              </div>
            </aside>

            {/* Main profile content */}
            <motion.section
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="p-5 md:p-7"
            >
              <div className="flex flex-col gap-4 border-b border-amber-100/80 pb-5 md:flex-row md:items-center md:justify-between dark:border-emerald-900/60">
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 rounded-2xl bg-gradient-to-br from-leaf via-turmeric to-earth p-[2px] shadow-soft">
                    <div className="flex h-full w-full items-center justify-center rounded-[1rem] bg-amber-50 text-lg font-semibold text-neutral-900 dark:bg-slate-950 dark:text-sand">
                      {initials}
                    </div>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-neutral-500 dark:text-neutral-400">
                      Ritual profile
                    </p>
                    <h1 className="mt-1 font-display text-xl text-neutral-900 md:text-2xl dark:text-sand">
                      {user.name || 'Prkriti member'}
                    </h1>
                    <p className="mt-1 inline-flex items-center gap-1.5 text-[11px] text-neutral-600 dark:text-neutral-300">
                      <Mail className="h-3.5 w-3.5" />
                      <span>{user.email}</span>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditing((v) => !v);
                    setSaveError('');
                    setNameInput(user.name || '');
                  }}
                  className="inline-flex items-center justify-center rounded-full border border-amber-200 bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-800 shadow-sm transition hover:border-amber-300 hover:bg-amber-50 dark:border-emerald-800 dark:bg-slate-950 dark:text-sand dark:hover:border-emerald-500 dark:hover:bg-emerald-950/60"
                >
                  {editing ? 'Cancel' : 'Edit profile'}
                </button>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-amber-100/80 bg-amber-50/60 p-4 text-xs dark:border-emerald-900/70 dark:bg-slate-900/80">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-neutral-500 dark:text-neutral-300">
                    Personal info
                  </p>
                  <dl className="mt-3 space-y-2 text-[11px] text-neutral-700 dark:text-neutral-200">
                    <div className="flex gap-3">
                      <dt className="w-28 text-neutral-500 dark:text-neutral-400">Name</dt>
                      <dd className="flex-1">
                        {editing ? (
                          <input
                            value={nameInput}
                            onChange={(e) => setNameInput(e.target.value)}
                            className="h-8 w-full max-w-xs rounded-full border border-amber-200 bg-white px-3 text-[11px] outline-none focus:border-amber-300 focus:ring-1 focus:ring-amber-300 dark:border-emerald-800 dark:bg-slate-950 dark:text-sand dark:focus:border-emerald-500 dark:focus:ring-emerald-500"
                            placeholder="Your name"
                          />
                        ) : (
                          user.name || '—'
                        )}
                      </dd>
                    </div>
                    <div className="flex gap-3">
                      <dt className="w-28 text-neutral-500 dark:text-neutral-400">Email</dt>
                      <dd className="flex-1 break-all">{user.email}</dd>
                    </div>
                    <div className="flex gap-3">
                      <dt className="w-28 text-neutral-500 dark:text-neutral-400">Role</dt>
                      <dd className="flex-1">{isAdmin ? 'Admin' : 'Customer'}</dd>
                    </div>
                  </dl>
                  {editing && (
                    <div className="mt-3 flex items-center gap-3">
                      <button
                        type="button"
                        disabled={saving || !nameInput.trim()}
                        onClick={async () => {
                          if (!nameInput.trim()) return;
                          setSaving(true);
                          setSaveError('');
                          try {
                            const auth = getAuth(firebaseApp);
                            if (auth.currentUser) {
                              await updateProfile(auth.currentUser, {
                                displayName: nameInput.trim(),
                              });
                            }
                            setUser((prev) =>
                              prev
                                ? { ...prev, name: nameInput.trim() }
                                : prev
                            );
                            setEditing(false);
                          } catch (err) {
                            setSaveError(
                              'Could not update your name right now. Please try again in a moment.'
                            );
                          } finally {
                            setSaving(false);
                          }
                        }}
                        className="inline-flex items-center justify-center rounded-full bg-neutral-900 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-sand shadow-sm transition hover:bg-neutral-800 disabled:opacity-60 dark:bg-emerald-500 dark:text-emerald-50 dark:hover:bg-emerald-400"
                      >
                        {saving ? 'Saving…' : 'Save changes'}
                      </button>
                      {saveError && (
                        <p className="text-[11px] text-rose-600 dark:text-rose-300">{saveError}</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border border-emerald-100/80 bg-emerald-50/60 p-4 text-xs dark:border-emerald-900/70 dark:bg-emerald-950/40">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-neutral-500 dark:text-neutral-300">
                    Shortcuts
                  </p>
                  <div className="mt-3 space-y-2 text-[11px] text-neutral-700 dark:text-neutral-100">
                    <Link
                      to="/orders"
                      className="flex items-center justify-between rounded-xl bg-white/90 px-3 py-2 text-left shadow-sm transition hover:bg-amber-50 dark:bg-slate-950/90 dark:hover:bg-slate-900"
                    >
                      <span className="flex items-center gap-2">
                        <ShoppingBag className="h-3.5 w-3.5" />
                        Recent orders
                      </span>
                      <span className="text-[10px] uppercase tracking-[0.18em] text-neutral-500">
                        View
                      </span>
                    </Link>
                    <Link
                      to="/wishlist"
                      className="flex items-center justify-between rounded-xl bg-white/90 px-3 py-2 text-left shadow-sm transition hover:bg-rose-50 dark:bg-slate-950/90 dark:hover:bg-slate-900"
                    >
                      <span className="flex items-center gap-2">
                        <Heart className="h-3.5 w-3.5" />
                        Saved botanicals
                      </span>
                      <span className="text-[10px] uppercase tracking-[0.18em] text-neutral-500">
                        Browse
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

