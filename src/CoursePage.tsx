import { ArrowLeft, Clock, Tag, MessageCircle, GraduationCap } from "lucide-react";
import { useSite } from "./context/SiteContext";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function CoursePage() {
  const { data, selectedCourseId, setCurrentPage, setSelectedCourseId } = useSite();
  const { courses, colors, whatsapp } = data;

  const course = courses.find((c) => c.id === selectedCourseId);

  const waUrl = whatsapp?.enabled
    ? `https://wa.me/${whatsapp.phone}?text=${encodeURIComponent(
        `Hola! Quiero información sobre el curso: ${course?.title ?? ""}`
      )}`
    : "#";

  const goBack = () => {
    setSelectedCourseId(null);
    setCurrentPage("home");
  };

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-slate-50">
        <p className="text-slate-500 text-lg">Curso no encontrado.</p>
        <button
          onClick={goBack}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-white"
          style={{ background: colors.primary }}
        >
          <ArrowLeft className="w-4 h-4" /> Volver al inicio
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ── HERO IMAGE ────────────────────────────────────────────────────── */}
      <div className="relative w-full" style={{ maxHeight: "520px", overflow: "hidden" }}>
        {course.image ? (
          <img
            src={course.image}
            alt={course.title}
            className="w-full object-cover"
            style={{ height: "520px", objectPosition: "center" }}
            referrerPolicy="no-referrer"
          />
        ) : (
          <div
            className="w-full flex items-center justify-center"
            style={{ height: "520px", background: colors.secondary }}
          >
            <GraduationCap className="w-24 h-24 text-white/40" />
          </div>
        )}

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Back button */}
        <button
          onClick={goBack}
          className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-white/90 backdrop-blur-sm text-slate-800 hover:bg-white transition-colors shadow-md"
        >
          <ArrowLeft className="w-4 h-4" /> Volver
        </button>

        {/* Course title over image */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {course.category && (
                <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 text-sm px-3 py-1">
                  <Tag className="w-3 h-3 mr-1" />
                  {course.category}
                </Badge>
              )}
              {course.featured && (
                <Badge className="bg-yellow-400 text-yellow-900 text-sm px-3 py-1">
                  ⭐ Popular
                </Badge>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight drop-shadow-lg">
              {course.title}
            </h1>
          </div>
        </div>
      </div>

      {/* ── BREADCRUMB ────────────────────────────────────────────────────── */}
      <div className="border-b bg-slate-50">
        <div className="max-w-4xl mx-auto px-6 py-3">
          <p className="text-sm text-slate-500">
            <button onClick={goBack} className="hover:underline text-slate-600">Inicio</button>
            <span className="mx-2">/</span>
            <button onClick={goBack} className="hover:underline text-slate-600">Cursos</button>
            <span className="mx-2">/</span>
            <span className="text-slate-800 font-medium">{course.title}</span>
          </p>
        </div>
      </div>

      {/* ── CONTENT ───────────────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Left: description */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-3">Sobre este curso</h2>
            <p className="text-slate-600 leading-relaxed text-base whitespace-pre-line">
              {course.description || "Información detallada del curso próximamente."}
            </p>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold mb-1">Duración</p>
              <div className="flex items-center gap-2 text-slate-700 font-semibold">
                <Clock className="w-4 h-4" style={{ color: colors.primary }} />
                {course.duration || "A consultar"}
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold mb-1">Categoría</p>
              <div className="flex items-center gap-2 text-slate-700 font-semibold">
                <Tag className="w-4 h-4" style={{ color: colors.primary }} />
                {course.category || "General"}
              </div>
            </div>
          </div>
        </div>

        {/* Right: price + CTA card */}
        <div className="md:col-span-1">
          <div className="sticky top-6 rounded-2xl border shadow-lg overflow-hidden">
            {/* Price header */}
            <div className="p-6 text-center" style={{ background: colors.secondary }}>
              <p className="text-white/70 text-sm font-medium mb-1">Inversión</p>
              <p className="text-4xl font-extrabold text-white">{course.price || "A consultar"}</p>
            </div>

            <div className="p-6 bg-white space-y-4">
              {/* WhatsApp CTA */}
              {whatsapp?.enabled ? (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl text-white font-bold text-base transition-opacity hover:opacity-90 shadow"
                  style={{ background: "#25d366" }}
                >
                  <MessageCircle className="w-5 h-5" />
                  Inscribirse por WhatsApp
                </a>
              ) : (
                <button
                  className="flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl text-white font-bold text-base"
                  style={{ background: colors.primary }}
                >
                  <GraduationCap className="w-5 h-5" />
                  Consultar
                </button>
              )}

              <button
                onClick={goBack}
                className="w-full py-2.5 px-6 rounded-xl border-2 font-semibold text-sm transition-colors hover:bg-slate-50"
                style={{ borderColor: colors.primary, color: colors.primary }}
              >
                Ver todos los cursos
              </button>

              <p className="text-xs text-slate-400 text-center">
                Respondemos en menos de 24hs hábiles
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
