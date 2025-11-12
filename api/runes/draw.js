import path from "path";
import fs from "fs/promises";

export default async function handler(req, res) {
  // รองรับ OPTIONS สำหรับ CORS
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  try {
    const { count } = req.query;
    let runeCount = parseInt(count, 10) || 3; // ค่า default = 3
    if (runeCount < 1) runeCount = 1;
    if (runeCount > 24) runeCount = 24; // max 24

    const filePath = path.join(process.cwd(), "data", "runes_24.json");
    const jsonData = await fs.readFile(filePath, "utf-8");
    const runesData = JSON.parse(jsonData).runes;

    // สุ่ม rune แบบไม่ซ้ำ
    const shuffled = [...runesData].sort(() => 0.5 - Math.random());
    const selectedRunes = shuffled.slice(0, runeCount);

    // กำหนดตำแหน่งสำหรับการตีความเชิงลึก (ถ้า count=3)
    const positions = ["อดีต", "ปัจจุบัน", "อนาคต"];
    const result = selectedRunes.map((rune, index) => {
      return {
        position: positions[index] || `รูนที่ ${index + 1}`,
        symbol: rune.symbol,
        name: rune.name,
        meaning: rune.meaning,
        interpretation: rune.interpretation
      };
    });

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json(result);

  } catch (error) {
    console.error("Error reading runes file:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
