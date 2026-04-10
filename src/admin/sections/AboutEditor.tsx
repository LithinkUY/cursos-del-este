import { useRef, useState, type ChangeEvent } from "react";
import { useSite } from "../../context/SiteContext";
import type { AboutSection } from "../../context/SiteContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Video,
  Image as ImageIcon,
  X as XIcon,
  GripVertical,
  Upload,
  Loader2,
} from "lucide-react";
import ImagePicker from "../../components/ImagePicker";

export default function AboutEditor() {
  const { data, updateAbout } = useSite();
  const about = data.about;

  const update = (patch: Partial<AboutSection>) => updateAbout({ ...about, ...patch });

  const [newBullet, setNewBullet] = useState("");
  const [uploading, setUploading] = useState(false);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleVideoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      // Try client-side upload (Vercel Blob) first, fallback to server upload
      let url = "";
      try {
        const { upload } = await import("@vercel/blob/client");
        const blob = await upload(file.name, file, {
          access: "public",
          handleUploadUrl: "/api/upload-client",
        });
        url = blob.url;
      } catch {
        // Fallback: server-side upload (local dev)
        const form = new FormData();
        form.append("video", file);
        const res = await fetch("/api/upload", {
          method: "POST",
          body: form,
        });
        const json = await res.json();
        url = json.url || "";
      }
      if (url) {
        update({ bgVideo: url });
      }
    } catch (err) {
      console.error("Error uploading video:", err);
    } finally {
      setUploading(false);
      if (videoInputRef.current) videoInputRef.current.value = "";
    }
  };

  const addBullet = () => {
    const t = newBullet.trim();
    if (!t) return;
    update({ bulletPoints: [...about.bulletPoints, t] });
    setNewBullet("");
  };

  const removeBullet = (idx: number) => {
    update({ bulletPoints: about.bulletPoints.filter((_, i) => i !== idx) });
  };

  const updateImage = (idx: number, url: string) => {
    const imgs = [...about.images];
    imgs[idx] = url;
    update({ images: imgs });
  };

  const addImage = () => {
    update({ images: [...about.images, ""] });
  };

  const removeImage = (idx: number) => {
    update({ images: about.images.filter((_, i) => i !== idx) });
  };

  return (
    <div className="space-y-6">
      {/* Visible toggle */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Sección Sobre Nosotros</h3>
        <Button
          variant={about.visible ? "default" : "outline"}
          size="sm"
          onClick={() => update({ visible: !about.visible })}
        >
          {about.visible ? <Eye className="w-4 h-4 mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
          {about.visible ? "Visible" : "Oculta"}
        </Button>
      </div>

      {/* Badge */}
      <div>
        <label className="text-sm font-medium text-slate-700">Badge / Etiqueta</label>
        <Input
          value={about.badge}
          onChange={(e) => update({ badge: e.target.value })}
          placeholder="Sobre Nosotros"
        />
      </div>

      {/* Título */}
      <div>
        <label className="text-sm font-medium text-slate-700">Título</label>
        <Input
          value={about.title}
          onChange={(e) => update({ title: e.target.value })}
          placeholder="Líderes en capacitación..."
        />
      </div>

      {/* Descripción */}
      <div>
        <label className="text-sm font-medium text-slate-700">Descripción</label>
        <textarea
          className="w-full border rounded-lg px-3 py-2 text-sm min-h-[80px] resize-y"
          value={about.description}
          onChange={(e) => update({ description: e.target.value })}
          placeholder="Texto descriptivo..."
        />
      </div>

      {/* Puntos clave */}
      <div>
        <label className="text-sm font-medium text-slate-700 mb-2 block">Puntos Destacados</label>
        <div className="space-y-2">
          {about.bulletPoints.map((bp, i) => (
            <div key={i} className="flex items-center gap-2">
              <GripVertical className="w-4 h-4 text-slate-400 shrink-0" />
              <Input
                value={bp}
                onChange={(e) => {
                  const pts = [...about.bulletPoints];
                  pts[i] = e.target.value;
                  update({ bulletPoints: pts });
                }}
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeBullet(i)}
                className="shrink-0 text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-2">
          <Input
            value={newBullet}
            onChange={(e) => setNewBullet(e.target.value)}
            placeholder="Nuevo punto destacado..."
            onKeyDown={(e) => e.key === "Enter" && addBullet()}
          />
          <Button variant="outline" size="sm" onClick={addBullet}>
            <Plus className="w-4 h-4 mr-1" /> Agregar
          </Button>
        </div>
      </div>

      {/* ── Fondo ─────────────────────────────────────────────────── */}
      <div className="border rounded-lg p-4 space-y-4">
        <label className="text-sm font-semibold text-slate-700">Fondo de la Sección</label>

        <div className="flex gap-2">
          {(["none", "video", "image"] as const).map((t) => (
            <Button
              key={t}
              variant={about.bgType === t ? "default" : "outline"}
              size="sm"
              onClick={() => update({ bgType: t })}
            >
              {t === "none" && "Sin fondo"}
              {t === "video" && (
                <>
                  <Video className="w-4 h-4 mr-1" /> Video
                </>
              )}
              {t === "image" && (
                <>
                  <ImageIcon className="w-4 h-4 mr-1" /> Imagen
                </>
              )}
            </Button>
          ))}
        </div>

        {about.bgType === "video" && (
          <div className="space-y-3">
            {/* Upload button */}
            <div>
              <label className="text-xs text-slate-500 block mb-1">Subir video desde tu PC</label>
              <input
                ref={videoInputRef}
                type="file"
                accept="video/mp4,video/webm,video/ogg,.mp4,.webm,.mov"
                onChange={handleVideoUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => videoInputRef.current?.click()}
                disabled={uploading}
                className="w-full"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Subiendo video...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" /> Elegir archivo de video
                  </>
                )}
              </Button>
            </div>

            {/* Or paste URL */}
            <div>
              <label className="text-xs text-slate-500">O pegar URL del video (MP4, WebM)</label>
              <Input
                value={about.bgVideo}
                onChange={(e) => update({ bgVideo: e.target.value })}
                placeholder="https://ejemplo.com/video.mp4"
              />
            </div>

            {/* Preview */}
            {about.bgVideo && (
              <div className="relative rounded-lg overflow-hidden border aspect-video">
                <video
                  src={about.bgVideo}
                  className="w-full h-full object-cover"
                  muted
                  loop
                  autoPlay
                  playsInline
                />
                <button
                  onClick={() => update({ bgVideo: "" })}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {about.bgType === "image" && (
          <div>
            <label className="text-xs text-slate-500">Imagen de Fondo</label>
            <ImagePicker
              value={about.bgImage}
              onChange={(url) => update({ bgImage: url })}
              label="Imagen de fondo"
            />
          </div>
        )}

        {about.bgType !== "none" && (
          <div>
            <label className="text-xs text-slate-500">
              Opacidad del overlay oscuro: {about.overlayOpacity}%
            </label>
            <input
              type="range"
              min={0}
              max={90}
              value={about.overlayOpacity}
              onChange={(e) => update({ overlayOpacity: Number(e.target.value) })}
              className="w-full"
            />
          </div>
        )}
      </div>

      {/* ── Imágenes laterales ─────────────────────────────────────── */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-slate-700">
            Imágenes Laterales ({about.images.length})
          </label>
          <Button variant="outline" size="sm" onClick={addImage}>
            <Plus className="w-4 h-4 mr-1" /> Agregar Imagen
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {about.images.map((img, i) => (
            <div key={i} className="relative group">
              <ImagePicker
                value={img}
                onChange={(url) => updateImage(i, url)}
                label={`Imagen ${i + 1}`}
              />
              <button
                onClick={() => removeImage(i)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                <XIcon className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
