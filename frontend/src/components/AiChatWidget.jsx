import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Loader2, Send } from 'lucide-react';
import { api } from '../services/api.js';

const QUICK_PROMPTS = [
  {
    id: 'turmeric-face',
    label: 'How to use turmeric for face?',
    message: 'How can I use turmeric powder safely for a face glow mask?',
  },
  {
    id: 'oily-skin',
    label: 'Ritual for oily skin',
    message: 'Suggest a simple weekly ritual for oily, acne-prone skin using powders.',
  },
  {
    id: 'dry-skin',
    label: 'Ritual for dry skin',
    message: 'Suggest a gentle ritual for dry, sensitive skin using natural powders.',
  },
  {
    id: 'hair-fall',
    label: 'Hair fall support',
    message: 'Which powders and rituals can support hair fall care in a gentle way?',
  },
  {
    id: 'moringa-inner',
    label: 'Moringa for inner care',
    message: 'How do people usually use moringa powder for inner wellness?',
  },
  {
    id: 'shipping',
    label: 'Shipping & delivery time',
    message: 'How long does Prkriti take to ship and deliver an order?',
  },
];

const AiChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Namaste, I am your Prkriti ritual guide. Ask me about powders, benefits, how to use them, or gift ideas.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sendMessage = async (rawText) => {
    const text = rawText.trim();
    if (!text || loading) return;

    setInput('');
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/ai/chat', {
        message: text,
      });
      const replyText =
        res?.data?.reply ||
        'Sorry, I could not respond just now. Please try again in a moment.';
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: replyText,
        },
      ]);
    } catch (err) {
      const apiMessage = err?.response?.data?.message;
      setError(
        apiMessage || 'Could not reach the AI guide. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    await sendMessage(input);
  };

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-40 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto w-[320px] max-w-[90vw] rounded-3xl border border-amber-100/80 bg-white/95 p-3 text-xs shadow-soft backdrop-blur-xl dark:border-emerald-900/70 dark:bg-slate-950/95"
          >
            <div className="mb-2 flex items-start justify-between gap-2">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-neutral-500 dark:text-neutral-300">
                  Prkriti ai guide
                </p>
                <p className="mt-0.5 text-[11px] text-neutral-600 dark:text-neutral-300">
                  I can help you explore powders, rituals and care routines. I do not give medical
                  advice.
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {QUICK_PROMPTS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      disabled={loading}
                      onClick={() => sendMessage(p.message)}
                      className="rounded-full border border-emerald-100/80 bg-emerald-50 px-2.5 py-1 text-[10px] font-medium text-emerald-800 shadow-[0_0_0_1px_rgba(15,118,110,0.03)] transition hover:border-emerald-300 hover:bg-white disabled:opacity-60 dark:border-emerald-900/70 dark:bg-slate-900 dark:text-emerald-100 dark:hover:border-emerald-500/80 dark:hover:bg-slate-800"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-50 text-neutral-500 hover:bg-amber-100 dark:bg-emerald-950 dark:text-neutral-200 dark:hover:bg-emerald-900"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="mb-2 max-h-64 space-y-2 overflow-y-auto pr-1 custom-scroll">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className="mr-auto w-fit max-w-[85%] rounded-2xl rounded-bl-sm bg-amber-50 px-3 py-1.5 text-[11px] text-neutral-800 shadow-sm dark:bg-slate-900 dark:text-sand"
                >
                  {m.content}
                </div>
              ))}
              {loading && (
                <div className="mr-auto inline-flex items-center gap-2 rounded-2xl bg-amber-50 px-3 py-1.5 text-[11px] text-neutral-700 dark:bg-slate-900 dark:text-sand">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Thinking…
                </div>
              )}
              {error && (
                <p className="text-[11px] text-rose-600 dark:text-rose-300">
                  {error}
                </p>
              )}
            </div>
            <form onSubmit={handleSend} className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about powders, routines…"
                className="h-8 flex-1 rounded-full border border-amber-100 bg-amber-50/70 px-3 text-[11px] outline-none focus:border-amber-300 focus:bg-white focus:ring-1 focus:ring-amber-300 dark:border-emerald-800 dark:bg-slate-900 dark:text-sand dark:focus:border-emerald-500 dark:focus:ring-emerald-500"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-leaf text-[11px] font-semibold uppercase tracking-[0.16em] text-sand shadow-soft transition hover:bg-emerald-500 disabled:opacity-60 dark:bg-emerald-500 dark:text-emerald-50 dark:hover:bg-emerald-400"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-neutral-900 px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-sand shadow-soft transition hover:bg-neutral-800 dark:bg-emerald-500 dark:text-emerald-50 dark:hover:bg-emerald-400"
      >
        <MessageCircle className="h-4 w-4" />
        <span className="hidden sm:inline">Ask Prkriti</span>
      </button>
    </div>
  );
};

export default AiChatWidget;

