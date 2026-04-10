import { useState, type FormEvent } from "react";
import { GraduationCap, Lock, User, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSite } from "../context/SiteContext";

export default function AdminLogin() {
  const { loginAdmin, setCurrentPage, data } = useSite();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const ok = await loginAdmin(username, password);
    if (ok) {
      setCurrentPage("admin-dashboard");
    } else {
      setError("Usuario o contraseña incorrectos.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="inline-flex p-4 rounded-2xl mb-4 shadow-lg"
            style={{ background: "#2563eb" }}
          >
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">{data.header.siteName}</h1>
          <p className="text-slate-500 text-sm mt-1">Panel de Administración</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-1">Iniciar Sesión</h2>
          <p className="text-slate-400 text-sm mb-6">
            Ingresá tus credenciales para acceder al panel.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Usuario
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 h-11"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-11"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg border border-red-100">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-11 text-white font-semibold mt-2"
              style={{ background: "#2563eb" }}
              disabled={loading}
            >
              {loading ? "Verificando..." : "Entrar al Panel"}
            </Button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-6">
            Credenciales por defecto: <strong>admin</strong> / <strong>admin123</strong>
          </p>
        </div>

        <p
          className="text-center text-sm text-slate-500 mt-6 cursor-pointer hover:underline"
          onClick={() => setCurrentPage("home")}
        >
          ← Volver al sitio
        </p>
      </div>
    </div>
  );
}
