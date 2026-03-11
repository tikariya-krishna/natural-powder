import { motion } from 'framer-motion';
import { Leaf, Droplets, Sparkles, HeartPulse } from 'lucide-react';

const benefitBlocks = [
  {
    icon: Leaf,
    title: 'Whole-plant purity',
    description:
      'Single-origin botanicals, stone-ground at low temperatures to preserve colour, aroma and actives.',
  },
  {
    icon: Droplets,
    title: 'Skin & scalp rituals',
    description:
      'Mix with hydrosols, oils or yogurt to create ubtans, masks and hair packs tailored to your dosha.',
  },
  {
    icon: HeartPulse,
    title: 'Inner wellness',
    description:
      'Stir into lattes, decoctions or smoothies to support digestion, immunity and daily vitality.',
  },
  {
    icon: Sparkles,
    title: 'Minimal, multi-use',
    description:
      'One jar, many rituals – layer powders into your existing routine instead of adding clutter.',
  },
];

const BenefitsPage = () => {
  return (
    <div className="container-page space-y-10">
      <section className="pt-3 md:pt-6">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-neutral-500 dark:text-neutral-400">
            Beneﬁts
          </p>
          <h1 className="mt-2 font-display text-2xl text-neutral-900 md:text-3xl dark:text-sand">
            Why choose powdered botanicals?
          </h1>
          <p className="mt-3 text-xs leading-relaxed text-neutral-600 md:text-sm dark:text-neutral-300">
            Prkriti powders are crafted as a bridge between classical Ayurveda and modern ritual –
            simple ingredients that flex across skin, hair and inner care without synthetic fillers.
          </p>
        </motion.div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {benefitBlocks.map((block, index) => {
          const Icon = block.icon;
          return (
            <motion.article
              key={block.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              className="flex gap-4 rounded-2xl border border-amber-100/80 bg-white/90 p-4 shadow-[0_12px_35px_rgba(15,23,42,0.05)] dark:border-emerald-900/70 dark:bg-slate-950/90"
            >
              <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-leaf/15 via-turmeric/20 to-sand/30 text-leaf dark:from-emerald-500/20 dark:via-amber-400/20 dark:to-slate-800">
                <Icon className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h2 className="text-sm font-semibold text-neutral-900 dark:text-sand">
                  {block.title}
                </h2>
                <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
                  {block.description}
                </p>
              </div>
            </motion.article>
          );
        })}
      </section>

      <section className="grid gap-8 pb-6 md:grid-cols-[minmax(0,_1.1fr)_minmax(0,_1fr)] md:items-center">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          <h2 className="font-display text-xl text-neutral-900 md:text-2xl dark:text-sand">
            A ritual that adapts to you.
          </h2>
          <p className="text-xs leading-relaxed text-neutral-600 md:text-sm dark:text-neutral-300">
            Each powder is intentionally left un-formulated so you can tune it to the day – richer
            for winter, lighter for summer, gentler when skin is reactive. Mix with pantry staples
            like yogurt, honey or ghee, or with hydrosols and oils for a more sensorial ritual.
          </p>
          <ul className="space-y-2 text-xs text-neutral-700 dark:text-neutral-200">
            <li>• Layer a turmeric–sandalwood ubtan weekly in place of scrubby exfoliants.</li>
            <li>• Use neem and moringa in scalp masks to clarify without stripping.</li>
            <li>• Add moringa and ashwagandha into lattes to support calm focus.</li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl border border-amber-100/80 bg-gradient-to-br from-sand via-amber-50 to-emerald-50 p-5 shadow-soft dark:border-emerald-900/70 dark:from-emerald-950 dark:via-slate-950 dark:to-black"
        >
          <div className="absolute inset-5 rounded-[26px] border border-amber-100/80 bg-white/75 dark:border-emerald-900/70 dark:bg-slate-950/85" />
          <div className="relative z-10 space-y-4 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-neutral-500 dark:text-neutral-400">
              Daily powder ritual
            </p>
            <p className="text-sm leading-relaxed text-neutral-800 dark:text-sand">
              Choose one powder for the day, mix, breathe in, and apply with intention. Simple,
              repeatable rituals compound into visible, grounded results.
            </p>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-300">
              Begin with once or twice a week and build your own rhythm.
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default BenefitsPage;

