import express, { type Request, type Response } from "express";
import cors from "cors";
import multer, { type StorageEngine, type FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// ── Paths ─────────────────────────────────────────────────────────────────────
// Guardamos en _server_data/ para que Vite no observe estos archivos
const SERVER_DATA_DIR = path.join(__dirname, "_server_data");
const DATA_FILE = path.join(SERVER_DATA_DIR, "data.json");
const UPLOADS_DIR = path.join(SERVER_DATA_DIR, "uploads");

// Crear carpetas si no existen
if (!fs.existsSync(SERVER_DATA_DIR)) fs.mkdirSync(SERVER_DATA_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// ── Middleware ─────────────────────────────────────────────────────────────────
app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "10mb" }));
app.use("/uploads", express.static(UPLOADS_DIR));

// ── Multer (subida de imágenes) ────────────────────────────────────────────────
const storage: StorageEngine = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) =>
    cb(null, UPLOADS_DIR),
  filename: (_req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const allowed = /jpeg|jpg|png|gif|webp|svg/;
    const ok = allowed.test(file.mimetype) && allowed.test(path.extname(file.originalname).toLowerCase());
    cb(null, ok);
  },
});

const uploadVideo = multer({
  storage,
  limits: { fileSize: 200 * 1024 * 1024 }, // 200MB
  fileFilter: (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const allowed = /mp4|webm|ogg|mov/;
    const okExt = allowed.test(path.extname(file.originalname).toLowerCase().replace(".", ""));
    const okMime = /video\/(mp4|webm|ogg|quicktime)/.test(file.mimetype);
    cb(null, okExt || okMime);
  },
});

// ── Data helpers ───────────────────────────────────────────────────────────────
function readData() {
  if (!fs.existsSync(DATA_FILE)) return null;
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  } catch {
    return null;
  }
}

function writeData(data: unknown) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

// ── Routes ─────────────────────────────────────────────────────────────────────

// GET /api/data  → leer todo
app.get("/api/data", (_req, res) => {
  const data = readData();
  if (!data) return res.status(404).json({ error: "No data found" });
  res.json(data);
});

// POST /api/data  → guardar todo
app.post("/api/data", (req, res) => {
  try {
    writeData(req.body);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// POST /api/upload  → subir imagen, devuelve URL
app.post("/api/upload", upload.single("image"), (req: Request, res: Response) => {
  const file = (req as Request & { file?: Express.Multer.File }).file;
  if (!file) return res.status(400).json({ error: "No file uploaded" });
  const url = `http://localhost:${PORT}/uploads/${file.filename}`;
  res.json({ url, filename: file.filename });
});

// POST /api/upload-video  → subir video, devuelve URL
app.post("/api/upload-video", uploadVideo.single("video"), (req: Request, res: Response) => {
  const file = (req as Request & { file?: Express.Multer.File }).file;
  if (!file) return res.status(400).json({ error: "No video uploaded" });
  const url = `http://localhost:${PORT}/uploads/${file.filename}`;
  res.json({ url, filename: file.filename });
});

// DELETE /api/upload/:filename  → borrar imagen
app.delete("/api/upload/:filename", (req, res) => {
  const filePath = path.join(UPLOADS_DIR, req.params.filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    res.json({ ok: true });
  } else {
    res.status(404).json({ error: "File not found" });
  }
});

// GET /api/uploads  → listar todas las imágenes subidas
app.get("/api/uploads", (_req, res) => {
  const files = fs.readdirSync(UPLOADS_DIR)
    .filter(f => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(f))
    .map(f => ({
      filename: f,
      url: `http://localhost:${PORT}/uploads/${f}`,
      size: fs.statSync(path.join(UPLOADS_DIR, f)).size,
    }));
  res.json(files);
});

// ── Start ──────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Backend corriendo en http://localhost:${PORT}`);
});
