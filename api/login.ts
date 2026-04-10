import type { VercelRequest, VercelResponse } from "@vercel/node";
import { neon } from "@neondatabase/serverless";
import bcryptjs from "bcryptjs";
const bcrypt = bcryptjs;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.DATABASE_URL) {
    return res.status(500).json({ error: "DATABASE_URL not configured" });
  }

  const sql = neon(process.env.DATABASE_URL);
  const { username, password } = req.body ?? {};

  if (!username || !password) {
    return res.status(400).json({ error: "username and password required" });
  }

  try {
    const rows = await sql`SELECT id, username, password_hash FROM admin_users WHERE username = ${username}`;
    if (rows.length === 0) {
      return res.status(401).json({ error: "Usuario o contraseña incorrectos." });
    }

    const user = rows[0];

    // Support both bcrypt-hashed passwords and plain-text (legacy)
    let valid = false;
    if (user.password_hash.startsWith("$2")) {
      valid = await bcrypt.compare(password, user.password_hash);
    } else {
      // Legacy plain-text password — also hash it for next time
      valid = password === user.password_hash;
      if (valid) {
        const hash = await bcrypt.hash(password, 10);
        await sql`UPDATE admin_users SET password_hash = ${hash}, updated_at = now() WHERE id = ${user.id}`;
      }
    }

    if (!valid) {
      return res.status(401).json({ error: "Usuario o contraseña incorrectos." });
    }

    return res.status(200).json({ ok: true, username: user.username });
  } catch (err: any) {
    console.error("API /login error:", err);
    return res.status(500).json({ error: err.message });
  }
}
