"use client";

import { useState } from "react";
import { updateUserMetadata } from "@/app/actions/user";
import { Save, CheckCircle2 } from "lucide-react";

interface ProfileFormProps {
  initialData: {
    full_name: string;
    currency: string;
  };
}

export default function ProfileForm({ initialData }: ProfileFormProps) {
  const [fullName, setFullName] = useState(initialData.full_name);
  const [currency, setCurrency] = useState(initialData.currency);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    const result = await updateUserMetadata({
      full_name: fullName,
      currency: currency,
    });

    if (result.success) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      alert("Error al actualizar el perfil: " + result.error);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-xs font-black uppercase tracking-widest text-slate-500">Nombre Completo</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white font-medium"
          placeholder="Tu nombre"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-black uppercase tracking-widest text-slate-500">Moneda Preferida</label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setCurrency("USD")}
            className={`p-4 rounded-2xl border font-bold transition-all ${currency === "USD"
              ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20"
              : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
              }`}
          >
            USD (Dólares)
          </button>
          <button
            type="button"
            onClick={() => setCurrency("ARS")}
            className={`p-4 rounded-2xl border font-bold transition-all ${currency === "ARS"
              ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20"
              : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
              }`}
          >
            ARS (Pesos Arg)
          </button>
        </div>
      </div>

      <div className="pt-4 flex items-center gap-4">
        <button
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] flex items-center gap-2"
        >
          {loading ? "Guardando..." : (
            <>
              <Save size={20} /> Guardar Cambios
            </>
          )}
        </button>

        {success && (
          <div className="flex items-center gap-2 text-green-500 font-bold animate-in fade-in slide-in-from-left-4">
            <CheckCircle2 size={20} />
            Cambios guardados
          </div>
        )}
      </div>
    </form>
  );
}
