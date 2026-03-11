import { motion } from 'framer-motion';

const CategoryCard = ({ name, description, accent, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ delay: index * 0.05, duration: 0.45, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-2xl border border-amber-100/70 bg-white/80 p-4 shadow-[0_12px_35px_rgba(15,23,42,0.05)] dark:border-emerald-900/70 dark:bg-slate-950/90"
    >
      <div
        className="absolute inset-0 opacity-70 mix-blend-multiply"
        style={{
          backgroundImage: `radial-gradient(circle at 0% 0%, ${accent}22 0, transparent 55%), radial-gradient(circle at 100% 100%, ${accent}11 0, transparent 55%)`,
        }}
      />
      <div className="relative space-y-1.5">
        <h3 className="text-sm font-semibold tracking-wide text-neutral-900 dark:text-sand">
          {name}
        </h3>
        <p className="text-[11px] leading-relaxed text-neutral-600 dark:text-neutral-300">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

export default CategoryCard;

