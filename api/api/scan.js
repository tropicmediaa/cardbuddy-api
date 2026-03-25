export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { image } = req.body;
  if (!image) return res.status(400).json({ error: "No image provided" });

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-opus-4-6",
        max_tokens: 100,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: { type: "base64", media_type: "image/jpeg", data: image }
              },
              {
                type: "text",
                text: "This is a PSA graded card slab. Find the PSA certification number on the label. It is usually an 8 digit number. Reply with ONLY the cert number, nothing else."
              }
            ]
          }
        ]
      })
    });

    const data = await response.json();
    const certNumber = data.content[0].text.trim();
    res.status(200).json({ certNumber });
  } catch (err) {
    res.status(500).json({ error: "Scan failed" });
  }
}
