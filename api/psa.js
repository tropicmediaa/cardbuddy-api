export default async function handler(req, res) {
  const { cert } = req.query;
  if (!cert) return res.status(400).json({ error: "No cert number provided" });

  try {
    const response = await fetch(
      `https://api.psacard.com/publicapi/cert/GetByCertNumber/${cert}`,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `bearer ${process.env.PSA_API_KEY}`
        }
      }
    );
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "PSA lookup failed" });
  }
}
