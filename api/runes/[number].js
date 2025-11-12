export default async function handler(req, res) {
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
    if (!response.ok) throw new Error("Cannot fetch runes file");

    const data = await response.json();
    const runes = data.runes;

    // สุ่ม 1 รูน
    const randomIndex = Math.floor(Math.random() * runes.length);
    const rune = runes[randomIndex];

    // กำหนดเป็น "ปัจจุบัน" ตรง ๆ
    const result = {
      position: "ปัจจุบัน",
      symbol: rune.symbol,
      name: rune.name,
      meaning: rune.meaning,
      interpretation: rune.interpretation
    };

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in /api/runes/[number]:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
