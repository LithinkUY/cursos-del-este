// Seed script: push data.json into Neon site_config table
import { neon } from "@neondatabase/serverless";
import fs from "fs";
import bcrypt from "bcryptjs";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("Set DATABASE_URL env var");
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function seed() {
  // 1. Seed site data
  const raw = JSON.parse(fs.readFileSync("data.json", "utf8"));
  const { adminUser, ...siteData } = raw;
  const jsonStr = JSON.stringify(siteData);

  await sql`
    INSERT INTO site_config (id, data, updated_at)
    VALUES ('main', ${jsonStr}::jsonb, now())
    ON CONFLICT (id) DO UPDATE SET data = ${jsonStr}::jsonb, updated_at = now()
  `;
  console.log("✅ Site data seeded to site_config");

  // 2. Hash admin password
  const hash = await bcrypt.hash("admin123", 10);
  await sql`
    UPDATE admin_users SET password_hash = ${hash}, updated_at = now()
    WHERE username = 'admin'
  `;
  console.log("✅ Admin password hashed with bcrypt");
}

seed().then(() => {
  console.log("Done!");
  process.exit(0);
}).catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
