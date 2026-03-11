export const AI_ASSISTANT_SYSTEM_PROMPT =
  'You are Prkriti Organics shop assistant for natural powders (skin, hair, and wellness). ' +
  'Answer clearly in short paragraphs. You can help with product benefits, ingredients, how to use, and general guidance. ' +
  'Do not give medical advice, diagnoses, or prescriptions. For serious or medical questions, tell the user to consult a doctor.';

// Local, free responses so chat works without any external API.
// Extend this with as many patterns and replies as you like.
const LOCAL_RULES = [
  {
    id: 'turmeric-uses',
    match: (text) => text.includes('turmeric'),
    reply:
      'Turmeric powder in Prkriti style is usually shade‑dried and finely milled from high‑curcumin roots. ' +
      'It is often used in face masks with curd or honey for glow, and in warm milk for inner wellness. ' +
      'Always do a patch test on skin and speak to a doctor for medical concerns.',
  },
  {
    id: 'neem-uses',
    match: (text) => text.includes('neem'),
    reply:
      'Neem powder is known for clarifying and anti‑bacterial properties. ' +
      'Many people use it in hair masks for scalp balance or in spot masks for oily / acne‑prone skin. ' +
      'Avoid using it on broken skin and check with a professional for serious conditions.',
  },
  {
    id: 'moringa-uses',
    match: (text) => text.includes('moringa'),
    reply:
      'Moringa leaf powder is rich in antioxidants and is often added to smoothies or teas, ' +
      'and sometimes used in DIY masks. Start with small amounts and listen to your body. ' +
      'For any health questions, please consult a doctor or nutritionist.',
  },
  {
    id: 'sandalwood',
    match: (text) => text.includes('sandalwood') || text.includes('chandan'),
    reply:
      'Sandalwood powder is typically used for soothing, cooling masks that help with redness and dullness. ' +
      'Mix with rose water or milk for a thin paste, apply briefly, and avoid using on very sensitive or broken skin.',
  },
  {
    id: 'oily-skin-routine',
    match: (text) => text.includes('oily skin') || text.includes('acne'),
    reply:
      'For oily or acne‑prone skin, people often choose clarifying powders like neem, multani mitti, or tulsi. ' +
      'Use a very gentle, thin mask once a week, hydrate well afterwards, and stop immediately if irritation appears. ' +
      'For persistent acne, please see a dermatologist.',
  },
  {
    id: 'dry-skin-routine',
    match: (text) => text.includes('dry skin') || text.includes('dry face'),
    reply:
      'For dry skin, look for nourishing blends like rose, oats, and manjistha mixed with milk, aloe or honey. ' +
      'Keep masks on for a short time and always follow with a soft cream or oil. ' +
      'Avoid very drawing clays unless mixed with rich carriers.',
  },
  {
    id: 'hair-fall',
    match: (text) =>
      text.includes('hair fall') ||
      text.includes('hairfall') ||
      text.includes('hair loss'),
    reply:
      'For general hair‑care rituals, many people use powders like bhringraj, amla and hibiscus in oil infusions or masks. ' +
      'Massage gently into the scalp and rinse well. Hair fall can have many medical causes, so please consult a doctor if it is severe or sudden.',
  },
  {
    id: 'how-to-use',
    match: (text) =>
      text.includes('how to use') ||
      text.includes('use this') ||
      text.includes('routine') ||
      text.includes('ritual'),
    reply:
      'A simple ritual is: 1–2 teaspoons of powder, mix with clean water / hydrosol / curd / oil depending on your skin or hair type, ' +
      'apply as a thin layer, leave 10–15 minutes and rinse. Start once a week and adjust slowly. ' +
      'Always patch‑test first and stop if you notice irritation.',
  },
  {
    id: 'shipping',
    match: (text) =>
      text.includes('shipping') ||
      text.includes('delivery') ||
      text.includes('how many days'),
    reply:
      'Orders are usually prepared within 1–2 working days. Delivery time depends on your pincode, ' +
      'but many parcels arrive in 3–7 working days once shipped. You can always check the latest status in your My Orders section.',
  },
  {
    id: 'orders-payments',
    match: (text) =>
      text.includes('payment') ||
      text.includes('upi') ||
      text.includes('cod') ||
      text.includes('order not showing'),
    reply:
      'For payments we support UPI and online methods as shown at checkout. ' +
      'After a successful payment, your order appears in the My Orders page. ' +
      'If you do not see it after a few minutes, try refreshing or signing out and in again.',
  },
  {
    id: 'general-help',
    match: () => true,
    reply:
      'I can help you explore natural powders, simple rituals and how to combine them for skin, hair and inner‑wellness. ' +
      'Ask about specific powders (turmeric, neem, moringa, sandalwood), your skin or hair type, or basic usage ideas. ' +
      'For medical questions or strong reactions, always speak to a qualified doctor.',
  },
];

export function buildLocalReply(message) {
  const text = (message || '').toLowerCase();
  const rule = LOCAL_RULES.find((r) => r.match(text));
  return rule?.reply || LOCAL_RULES[LOCAL_RULES.length - 1].reply;
}

