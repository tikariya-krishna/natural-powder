import { Leaf, Instagram, Facebook, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-amber-100/70 bg-[color:var(--bg-soft)]/90 py-8 text-xs text-neutral-500 dark:border-emerald-900/40 dark:bg-black/40">
      <div className="container-page flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-leaf/10 text-leaf dark:bg-emerald-500/20 dark:text-emerald-200">
            <Leaf className="h-4 w-4" />
          </span>
          <div>
            <p className="text-[11px] font-semibold tracking-[0.3em] text-neutral-800 dark:text-neutral-200">
              PRKRITI
            </p>
            <p className="text-[11px] tracking-[0.22em] text-neutral-500">
              PURE • EARTH-BORN • AYURVEDIC
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-5">
          <div className="flex gap-4">
            <button className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-amber-200/70 text-neutral-600 transition hover:bg-amber-50 dark:border-emerald-800 dark:text-neutral-300 dark:hover:bg-emerald-900/60">
              <Instagram className="h-4 w-4" />
            </button>
            <button className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-amber-200/70 text-neutral-600 transition hover:bg-amber-50 dark:border-emerald-800 dark:text-neutral-300 dark:hover:bg-emerald-900/60">
              <Facebook className="h-4 w-4" />
            </button>
            <button className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-amber-200/70 text-neutral-600 transition hover:bg-amber-50 dark:border-emerald-800 dark:text-neutral-300 dark:hover:bg-emerald-900/60">
              <Youtube className="h-4 w-4" />
            </button>
          </div>
          <p className="text-[11px] tracking-[0.24em]">
            © {new Date().getFullYear()} Prkriti Organics. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

