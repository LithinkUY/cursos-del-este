import { useState } from "react";
import { Plus, Trash2, Eye, EyeOff, Pencil, Check, X, Star, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSite, type Course } from "../../context/SiteContext";
import ImagePicker from "../../components/ImagePicker";

const newId = () => Date.now().toString();

const EMPTY_COURSE: Partial<Course> = {
  title: "",
  category: "",
  price: "",
  duration: "",
  description: "",
  image: "",
  featured: false,
  visible: true,
};

export default function CoursesEditor() {
  const { data, updateCourses, addCourse, removeCourse, updateCourseCategories } = useSite();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Course>>({});
  const [addForm, setAddForm] = useState<Partial<Course>>({ ...EMPTY_COURSE });
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState("all");

  // Category management state
  const [showCatManager, setShowCatManager] = useState(false);
  const [newCatInput, setNewCatInput] = useState("");

  const categories = data.courseCategories ?? [];

  const filteredCourses =
    filterCategory === "all"
      ? data.courses
      : data.courses.filter((c) => c.category === filterCategory);

  const startEdit = (c: Course) => {
    setEditingId(c.id);
    setEditForm({ ...c });
  };

  const saveEdit = () => {
    if (!editingId) return;
    updateCourses(data.courses.map((c) => (c.id === editingId ? { ...c, ...editForm } : c)));
    setEditingId(null);
  };

  const toggleVisible = (id: string) =>
    updateCourses(data.courses.map((c) => (c.id === id ? { ...c, visible: !c.visible } : c)));

  const toggleFeatured = (id: string) =>
    updateCourses(data.courses.map((c) => (c.id === id ? { ...c, featured: !c.featured } : c)));

  const handleAdd = () => {
    if (!addForm.title || !addForm.image) return;
    addCourse({
      id: newId(),
      title: addForm.title ?? "",
      category: addForm.category ?? (categories[0] ?? "General"),
      price: addForm.price ?? "$0",
      duration: addForm.duration ?? "",
      description: addForm.description ?? "",
      image: addForm.image ?? "",
      featured: addForm.featured ?? false,
      visible: true,
    });
    setAddForm({ ...EMPTY_COURSE });
    setShowAddForm(false);
  };

  const addCategory = () => {
    const trimmed = newCatInput.trim();
    if (!trimmed || categories.includes(trimmed)) return;
    updateCourseCategories([...categories, trimmed]);
    setNewCatInput("");
  };

  const removeCategory = (cat: string) => {
    updateCourseCategories(categories.filter((c) => c !== cat));
    if (filterCategory === cat) setFilterCategory("all");
  };

  const FormFields = ({
    form,
    onChange,
  }: {
    form: Partial<Course>;
    onChange: (f: Partial<Course>) => void;
  }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="sm:col-span-2">
        <label className="block text-sm font-medium text-slate-700 mb-1">Título del Curso *</label>
        <Input
          value={form.title ?? ""}
          onChange={(e) => onChange({ ...form, title: e.target.value })}
          placeholder="ej: Excel Avanzado para Negocios"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
        <select
          value={form.category ?? ""}
          onChange={(e) => onChange({ ...form, category: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">Sin categoría</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Precio</label>
        <Input
          value={form.price ?? ""}
          onChange={(e) => onChange({ ...form, price: e.target.value })}
          placeholder="ej: $4500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Duración</label>
        <Input
          value={form.duration ?? ""}
          onChange={(e) => onChange({ ...form, duration: e.target.value })}
          placeholder="ej: 4 semanas"
        />
      </div>
      <div className="sm:col-span-2">
        <ImagePicker
          label="Imagen del Curso *"
          value={form.image ?? ""}
          onChange={(url) => onChange({ ...form, image: url })}
        />
      </div>
      <div className="sm:col-span-2">
        <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
        <textarea
          value={form.description ?? ""}
          onChange={(e) => onChange({ ...form, description: e.target.value })}
          placeholder="Descripción del curso..."
          rows={3}
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex items-center gap-2 sm:col-span-2">
        <input
          type="checkbox"
          id="featured-check"
          checked={form.featured ?? false}
          onChange={(e) => onChange({ ...form, featured: e.target.checked })}
          className="w-4 h-4 accent-blue-600"
        />
        <label htmlFor="featured-check" className="text-sm font-medium text-slate-700">
          Marcar como Popular / Destacado
        </label>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Cursos</h2>
          <p className="text-slate-500 text-sm">
            {data.courses.filter((c) => c.visible).length} cursos visibles de {data.courses.length} totales
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowCatManager(!showCatManager)}
            className="flex items-center gap-2"
          >
            <Tag className="w-4 h-4" />
            Categorías
          </Button>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nuevo Curso
          </Button>
        </div>
      </div>

      {/* Category Manager */}
      {showCatManager && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <Tag className="w-4 h-4" /> Gestionar Categorías
          </h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <div
                key={cat}
                className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-full px-3 py-1.5 text-sm"
              >
                <span className="text-slate-700">{cat}</span>
                <button
                  onClick={() => removeCategory(cat)}
                  className="text-red-400 hover:text-red-600 transition-colors"
                  title="Eliminar categoría"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            {categories.length === 0 && (
              <p className="text-slate-400 text-sm">No hay categorías. Agrega la primera.</p>
            )}
          </div>
          <div className="flex gap-2">
            <Input
              value={newCatInput}
              onChange={(e) => setNewCatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCategory()}
              placeholder="Nueva categoría..."
              className="max-w-xs"
            />
            <Button
              onClick={addCategory}
              size="sm"
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-1" /> Agregar
            </Button>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilterCategory("all")}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            filterCategory === "all"
              ? "bg-blue-600 text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Todos ({data.courses.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filterCategory === cat
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 space-y-4">
          <h3 className="font-semibold text-blue-900">Nuevo Curso</h3>
          <FormFields form={addForm} onChange={setAddForm} />
          <div className="flex gap-3">
            <Button onClick={handleAdd} className="bg-blue-600 text-white hover:bg-blue-700">
              <Check className="w-4 h-4 mr-1" /> Guardar Curso
            </Button>
            <Button variant="outline" onClick={() => setShowAddForm(false)}>
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {/* Courses List */}
      <div className="space-y-3">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className={`bg-white rounded-xl border shadow-sm overflow-hidden ${
              !course.visible ? "opacity-60" : ""
            }`}
          >
            {editingId === course.id ? (
              <div className="p-5 space-y-4">
                <h4 className="font-semibold text-slate-800">Editando: {course.title}</h4>
                <FormFields form={editForm} onChange={setEditForm} />
                <div className="flex gap-2">
                  <Button
                    onClick={saveEdit}
                    size="sm"
                    className="bg-green-600 text-white hover:bg-green-700"
                  >
                    <Check className="w-4 h-4 mr-1" /> Guardar
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                    <X className="w-4 h-4 mr-1" /> Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4">
                <div className="w-20 h-14 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                  {course.image && (
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-800 truncate">{course.title}</p>
                    {course.featured && (
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-slate-400">
                    {course.category} · {course.duration} · {course.price}
                  </p>
                  <p className="text-xs text-slate-400 line-clamp-1">{course.description}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => toggleFeatured(course.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      course.featured
                        ? "text-yellow-500 hover:bg-yellow-50"
                        : "text-slate-300 hover:bg-slate-100"
                    }`}
                    title="Popular"
                  >
                    <Star className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleVisible(course.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      course.visible
                        ? "text-green-600 hover:bg-green-50"
                        : "text-slate-400 hover:bg-slate-100"
                    }`}
                    title={course.visible ? "Ocultar" : "Mostrar"}
                  >
                    {course.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => startEdit(course)}
                    className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeCourse(course.id)}
                    className="p-2 rounded-lg text-red-400 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <p>No hay cursos en esta categoría.</p>
        </div>
      )}
    </div>
  );
}
