import { useState, type ElementType, type ReactNode } from "react";
import {
  Save, Check, Plus, Trash2, ChevronUp, ChevronDown,
  Eye, EyeOff, Image as ImageIcon, Type, Palette,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSite, type SiteHeader, type SectionButton } from "../../context/SiteContext";
import ImagePicker from "../../components/ImagePicker";

const newId = () => Date.now().toString();

const EMPTY_BTN: SectionButton = { id: "", label: "", link: "", style: "primary" };

export default function HeaderEditor() {
  const { data, updateHeader } = useSite();
  const [form, setForm] = useState<SiteHeader>({ ...data.header });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateHeader(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  // ── CTA Buttons helpers ─────────────────────────────────────────────────
  const addBtn = () => {
    setForm({
      ...form,
      ctaButtons: [
        ...(form.ctaButtons ?? []),
        { ...EMPTY_BTN, id: newId(), label: "Nuevo Botón", link: "#cursos" },
      ],
    });
  };
  const updateBtn = (idx: number, patch: Partial<SectionButton>) => {
    const btns = [...(form.ctaButtons ?? [])];
    btns[idx] = { ...btns[idx], ...patch };
    setForm({ ...form, ctaButtons: btns });
  };
  const removeBtn = (idx: number) => {
    const btns = [...(form.ctaButtons ?? [])];
    btns.splice(idx, 1);
    setForm({ ...form, ctaButtons: btns });
  };
  const moveBtn = (idx: number, dir: -1 | 1) => {
    const btns = [...(form.ctaButtons ?? [])];
    const to = idx + dir;
    if (to < 0 || to >= btns.length) return;
    [btns[idx], btns[to]] = [btns[to], btns[idx]];
    setForm({ ...form, ctaButtons: btns });
  };

  // ── Field helpers ────────────────────────────────────────────────────────
  const Toggle = ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: boolean;
    onChange: (v: boolean) => void;
  }) => (
    <div className="flex items-center justify-between py-2.5">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative w-11 h-6 rounded-full transition-colors ${value ? "bg-blue-600" : "bg-slate-300"}`}
      >
        <span
          className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
            value ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );

  const Section = ({ title, icon: Icon, children }: { title: string; icon?: ElementType; children: ReactNode }) => (
    <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b">
        {Icon && <Icon className="w-4 h-4 text-blue-600" />}
        <h3 className="font-bold text-slate-800">{title}</h3>
      </div>
      {children}
    </div>
  );

  return (
    <div className="max-w-2xl space-y-6 pb-10">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Encabezado del Sitio</h2>
        <p className="text-slate-500 text-sm">Logo, hero banner, botones CTA y navegación.</p>
      </div>

      {/* ── Logo & Site Name ─────────────────────────────────────────────── */}
      <Section title="Logo y Nombre del Sitio" icon={ImageIcon}>
        <ImagePicker
          label="Logo del Sitio"
          value={form.logoUrl ?? ""}
          onChange={(url) => setForm({ ...form, logoUrl: url })}
        />
        <p className="text-xs text-slate-400 -mt-2">
          Recomendado: PNG con fondo transparente.
        </p>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Ancho del Logo (px)
          </label>
          <Input
            type="number"
            value={form.logoWidth ?? 140}
            onChange={(e) => setForm({ ...form, logoWidth: Number(e.target.value) })}
            min={40}
            max={400}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Nombre del Sitio
          </label>
          <Input
            value={form.siteName}
            onChange={(e) => setForm({ ...form, siteName: e.target.value })}
            placeholder="Cursos del Este"
          />
        </div>
        <Toggle
          label="Mostrar nombre del sitio junto al logo"
          value={form.showSiteName ?? true}
          onChange={(v) => setForm({ ...form, showSiteName: v })}
        />
      </Section>

      {/* ── Hero Banner ──────────────────────────────────────────────────── */}
      <Section title="Hero Banner" icon={ImageIcon}>
        <Toggle
          label="Mostrar hero banner en la página de inicio"
          value={form.enabled ?? true}
          onChange={(v) => setForm({ ...form, enabled: v })}
        />

        {form.enabled && (
          <>
            {/* Height */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Altura del Banner
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(["small", "medium", "large", "fullscreen"] as const).map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setForm({ ...form, height: h })}
                    className={`py-2 rounded-lg text-sm font-medium border transition-colors ${
                      form.height === h
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-slate-200 text-slate-600 hover:border-blue-300"
                    }`}
                  >
                    {h === "small" ? "Pequeño" : h === "medium" ? "Mediano" : h === "large" ? "Grande" : "Pantalla completa"}
                  </button>
                ))}
              </div>
            </div>

            {/* Background Type */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Tipo de Fondo
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["image", "color", "video"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setForm({ ...form, bgType: t })}
                    className={`py-2 rounded-lg text-sm font-medium border transition-colors ${
                      form.bgType === t
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-slate-200 text-slate-600 hover:border-blue-300"
                    }`}
                  >
                    {t === "image" ? "Imagen" : t === "color" ? "Color" : "Video"}
                  </button>
                ))}
              </div>
            </div>

            {form.bgType === "image" && (
              <ImagePicker
                label="Imagen de Fondo del Hero"
                value={form.bgImage ?? ""}
                onChange={(url) => setForm({ ...form, bgImage: url })}
              />
            )}
            {form.bgType === "color" && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Color de Fondo
                </label>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl border-2 border-slate-200 shadow-sm overflow-hidden cursor-pointer"
                    style={{ background: form.bgColor ?? "#1e3a8a" }}
                  >
                    <input
                      type="color"
                      value={form.bgColor ?? "#1e3a8a"}
                      onChange={(e) => setForm({ ...form, bgColor: e.target.value })}
                      className="w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                  <Input
                    value={form.bgColor ?? "#1e3a8a"}
                    onChange={(e) => setForm({ ...form, bgColor: e.target.value })}
                    className="w-32 font-mono text-sm"
                  />
                </div>
              </div>
            )}
            {form.bgType === "video" && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  URL del Video de Fondo
                </label>
                <Input
                  value={form.bgVideo ?? ""}
                  onChange={(e) => setForm({ ...form, bgVideo: e.target.value })}
                  placeholder="https://... (MP4 directo)"
                />
              </div>
            )}

            {/* Overlay */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Color de Overlay
              </label>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl border-2 border-slate-200 shadow-sm overflow-hidden cursor-pointer"
                  style={{ background: form.overlayColor ?? "#000000" }}
                >
                  <input
                    type="color"
                    value={form.overlayColor ?? "#000000"}
                    onChange={(e) => setForm({ ...form, overlayColor: e.target.value })}
                    className="w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                <Input
                  value={form.overlayColor ?? "#000000"}
                  onChange={(e) => setForm({ ...form, overlayColor: e.target.value })}
                  className="w-32 font-mono text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Opacidad del Overlay — {form.overlayOpacity ?? 45}%
              </label>
              <input
                type="range"
                min={0}
                max={90}
                value={form.overlayOpacity ?? 45}
                onChange={(e) => setForm({ ...form, overlayOpacity: Number(e.target.value) })}
                className="w-full accent-blue-600"
              />
            </div>
          </>
        )}
      </Section>

      {/* ── Texts ────────────────────────────────────────────────────────── */}
      {form.enabled && (
        <Section title="Textos del Hero" icon={Type}>
          <div className="space-y-1">
            <Toggle
              label="Mostrar Tagline (badge pequeño)"
              value={form.taglineEnabled ?? true}
              onChange={(v) => setForm({ ...form, taglineEnabled: v })}
            />
            {form.taglineEnabled && (
              <Input
                value={form.tagline ?? ""}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                placeholder="El Poder De Aprender!"
              />
            )}
          </div>
          <div className="space-y-1 pt-2 border-t">
            <Toggle
              label="Mostrar Título Principal"
              value={form.titleEnabled ?? true}
              onChange={(v) => setForm({ ...form, titleEnabled: v })}
            />
            {form.titleEnabled && (
              <Input
                value={form.title ?? ""}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Cursos del Este"
              />
            )}
          </div>
          <div className="space-y-1 pt-2 border-t">
            <Toggle
              label="Mostrar Subtítulo"
              value={form.subtitleEnabled ?? true}
              onChange={(v) => setForm({ ...form, subtitleEnabled: v })}
            />
            {form.subtitleEnabled && (
              <textarea
                value={form.subtitle ?? ""}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                rows={2}
                placeholder="Tu mejor opción para capacitarte..."
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>
        </Section>
      )}

      {/* ── CTA Buttons ──────────────────────────────────────────────────── */}
      {form.enabled && (
        <Section title="Botones CTA del Hero" icon={Type}>
          <p className="text-xs text-slate-500 -mt-2">
            Aparecen en el hero banner. Podés usar <code>#whatsapp</code> como link para que abra WhatsApp.
          </p>
          <div className="space-y-3">
            {(form.ctaButtons ?? []).map((btn, idx) => (
              <div key={btn.id} className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Botón {idx + 1}
                  </span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => moveBtn(idx, -1)}
                      disabled={idx === 0}
                      className="p-1.5 rounded text-slate-400 hover:text-slate-700 disabled:opacity-20"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveBtn(idx, 1)}
                      disabled={idx === (form.ctaButtons?.length ?? 0) - 1}
                      className="p-1.5 rounded text-slate-400 hover:text-slate-700 disabled:opacity-20"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeBtn(idx)}
                      className="p-1.5 rounded text-red-400 hover:bg-red-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Texto</label>
                    <Input
                      value={btn.label}
                      onChange={(e) => updateBtn(idx, { label: e.target.value })}
                      placeholder="Ver Cursos"
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Enlace</label>
                    <Input
                      value={btn.link}
                      onChange={(e) => updateBtn(idx, { link: e.target.value })}
                      placeholder="#cursos"
                      className="text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-2">Estilo</label>
                  <div className="flex gap-2">
                    {(["primary", "white", "outline"] as const).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => updateBtn(idx, { style: s })}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                          btn.style === s
                            ? "bg-blue-600 border-blue-600 text-white"
                            : "border-slate-200 text-slate-600 hover:border-blue-300"
                        }`}
                      >
                        {s === "primary" ? "Primario" : s === "white" ? "Blanco" : "Borde"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={addBtn}
            className="w-full flex items-center gap-2 border-dashed"
          >
            <Plus className="w-4 h-4" />
            Agregar Botón
          </Button>
        </Section>
      )}

      {/* ── Navbar Style ─────────────────────────────────────────────────── */}
      <Section title="Estilo de Navegación" icon={Palette}>
        <Toggle
          label="Navbar transparente sobre el hero"
          value={form.navTransparent ?? true}
          onChange={(v) => setForm({ ...form, navTransparent: v })}
        />
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Color de texto en el navbar
          </label>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl border-2 border-slate-200 shadow-sm overflow-hidden cursor-pointer"
              style={{ background: form.navTextColor ?? "#1e3a8a" }}
            >
              <input
                type="color"
                value={form.navTextColor ?? "#1e3a8a"}
                onChange={(e) => setForm({ ...form, navTextColor: e.target.value })}
                className="w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <Input
              value={form.navTextColor ?? "#1e3a8a"}
              onChange={(e) => setForm({ ...form, navTextColor: e.target.value })}
              className="w-32 font-mono text-sm"
            />
            <span className="text-xs text-slate-400">(al hacer scroll)</span>
          </div>
        </div>
      </Section>

      {/* ── Visibility summary ───────────────────────────────────────────── */}
      {form.enabled && (
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-wrap gap-3">
          {[
            { label: "Tagline", on: form.taglineEnabled },
            { label: "Título", on: form.titleEnabled },
            { label: "Subtítulo", on: form.subtitleEnabled },
            { label: "Botones", on: (form.ctaButtons?.length ?? 0) > 0 },
          ].map(({ label, on }) => (
            <span
              key={label}
              className={`flex items-center gap-1 text-xs px-3 py-1 rounded-full font-semibold ${
                on ? "bg-green-100 text-green-700" : "bg-slate-200 text-slate-500"
              }`}
            >
              {on ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              {label}
            </span>
          ))}
        </div>
      )}

      {/* ── Save ─────────────────────────────────────────────────────────── */}
      <Button
        onClick={handleSave}
        className={`w-full h-12 font-bold text-white transition-all text-base ${
          saved ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {saved ? (
          <>
            <Check className="w-5 h-5 mr-2" /> ¡Cambios Guardados!
          </>
        ) : (
          <>
            <Save className="w-5 h-5 mr-2" /> Guardar Header
          </>
        )}
      </Button>
    </div>
  );
}
