import express from 'express';
import asyncHandler from 'express-async-handler';
import OpenAI from 'openai';
import {
  AI_ASSISTANT_SYSTEM_PROMPT,
  buildLocalReply,
} from '../config/aiPrompts.js';

const router = express.Router();

// POST /api/ai/chat
// { message: string, context?: string }
router.post(
  '/chat',
  asyncHandler(async (req, res) => {
    const { message, context } = req.body || {};
    const userMessage = (message || '').trim();

    if (!userMessage) {
      return res.status(400).json({ message: 'Message is required.' });
    }

    // If you want totally free behaviour, leave OPENAI_API_KEY empty
    // and we will reply using the local helper above.
    if (!process.env.OPENAI_API_KEY) {
      const reply = buildLocalReply(userMessage);
      return res.json({ reply });
    }

    const extraContext =
      typeof context === 'string' && context.trim()
        ? `\n\nAdditional context from the app:\n${context.trim()}`
        : '';

    try {
      const openaiClient = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const completion = await openaiClient.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: AI_ASSISTANT_SYSTEM_PROMPT + extraContext,
          },
          {
            role: 'user',
            content: userMessage,
          },
        ],
        temperature: 0.4,
        max_tokens: 400,
      });

      const reply =
        completion.choices?.[0]?.message?.content ||
        'Sorry, I could not generate a response right now.';

      res.json({ reply });
    } catch (err) {
      console.error('AI chat error:', err?.response?.data || err.message || err);
      // Fall back to free local reply on any API error so testing still works.
      const reply = buildLocalReply(userMessage);
      res.json({ reply });
    }
  })
);

export default router;

