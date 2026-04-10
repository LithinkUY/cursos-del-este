import { useEffect } from "react";
import { useSite } from "./context/SiteContext";
import HomePage from "./HomePage";
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import CoursePage from "./CoursePage";

export default function App() {
  const { currentPage, isAdminLoggedIn, setCurrentPage } = useSite();

  // Detectar /admin en la URL al cargar
  useEffect(() => {
    const path = window.location.pathname;
    if (path === "/admin" || path === "/admin/") {
      setCurrentPage("admin");
      window.history.replaceState({}, "", "/");
    }
  }, []);

  if (currentPage === "admin" || currentPage === "admin-dashboard") {
    if (!isAdminLoggedIn) return <AdminLogin />;
    return <AdminDashboard />;
  }

  if (currentPage === "course") {
    return <CoursePage />;
  }

  return <HomePage />;
}

