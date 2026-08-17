// Vercel serverless function.
// Private viewer for logged sessions. Visit: /api/admin?key=YOUR_ADMIN_KEY
// Protect this by setting an ADMIN_KEY environment variable - anyone without
// the correct key gets a 401, nothing is shown.

import { createClient } from 'redis';

export default async function handler(req, res) {
  const { key } = req.query;

  if (!process.env.ADMIN_KEY || key !== process.env.ADMIN_KEY) {
    return res.status(401).send('Unauthorized');
  }

  if (!process.env.REDIS_URL) {
    return res.status(500).send('Storage not configured');
  }

  const client = createClient({ url: process.env.REDIS_URL });

  try {
    await client.connect();
    const raw = await client.lRange('roadmap_sim_sessions', 0, -1);
    const sessions = raw
      .map(s => { try { return JSON.parse(s); } catch { return null; } })
      .filter(Boolean)
      .reverse();

    const rows = sessions.map(s => `
      <details class="session">
        <summary>
          <span class="ts">${escapeHtml(s.timestamp)}</span>
          <span class="opp">${escapeHtml(s.opponent)}</span>
          <span class="score">score ${s.score ?? '-'}/10</span>
          <span class="pressure">pressure ${s.finalPressure ?? '-'}</span>
        </summary>
        <p class="decision"><strong>Decision:</strong> ${escapeHtml(s.decision)}</p>
        <pre>${escapeHtml(s.transcript)}</pre>
      </details>
    `).join('');

    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Roadmap Simulator - Sessions</title>
<style>
  body{ background:#14161a; color:#ededef; font-family:-apple-system,sans-serif; padding:32px; max-width:900px; margin:0 auto; }
  h1{ font-size:20px; margin-bottom:24px; }
  .session{ border:1px solid #2e323b; border-radius:10px; padding:14px 16px; margin-bottom:14px; background:#1b1e24; }
  summary{ cursor:pointer; display:flex; gap:14px; flex-wrap:wrap; font-size:13px; color:#8b909c; }
  summary .ts{ color:#ededef; font-family:monospace; }
  summary .opp{ color:#e8a33d; }
  .decision{ margin-top:12px; font-size:14px; line-height:1.5; }
  pre{ white-space:pre-wrap; font-size:12.5px; background:#0e0f12; padding:12px; border-radius:6px; margin-top:10px; line-height:1.5; }
</style>
</head>
<body>
  <h1>Roadmap Defense Simulator — ${sessions.length} sessions logged</h1>
  ${rows || '<p style="color:#8b909c;">No sessions logged yet.</p>'}
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(html);
  } catch (err) {
    res.status(500).send('Error loading sessions: ' + err.message);
  } finally {
    try { await client.quit(); } catch (e) { /* ignore */ }
  }
}

function escapeHtml(str){
  return String(str || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
