import { motion } from 'framer-motion';

/** Shared header card for login/register pages */
export const AuthLayout = ({ title, subtitle, children }) => (
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
              {title}
            </h1>
            <p className="max-w-md text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
              {subtitle}
            </p>
          </div>
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
                <svg viewBox="0 0 80 80" className="h-14 w-14 text-amber-900/90 dark:text-amber-100">
                  <defs>
                    <linearGradient id="powder" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFC94A" />
                      <stop offset="50%" stopColor="#F5E6C8" />
                      <stop offset="100%" stopColor="#3B7A57" />
                    </linearGradient>
                  </defs>
                  <path d="M10 52c8-8 18-12 30-12s22 4 30 12v6c0 4-3 7-7 7H17c-4 0-7-3-7-7v-6Z" fill="url(#powder)" />
                  <path d="M24 40c4-6 10-10 16-10s12 4 16 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4" opacity="0.9" />
                  <circle cx="36" cy="26" r="3" fill="#FFC94A" />
                  <circle cx="46" cy="22" r="2" fill="#F5E6C8" />
                  <circle cx="52" cy="30" r="2" fill="#3B7A57" />
                </svg>
              </motion.div>
            </div>
            <div className="space-y-1 text-[11px] text-neutral-600 dark:text-neutral-300">
              <p className="font-semibold uppercase tracking-[0.26em] text-neutral-500 dark:text-neutral-400">Powder ritual cloud</p>
              <p>One place for skin, hair and inner‑wellness journeys crafted from pure botanicals.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-4 rounded-2xl bg-amber-50/80 p-4 text-xs shadow-sm dark:bg-slate-900/80">
        {children}
      </div>
    </motion.div>
  </div>
);
