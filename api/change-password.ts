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
  const { username, currentPassword, newPassword } = req.body ?? {};

  if (!username || !currentPassword || !newPassword) {
    return res.status(400).json({ error: "username, currentPassword and newPassword required" });
  }

  if (newPassword.length < 4) {
    return res.status(400).json({ error: "La nueva contraseña debe tener al menos 4 caracteres." });
  }

  try {
    const rows = await sql`SELECT id, password_hash FROM admin_users WHERE username = ${username}`;
    if (rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    const user = rows[0];

    // Verify current password (bcrypt or plain-text legacy)
    let valid = false;
    if (user.password_hash.startsWith("$2")) {
      valid = await bcrypt.compare(currentPassword, user.password_hash);
    } else {
      valid = currentPassword === user.password_hash;
    }

    if (!valid) {
      return res.status(401).json({ error: "La contraseña actual es incorrecta." });
    }

    // Hash and save new password
    const hash = await bcrypt.hash(newPassword, 10);
    await sql`UPDATE admin_users SET password_hash = ${hash}, updated_at = now() WHERE id = ${user.id}`;

    return res.status(200).json({ ok: true });
  } catch (err: any) {
    console.error("API /change-password error:", err);
    return res.status(500).json({ error: err.message });
  }
}
