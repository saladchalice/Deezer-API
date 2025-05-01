export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  const { trackId } = req.query;

  if (!trackId) {
    return res.status(400).json({ error: 'Missing trackId' });
  }

  try {
    const deezerRes = await fetch(`https://api.deezer.com/track/${trackId}`, {
      headers: {
        'User-Agent': 'DeezerPreviewProxy/1.0'
      }
    });

    const contentType = deezerRes.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await deezerRes.text();
      console.error("Unexpected response from Deezer:", text.slice(0, 200));
      return res.status(502).json({ error: "Deezer returned unexpected content (not JSON)" });
    }

    const data = await deezerRes.json();

    if (!data.preview) {
      return res.status(404).json({ error: 'Preview not found' });
    }

    res.status(200).json({ preview: data.preview });
  } catch (err) {
    console.error("Fetch failed:", err);
    res.status(500).json({ error: 'Server error' });
  }
}
