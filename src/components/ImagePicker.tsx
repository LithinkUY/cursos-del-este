import { useState, useRef, useEffect, useCallback, type ChangeEvent, type DragEvent, type ReactNode } from "react";
import { Upload, Link, ImageIcon, X, Check, Trash2, Loader2, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const BACKEND = "http://localhost:3001";

type Tab = "url" | "upload" | "gallery";

interface GalleryFile {
  filename: string;
  url: string;
  size: number;
}

interface ImagePickerProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ─────────────────────────────────────────────────────────────────────────────

export default function ImagePicker({ value, onChange, label = "Imagen", className = "" }: ImagePickerProps) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("url");

  // URL tab
  const [urlInput, setUrlInput] = useState(value ?? "");

  // Upload tab
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Gallery tab
  const [gallery, setGallery] = useState<GalleryFile[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Sync urlInput with value when opening
  useEffect(() => { if (open) setUrlInput(value ?? ""); }, [open, value]);

  const loadGallery = useCallback(async () => {
    setGalleryLoading(true);
    try {
      const r = await fetch(`${BACKEND}/api/uploads`);
      if (r.ok) setGallery(await r.json());
    } catch { /* backend offline */ }
    setGalleryLoading(false);
  }, []);

  useEffect(() => {
    if (open && tab === "gallery") loadGallery();
  }, [open, tab, loadGallery]);

  // ── Upload ────────────────────────────────────────────────────────────────
  const uploadFile = async (file: File) => {
    setUploading(true);
    setUploadError("");
    const form = new FormData();
    form.append("image", file);
    try {
      const r = await fetch(`${BACKEND}/api/upload`, { method: "POST", body: form });
      const json = await r.json();
      if (r.ok && json.url) {
        onChange(json.url);
        setOpen(false);
      } else {
        setUploadError(json.error ?? "Error al subir");
      }
    } catch {
      setUploadError("No se pudo conectar al servidor. Asegúrate de que el backend está corriendo.");
    }
    setUploading(false);
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = "";
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  // ── Delete from gallery ───────────────────────────────────────────────────
  const deleteFile = async (filename: string) => {
    setDeleting(filename);
    try {
      await fetch(`${BACKEND}/api/upload/${filename}`, { method: "DELETE" });
      setGallery((g) => g.filter((f) => f.filename !== filename));
      if (value.includes(filename)) onChange("");
    } catch { /* ignore */ }
    setDeleting(null);
  };

  // ── Apply ─────────────────────────────────────────────────────────────────
  const applyUrl = () => {
    onChange(urlInput.trim());
    setOpen(false);
  };

  const applyGallery = () => {
    if (selected) { onChange(selected); setOpen(false); }
  };

  const tabs: { id: Tab; label: string; icon: ReactNode }[] = [
    { id: "url", label: "URL externa", icon: <Link className="w-4 h-4" /> },
    { id: "upload", label: "Subir archivo", icon: <Upload className="w-4 h-4" /> },
    { id: "gallery", label: "Galería", icon: <ImageIcon className="w-4 h-4" /> },
  ];

  return (
    <div className={className}>
      {label && <label className="block text-sm font-semibold text-slate-700 mb-1">{label}</label>}

      {/* Preview + trigger */}
      <div className="flex gap-2 items-start">
        <div className="flex-1 relative">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://... o sube desde la PC"
            className="pr-10"
          />
          {value && (
            <button
              onClick={() => onChange("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="shrink-0 px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5 text-sm font-medium"
        >
          <Upload className="w-4 h-4" />
          <span className="hidden sm:inline">Elegir</span>
        </button>
      </div>

      {value && (
        <div className="mt-2 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 w-full max-h-32">
          <img src={value} alt="" className="w-full h-32 object-cover" referrerPolicy="no-referrer" />
        </div>
      )}

      {/* ── Modal ──────────────────────────────────────────────────────────── */}
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h3 className="font-bold text-slate-800">Seleccionar imagen</h3>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b px-4">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    tab === t.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {t.icon}
                  {t.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5">

              {/* ── URL tab ────────────────────────────────────────────────── */}
              {tab === "url" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">URL de la imagen</label>
                    <Input
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && applyUrl()}
                      placeholder="https://ejemplo.com/imagen.jpg"
                      autoFocus
                    />
                  </div>
                  {urlInput && (
                    <div className="rounded-lg overflow-hidden border bg-slate-50">
                      <img src={urlInput} alt="" className="w-full max-h-48 object-contain" referrerPolicy="no-referrer" />
                    </div>
                  )}
                  <Button onClick={applyUrl} disabled={!urlInput.trim()} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    <Check className="w-4 h-4 mr-2" /> Usar esta URL
                  </Button>
                </div>
              )}

              {/* ── Upload tab ─────────────────────────────────────────────── */}
              {tab === "upload" && (
                <div className="space-y-4">
                  <div
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                      dragOver ? "border-blue-400 bg-blue-50" : "border-slate-300 hover:border-blue-300 hover:bg-slate-50"
                    }`}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={onDrop}
                  >
                    {uploading ? (
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                        <p className="text-sm text-slate-500">Subiendo imagen...</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3">
                        <Upload className="w-10 h-10 text-slate-400" />
                        <div>
                          <p className="font-semibold text-slate-700">Haz clic o arrastra una imagen aquí</p>
                          <p className="text-xs text-slate-400 mt-1">JPG, PNG, GIF, WebP, SVG · máx. 10 MB</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={onFileChange}
                  />
                  {uploadError && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                      ⚠️ {uploadError}
                    </p>
                  )}
                  <p className="text-xs text-slate-400 text-center">
                    La imagen se sube al servidor y la URL se copia automáticamente.
                  </p>
                </div>
              )}

              {/* ── Gallery tab ────────────────────────────────────────────── */}
              {tab === "gallery" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-500">{gallery.length} imagen{gallery.length !== 1 ? "es" : ""} subida{gallery.length !== 1 ? "s" : ""}</p>
                    <button
                      onClick={loadGallery}
                      className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 transition-colors"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${galleryLoading ? "animate-spin" : ""}`} />
                      Recargar
                    </button>
                  </div>

                  {galleryLoading && (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                    </div>
                  )}

                  {!galleryLoading && gallery.length === 0 && (
                    <div className="text-center py-10 text-slate-400">
                      <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">No hay imágenes subidas todavía.</p>
                      <p className="text-xs mt-1">Usa la pestaña "Subir archivo" para agregar.</p>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-2">
                    {gallery.map((file) => (
                      <div
                        key={file.filename}
                        onClick={() => setSelected(file.url)}
                        className={`relative cursor-pointer rounded-lg overflow-hidden border-2 aspect-square transition-all ${
                          selected === file.url
                            ? "border-blue-500 ring-2 ring-blue-300"
                            : "border-transparent hover:border-slate-300"
                        }`}
                      >
                        <img
                          src={file.url}
                          alt={file.filename}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        {selected === file.url && (
                          <div className="absolute top-1 left-1 bg-blue-500 text-white rounded-full p-0.5">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteFile(file.filename); }}
                          className="absolute top-1 right-1 bg-black/60 hover:bg-red-600 text-white rounded-full p-0.5 transition-colors"
                          title="Eliminar"
                        >
                          {deleting === file.filename
                            ? <Loader2 className="w-3 h-3 animate-spin" />
                            : <Trash2 className="w-3 h-3" />
                          }
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-1.5 py-0.5">
                          <p className="text-white text-[10px] truncate">{formatBytes(file.size)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {tab === "gallery" && (
              <div className="px-5 py-3 border-t flex justify-end gap-2">
                <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                <Button
                  onClick={applyGallery}
                  disabled={!selected}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Check className="w-4 h-4 mr-2" /> Usar seleccionada
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
