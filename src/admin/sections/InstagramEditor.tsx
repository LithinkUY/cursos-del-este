import { useState } from "react";
import { Save, Check, Instagram, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSite, type InstagramConfig } from "../../context/SiteContext";

export default function InstagramEditor() {
  const { data, updateInstagram } = useSite();
  const [form, setForm] = useState<InstagramConfig>({ ...data.instagram });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateInstagram(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Instagram</h2>
        <p className="text-slate-500 text-sm">
          Mostrá tu feed de Instagram en la página de inicio.
        </p>
      </div>

      <div className="bg-white rounded-xl border shadow-sm p-6 space-y-5">
        {/* Enable toggle */}
        <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div
            onClick={() => setForm({ ...form, enabled: !form.enabled })}
            className={`relative w-12 h-6 rounded-full cursor-pointer transition-colors ${
              form.enabled ? "bg-blue-600" : "bg-slate-300"
            }`}
          >
            <div
              className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                form.enabled ? "translate-x-7" : "translate-x-1"
              }`}
            />
          </div>
          <div>
            <p className="font-semibold text-slate-800">
              {form.enabled ? "Instagram Activo" : "Instagram Desactivado"}
            </p>
            <p className="text-xs text-slate-500">
              {form.enabled
                ? "La sección de Instagram se muestra en el home."
                : "La sección está oculta en el home."}
            </p>
          </div>
        </div>

        {form.enabled && (
          <>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Nombre de usuario de Instagram
              </label>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 text-sm">@</span>
                <Input
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  placeholder="cursosdeleste"
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Se usa para mostrar el enlace al perfil.
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Código de Embed de Instagram
              </label>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3 flex gap-2">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-800 space-y-1">
                  <p className="font-semibold">¿Cómo obtener el código embed?</p>
                  <p>1. Andá a Instagram.com desde el navegador</p>
                  <p>2. Abrí una publicación y hacé click en los 3 puntos (···)</p>
                  <p>3. Seleccioná "Insertar" (Embed)</p>
                  <p>4. Copiá el código HTML que aparece y pegalo acá</p>
                  <p className="font-semibold mt-1">También podés usar servicios como Elfsight o Behold para feeds completos.</p>
                </div>
              </div>
              <textarea
                value={form.embedCode}
                onChange={(e) => setForm({ ...form, embedCode: e.target.value })}
                rows={6}
                placeholder={'<blockquote class="instagram-media" ...\n\nO pega aquí el código de tu widget de Instagram (Elfsight, Behold, etc.)'}
                className="w-full px-3 py-2 text-sm font-mono border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Preview */}
            {form.embedCode && (
              <div className="border-t pt-4">
                <p className="text-sm font-semibold text-slate-700 mb-3">Vista Previa del Embed</p>
                <div className="bg-slate-50 rounded-xl p-4 overflow-hidden">
                  <div
                    dangerouslySetInnerHTML={{ __html: form.embedCode }}
                    className="max-w-full"
                  />
                </div>
              </div>
            )}
          </>
        )}

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
              <Save className="w-4 h-4 mr-2" /> Guardar Configuración
            </>
          )}
        </Button>
      </div>

      {/* Info Card */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-xl p-5 flex gap-4">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 text-white shrink-0">
          <Instagram className="w-5 h-5" />
        </div>
        <div>
          <p className="font-semibold text-slate-800 text-sm">Consejo</p>
          <p className="text-slate-600 text-xs mt-1 leading-relaxed">
            Para mostrar tu feed completo de Instagram se recomienda usar{" "}
            <strong>Behold.so</strong> o <strong>Elfsight</strong>, que generan un widget
            embebible fácilmente. El embed oficial de Instagram solo muestra publicaciones
            individuales.
          </p>
        </div>
      </div>
    </div>
  );
}
