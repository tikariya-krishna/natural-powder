/**
 * Recursively convert Firestore Timestamps to ISO date strings for JSON responses.
 * @param {unknown} obj
 * @returns {unknown}
 */
export function serializeForJson(obj) {
  if (obj === null || obj === undefined) return obj;
  if (obj && typeof obj.toDate === 'function') return obj.toDate().toISOString();
  if (Array.isArray(obj)) return obj.map(serializeForJson);
  if (typeof obj === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(obj)) out[k] = serializeForJson(v);
    return out;
  }
  return obj;
}
