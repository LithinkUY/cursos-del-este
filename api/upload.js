import { put, list, del } from "@vercel/blob";

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    if (req.method === "GET") {
      const { blobs } = await list();
      const files = blobs.map((b) => ({
        filename: b.pathname,
        url: b.url,
        size: b.size,
      }));
      return res.status(200).json(files);
    }

    if (req.method === "DELETE") {
      const { url } = req.body ?? {};
      if (!url) return res.status(400).json({ error: "url required" });
      await del(url);
      return res.status(200).json({ ok: true });
    }

    if (req.method === "POST") {
      const contentType = req.headers["content-type"] || "";
      if (!contentType.includes("multipart/form-data")) {
        return res.status(400).json({ error: "Expected multipart/form-data" });
      }

      const chunks = [];
      await new Promise((resolve, reject) => {
        req.on("data", (chunk) => chunks.push(chunk));
        req.on("end", resolve);
        req.on("error", reject);
      });
      const body = Buffer.concat(chunks);

      const boundaryMatch = contentType.match(/boundary=(.+)/);
      if (!boundaryMatch) return res.status(400).json({ error: "No boundary found" });
      const boundary = boundaryMatch[1];

      const bodyStr = body.toString("binary");
      const parts = bodyStr.split("--" + boundary);

      for (const part of parts) {
        const headerEnd = part.indexOf("\r\n\r\n");
        if (headerEnd === -1) continue;
        const headers = part.substring(0, headerEnd);
        const filenameMatch = headers.match(/filename="([^"]+)"/);
        if (!filenameMatch) continue;

        const filename = filenameMatch[1];
        const fileContent = part.substring(headerEnd + 4).replace(/\r\n$/, "");
        const fileBuffer = Buffer.from(fileContent, "binary");

        const ext = filename.split(".").pop() || "bin";
        const safeName = Date.now() + "-" + Math.random().toString(36).slice(2, 8) + "." + ext;

        const contentTypeMap = {
          jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png",
          gif: "image/gif", webp: "image/webp", svg: "image/svg+xml",
          mp4: "video/mp4", webm: "video/webm", mov: "video/quicktime",
        };

        const blob = await put(safeName, fileBuffer, {
          access: "public",
          contentType: contentTypeMap[ext.toLowerCase()] || "application/octet-stream",
        });

        return res.status(200).json({ url: blob.url, filename: safeName });
      }

      return res.status(400).json({ error: "No file found in request" });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("API /upload error:", err);
    return res.status(500).json({ error: err.message });
  }
}
