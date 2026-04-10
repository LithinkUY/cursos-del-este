export default function handler(_req, res) {
  res.status(200).json({
    ok: true,
    hasDbUrl: !!process.env.DATABASE_URL,
    hasBlobToken: !!process.env.BLOB_READ_WRITE_TOKEN,
    nodeVersion: process.version,
    time: new Date().toISOString(),
  });
}
