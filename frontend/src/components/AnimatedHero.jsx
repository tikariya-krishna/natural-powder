import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const leafParticles = Array.from({ length: 16 }).map((_, i) => ({
  id: i,
  delay: i * 0.15,
}));

const AnimatedHero = () => {
  return (
    <section className="container-page grid gap-10 md:grid-cols-[minmax(0,_1.25fr)_minmax(0,_1fr)] md:items-center">
      <div className="space-y-7">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="inline-flex items-center gap-2 rounded-full border border-amber-200/80 bg-amber-50/80 px-3 py-1 text-[11px] tracking-[0.24em] text-amber-800 shadow-sm dark:border-emerald-700/60 dark:bg-emerald-900/40 dark:text-emerald-100"
        >
          <Sparkles className="h-3.5 w-3.5" />
          PURE, STONE-GROUND, EARTH-BORN
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.7, ease: 'easeOut' }}
          className="font-display text-4xl tracking-tight text-neutral-900 sm:text-5xl md:text-6xl dark:text-sand"
        >
          Natural powders,
          <span className="block bg-gradient-to-r from-leaf via-earth to-turmeric bg-clip-text text-transparent">
            rooted in Ayurveda.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16, duration: 0.7 }}
          className="max-w-xl text-sm leading-relaxed text-neutral-600 md:text-base dark:text-neutral-300"
        >
          Handpicked turmeric, neem, moringa, sandalwood and more — slow-crafted into ultra-fine
          powders for skin, hair and inner wellness. No fillers, no synthetics, just pure plants.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="flex flex-wrap items-center gap-4"
        >
          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.22em] text-sand shadow-soft transition hover:bg-neutral-800 dark:bg-emerald-500 dark:text-emerald-50 dark:hover:bg-emerald-400"
          >
            Shop powders
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/about"
            className="text-xs font-medium uppercase tracking-[0.24em] text-neutral-700 underline-offset-4 hover:underline dark:text-neutral-300"
          >
            Explore rituals
          </Link>
        </motion.div>

        <motion.dl
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.7 }}
          className="grid grid-cols-3 gap-4 pt-4 text-xs text-neutral-600 dark:text-neutral-300 md:max-w-md"
        >
          <div>
            <dt className="font-semibold text-neutral-900 dark:text-sand">Stone-ground</dt>
            <dd className="mt-1 text-[11px] leading-relaxed">
              Gentle, low-heat grinding to preserve volatile actives.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-neutral-900 dark:text-sand">Soil-to-skin</dt>
            <dd className="mt-1 text-[11px] leading-relaxed">
              Sourced from small-holder farms across India.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-neutral-900 dark:text-sand">Lab tested</dt>
            <dd className="mt-1 text-[11px] leading-relaxed">
              Checked for purity, heavy metals and pesticides.
            </dd>
          </div>
        </motion.dl>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 28 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.18, duration: 0.7, ease: 'easeOut' }}
        className="relative mx-auto mt-2 h-[320px] w-full max-w-md overflow-hidden rounded-3xl bg-gradient-to-br from-sand via-amber-50 to-emerald-50 p-5 shadow-soft dark:from-emerald-950 dark:via-slate-950 dark:to-black md:mt-0"
      >
        <div className="absolute inset-6 rounded-[28px] border border-amber-100/80 bg-gradient-to-b from-white/90 to-amber-50/60 dark:border-emerald-800/60 dark:from-emerald-950/80 dark:to-slate-950/80" />

        <div className="relative z-10 flex h-full flex-col justify-between p-4">
          <div className="space-y-3">
            <p className="text-[11px] uppercase tracking-[0.28em] text-amber-700 dark:text-emerald-200">
              Signature ritual set
            </p>
            <p className="font-display text-xl text-neutral-900 dark:text-sand">
              Radiance Ubtan Ritual
            </p>
            <p className="text-[11px] leading-relaxed text-neutral-600 dark:text-neutral-300">
              Turmeric, sandalwood and rose petal powder to brighten, calm and soften skin. Just add
              rose water or yogurt.
            </p>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-neutral-500 dark:text-neutral-400">
                Starting at
              </p>
              <p className="mt-1 text-lg font-semibold text-earth dark:text-emerald-100">
                ₹ 480
                <span className="ml-1 text-[11px] font-normal text-neutral-500 dark:text-neutral-400">
                  /100g
                </span>
              </p>
            </div>
            <div className="rounded-full bg-neutral-900 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em] text-sand shadow-md shadow-neutral-900/25 dark:bg-emerald-500 dark:text-emerald-50">
              Limited harvest
            </div>
          </div>
        </div>

        {/* Floating particles */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {leafParticles.map((leaf) => (
            <motion.span
              key={leaf.id}
              className="absolute h-6 w-6 rounded-full bg-gradient-to-br from-leaf/10 to-turmeric/10 blur-[1px]"
              style={{
                left: `${10 + (leaf.id * 17) % 80}%`,
                top: `${(leaf.id * 23) % 90}%`,
              }}
              initial={{ opacity: 0, y: 10, scale: 0.7 }}
              animate={{ opacity: [0, 1, 0], y: -18, scale: [0.7, 1, 1.1] }}
              transition={{
                repeat: Infinity,
                duration: 7 + (leaf.id % 3),
                delay: leaf.delay,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default AnimatedHero;

