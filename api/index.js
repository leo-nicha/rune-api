import path from "path";
import fs from "fs/promises";

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  try {
    const filePath = path.join(process.cwd(), "data", "runes_24.json");
    const jsonData = await fs.readFile(filePath, "utf-8");
    const runesData = JSON.parse(jsonData).runes;

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json(runesData);
  } catch (error) {
    console.error("Error reading runes file:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
