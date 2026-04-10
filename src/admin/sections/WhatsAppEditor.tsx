import { useState } from "react";
import { Save, Check, MessageCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSite, type WhatsAppConfig } from "../../context/SiteContext";

export default function WhatsAppEditor() {
  const { data, updateWhatsApp } = useSite();
  const [form, setForm] = useState<WhatsAppConfig>({ ...data.whatsapp });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateWhatsApp(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const previewUrl = form.phone
    ? `https://wa.me/${form.phone.replace(/\D/g, "")}?text=${encodeURIComponent(form.message ?? "")}`
    : null;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Botón de WhatsApp</h2>
        <p className="text-slate-500 text-sm">
          Configura el botón flotante de WhatsApp que aparece en todas las páginas.
        </p>
      </div>

      <div className="bg-white rounded-xl border shadow-sm p-6 space-y-5">

        {/* Enable toggle */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-slate-800">Activar botón</p>
            <p className="text-xs text-slate-500">Mostrar u ocultar el botón flotante</p>
          </div>
          <button
            onClick={() => setForm({ ...form, enabled: !form.enabled })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
              form.enabled ? "bg-green-500" : "bg-slate-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                form.enabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Número de teléfono
          </label>
          <Input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="59898942143"
          />
          <div className="mt-1.5 flex items-start gap-1.5 text-xs text-slate-500">
            <Info className="w-3.5 h-3.5 mt-0.5 shrink-0 text-blue-400" />
            <span>
              Código de país + número, sin el signo <code className="bg-slate-100 px-1 rounded">+</code>.
              Ejemplo Uruguay: <code className="bg-slate-100 px-1 rounded">59898942143</code>
            </span>
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Mensaje predeterminado
          </label>
          <textarea
            value={form.message ?? ""}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            rows={3}
            placeholder="Hola! Me gustaría recibir información sobre los cursos."
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <p className="text-xs text-slate-400 mt-1">
            Este texto se completará automáticamente al abrir WhatsApp.
          </p>
        </div>

        {/* Label */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Etiqueta del botón
          </label>
          <Input
            value={form.label ?? ""}
            onChange={(e) => setForm({ ...form, label: e.target.value })}
            placeholder="Chatear por WhatsApp"
          />
          <p className="text-xs text-slate-400 mt-1">
            Texto que aparece junto al ícono (puede dejarse vacío).
          </p>
        </div>

        {/* Position */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Posición en pantalla
          </label>
          <div className="grid grid-cols-2 gap-3">
            {(["bottom-right", "bottom-left"] as const).map((pos) => (
              <button
                key={pos}
                onClick={() => setForm({ ...form, position: pos })}
                className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                  form.position === pos
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                <span className="text-lg">
                  {pos === "bottom-right" ? "↘" : "↙"}
                </span>
                {pos === "bottom-right" ? "Inferior derecha" : "Inferior izquierda"}
              </button>
            ))}
          </div>
        </div>

        {/* Live preview */}
        <div className="border-t pt-5">
          <p className="text-sm font-semibold text-slate-700 mb-3">Vista previa</p>
          <div className="relative bg-slate-100 rounded-xl h-32 overflow-hidden border">
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs text-slate-400">
              Vista de la página
            </span>
            {form.enabled && (
              <a
                href={previewUrl ?? "#"}
                target="_blank"
                rel="noreferrer"
                title="Abrir WhatsApp (preview)"
                className={`absolute bottom-3 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold rounded-full shadow-lg px-3 py-2 transition-colors ${
                  form.position === "bottom-right" ? "right-3" : "left-3"
                }`}
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                {form.label && <span>{form.label}</span>}
              </a>
            )}
          </div>
          {form.enabled && previewUrl && (
            <p className="text-xs text-slate-400 mt-1 truncate">
              URL: {previewUrl}
            </p>
          )}
        </div>

        <Button
          onClick={handleSave}
          className={`w-full h-11 font-semibold text-white transition-all ${
            saved ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {saved ? (
            <>
              <Check className="w-4 h-4 mr-2" /> ¡Guardado!
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" /> Guardar Cambios
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
