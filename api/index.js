export default async function handler(req, res) {
  // รองรับ OPTIONS สำหรับ CORS
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  try {
    // ดึงไฟล์ JSON จาก public folder
    const protocol = req.headers["x-forwarded-proto"] || "https";
    const host = req.headers.host;
    const url = `${protocol}://${host}/runes_24.json`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch runes file: ${response.status}`);
    }

    const data = await response.json();
    const runesData = data.runes;

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json(runesData);
  } catch (error) {
    console.error("Error fetching runes file:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
