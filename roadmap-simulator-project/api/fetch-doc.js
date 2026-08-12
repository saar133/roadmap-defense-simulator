// Vercel serverless function.
// Fetches a public Google Docs/Slides "export as text" URL server-side,
// since the browser can't fetch docs.google.com directly (CORS).
// Only works for files shared as "Anyone with the link can view".

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body || {};
  if (!url || typeof url !== 'string' || !url.startsWith('https://docs.google.com/')) {
    return res.status(400).json({ error: 'Invalid or missing url' });
  }

  try {
    const response = await fetch(url, { redirect: 'follow' });
    const text = await response.text();

    // If the doc isn't publicly shared, Google returns an HTML sign-in/error page instead of plain text.
    if (text.trim().startsWith('<')) {
      return res.status(422).json({ error: 'Document is not publicly accessible. Share it as "Anyone with the link can view".' });
    }

    res.status(200).json({ text: text.slice(0, 20000) });
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching the document' });
  }
}
