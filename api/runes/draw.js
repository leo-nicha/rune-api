export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  try {
    const { count } = req.query;
    const runeCount = Math.min(Math.max(parseInt(count, 10) || 3, 1), 24);

    // fetch JSON จาก public folder
    const protocol = req.headers["x-forwarded-proto"] || "https";
    const host = req.headers.host;
    const url = `${protocol}://${host}/runes_24.json`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Cannot fetch runes file");

    const data = await response.json();
    const runes = data.runes;

    // สุ่ม rune
    const shuffled = [...runes].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, runeCount);

    const positions = ["อดีต", "ปัจจุบัน", "อนาคต"];
    const result = selected.map((rune, i) => ({
      position: positions[i] || `รูนที่ ${i+1}`,
      symbol: rune.symbol,
      name: rune.name,
      meaning: rune.meaning,
      interpretation: rune.interpretation
    }));

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in /api/runes/draw:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
