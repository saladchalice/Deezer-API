export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*"); // <-- allow all origins
    res.setHeader("Access-Control-Allow-Methods", "GET");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  
    const { trackId } = req.query;
  
    if (!trackId) {
      return res.status(400).json({ error: 'Missing trackId' });
    }
  
    try {
      const deezerRes = await fetch(`https://api.deezer.com/track/${trackId}`);
      const data = await deezerRes.json();
  
      if (!data.preview) {
        return res.status(404).json({ error: 'Preview not found' });
      }
  
      res.status(200).json({ preview: data.preview });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }
  