import { useState } from "react";
import { Save, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSite, type SiteFooter } from "../../context/SiteContext";

export default function FooterEditor() {
  const { data, updateFooter } = useSite();
  const [form, setForm] = useState<SiteFooter>({ ...data.footer });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateFooter(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Pie de Página (Footer)</h2>
        <p className="text-slate-500 text-sm">
          Información de contacto, redes sociales y texto de copyright.
        </p>
      </div>

      <div className="bg-white rounded-xl border shadow-sm p-6 space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Descripción de la Empresa
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="border-t pt-5">
          <h3 className="font-semibold text-slate-800 mb-4">Datos de Contacto</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Dirección</label>
              <Input
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Av. Principal 123, Maldonado"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Teléfono 1</label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+598 09X XXX XXX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Teléfono 2</label>
                <Input
                  value={form.phone2 ?? ""}
                  onChange={(e) => setForm({ ...form, phone2: e.target.value })}
                  placeholder="+598 09X XXX XXX"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Email</label>
              <Input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="info@cursosdeleste.com"
              />
            </div>
          </div>
        </div>

        <div className="border-t pt-5">
          <h3 className="font-semibold text-slate-800 mb-4">Redes Sociales</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Facebook (URL completa o dejar vacío para ocultar)
              </label>
              <Input
                value={form.facebook}
                onChange={(e) => setForm({ ...form, facebook: e.target.value })}
                placeholder="https://facebook.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Instagram 1</label>
              <Input
                value={form.instagram}
                onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                placeholder="https://instagram.com/cursosdeleste"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Instagram 2</label>
              <Input
                value={form.instagram2 ?? ""}
                onChange={(e) => setForm({ ...form, instagram2: e.target.value })}
                placeholder="https://instagram.com/cursosdelesteminas"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Instagram 3</label>
              <Input
                value={form.instagram3 ?? ""}
                onChange={(e) => setForm({ ...form, instagram3: e.target.value })}
                placeholder="https://instagram.com/cursosdelesterocha"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Twitter / X</label>
              <Input
                value={form.twitter}
                onChange={(e) => setForm({ ...form, twitter: e.target.value })}
                placeholder="https://twitter.com/..."
              />
            </div>
          </div>
        </div>

        <div className="border-t pt-5">
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Texto de Copyright
          </label>
          <Input
            value={form.copyright}
            onChange={(e) => setForm({ ...form, copyright: e.target.value })}
            placeholder="© 2026 Cursos del Este..."
          />
        </div>

        <Button
          onClick={handleSave}
          className={`w-full h-11 font-semibold text-white transition-all ${
            saved ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {saved ? (
            <>
              <Check className="w-4 h-4 mr-2" /> ¡Guardado!
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" /> Guardar Cambios
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
