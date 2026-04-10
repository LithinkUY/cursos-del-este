import { useState, type ElementType } from "react";
import {
  LayoutDashboard,
  Image as ImageIcon,
  BookOpen,
  Menu as MenuIcon,
  Type,
  Footprints,
  Palette,
  Instagram,
  MessageCircle,
  LogOut,
  ChevronRight,
  GraduationCap,
  X,
} from "lucide-react";
import { useSite } from "../context/SiteContext";
import { Button } from "@/components/ui/button";

// Sections
import SectionsEditor from "./sections/SectionsEditor";
import CoursesEditor from "./sections/CoursesEditor";
import MenuEditor from "./sections/MenuEditor";
import HeaderEditor from "./sections/HeaderEditor";
import FooterEditor from "./sections/FooterEditor";
import ColorsEditor from "./sections/ColorsEditor";
import InstagramEditor from "./sections/InstagramEditor";
import WhatsAppEditor from "./sections/WhatsAppEditor";
import AboutEditor from "./sections/AboutEditor";

type AdminSection =
  | "dashboard"
  | "sections"
  | "courses"
  | "menu"
  | "header"
  | "footer"
  | "colors"
  | "instagram"
  | "whatsapp"
  | "about";

const NAV_ITEMS: {
  id: AdminSection;
  label: string;
  description: string;
  icon: ElementType;
}[] = [
  {
    id: "sections",
    label: "Secciones del Home",
    description: "Imágenes y tarjetas de categorías",
    icon: ImageIcon,
  },
  {
    id: "courses",
    label: "Cursos",
    description: "Agregar, editar o eliminar cursos",
    icon: BookOpen,
  },
  {
    id: "menu",
    label: "Menú de Navegación",
    description: "Editar los enlaces del menú",
    icon: MenuIcon,
  },
  {
    id: "header",
    label: "Encabezado",
    description: "Logo, nombre, tagline y CTA",
    icon: Type,
  },
  {
    id: "footer",
    label: "Pie de Página",
    description: "Contacto, redes sociales y texto",
    icon: Footprints,
  },
  {
    id: "colors",
    label: "Colores del Sitio",
    description: "Primario, secundario y fondo",
    icon: Palette,
  },
  {
    id: "instagram",
    label: "Instagram",
    description: "Embed de feed de Instagram",
    icon: Instagram,
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    description: "Botón flotante configurable",
    icon: MessageCircle,
  },
  {
    id: "about",
    label: "Sobre Nosotros",
    description: "Sección de presentación con video de fondo",
    icon: GraduationCap,
  },
];

export default function AdminDashboard() {
  const { logoutAdmin, setCurrentPage, data } = useSite();
  const [activeSection, setActiveSection] = useState<AdminSection>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeSection) {
      case "sections":
        return <SectionsEditor />;
      case "courses":
        return <CoursesEditor />;
      case "menu":
        return <MenuEditor />;
      case "header":
        return <HeaderEditor />;
      case "footer":
        return <FooterEditor />;
      case "colors":
        return <ColorsEditor />;
      case "instagram":
        return <InstagramEditor />;
      case "whatsapp":
        return <WhatsAppEditor />;
      case "about":
        return <AboutEditor />;
      default:
        return <DashboardHome onNavigate={setActiveSection} />;
    }
  };

  const currentNav = NAV_ITEMS.find((n) => n.id === activeSection);

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-slate-900 text-white z-40 flex flex-col transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:flex`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-sm leading-tight">{data.header.siteName}</p>
              <p className="text-slate-400 text-xs">Panel Admin</p>
            </div>
          </div>
          <button
            className="lg:hidden text-slate-400 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <button
            onClick={() => { setActiveSection("dashboard"); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
              ${activeSection === "dashboard" ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </button>

          <p className="text-slate-600 text-xs font-semibold uppercase tracking-wider px-3 pt-4 pb-2">
            Contenido
          </p>

          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveSection(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${activeSection === item.id ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <button
            onClick={() => setCurrentPage("home")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Ver Sitio Web
          </button>
          <button
            onClick={logoutAdmin}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* ── Main Content ──────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden text-slate-500 hover:text-slate-900"
              onClick={() => setSidebarOpen(true)}
            >
              <MenuIcon className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-bold text-slate-900 text-lg">
                {activeSection === "dashboard" ? "Dashboard" : currentNav?.label ?? ""}
              </h1>
              {currentNav && (
                <p className="text-slate-400 text-xs">{currentNav.description}</p>
              )}
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setCurrentPage("home")}
            className="hidden sm:flex items-center gap-2 text-sm"
          >
            Ver Sitio
            <ChevronRight className="w-3 h-3" />
          </Button>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

// ─── Dashboard Home ────────────────────────────────────────────────────────────

function DashboardHome({ onNavigate }: { onNavigate: (s: AdminSection) => void }) {
  const { data } = useSite();

  const stats = [
    {
      label: "Secciones en Home",
      value: data.homeSections.filter((s) => s.visible).length,
      total: data.homeSections.length,
    },
    {
      label: "Cursos Activos",
      value: data.courses.filter((c) => c.visible).length,
      total: data.courses.length,
    },
    {
      label: "Items de Menú",
      value: data.menuItems.length,
      total: data.menuItems.length,
    },
    {
      label: "Instagram",
      value: data.instagram.enabled ? 1 : 0,
      total: 1,
      label2: data.instagram.enabled ? "Activo" : "Inactivo",
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-1">
          Bienvenido al Panel de {data.header.siteName}
        </h2>
        <p className="text-slate-500">Administrá todo el contenido de tu sitio desde acá.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
            <p className="text-3xl font-extrabold text-blue-600">{stat.value}</p>
            <p className="text-slate-500 text-sm mt-1">{stat.label}</p>
            {"label2" in stat ? (
              <span
                className={`text-xs font-semibold mt-2 inline-block px-2 py-0.5 rounded-full ${
                  stat.value ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
                }`}
              >
                {stat.label2}
              </span>
            ) : (
              <p className="text-xs text-slate-400 mt-1">de {stat.total} totales</p>
            )}
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 text-left hover:border-blue-200 hover:shadow-md transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 text-sm">{item.label}</p>
                  <p className="text-slate-400 text-xs mt-0.5 leading-tight">{item.description}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 mt-1 shrink-0" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
