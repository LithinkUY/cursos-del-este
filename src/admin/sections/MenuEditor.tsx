import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus, Trash2, Pencil, Check, X, ChevronDown, ChevronRight, GripVertical, CornerDownRight, Link, BookOpen, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSite, type MenuItem } from "../../context/SiteContext";

const newId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

type LinkType = "url" | "course" | "category";

// ── Inline edit form ──────────────────────────────────────────────────────────
function EditRow({
  item,
  onSave,
  onCancel,
}: {
  item: MenuItem;
  onSave: (updated: MenuItem) => void;
  onCancel: () => void;
}) {
  const { data } = useSite();
  const [form, setForm] = useState<MenuItem>({ ...item });

  // Detect initial link type
  const detectType = (href: string): LinkType => {
    if (href.startsWith("#curso:")) return "course";
    if (href.startsWith("#categoria:")) return "category";
    return "url";
  };
  const [linkType, setLinkType] = useState<LinkType>(detectType(item.href));

  const handleTypeChange = (type: LinkType) => {
    setLinkType(type);
    if (type === "url") setForm({ ...form, href: "" });
    else if (type === "course") {
      const first = data.courses[0];
      setForm({ ...form, href: first ? `#curso:${first.id}` : "", label: form.label || (first?.title ?? "") });
    } else {
      const first = data.courseCategories[0];
      setForm({ ...form, href: first ? `#categoria:${first}` : "", label: form.label || (first ?? "") });
    }
  };

  return (
    <div className="flex flex-col gap-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
      {/* Link type selector */}
      <div className="flex gap-1">
        <button
          onClick={() => handleTypeChange("url")}
          className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${linkType === "url" ? "bg-blue-600 text-white" : "bg-white text-slate-600 border hover:bg-slate-50"}`}
        >
          <Link className="w-3 h-3" /> Enlace
        </button>
        <button
          onClick={() => handleTypeChange("course")}
          className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${linkType === "course" ? "bg-blue-600 text-white" : "bg-white text-slate-600 border hover:bg-slate-50"}`}
        >
          <BookOpen className="w-3 h-3" /> Curso
        </button>
        <button
          onClick={() => handleTypeChange("category")}
          className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${linkType === "category" ? "bg-blue-600 text-white" : "bg-white text-slate-600 border hover:bg-slate-50"}`}
        >
          <Tag className="w-3 h-3" /> Categoría
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          value={form.label}
          onChange={(e) => setForm({ ...form, label: e.target.value })}
          placeholder="Etiqueta"
          className="flex-1 h-8 text-sm"
        />

        {linkType === "url" && (
          <Input
            value={form.href}
            onChange={(e) => setForm({ ...form, href: e.target.value })}
            placeholder="URL ej: /cursos o #cursos"
            className="flex-1 h-8 text-sm"
          />
        )}

        {linkType === "course" && (
          <select
            value={form.href}
            onChange={(e) => {
              const courseId = e.target.value;
              const course = data.courses.find((c) => `#curso:${c.id}` === courseId);
              setForm({ ...form, href: courseId, label: form.label || (course?.title ?? "") });
            }}
            className="flex-1 h-8 text-sm border rounded-md px-2 bg-white"
          >
            <option value="">-- Seleccionar curso --</option>
            {data.courses.filter(c => c.visible).map((c) => (
              <option key={c.id} value={`#curso:${c.id}`}>{c.title}</option>
            ))}
          </select>
        )}

        {linkType === "category" && (
          <select
            value={form.href}
            onChange={(e) => {
              const cat = e.target.value;
              const catName = cat.replace("#categoria:", "");
              setForm({ ...form, href: cat, label: form.label || catName });
            }}
            className="flex-1 h-8 text-sm border rounded-md px-2 bg-white"
          >
            <option value="">-- Seleccionar categoría --</option>
            {data.courseCategories.map((cat) => (
              <option key={cat} value={`#categoria:${cat}`}>{cat}</option>
            ))}
          </select>
        )}

        <div className="flex gap-1">
          <button
            onClick={() => onSave(form)}
            className="p-1.5 rounded bg-green-500 hover:bg-green-600 text-white"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onCancel}
            className="p-1.5 rounded bg-slate-300 hover:bg-slate-400 text-slate-700"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Sortable sub-item ─────────────────────────────────────────────────────────
function SortableSubItem({
  sub,
  parentId,
  onUpdateSub,
  onDeleteSub,
}: {
  sub: MenuItem;
  parentId: string;
  onUpdateSub: (parentId: string, updated: MenuItem) => void;
  onDeleteSub: (parentId: string, subId: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: sub.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="ml-6 flex items-start gap-1 mt-1">
      <CornerDownRight className="w-3 h-3 text-slate-400 mt-2 shrink-0" />
      <div className="flex-1">
        {editing ? (
          <EditRow
            item={sub}
            onSave={(updated) => { onUpdateSub(parentId, updated); setEditing(false); }}
            onCancel={() => setEditing(false)}
          />
        ) : (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg">
            <button
              {...attributes}
              {...listeners}
              className="text-slate-300 hover:text-slate-500 cursor-grab active:cursor-grabbing touch-none"
            >
              <GripVertical className="w-3.5 h-3.5" />
            </button>
            <span className="flex-1 text-sm text-slate-700">{sub.label}</span>
            <span className="text-xs text-slate-400 font-mono truncate max-w-[120px]">{sub.href}</span>
            <button onClick={() => setEditing(true)} className="p-1 hover:text-blue-600 text-slate-400">
              <Pencil className="w-3 h-3" />
            </button>
            <button onClick={() => onDeleteSub(parentId, sub.id)} className="p-1 hover:text-red-500 text-slate-400">
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Sortable main item ────────────────────────────────────────────────────────
function SortableItem({
  item,
  onUpdate,
  onDelete,
  onUpdateSub,
  onDeleteSub,
  onAddSub,
  onReorderSubs,
}: {
  item: MenuItem;
  onUpdate: (updated: MenuItem) => void;
  onDelete: (id: string) => void;
  onUpdateSub: (parentId: string, updated: MenuItem) => void;
  onDeleteSub: (parentId: string, subId: string) => void;
  onAddSub: (parentId: string) => void;
  onReorderSubs: (parentId: string, newChildren: MenuItem[]) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [subOpen, setSubOpen] = useState(false);
  const children = item.children ?? [];

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Sub-items DnD sensors
  const subSensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  const handleSubDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIdx = children.findIndex((s) => s.id === active.id);
      const newIdx = children.findIndex((s) => s.id === over.id);
      onReorderSubs(item.id, arrayMove(children, oldIdx, newIdx).map((s, n) => ({ ...s, order: n })));
    }
  };

  return (
    <div ref={setNodeRef} style={style} className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      {/* Main row */}
      {editing ? (
        <div className="p-2">
          <EditRow
            item={item}
            onSave={(updated) => { onUpdate(updated); setEditing(false); }}
            onCancel={() => setEditing(false)}
          />
        </div>
      ) : (
        <div className="flex items-center gap-2 px-4 py-3">
          {/* Drag handle */}
          <button
            {...attributes}
            {...listeners}
            className="text-slate-300 hover:text-slate-500 cursor-grab active:cursor-grabbing touch-none mr-1"
          >
            <GripVertical className="w-5 h-5" />
          </button>

          <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate-800 text-sm">{item.label}</p>
            <p className="text-xs text-slate-400 font-mono truncate">{item.href}</p>
          </div>

          {children.length > 0 && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
              {children.length} submenú{children.length > 1 ? "s" : ""}
            </span>
          )}

          {/* Actions */}
          <button
            onClick={() => setSubOpen(!subOpen)}
            title="Submenús"
            className={`p-1.5 rounded transition-colors ${subOpen ? "bg-blue-100 text-blue-600" : "text-slate-400 hover:text-blue-500"}`}
          >
            {subOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          <button onClick={() => setEditing(true)} className="p-1.5 text-slate-400 hover:text-blue-600 rounded">
            <Pencil className="w-4 h-4" />
          </button>
          <button onClick={() => onDelete(item.id)} className="p-1.5 text-slate-400 hover:text-red-500 rounded">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Sub-items panel with DnD */}
      {subOpen && (
        <div className="border-t border-slate-100 bg-slate-50 px-4 py-3 space-y-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Submenú de "{item.label}"
          </p>
          {children.length === 0 && (
            <p className="text-xs text-slate-400 italic">Sin ítems. Agrega uno abajo.</p>
          )}
          <DndContext sensors={subSensors} collisionDetection={closestCenter} onDragEnd={handleSubDragEnd}>
            <SortableContext items={children.map((s) => s.id)} strategy={verticalListSortingStrategy}>
              {children.map((sub) => (
                <div key={sub.id}>
                  <SortableSubItem
                    sub={sub}
                    parentId={item.id}
                    onUpdateSub={onUpdateSub}
                    onDeleteSub={onDeleteSub}
                  />
                </div>
              ))}
            </SortableContext>
          </DndContext>
          <button
            onClick={() => onAddSub(item.id)}
            className="mt-2 flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            <Plus className="w-3.5 h-3.5" /> Agregar ítem al submenú
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function MenuEditor() {
  const { data, updateMenuItems } = useSite();
  const [newLabel, setNewLabel] = useState("");
  const [newHref, setNewHref] = useState("");

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  const items = [...data.menuItems].sort((a, b) => a.order - b.order);

  // ── Drag end for top-level items ────────────────────────────────────────
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIdx = items.findIndex((i) => i.id === active.id);
      const newIdx = items.findIndex((i) => i.id === over.id);
      updateMenuItems(arrayMove(items, oldIdx, newIdx).map((i, n) => ({ ...i, order: n })));
    }
  };

  // ── Top-level CRUD ──────────────────────────────────────────────────────
  const addItem = () => {
    if (!newLabel.trim()) return;
    const item: MenuItem = {
      id: newId(),
      label: newLabel.trim(),
      href: newHref.trim() || "#",
      order: items.length,
      children: [],
    };
    updateMenuItems([...items, item]);
    setNewLabel("");
    setNewHref("");
  };

  const updateItem = (updated: MenuItem) => {
    updateMenuItems(items.map((i) => (i.id === updated.id ? updated : i)));
  };

  const deleteItem = (id: string) => {
    updateMenuItems(items.filter((i) => i.id !== id));
  };

  // ── Sub-item CRUD ───────────────────────────────────────────────────────
  const addSub = (parentId: string) => {
    updateMenuItems(
      items.map((i) => {
        if (i.id !== parentId) return i;
        const children = i.children ?? [];
        return {
          ...i,
          children: [
            ...children,
            { id: newId(), label: "Nuevo ítem", href: "#", order: children.length },
          ],
        };
      })
    );
  };

  const updateSub = (parentId: string, updated: MenuItem) => {
    updateMenuItems(
      items.map((i) => {
        if (i.id !== parentId) return i;
        return {
          ...i,
          children: (i.children ?? []).map((s) => (s.id === updated.id ? updated : s)),
        };
      })
    );
  };

  const deleteSub = (parentId: string, subId: string) => {
    updateMenuItems(
      items.map((i) => {
        if (i.id !== parentId) return i;
        return { ...i, children: (i.children ?? []).filter((s) => s.id !== subId) };
      })
    );
  };

  const reorderSubs = (parentId: string, newChildren: MenuItem[]) => {
    updateMenuItems(
      items.map((i) => (i.id === parentId ? { ...i, children: newChildren } : i))
    );
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Menú de Navegación</h2>
        <p className="text-slate-500 text-sm">
          Arrastra los ítems para reordenarlos. Haz clic en <strong>▶</strong> para agregar submenús.
        </p>
      </div>

      {/* Items list with DnD */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {items.length === 0 && (
              <p className="text-sm text-slate-400 italic text-center py-6">
                No hay ítems. Agrega uno abajo.
              </p>
            )}
            {items.map((item) => (
              <div key={item.id}>
                <SortableItem
                  item={item}
                  onUpdate={updateItem}
                  onDelete={deleteItem}
                  onUpdateSub={updateSub}
                  onDeleteSub={deleteSub}
                  onAddSub={addSub}
                  onReorderSubs={reorderSubs}
                />
              </div>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Add top-level item */}
      <div className="bg-white rounded-xl border shadow-sm p-4">
        <p className="text-sm font-semibold text-slate-700 mb-3">Agregar ítem principal</p>
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addItem()}
            placeholder="Etiqueta  ej: Cursos"
            className="flex-1"
          />
          <Input
            value={newHref}
            onChange={(e) => setNewHref(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addItem()}
            placeholder="URL  ej: #cursos"
            className="flex-1"
          />
          <Button
            onClick={addItem}
            disabled={!newLabel.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white shrink-0"
          >
            <Plus className="w-4 h-4 mr-1" /> Agregar
          </Button>
        </div>
      </div>

      <p className="text-xs text-slate-400">
        💡 <strong>Arrastra</strong> el ícono <GripVertical className="inline w-3 h-3" /> para reordenar. Haz clic en <strong>▶</strong> para gestionar submenús.
      </p>
    </div>
  );
}
