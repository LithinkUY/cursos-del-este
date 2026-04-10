// @refresh reset
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SectionButton {
  id: string;
  label: string;
  link: string;
  style: "primary" | "outline" | "white";
}

export interface AccordionItem {
  id: string;
  icon: string; // lucide icon name or emoji
  title: string;
  htmlCode: string;
}

export interface HomeSection {
  id: string;
  type: "image" | "video" | "html" | "accordion";
  title: string;
  subtitle: string;
  image: string;
  // image display
  fullWidth: boolean;
  height: "small" | "medium" | "large" | "fullscreen";
  objectPosition: string; // "center", "top", "bottom"
  overlayOpacity: number; // 0-100
  showTitle: boolean;
  // video
  videoUrl: string; // YouTube/Vimeo URL
  // html widget
  htmlCode: string;
  // accordion
  accordionItems: AccordionItem[];
  // buttons
  buttons: SectionButton[];
  link: string;
  order: number;
  visible: boolean;
}

export interface Course {
  id: string;
  title: string;
  category: string;
  price: string;
  duration: string;
  description: string;
  image: string;
  featured: boolean;
  visible: boolean;
}

export interface MenuItem {
  id: string;
  label: string;
  href: string;
  order: number;
  children?: MenuItem[]; // submenú
}

export interface SiteHeader {
  // Logo
  logoUrl: string;
  logoWidth: number; // px
  // Site name (shown if no logo)
  siteName: string;
  showSiteName: boolean;
  // Hero banner
  enabled: boolean;
  bgType: "image" | "color" | "video";
  bgImage: string;
  bgColor: string;
  bgVideo: string;
  overlayColor: string;
  overlayOpacity: number;
  // Texts
  tagline: string;
  taglineEnabled: boolean;
  title: string;
  titleEnabled: boolean;
  subtitle: string;
  subtitleEnabled: boolean;
  // CTA buttons
  ctaButtons: SectionButton[];
  // Nav style
  navTransparent: boolean;
  navBgColor: string;
  navTextColor: string;
  // Height
  height: "small" | "medium" | "large" | "fullscreen";
}

export interface SiteFooter {
  description: string;
  address: string;
  phone: string;
  phone2: string;
  email: string;
  facebook: string;
  instagram: string;
  instagram2: string;
  instagram3: string;
  twitter: string;
  copyright: string;
}

export interface SiteColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export interface WhatsAppConfig {
  enabled: boolean;
  phone: string;
  message: string;
  label: string;
  position: "bottom-right" | "bottom-left";
}

export interface InstagramConfig {
  enabled: boolean;
  embedCode: string;
  username: string;
  username2: string;
  username3: string;
}

export interface HtmlWidget {
  id: string;
  name: string;
  code: string;
  enabled: boolean;
  position: "after-header" | "before-footer" | "in-home";
}

export interface AboutSection {
  badge: string;
  title: string;
  description: string;
  bulletPoints: string[];
  bgType: "none" | "video" | "image";
  bgVideo: string;
  bgImage: string;
  overlayOpacity: number;
  images: string[];
  visible: boolean;
}

export interface SiteData {
  header: SiteHeader;
  courseCategories: string[];
  coursesGridCols: 2 | 3 | 4;
  footer: SiteFooter;
  colors: SiteColors;
  menuItems: MenuItem[];
  homeSections: HomeSection[];
  courses: Course[];
  instagram: InstagramConfig;
  whatsapp: WhatsAppConfig;
  htmlWidgets: HtmlWidget[];
  about: AboutSection;
  adminUser: { username: string; password: string };
}

// ─── Default Data ─────────────────────────────────────────────────────────────

const DEFAULT_DATA: SiteData = {
  adminUser: { username: "admin", password: "admin123" },
  coursesGridCols: 3,
  header: {
    logoUrl: "",
    logoWidth: 160,
    siteName: "Cursos del Este",
    showSiteName: true,
    enabled: true,
    bgType: "image",
    bgImage: "https://picsum.photos/seed/hero-banner/1600/900",
    bgColor: "#1e3a8a",
    bgVideo: "",
    overlayColor: "#000000",
    overlayOpacity: 45,
    tagline: "El Poder De Aprender!",
    taglineEnabled: true,
    title: "Cursos del Este",
    titleEnabled: true,
    subtitle: "Tu mejor opción para capacitarte. Cursos prácticos con salida laboral.",
    subtitleEnabled: true,
    ctaButtons: [
      { id: "1", label: "Ver Cursos", link: "#cursos", style: "primary" },
      { id: "2", label: "Inscribirse", link: "https://api.whatsapp.com/send?phone=59898942143", style: "white" },
    ],
    navTransparent: true,
    navBgColor: "#ffffff",
    navTextColor: "#1e3a8a",
    height: "large",
  },
  footer: {
    description: "Nro 1 en cursos de alta demanda laboral, capacitate para el futuro. UNETE HOY",
    address: "Maldonado, Uruguay",
    phone: "098 942 143",
    phone2: "093 715 636",
    email: "info@cursosdeleste.com",
    facebook: "",
    instagram: "https://instagram.com/CURSOSDELESTE",
    instagram2: "https://instagram.com/CURSOSDELESTEMINAS",
    instagram3: "https://instagram.com/CURSOSDELESTEROCHA",
    twitter: "",
    copyright: "© 2026 Cursos del Este. Todos los derechos reservados.",
  },
  colors: {
    primary: "#2563eb",
    secondary: "#1e3a8a",
    accent: "#f59e0b",
    background: "#ffffff",
    text: "#0f172a",
  },
  menuItems: [
    { id: "1", label: "Inicio", href: "#", order: 1 },
    { id: "2", label: "Cursos", href: "#cursos", order: 2 },
    { id: "3", label: "Nosotros", href: "#nosotros", order: 3 },
    { id: "4", label: "Contacto", href: "#contacto", order: 4 },
  ],
  homeSections: [
    {
      id: "1",
      type: "image",
      title: "Reparación de Celulares",
      subtitle: "Módulo 1 — Aprende desde cero",
      image: "https://picsum.photos/seed/celulares/1600/900",
      fullWidth: true,
      height: "large",
      objectPosition: "center",
      overlayOpacity: 35,
      showTitle: true,
      videoUrl: "",
      htmlCode: "",
      accordionItems: [],
      buttons: [{ id: "1", label: "VER CURSO", link: "#cursos", style: "primary" }],
      link: "#cursos",
      order: 1,
      visible: true,
    },
    {
      id: "2",
      type: "image",
      title: "Reparación de Tablets",
      subtitle: "Técnico especializado en dispositivos móviles",
      image: "https://picsum.photos/seed/tablets/1600/900",
      fullWidth: true,
      height: "large",
      objectPosition: "center",
      overlayOpacity: 35,
      showTitle: true,
      videoUrl: "",
      htmlCode: "",
      accordionItems: [],
      buttons: [{ id: "1", label: "VER CURSO", link: "#cursos", style: "primary" }],
      link: "#cursos",
      order: 2,
      visible: true,
    },
    {
      id: "3",
      type: "image",
      title: "Reparación de Computadoras",
      subtitle: "Hardware, software y mantenimiento",
      image: "https://picsum.photos/seed/computadoras/1600/900",
      fullWidth: true,
      height: "large",
      objectPosition: "center",
      overlayOpacity: 35,
      showTitle: true,
      videoUrl: "",
      htmlCode: "",
      accordionItems: [],
      buttons: [{ id: "1", label: "VER CURSO", link: "#cursos", style: "primary" }],
      link: "#cursos",
      order: 3,
      visible: true,
    },
  ],
  courses: [
    {
      id: "1",
      title: "Reparación de Celulares Mod. 1",
      category: "Tecnología",
      price: "$4500",
      duration: "4 semanas",
      description: "Aprende diagnóstico y reparación de celulares desde cero con práctica real.",
      image: "https://picsum.photos/seed/cel1/800/600",
      featured: true,
      visible: true,
    },
    {
      id: "2",
      title: "Reparación de Celulares Mod. 2",
      category: "Tecnología",
      price: "$4500",
      duration: "4 semanas",
      description: "Nivel avanzado de reparación: microprocesadores, placas y soldadura.",
      image: "https://picsum.photos/seed/cel2/800/600",
      featured: true,
      visible: true,
    },
    {
      id: "3",
      title: "Reparación de Tablets",
      category: "Tecnología",
      price: "$4000",
      duration: "3 semanas",
      description: "Pantallas, baterías y sistemas operativos en tablets de todas las marcas.",
      image: "https://picsum.photos/seed/tab1/800/600",
      featured: false,
      visible: true,
    },
    {
      id: "4",
      title: "Reparación de Computadoras",
      category: "Tecnología",
      price: "$5000",
      duration: "6 semanas",
      description: "Hardware, software, mantenimiento preventivo y reparación de PC y notebooks.",
      image: "https://picsum.photos/seed/pc1/800/600",
      featured: false,
      visible: true,
    },
  ],
  courseCategories: ["Tecnología", "Informática", "Reparación", "Diseño", "Programación"],
  instagram: {
    enabled: false,
    embedCode: "",
    username: "CURSOSDELESTE",
    username2: "CURSOSDELESTEMINAS",
    username3: "CURSOSDELESTEROCHA",
  },
  whatsapp: {
    enabled: true,
    phone: "59898942143",
    message: "Hola! Quiero información sobre los cursos.",
    label: "INSCRIBETE",
    position: "bottom-right",
  },
  htmlWidgets: [],
  about: {
    badge: "Sobre Nosotros",
    title: "Líderes en capacitación técnica en la región",
    description: "Nro 1 en cursos de alta demanda laboral, capacitate para el futuro. UNETE HOY",
    bulletPoints: [
      "Metodología 100% práctica y con salida laboral",
      "Instructores con experiencia real en la industria",
      "Horarios flexibles — mañana, tarde y noche",
      "Comunidad de egresados que triunfan en sus campos",
    ],
    bgType: "none",
    bgVideo: "",
    bgImage: "",
    overlayOpacity: 40,
    images: [
      "https://picsum.photos/seed/learn1/400/500",
      "https://picsum.photos/seed/learn2/400/500",
    ],
    visible: true,
  },
};

// ─── Context ──────────────────────────────────────────────────────────────────

interface SiteContextType {
  data: SiteData;
  updateHeader: (header: SiteHeader) => void;
  updateFooter: (footer: SiteFooter) => void;
  updateColors: (colors: SiteColors) => void;
  updateMenuItems: (items: MenuItem[]) => void;
  updateHomeSections: (sections: HomeSection[]) => void;
  addHomeSection: (section: HomeSection) => void;
  removeHomeSection: (id: string) => void;
  updateCourses: (courses: Course[]) => void;
  addCourse: (course: Course) => void;
  removeCourse: (id: string) => void;
  updateCourseCategories: (categories: string[]) => void;
  updateCoursesGridCols: (cols: 2 | 3 | 4) => void;
  updateInstagram: (config: InstagramConfig) => void;
  updateWhatsApp: (config: WhatsAppConfig) => void;
  updateHtmlWidgets: (widgets: HtmlWidget[]) => void;
  updateAbout: (about: AboutSection) => void;
  updateAdminCredentials: (username: string, password: string) => void;
  isAdminLoggedIn: boolean;
  loginAdmin: (username: string, password: string) => boolean;
  logoutAdmin: () => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  selectedCourseId: string | null;
  setSelectedCourseId: (id: string | null) => void;
}

const BACKEND = "http://localhost:3001";

const SiteContext = createContext<SiteContextType | null>(null);

export function SiteProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SiteData>(() => {
    try {
      const saved = localStorage.getItem("cursosdeleste_data");
      if (saved) {
        const parsed = JSON.parse(saved);
        // Deep merge to pick up new default fields
        return {
          ...DEFAULT_DATA,
          ...parsed,
          header: { ...DEFAULT_DATA.header, ...parsed.header },
          footer: { ...DEFAULT_DATA.footer, ...parsed.footer },
          colors: { ...DEFAULT_DATA.colors, ...parsed.colors },
          whatsapp: { ...DEFAULT_DATA.whatsapp, ...parsed.whatsapp },
          instagram: { ...DEFAULT_DATA.instagram, ...parsed.instagram },
          htmlWidgets: parsed.htmlWidgets ?? [],
          about: { ...DEFAULT_DATA.about, ...parsed.about },
          courseCategories: parsed.courseCategories ?? DEFAULT_DATA.courseCategories,
          homeSections: (parsed.homeSections ?? DEFAULT_DATA.homeSections).map((s: HomeSection) => ({
            ...s,
            fullWidth: s.fullWidth ?? true,
            accordionItems: s.accordionItems ?? [],
          })),
        };
      }
    } catch {}
    return DEFAULT_DATA;
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return sessionStorage.getItem("admin_logged") === "true";
  });

  const [currentPage, setCurrentPage] = useState("home");
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  // ── Cargar datos del backend al iniciar ──────────────────────────────────
  useEffect(() => {
    fetch(`${BACKEND}/api/data`)
      .then((r) => r.ok ? r.json() : null)
      .then((remote) => {
        if (!remote) return;
        const merged: SiteData = {
          ...DEFAULT_DATA,
          ...remote,
          header: { ...DEFAULT_DATA.header, ...remote.header },
          footer: { ...DEFAULT_DATA.footer, ...remote.footer },
          colors: { ...DEFAULT_DATA.colors, ...remote.colors },
          whatsapp: { ...DEFAULT_DATA.whatsapp, ...remote.whatsapp },
          instagram: { ...DEFAULT_DATA.instagram, ...remote.instagram },
          htmlWidgets: remote.htmlWidgets ?? [],
          about: { ...DEFAULT_DATA.about, ...remote.about },
          courseCategories: remote.courseCategories ?? DEFAULT_DATA.courseCategories,
          homeSections: (remote.homeSections ?? DEFAULT_DATA.homeSections).map((s: HomeSection) => ({
            ...s,
            fullWidth: s.fullWidth ?? true,
            accordionItems: s.accordionItems ?? [],
          })),
        };
        setData(merged);
        localStorage.setItem("cursosdeleste_data", JSON.stringify(merged));
      })
      .catch(() => { /* backend offline — usar localStorage */ });
  }, []);

  // ── Persistir en localStorage y backend cuando cambian los datos ─────────
  useEffect(() => {
    localStorage.setItem("cursosdeleste_data", JSON.stringify(data));
    fetch(`${BACKEND}/api/data`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).catch(() => { /* backend offline — solo localStorage */ });
  }, [data]);

  const updateHeader = (header: SiteHeader) => setData((d) => ({ ...d, header }));
  const updateFooter = (footer: SiteFooter) => setData((d) => ({ ...d, footer }));
  const updateColors = (colors: SiteColors) => setData((d) => ({ ...d, colors }));
  const updateMenuItems = (menuItems: MenuItem[]) => setData((d) => ({ ...d, menuItems }));
  const updateHomeSections = (homeSections: HomeSection[]) => setData((d) => ({ ...d, homeSections }));
  const addHomeSection = (section: HomeSection) => setData((d) => ({ ...d, homeSections: [...d.homeSections, section] }));
  const removeHomeSection = (id: string) => setData((d) => ({ ...d, homeSections: d.homeSections.filter((s) => s.id !== id) }));
  const updateCourses = (courses: Course[]) => setData((d) => ({ ...d, courses }));
  const addCourse = (course: Course) => setData((d) => ({ ...d, courses: [...d.courses, course] }));
  const removeCourse = (id: string) => setData((d) => ({ ...d, courses: d.courses.filter((c) => c.id !== id) }));
  const updateCourseCategories = (courseCategories: string[]) => setData((d) => ({ ...d, courseCategories }));
  const updateCoursesGridCols = (coursesGridCols: 2 | 3 | 4) => setData((d) => ({ ...d, coursesGridCols }));
  const updateInstagram = (instagram: InstagramConfig) => setData((d) => ({ ...d, instagram }));
  const updateWhatsApp = (whatsapp: WhatsAppConfig) => setData((d) => ({ ...d, whatsapp }));
  const updateHtmlWidgets = (htmlWidgets: HtmlWidget[]) => setData((d) => ({ ...d, htmlWidgets }));
  const updateAbout = (about: AboutSection) => setData((d) => ({ ...d, about }));
  const updateAdminCredentials = (username: string, password: string) => setData((d) => ({ ...d, adminUser: { username, password } }));

  const loginAdmin = (username: string, password: string): boolean => {
    if (username === data.adminUser.username && password === data.adminUser.password) {
      setIsAdminLoggedIn(true);
      sessionStorage.setItem("admin_logged", "true");
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem("admin_logged");
    setCurrentPage("home");
    setSelectedCourseId(null);
  };

  return (
    <SiteContext.Provider value={{
      data,
      updateHeader, updateFooter, updateColors, updateMenuItems,
      updateHomeSections, addHomeSection, removeHomeSection,
      updateCourses, addCourse, removeCourse, updateCourseCategories, updateCoursesGridCols,
      updateInstagram, updateWhatsApp, updateHtmlWidgets, updateAbout,
      updateAdminCredentials,
      isAdminLoggedIn, loginAdmin, logoutAdmin,
      currentPage, setCurrentPage,
      selectedCourseId, setSelectedCourseId,
    }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used within SiteProvider");
  return ctx;
}
