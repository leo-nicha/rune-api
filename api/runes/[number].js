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
    const { number, name } = req.query;

    const filePath = path.join(process.cwd(), "data", "runes_24.json");
    const jsonData = await fs.readFile(filePath, "utf-8");
    const runesData = JSON.parse(jsonData).runes;

    let found = null;

    if (number) {
      const index = parseInt(number, 10) - 1; // number เริ่มที่ 1
      if (index >= 0 && index < runesData.length) {
        found = runesData[index];
      }
    } else if (name) {
      found = runesData.find(r => r.name.toLowerCase() === name.toLowerCase());
    } else {
      return res.status(400).json({ error: "Missing number or name parameter" });
    }

    if (!found) {
      return res.status(404).json({ error: "Rune not found" });
    }

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json(found);
  } catch (error) {
    console.error("Error reading runes file:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
