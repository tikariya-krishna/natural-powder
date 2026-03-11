import AnimatedHero from '../components/AnimatedHero.jsx';
import ProductCard from '../components/ProductCard.jsx';
import CategoryCard from '../components/CategoryCard.jsx';
import { ProductSkeletonGrid } from '../components/LoadingSkeleton.jsx';
import { api } from '../services/api.js';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '../context/ToastContext.jsx';

const categories = [
  {
    name: 'Turmeric Rituals',
    description: 'Brightening, anti-inflammatory powders for ubtans, masks and golden milk.',
    accent: '#FFC94A',
  },
  {
    name: 'Neem Detox',
    description: 'Clarifying neem blends for blemish-prone skin and scalp care.',
    accent: '#3B7A57',
  },
  {
    name: 'Moringa Nourish',
    description: 'Vitamin-rich moringa for daily smoothies, hair masks and wellness shots.',
    accent: '#4F9D69',
  },
  {
    name: 'Sandalwood Calm',
    description: 'Fine sandalwood powders to soothe, cool and even out skin tone.',
    accent: '#C68B59',
  },
];

const HomePage = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    let mounted = true;
    api
      .get('/products', { params: { limit: 6 } })
      .then((res) => {
        if (mounted) setFeatured(res.data.slice(0, 6));
      })
      .catch(() => {
        if (mounted) {
          addToast({
            variant: 'error',
            title: 'Products unavailable',
            message: 'We could not load featured powders right now. Please refresh in a moment.',
          });
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-14 md:space-y-20">
      <AnimatedHero />

      <section className="container-page space-y-8">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-display text-xl text-neutral-900 md:text-2xl dark:text-sand">
              Featured powders
            </h2>
            <p className="mt-1 max-w-md text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
              Our most-loved botanicals for daily rituals — from brightening ubtans to balancing
              hair masks.
            </p>
          </div>
        </div>

        {loading ? (
          <ProductSkeletonGrid />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((product, index) => (
              <ProductCard key={product._id} product={product} index={index} />
            ))}
          </div>
        )}
      </section>

      <section className="container-page space-y-8">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-display text-xl text-neutral-900 md:text-2xl dark:text-sand">
              Ritual categories
            </h2>
            <p className="mt-1 max-w-md text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
              Explore powders curated by benefits — radiance, detox, nourishment and calm.
            </p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {categories.map((cat, index) => (
            <CategoryCard key={cat.name} index={index} {...cat} />
          ))}
        </div>
      </section>

      <section className="container-page space-y-10">
        <div className="grid gap-10 md:grid-cols-2 md:items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-15%' }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h2 className="font-display text-xl text-neutral-900 md:text-2xl dark:text-sand">
              Why powders, not extracts?
            </h2>
            <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
              Whole-plant powders retain fiber, trace minerals and synergistic compounds that are
              often stripped away in extracts. Our gentle, low-heat stone grinding preserves the
              full spectrum of actives — giving you richer colour, aroma and results.
            </p>
            <ul className="space-y-2 text-xs text-neutral-700 dark:text-neutral-200">
              <li>• Higher phytonutrient density vs. isolates</li>
              <li>• Multi-benefit rituals for skin, hair and internal wellness</li>
              <li>• Versatile — blend into masks, milks, lattes and oils</li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-15%' }}
            transition={{ duration: 0.6 }}
            className="space-y-4 rounded-3xl border border-amber-100/80 bg-white/90 p-6 shadow-soft dark:border-emerald-900/70 dark:bg-slate-950/90"
          >
            <p className="text-[11px] uppercase tracking-[0.3em] text-neutral-500">
              Voices from the ritual room
            </p>
            <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-200">
              “The turmeric-sandalwood ubtan has become my weekend ritual. It smells like an old
              Ayurvedic pharmacy — earthy, faintly floral — and leaves my skin bright, soft and
              quietly glowing.”
            </p>
            <p className="text-xs font-semibold text-neutral-900 dark:text-sand">
              ANANYA • BENGALURU
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

