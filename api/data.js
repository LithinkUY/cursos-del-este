import { neon } from "@neondatabase/serverless";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (!process.env.DATABASE_URL) {
    return res.status(500).json({ error: "DATABASE_URL not configured" });
  }

  const sql = neon(process.env.DATABASE_URL);

  try {
    if (req.method === "GET") {
      const rows = await sql`SELECT data FROM site_config WHERE id = 'main'`;
      if (rows.length === 0) return res.status(200).json({});
      return res.status(200).json(rows[0].data);
    }

    if (req.method === "POST") {
      const body = req.body;
      if (!body || typeof body !== "object") {
        return res.status(400).json({ error: "Invalid body" });
      }
      const { adminUser, ...siteData } = body;
      const jsonStr = JSON.stringify(siteData);
      await sql`
        INSERT INTO site_config (id, data, updated_at)
        VALUES ('main', ${jsonStr}::jsonb, now())
        ON CONFLICT (id) DO UPDATE SET data = ${jsonStr}::jsonb, updated_at = now()
      `;
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("API /data error:", err);
    return res.status(500).json({ error: err.message });
  }
}
