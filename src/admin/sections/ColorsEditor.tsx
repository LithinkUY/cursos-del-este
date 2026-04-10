import { useState } from "react";
import { Save, Check, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSite, type SiteColors } from "../../context/SiteContext";

const DEFAULT_COLORS: SiteColors = {
  primary: "#2563eb",
  secondary: "#1e3a8a",
  accent: "#f59e0b",
  background: "#f8fafc",
  text: "#0f172a",
};

const PRESETS: { name: string; colors: SiteColors }[] = [
  {
    name: "Azul (Default)",
    colors: DEFAULT_COLORS,
  },
  {
    name: "Verde",
    colors: {
      primary: "#16a34a",
      secondary: "#14532d",
      accent: "#f59e0b",
      background: "#f0fdf4",
      text: "#14532d",
    },
  },
  {
    name: "Rojo",
    colors: {
      primary: "#dc2626",
      secondary: "#7f1d1d",
      accent: "#f59e0b",
      background: "#fff5f5",
      text: "#1a0000",
    },
  },
  {
    name: "Púrpura",
    colors: {
      primary: "#7c3aed",
      secondary: "#4c1d95",
      accent: "#f59e0b",
      background: "#faf5ff",
      text: "#1e1035",
    },
  },
  {
    name: "Naranja",
    colors: {
      primary: "#ea580c",
      secondary: "#9a3412",
      accent: "#3b82f6",
      background: "#fff7ed",
      text: "#1c0a00",
    },
  },
];

const COLOR_FIELDS: { key: keyof SiteColors; label: string; description: string }[] = [
  { key: "primary", label: "Color Primario", description: "Botones, links y elementos destacados" },
  { key: "secondary", label: "Color Secundario", description: "Textos del logo y encabezados" },
  { key: "accent", label: "Color de Acento", description: "Badges y detalles especiales" },
  { key: "background", label: "Color de Fondo", description: "Fondo general del sitio" },
  { key: "text", label: "Color de Texto", description: "Texto principal del contenido" },
];

export default function ColorsEditor() {
  const { data, updateColors } = useSite();
  const [form, setForm] = useState<SiteColors>({ ...data.colors });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateColors(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const applyPreset = (preset: SiteColors) => {
    setForm({ ...preset });
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Colores del Sitio</h2>
        <p className="text-slate-500 text-sm">
          Personalizá la paleta de colores de toda la web.
        </p>
      </div>

      {/* Presets */}
      <div className="bg-white rounded-xl border shadow-sm p-5">
        <h3 className="font-semibold text-slate-800 mb-3">Paletas Preconfiguradas</h3>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset.colors)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
            >
              <div className="flex gap-1">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ background: preset.colors.primary }}
                />
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ background: preset.colors.secondary }}
                />
              </div>
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Colors */}
      <div className="bg-white rounded-xl border shadow-sm p-6 space-y-5">
        <h3 className="font-semibold text-slate-800">Colores Personalizados</h3>

        {COLOR_FIELDS.map(({ key, label, description }) => (
          <div key={key} className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-slate-700">{label}</label>
              <p className="text-xs text-slate-400 mt-0.5">{description}</p>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl border-2 border-slate-200 shadow-sm overflow-hidden cursor-pointer"
                style={{ background: form[key] }}
              >
                <input
                  type="color"
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="w-full h-full opacity-0 cursor-pointer"
                  title={label}
                />
              </div>
              <input
                type="text"
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-28 px-3 py-2 text-sm font-mono border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        ))}

        {/* Preview */}
        <div className="border-t pt-5">
          <p className="text-sm font-semibold text-slate-700 mb-3">Vista Previa</p>
          <div
            className="rounded-xl p-5 space-y-3"
            style={{ background: form.background, color: form.text }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                style={{ background: form.primary }}
              >
                CE
              </div>
              <span className="font-bold text-sm" style={{ color: form.secondary }}>
                Cursos del Este
              </span>
            </div>
            <p className="text-sm opacity-70">Texto de ejemplo para ver el contraste.</p>
            <button
              className="px-4 py-1.5 rounded-lg text-sm font-semibold text-white"
              style={{ background: form.primary }}
            >
              Botón Primario
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleSave}
            className={`flex-1 h-11 font-semibold text-white transition-all ${
              saved ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {saved ? (
              <>
                <Check className="w-4 h-4 mr-2" /> ¡Guardado!
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" /> Guardar Colores
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => setForm({ ...DEFAULT_COLORS })}
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
