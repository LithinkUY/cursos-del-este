import { handleUpload } from "@vercel/blob/client";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-vercel-blob-store-id");
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const jsonResponse = await handleUpload({
      body: req.body,
      request: req,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: [
          "image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml",
          "video/mp4", "video/webm", "video/quicktime",
        ],
        maximumSizeInBytes: 100 * 1024 * 1024, // 100MB
      }),
      onUploadCompleted: async () => {},
    });
    return res.status(200).json(jsonResponse);
  } catch (err) {
    console.error("API /upload-client error:", err);
    return res.status(400).json({ error: err.message });
  }
}
