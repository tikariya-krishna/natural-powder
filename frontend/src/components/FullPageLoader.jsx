import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';

const FullPageLoader = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_#fdf4d5,_transparent_55%),_radial-gradient(circle_at_bottom,_#e6f2e8,_transparent_55%)] dark:bg-[radial-gradient(circle_at_top,_#020617,_transparent_55%),_radial-gradient(circle_at_bottom,_#022c22,_transparent_55%)]">
      <div className="relative flex flex-col items-center gap-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 220, damping: 18 }}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-leaf to-turmeric shadow-soft"
        >
          <motion.div
            animate={{ y: [0, -6, 0], rotate: [-6, 6, -6] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Leaf className="h-7 w-7 text-sand" />
          </motion.div>
        </motion.div>
        <div className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-neutral-500 dark:text-neutral-400">
            Prkriti Organics
          </p>
          <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-300">
            Infusing your ritual space…
          </p>
        </div>
        <div className="mt-1 h-1 w-28 overflow-hidden rounded-full bg-amber-100/70 dark:bg-emerald-900/60">
          <motion.div
            className="h-full w-1/3 rounded-full bg-gradient-to-r from-leaf via-turmeric to-earth"
            animate={{ x: ['-50%', '120%'] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </div>
    </div>
  );
};

export default FullPageLoader;

