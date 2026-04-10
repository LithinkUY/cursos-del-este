import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import {
  GraduationCap,
  Clock,
  ChevronRight,
  Menu,
  Facebook,
  Instagram,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  Settings,
  MessageCircle,
  ChevronUp,
  X,
} from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useSite, type HomeSection } from "./context/SiteContext";

// ─── helpers ─────────────────────────────────────────────────────────────────

function getYouTubeEmbed(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtu\.be\/([^?]+)/,
    /youtube\.com\/embed\/([^?]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m)
      return `https://www.youtube.com/embed/${m[1]}?autoplay=1&muted=1&loop=1&playlist=${m[1]}`;
  }
  return null;
}

function heightToClass(h: HomeSection["height"] | undefined) {
  return (
    ({
      small: "h-48 md:h-64",
      medium: "h-64 md:h-80",
      large: "h-[60vh] min-h-[400px]",
      fullscreen: "h-screen",
    } as Record<string, string>)[h ?? "large"] ?? "h-[60vh] min-h-[400px]"
  );
}

// ─── Section Buttons ──────────────────────────────────────────────────────────

function SectionBtns({
  section,
  colors,
  waUrl,
}: {
  section: HomeSection;
  colors: Record<string, string>;
  waUrl: string;
}) {
  if (!section.buttons || section.buttons.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-3 mt-5">
      {section.buttons.map((btn) => {
        const base =
          "px-6 py-2.5 rounded-full font-bold text-sm tracking-wide transition-all hover:scale-105 shadow";
        const href = btn.link === "#whatsapp" ? waUrl : btn.link;
        if (btn.style === "primary")
          return (
            <a key={btn.id} href={href} className={`${base} text-white`} style={{ background: colors.primary }}>
              {btn.label}
            </a>
          );
        if (btn.style === "white")
          return (
            <a key={btn.id} href={href} className={`${base} bg-white`} style={{ color: colors.primary }}>
              {btn.label}
            </a>
          );
        return (
          <a key={btn.id} href={href} className={`${base} border-2 border-white text-white bg-transparent`}>
            {btn.label}
          </a>
        );
      })}
    </div>
  );
}

// ─── SectionBlock ─────────────────────────────────────────────────────────────

function SectionBlock({
  section,
  colors,
  waUrl,
}: {
  section: HomeSection;
  colors: Record<string, string>;
  waUrl: string;
}) {
  const hClass = heightToClass(section.height);
  const overlayStyle = { background: `rgba(0,0,0,${(section.overlayOpacity ?? 40) / 100})` };

  // image
  if (section.type === "image" || !section.type) {
    return (
      <div
        className={`relative ${hClass} overflow-hidden`}
        style={section.fullWidth ? { width: "100vw", marginLeft: "calc(50% - 50vw)" } : {}}
      >
        {section.image && (
          <img
            src={section.image}
            alt={section.title}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: section.objectPosition ?? "center" }}
            referrerPolicy="no-referrer"
          />
        )}
        <div className="absolute inset-0" style={overlayStyle} />
        {section.showTitle !== false && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg leading-tight"
            >
              {section.title}
            </motion.h2>
            {section.subtitle && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-white/85 text-lg md:text-xl mt-3 max-w-2xl drop-shadow"
              >
                {section.subtitle}
              </motion.p>
            )}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <SectionBtns section={section} colors={colors} waUrl={waUrl} />
            </motion.div>
          </div>
        )}
      </div>
    );
  }

  // video
  if (section.type === "video") {
    const embedUrl = getYouTubeEmbed(section.videoUrl ?? "");
    return (
      <div
        className={`relative ${hClass} overflow-hidden bg-black`}
        style={section.fullWidth ? { width: "100vw", marginLeft: "calc(50% - 50vw)" } : {}}
      >
        {embedUrl ? (
          <iframe
            src={embedUrl}
            className="absolute inset-0 w-full h-full"
            allow="autoplay; fullscreen"
            frameBorder="0"
            title={section.title}
          />
        ) : (
          <video
            src={section.videoUrl}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0" style={overlayStyle} />
        {section.showTitle !== false && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg">
              {section.title}
            </h2>
            {section.subtitle && (
              <p className="text-white/85 text-lg mt-3 drop-shadow">{section.subtitle}</p>
            )}
          </div>
        )}
      </div>
    );
  }

  // html widget
  if (section.type === "html") {
    return (
      <div
        className={`py-8 ${section.fullWidth ? "" : "container mx-auto px-4"}`}
        style={section.fullWidth ? { width: "100vw", marginLeft: "calc(50% - 50vw)" } : {}}
      >
        {section.showTitle !== false && section.title && (
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6" style={{ color: colors.text }}>
            {section.title}
          </h2>
        )}
        <div dangerouslySetInnerHTML={{ __html: section.htmlCode ?? "" }} />
      </div>
    );
  }

  return null;
}

// ─── Hero Banner ─────────────────────────────────────────────────────────────

function HeroBanner({ colors, waUrl }: { colors: Record<string, string>; waUrl: string }) {
  const { data } = useSite();
  const { header } = data;
  if (!header.enabled) return null;

  const hClass = heightToClass(header.height);
  const opHex = Math.round(((header.overlayOpacity ?? 45) / 100) * 255)
    .toString(16)
    .padStart(2, "0");
  const overlayBg = `${header.overlayColor ?? "#000000"}${opHex}`;

  return (
    <div className={`relative w-full ${hClass} overflow-hidden`}>
      {header.bgType === "image" && header.bgImage && (
        <img
          src={header.bgImage}
          alt="hero"
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      )}
      {header.bgType === "color" && (
        <div className="absolute inset-0" style={{ background: header.bgColor ?? colors.secondary }} />
      )}
      {header.bgType === "video" && header.bgVideo && (
        <video
          src={header.bgVideo}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      <div className="absolute inset-0" style={{ background: overlayBg }} />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        {header.taglineEnabled && header.tagline && (
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-5 text-white"
            style={{ background: `${colors.primary}cc` }}
          >
            {header.tagline}
          </motion.span>
        )}
        {header.titleEnabled && header.title && (
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="text-4xl md:text-7xl font-extrabold text-white drop-shadow-xl leading-tight mb-4"
          >
            {header.title}
          </motion.h1>
        )}
        {header.subtitleEnabled && header.subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="text-white/80 text-lg md:text-2xl max-w-2xl mb-8"
          >
            {header.subtitle}
          </motion.p>
        )}
        {header.ctaButtons && header.ctaButtons.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            {header.ctaButtons.map((btn) => {
              const base =
                "px-8 py-3 rounded-full font-bold text-base tracking-wide transition-all hover:scale-105 shadow-lg";
              const href = btn.link === "#whatsapp" ? waUrl : btn.link;
              if (btn.style === "primary")
                return (
                  <a key={btn.id} href={href} className={`${base} text-white`} style={{ background: colors.primary }}>
                    {btn.label}
                  </a>
                );
              if (btn.style === "white")
                return (
                  <a key={btn.id} href={href} className={`${base} bg-white`} style={{ color: colors.primary }}>
                    {btn.label}
                  </a>
                );
              return (
                <a key={btn.id} href={href} className={`${base} border-2 border-white text-white`}>
                  {btn.label}
                </a>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ─── Main HomePage ────────────────────────────────────────────────────────────

export default function HomePage() {
  const { data, setCurrentPage, setSelectedCourseId } = useSite();
  const { header, footer, colors, menuItems, homeSections, courses, instagram, whatsapp } = data;

  const [isScrolled, setIsScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openMobileSub, setOpenMobileSub] = useState<string | null>(null);
  const _waRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 40);
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const visibleSections = [...homeSections]
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order);
  const visibleCourses = courses.filter((c) => c.visible);

  const waUrl =
    whatsapp?.phone
      ? `https://api.whatsapp.com/send?phone=${whatsapp.phone.replace(/\D/g, "")}&text=${encodeURIComponent(whatsapp.message ?? "")}`
      : "#";

  const navTransparentNow = header.navTransparent && !isScrolled;
  const navBg = navTransparentNow
    ? "bg-transparent"
    : "bg-white/95 backdrop-blur-md shadow-sm";
  const navTextColor = navTransparentNow
    ? "#ffffff"
    : header.navTextColor ?? colors.secondary;

  return (
    <div className="min-h-screen font-sans" style={{ background: colors.background, color: colors.text }}>

      {/* ── NAVBAR ──────────────────────────────────────────────────────────── */}
      <nav className={`fixed top-0 z-50 w-full transition-all duration-300 ${navBg} py-3`}>
        <div className="container mx-auto px-4 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2.5 shrink-0">
            {header.logoUrl ? (
              <img
                src={header.logoUrl}
                alt={header.siteName}
                style={{ width: header.logoWidth ?? 140, maxHeight: 52 }}
                className="object-contain"
                referrerPolicy="no-referrer"
              />
            ) : (
              <>
                <div className="p-2 rounded-lg shrink-0" style={{ background: colors.primary }}>
                  <GraduationCap className="text-white w-5 h-5" />
                </div>
                {header.showSiteName !== false && (
                  <span className="text-lg font-bold tracking-tight" style={{ color: navTextColor }}>
                    {header.siteName}
                  </span>
                )}
              </>
            )}
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-7">
            {[...menuItems].sort((a, b) => a.order - b.order).map((item) => {
              const hasSub = (item.children ?? []).length > 0;
              return (
                <div
                  key={item.id}
                  className="relative"
                  onMouseEnter={() => hasSub && setOpenDropdown(item.id)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <a
                    href={item.href}
                    className="flex items-center gap-1 text-sm font-semibold transition-opacity hover:opacity-70"
                    style={{ color: navTextColor }}
                  >
                    {item.label}
                    {hasSub && (
                      <svg className="w-3.5 h-3.5 opacity-70" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                      </svg>
                    )}
                  </a>
                  {hasSub && openDropdown === item.id && (
                    <div className="absolute top-full left-0 mt-2 min-w-[180px] bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50">
                      {(item.children ?? []).map((sub) => (
                        <a
                          key={sub.id}
                          href={sub.href}
                          className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                        >
                          {sub.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            {whatsapp?.enabled && (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 rounded-full text-sm font-bold text-white transition-all hover:opacity-90 hover:scale-105 shadow"
                style={{ background: "#25d366" }}
              >
                {whatsapp.label ?? "Inscribirse"}
              </a>
            )}
          </div>

          {/* Mobile */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <button className="p-2" style={{ color: navTextColor }}>
                  <Menu className="w-6 h-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <div className="flex items-center justify-between mb-8 mt-2">
                  <span className="font-bold text-lg" style={{ color: colors.secondary }}>
                    {header.siteName}
                  </span>
                  <button onClick={() => setMobileMenuOpen(false)}>
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>
                <div className="flex flex-col gap-1">
                  {[...menuItems].sort((a, b) => a.order - b.order).map((item) => {
                    const hasSub = (item.children ?? []).length > 0;
                    const isSubOpen = openMobileSub === item.id;
                    return (
                      <div key={item.id}>
                        <div className="flex items-center justify-between">
                          <a
                            href={item.href}
                            className="flex-1 py-2.5 text-base font-semibold text-slate-700 hover:text-blue-600 transition-colors"
                            onClick={() => !hasSub && setMobileMenuOpen(false)}
                          >
                            {item.label}
                          </a>
                          {hasSub && (
                            <button
                              onClick={() => setOpenMobileSub(isSubOpen ? null : item.id)}
                              className="p-2 text-slate-400"
                            >
                              <svg className={`w-4 h-4 transition-transform ${isSubOpen ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                              </svg>
                            </button>
                          )}
                        </div>
                        {hasSub && isSubOpen && (
                          <div className="ml-4 border-l-2 border-slate-100 pl-3 mb-2 flex flex-col gap-0.5">
                            {(item.children ?? []).map((sub) => (
                              <a
                                key={sub.id}
                                href={sub.href}
                                className="py-2 text-sm text-slate-500 hover:text-blue-600 transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {sub.label}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {whatsapp?.enabled && (
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 px-5 py-3 rounded-full text-center text-sm font-bold text-white"
                      style={{ background: "#25d366" }}
                    >
                      {whatsapp.label ?? "Inscribirse"}
                    </a>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* ── HERO BANNER ─────────────────────────────────────────────────────── */}
      <HeroBanner colors={colors} waUrl={waUrl} />

      {/* ── SECCIONES DINÁMICAS ─────────────────────────────────────────────── */}
      {visibleSections.map((section) => (
        <div key={section.id} className="overflow-hidden">
          <SectionBlock section={section} colors={colors} waUrl={waUrl} />
        </div>
      ))}

      {/* ── CURSOS ──────────────────────────────────────────────────────────── */}
      {visibleCourses.length > 0 && (
        <section id="cursos" className="py-20" style={{ background: colors.background }}>
          <div className="container mx-auto px-4">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-3" style={{ color: colors.secondary }}>
                Nuestros Cursos
              </h2>
              <p className="text-slate-500 max-w-xl mx-auto">
                Elegí la capacitación que más se adapta a tus objetivos.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {visibleCourses.map((course, i) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                >
                  <Card
                    className="overflow-hidden border-none shadow-md hover:shadow-xl transition-shadow h-full flex flex-col group cursor-pointer"
                    onClick={() => {
                      setSelectedCourseId(course.id);
                      setCurrentPage("course");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    <div className="relative aspect-video overflow-hidden">
                      {course.image && (
                        <img
                          src={course.image}
                          alt={course.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                      )}
                      <Badge
                        className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-semibold"
                        style={{ color: colors.primary }}
                      >
                        {course.category}
                      </Badge>
                      {course.featured && (
                        <Badge className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 text-xs">
                          Popular
                        </Badge>
                      )}
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base leading-tight line-clamp-2">
                        {course.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow pt-0">
                      <p className="text-slate-500 text-sm line-clamp-3">{course.description}</p>
                      <div className="flex items-center gap-1 text-sm text-slate-400 mt-4">
                        <Clock className="w-4 h-4" />
                        <span>{course.duration}</span>
                      </div>
                    </CardContent>
                    <Separator className="bg-slate-100" />
                    <CardFooter className="p-5 flex items-center justify-between">
                      <span className="text-xl font-extrabold" style={{ color: colors.primary }}>
                        {course.price}
                      </span>
                      <span
                        className="flex items-center gap-1 text-sm font-bold"
                        style={{ color: colors.primary }}
                      >
                        Ver detalle <ChevronRight className="w-4 h-4" />
                      </span>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── INSTAGRAM ───────────────────────────────────────────────────────── */}
      {instagram.enabled && instagram.embedCode && (
        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 mb-2">
                <Instagram className="w-6 h-6" style={{ color: "#e1306c" }} />
                <h2 className="text-2xl font-bold" style={{ color: colors.secondary }}>
                  Seguinos en Instagram
                </h2>
              </div>
              <div className="flex flex-wrap justify-center gap-3 mt-2">
                {[instagram.username, instagram.username2, instagram.username3]
                  .filter(Boolean)
                  .map((u) => (
                    <a
                      key={u}
                      href={`https://instagram.com/${u}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-pink-500 hover:underline font-medium"
                    >
                      @{u}
                    </a>
                  ))}
              </div>
            </div>
            <div
              className="max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-lg"
              dangerouslySetInnerHTML={{ __html: instagram.embedCode }}
            />
          </div>
        </section>
      )}

      {/* ── NOSOTROS ────────────────────────────────────────────────────────── */}
      <section id="nosotros" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1">
              <Badge
                className="mb-4 border-none text-sm px-3 py-1"
                style={{ background: `${colors.primary}18`, color: colors.primary }}
              >
                Sobre Nosotros
              </Badge>
              <h2
                className="text-3xl md:text-4xl font-bold mb-5 leading-tight"
                style={{ color: colors.secondary }}
              >
                Líderes en capacitación técnica en la región
              </h2>
              <p className="text-slate-600 mb-6 text-base leading-relaxed">{footer.description}</p>
              <div className="space-y-3 mb-8">
                {[
                  "Metodología 100% práctica y con salida laboral",
                  "Instructores con experiencia real en la industria",
                  "Horarios flexibles — mañana, tarde y noche",
                  "Comunidad de egresados que triunfan en sus campos",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-1 rounded-full p-1 shrink-0" style={{ background: colors.primary }}>
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-slate-700 text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
              {whatsapp?.enabled && (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-bold text-white text-sm shadow-lg transition-all hover:scale-105"
                  style={{ background: "#25d366" }}
                >
                  <MessageCircle className="w-4 h-4" />
                  Consultanos por WhatsApp
                </a>
              )}
            </div>
            <div className="flex-1">
              <div className="grid grid-cols-2 gap-4">
                <img
                  src="https://picsum.photos/seed/learn1/400/500"
                  alt="Clase"
                  className="rounded-2xl w-full h-56 object-cover shadow-lg"
                  referrerPolicy="no-referrer"
                />
                <img
                  src="https://picsum.photos/seed/learn2/400/500"
                  alt="Estudiante"
                  className="rounded-2xl w-full h-56 object-cover shadow-lg mt-10"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer id="contacto" className="bg-slate-900 text-slate-300 pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="space-y-5">
              <div className="flex items-center gap-2">
                {header.logoUrl ? (
                  <img
                    src={header.logoUrl}
                    alt={header.siteName}
                    className="h-10 w-auto object-contain"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <>
                    <div className="p-2 rounded-lg" style={{ background: colors.primary }}>
                      <GraduationCap className="text-white w-5 h-5" />
                    </div>
                    <span className="text-lg font-bold text-white">{header.siteName}</span>
                  </>
                )}
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">{footer.description}</p>
              <div className="flex gap-3 flex-wrap">
                {footer.facebook && (
                  <a
                    href={footer.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-slate-800 hover:bg-blue-600 transition-colors"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
                {[footer.instagram, footer.instagram2, footer.instagram3]
                  .filter(Boolean)
                  .map((ig, i) => (
                    <a
                      key={i}
                      href={ig}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-slate-800 hover:bg-pink-600 transition-colors"
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                  ))}
              </div>
            </div>
            {/* Nav */}
            <div>
              <h3 className="text-white font-bold mb-5">Navegación</h3>
              <ul className="space-y-3 text-sm">
                {[...menuItems].sort((a, b) => a.order - b.order).map((item) => (
                  <li key={item.id}>
                    <a href={item.href} className="hover:text-blue-400 transition-colors">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            {/* Courses */}
            <div>
              <h3 className="text-white font-bold mb-5">Cursos Populares</h3>
              <ul className="space-y-3 text-sm">
                {visibleCourses.slice(0, 5).map((c) => (
                  <li key={c.id}>
                    <a href="#cursos" className="hover:text-blue-400 transition-colors">
                      {c.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            {/* Contact */}
            <div>
              <h3 className="text-white font-bold mb-5">Contacto</h3>
              <ul className="space-y-3 text-sm">
                {footer.address && (
                  <li className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <span>{footer.address}</span>
                  </li>
                )}
                {footer.phone && (
                  <li className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                    <a href={`tel:${footer.phone}`} className="hover:text-white">{footer.phone}</a>
                  </li>
                )}
                {footer.phone2 && (
                  <li className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                    <a href={`tel:${footer.phone2}`} className="hover:text-white">{footer.phone2}</a>
                  </li>
                )}
                {footer.email && (
                  <li className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                    <a href={`mailto:${footer.email}`} className="hover:text-white">{footer.email}</a>
                  </li>
                )}
              </ul>
            </div>
          </div>
          <Separator className="bg-slate-800 mb-6" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>{footer.copyright}</p>
            <button
              onClick={() => setCurrentPage("admin")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700"
            >
              <Settings className="w-3 h-3" />
              Panel Admin
            </button>
          </div>
        </div>
      </footer>

      {/* ── WHATSAPP FLOATING ───────────────────────────────────────────────── */}
      {whatsapp?.enabled && (
        <a
          ref={_waRef}
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`fixed z-50 flex items-center gap-2 px-5 py-3 rounded-full text-white font-bold text-sm shadow-2xl transition-all hover:scale-105 ${
            whatsapp.position === "bottom-left" ? "bottom-6 left-6" : "bottom-6 right-6"
          }`}
          style={{ background: "#25d366" }}
        >
          <MessageCircle className="w-5 h-5" />
          {whatsapp.label ?? "INSCRIBETE"}
        </a>
      )}

      {/* ── SCROLL TO TOP ───────────────────────────────────────────────────── */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed z-40 p-3 rounded-full shadow-lg text-white transition-all hover:scale-110"
          style={{ background: colors.primary, bottom: "5.5rem", right: "1.5rem" }}
          title="Volver arriba"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
