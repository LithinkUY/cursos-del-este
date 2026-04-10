import { useState } from "react";
import {
  Plus, Trash2, Eye, EyeOff, Pencil, Check, X,
  ChevronUp, ChevronDown, Image as ImageIcon, Video, Code, ListCollapse,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSite, type HomeSection, type SectionButton, type AccordionItem } from "../../context/SiteContext";
import ImagePicker from "../../components/ImagePicker";

const newId = () => Date.now().toString() + Math.random().toString(36).slice(2, 6);

const ICON_OPTIONS = [
  { value: "instagram", label: "📷 Instagram" },
  { value: "facebook", label: "📘 Facebook" },
  { value: "youtube", label: "▶️ YouTube" },
  { value: "tiktok", label: "🎵 TikTok" },
  { value: "web", label: "🌐 Web" },
  { value: "tienda", label: "🛒 Tienda" },
  { value: "email", label: "✉️ Email" },
  { value: "telefono", label: "📞 Teléfono" },
  { value: "ubicacion", label: "📍 Ubicación" },
];

const DEFAULT_SECTION: Omit<HomeSection, "id" | "order"> = {
  type: "image",
  title: "Nueva Sección",
  subtitle: "",
  image: "",
  fullWidth: true,
  height: "large",
  objectPosition: "center",
  overlayOpacity: 40,
  showTitle: true,
  videoUrl: "",
  htmlCode: "",
  accordionItems: [],
  buttons: [],
  link: "#cursos",
  visible: true,
};

// ─── small helpers ────────────────────────────────────────────────────────────

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm text-slate-700">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative w-11 h-6 rounded-full transition-colors ${value ? "bg-blue-600" : "bg-slate-300"}`}
      >
        <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${value ? "translate-x-6" : "translate-x-1"}`} />
      </button>
    </div>
  );
}

// ─── Button rows inside a section ────────────────────────────────────────────

function ButtonsEditor({
  buttons,
  onChange,
}: {
  buttons: SectionButton[];
  onChange: (btns: SectionButton[]) => void;
}) {
  const add = () =>
    onChange([...buttons, { id: newId(), label: "VER CURSO", link: "#cursos", style: "primary" }]);
  const remove = (idx: number) => {
    const b = [...buttons];
    b.splice(idx, 1);
    onChange(b);
  };
  const update = (idx: number, patch: Partial<SectionButton>) => {
    const b = [...buttons];
    b[idx] = { ...b[idx], ...patch };
    onChange(b);
  };

  return (
    <div className="space-y-2">
      {buttons.map((btn, idx) => (
        <div key={btn.id} className="bg-slate-50 rounded-lg p-3 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Botón {idx + 1}</span>
            <button type="button" onClick={() => remove(idx)} className="p-1 text-red-400 hover:bg-red-50 rounded">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Texto</label>
              <Input
                value={btn.label}
                onChange={(e) => update(idx, { label: e.target.value })}
                className="text-xs h-8"
                placeholder="VER CURSO"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Enlace</label>
              <Input
                value={btn.link}
                onChange={(e) => update(idx, { link: e.target.value })}
                className="text-xs h-8"
                placeholder="#cursos"
              />
            </div>
          </div>
          <div className="flex gap-1.5">
            {(["primary", "white", "outline"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => update(idx, { style: s })}
                className={`px-2.5 py-1 rounded text-xs font-semibold border transition-colors ${
                  btn.style === s ? "bg-blue-600 border-blue-600 text-white" : "border-slate-200 text-slate-600 hover:border-blue-300"
                }`}
              >
                {s === "primary" ? "Primario" : s === "white" ? "Blanco" : "Borde"}
              </button>
            ))}
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="w-full py-2 rounded-lg border border-dashed border-slate-300 text-slate-500 text-xs font-semibold hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-1.5"
      >
        <Plus className="w-3.5 h-3.5" /> Agregar Botón
      </button>
    </div>
  );
}

// ─── Accordion Items Editor ──────────────────────────────────────────────────

function AccordionItemsEditor({
  items,
  onChange,
}: {
  items: AccordionItem[];
  onChange: (items: AccordionItem[]) => void;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const add = () =>
    onChange([
      ...items,
      { id: newId(), icon: "instagram", title: "Nueva sucursal", htmlCode: "" },
    ]);

  const remove = (idx: number) => {
    const arr = [...items];
    arr.splice(idx, 1);
    onChange(arr);
  };

  const update = (idx: number, patch: Partial<AccordionItem>) => {
    const arr = [...items];
    arr[idx] = { ...arr[idx], ...patch };
    onChange(arr);
  };

  return (
    <div className="space-y-2">
      {items.map((item, idx) => (
        <div key={item.id} className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
          {/* Header row */}
          <div className="flex items-center gap-2 p-3">
            <span className="text-lg shrink-0">
              {ICON_OPTIONS.find((o) => o.value === item.icon)?.label.slice(0, 2) ?? "📌"}
            </span>
            <span className="flex-1 text-sm font-semibold text-slate-700 truncate">{item.title}</span>
            <button
              type="button"
              onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
              className="p-1 text-blue-500 hover:bg-blue-50 rounded"
              title="Editar"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => remove(idx)}
              className="p-1 text-red-400 hover:bg-red-50 rounded"
              title="Eliminar"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Expanded edit */}
          {expandedId === item.id && (
            <div className="border-t border-slate-200 p-3 space-y-3 bg-white">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Título</label>
                  <Input
                    value={item.title}
                    onChange={(e) => update(idx, { title: e.target.value })}
                    className="text-xs h-8"
                    placeholder="Instagram Maldonado"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Ícono</label>
                  <select
                    value={item.icon}
                    onChange={(e) => update(idx, { icon: e.target.value })}
                    className="w-full h-8 text-xs border border-slate-200 rounded-md px-2"
                  >
                    {ICON_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Código HTML / Embed (widget de Instagram, etc.)
                </label>
                <textarea
                  value={item.htmlCode}
                  onChange={(e) => update(idx, { htmlCode: e.target.value })}
                  rows={5}
                  placeholder={'<script src="https://..."></script>\n<div class="elfsight-app-..."></div>'}
                  className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="w-full py-2 rounded-lg border border-dashed border-slate-300 text-slate-500 text-xs font-semibold hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-1.5"
      >
        <Plus className="w-3.5 h-3.5" /> Agregar Ítem del Acordeón
      </button>
    </div>
  );
}

// ─── Edit Form ────────────────────────────────────────────────────────────────

function EditForm({
  section,
  onSave,
  onCancel,
}: {
  section: HomeSection;
  onSave: (s: HomeSection) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<HomeSection>({ ...section });

  return (
    <div className="p-5 space-y-5 border-t border-blue-100 bg-blue-50/30">
      <h4 className="font-bold text-slate-800 text-sm">
        Editando: <span className="text-blue-700">{section.title}</span>
      </h4>

      {/* Type */}
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">
          Tipo de Sección
        </label>
        <div className="flex flex-wrap gap-2">
          {(["image", "video", "html", "accordion"] as const).map((t) => {
            const Icon = t === "image" ? ImageIcon : t === "video" ? Video : t === "accordion" ? ListCollapse : Code;
            const label = t === "image" ? "Imagen" : t === "video" ? "Video" : t === "accordion" ? "Acordeón" : "HTML";
            return (
              <button
                key={t}
                type="button"
                onClick={() => setForm({ ...form, type: t })}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  form.type === t ? "bg-blue-600 border-blue-600 text-white" : "border-slate-200 text-slate-600 hover:border-blue-300"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Title / Subtitle */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Título</label>
          <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Subtítulo</label>
          <Input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
        </div>
      </div>

      {/* Image fields */}
      {form.type === "image" && (
        <>
          <ImagePicker
            label="Imagen de la Sección"
            value={form.image}
            onChange={(url) => setForm({ ...form, image: url })}
          />
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-2">Posición de la Imagen</label>
            <div className="flex flex-wrap gap-1.5">
              {["center", "top", "bottom", "left", "right"].map((pos) => (
                <button
                  key={pos}
                  type="button"
                  onClick={() => setForm({ ...form, objectPosition: pos })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    form.objectPosition === pos ? "bg-blue-600 border-blue-600 text-white" : "border-slate-200 text-slate-500 hover:border-blue-300"
                  }`}
                >
                  {pos}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Video field */}
      {form.type === "video" && (
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">URL del Video</label>
          <Input
            value={form.videoUrl ?? ""}
            onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
            placeholder="https://youtube.com/watch?v=... o MP4 directo"
          />
          <p className="text-xs text-slate-400 mt-1">Compatible con YouTube, Vimeo o MP4 directo.</p>
        </div>
      )}

      {/* HTML field */}
      {form.type === "html" && (
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Código HTML / Widget</label>
          <textarea
            value={form.htmlCode ?? ""}
            onChange={(e) => setForm({ ...form, htmlCode: e.target.value })}
            rows={5}
            placeholder="Pega aquí tu código HTML, widget de Instagram, embed, etc."
            className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {/* Accordion items */}
      {form.type === "accordion" && (
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">
            Ítems del Acordeón
          </label>
          <p className="text-xs text-slate-400 mb-3">
            Cada ítem se despliega al hacer click. Ideal para mostrar embeds de Instagram, mapas, etc. por sucursal.
          </p>
          <AccordionItemsEditor
            items={form.accordionItems ?? []}
            onChange={(items) => setForm({ ...form, accordionItems: items })}
          />
        </div>
      )}

      {/* Layout options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Altura</label>
          <div className="flex flex-col gap-1.5">
            {(["small", "medium", "large", "fullscreen"] as const).map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => setForm({ ...form, height: h })}
                className={`py-1.5 rounded-lg text-xs font-medium border transition-colors text-left px-3 ${
                  form.height === h ? "bg-blue-600 border-blue-600 text-white" : "border-slate-200 text-slate-600 hover:border-blue-300"
                }`}
              >
                {h === "small" ? "Pequeña (192px)" : h === "medium" ? "Mediana (320px)" : h === "large" ? "Grande (60vh)" : "Pantalla completa (100vh)"}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <Toggle
            label="Ancho completo (full-width)"
            value={form.fullWidth ?? true}
            onChange={(v) => setForm({ ...form, fullWidth: v })}
          />
          <Toggle
            label="Mostrar título y subtítulo"
            value={form.showTitle ?? true}
            onChange={(v) => setForm({ ...form, showTitle: v })}
          />
          <div className="pt-1">
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Opacidad del overlay — {form.overlayOpacity ?? 40}%
            </label>
            <input
              type="range"
              min={0}
              max={90}
              value={form.overlayOpacity ?? 40}
              onChange={(e) => setForm({ ...form, overlayOpacity: Number(e.target.value) })}
              className="w-full accent-blue-600"
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">
          Botones de la Sección
        </label>
        <ButtonsEditor
          buttons={form.buttons ?? []}
          onChange={(btns) => setForm({ ...form, buttons: btns })}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-2 border-t">
        <Button onClick={() => onSave(form)} size="sm" className="bg-green-600 text-white hover:bg-green-700">
          <Check className="w-4 h-4 mr-1" /> Guardar
        </Button>
        <Button size="sm" variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-1" /> Cancelar
        </Button>
      </div>
    </div>
  );
}

// ─── Main SectionsEditor ──────────────────────────────────────────────────────

export default function SectionsEditor() {
  const { data, updateHomeSections, addHomeSection, removeHomeSection } = useSite();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addType, setAddType] = useState<HomeSection["type"]>("image");

  const sections = [...data.homeSections].sort((a, b) => a.order - b.order);

  const saveEdit = (updated: HomeSection) => {
    updateHomeSections(data.homeSections.map((s) => (s.id === updated.id ? updated : s)));
    setEditingId(null);
  };

  const toggleVisible = (id: string) =>
    updateHomeSections(data.homeSections.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s)));

  const moveSection = (index: number, dir: -1 | 1) => {
    const arr = [...sections];
    const to = index + dir;
    if (to < 0 || to >= arr.length) return;
    [arr[index], arr[to]] = [arr[to], arr[index]];
    updateHomeSections(arr.map((s, i) => ({ ...s, order: i + 1 })));
  };

  const handleAdd = () => {
    addHomeSection({
      ...DEFAULT_SECTION,
      type: addType,
      id: newId(),
      order: sections.length + 1,
    });
    setShowAddForm(false);
    setAddType("image");
  };

  const typeIcon = (t: HomeSection["type"]) =>
    t === "video" ? <Video className="w-3 h-3" /> : t === "html" ? <Code className="w-3 h-3" /> : t === "accordion" ? <ListCollapse className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Secciones del Home</h2>
          <p className="text-slate-500 text-sm">
            {sections.filter((s) => s.visible).length} visibles de {sections.length} totales. Arrastrá las flechas para reordenar.
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Agregar
        </Button>
      </div>

      {/* ── Add Form ─────────────────────────────────────────────────────── */}
      {showAddForm && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 space-y-4">
          <h3 className="font-semibold text-blue-900">Nueva Sección</h3>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Tipo</label>
            <div className="flex flex-wrap gap-2">
              {(["image", "video", "html", "accordion"] as const).map((t) => {
                const Icon = t === "image" ? ImageIcon : t === "video" ? Video : t === "accordion" ? ListCollapse : Code;
                const label = t === "image" ? "Imagen" : t === "video" ? "Video" : t === "accordion" ? "Acordeón" : "HTML";
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setAddType(t)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                      addType === t ? "bg-blue-600 border-blue-600 text-white" : "border-slate-200 text-slate-600 hover:border-blue-300"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
          <p className="text-xs text-slate-500">
            {addType === "image"
              ? "Sección con imagen de fondo, título, subtítulo y botones."
              : addType === "video"
              ? "Sección con video de fondo (YouTube o MP4)."
              : addType === "accordion"
              ? "Sección con desplegables. Ideal para mostrar Instagram de cada sucursal."
              : "Sección para insertar código HTML/JS (widgets, embeds, etc.)."}
          </p>
          <div className="flex gap-3">
            <Button onClick={handleAdd} className="bg-blue-600 text-white hover:bg-blue-700">
              <Check className="w-4 h-4 mr-1" /> Crear y Editar
            </Button>
            <Button variant="outline" onClick={() => setShowAddForm(false)}>
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {/* ── Sections List ─────────────────────────────────────────────────── */}
      <div className="space-y-3">
        {sections.map((section, index) => (
          <div
            key={section.id}
            className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-opacity ${
              !section.visible ? "opacity-50" : ""
            }`}
          >
            {/* Row */}
            <div className="flex items-center gap-3 p-4">
              {/* Order arrows */}
              <div className="flex flex-col gap-0.5 shrink-0">
                <button
                  onClick={() => moveSection(index, -1)}
                  disabled={index === 0}
                  className="p-1 text-slate-300 hover:text-slate-700 disabled:opacity-20 transition-colors"
                  title="Subir"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => moveSection(index, 1)}
                  disabled={index === sections.length - 1}
                  className="p-1 text-slate-300 hover:text-slate-700 disabled:opacity-20 transition-colors"
                  title="Bajar"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {/* Thumb */}
              <div className="w-20 h-14 rounded-lg overflow-hidden bg-slate-100 shrink-0 flex items-center justify-center">
                {section.type === "image" && section.image ? (
                  <img
                    src={section.image}
                    alt={section.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : section.type === "video" ? (
                  <Video className="w-6 h-6 text-slate-400" />
                ) : section.type === "accordion" ? (
                  <ListCollapse className="w-6 h-6 text-slate-400" />
                ) : (
                  <Code className="w-6 h-6 text-slate-400" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-slate-800 truncate">{section.title}</p>
                  <span className="shrink-0 flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-medium">
                    {typeIcon(section.type)}
                    {section.type}
                  </span>
                </div>
                <p className="text-sm text-slate-400 truncate">
                  {section.type === "accordion"
                    ? `${(section.accordionItems ?? []).length} ítem(s)`
                    : section.subtitle}
                </p>
                <p className="text-xs text-slate-300 mt-0.5">
                  {section.type === "accordion"
                    ? (section.accordionItems ?? []).map((i) => i.title).join(", ") || "Sin ítems"
                    : `${section.height} · ${section.fullWidth ? "full-width" : "contenedor"} · ${section.buttons?.length ?? 0} btn(s)`}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => toggleVisible(section.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    section.visible ? "text-green-600 hover:bg-green-50" : "text-slate-400 hover:bg-slate-100"
                  }`}
                  title={section.visible ? "Ocultar" : "Mostrar"}
                >
                  {section.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setEditingId(editingId === section.id ? null : section.id)}
                  className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors"
                  title="Editar"
                >
                  {editingId === section.id ? <X className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => removeHomeSection(section.id)}
                  className="p-2 rounded-lg text-red-400 hover:bg-red-50 transition-colors"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Edit Form */}
            {editingId === section.id && (
              <EditForm
                section={section}
                onSave={saveEdit}
                onCancel={() => setEditingId(null)}
              />
            )}
          </div>
        ))}
      </div>

      {sections.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No hay secciones. Agregá la primera usando el botón de arriba.</p>
        </div>
      )}
    </div>
  );
}
