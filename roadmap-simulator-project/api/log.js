// Vercel serverless function.
// Logs a completed simulator session to Redis (Redis Cloud / Vercel Storage integration).
// Fails silently if storage isn't configured, so it never breaks the simulator itself.

import { createClient } from 'redis';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.REDIS_URL) {
    return res.status(200).json({ logged: false, reason: 'storage not configured' });
  }

  const client = createClient({ url: process.env.REDIS_URL });

  try {
    await client.connect();

    const body = req.body || {};
    const record = {
      timestamp: new Date().toISOString(),
      lang: body.lang || '',
      opponent: body.opponent || '',
      decision: body.decision || '',
      transcript: body.transcript || '',
      score: body.score ?? null,
      finalPressure: body.finalPressure ?? null
    };

    await client.rPush('roadmap_sim_sessions', JSON.stringify(record));
    res.status(200).json({ logged: true });
  } catch (err) {
    // Logging is best-effort - never surface this as an error to the visitor.
    res.status(200).json({ logged: false });
  } finally {
    try { await client.quit(); } catch (e) { /* ignore */ }
  }
}
