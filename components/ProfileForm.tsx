"use client";

import { useState } from "react";
import { updateUserMetadata } from "@/app/actions/user";
import { Save, CheckCircle2, User, Loader2 } from "lucide-react";

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
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-3">
        <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Nombre Completo</label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
            <User size={18} />
          </div>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full bg-slate-950/50 border border-slate-800/60 pl-11 p-4 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none transition-all text-white font-medium placeholder:text-slate-600"
            placeholder="Tu nombre completo"
            required
          />
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Moneda Preferida</label>
        <div className="grid grid-cols-2 p-1.5 bg-slate-950/50 border border-slate-800/60 rounded-[1.25rem] relative">
          <button
            type="button"
            onClick={() => setCurrency("USD")}
            className={`relative z-10 py-3.5 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${currency === "USD"
              ? "text-white"
              : "text-slate-500 hover:text-slate-300"
              }`}
          >
            {currency === "USD" && (
              <div className="absolute inset-0 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20 -z-10 animate-in fade-in zoom-in-95 duration-200" />
            )}
            USD (Dólares)
          </button>
          <button
            type="button"
            onClick={() => setCurrency("ARS")}
            className={`relative z-10 py-3.5 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${currency === "ARS"
              ? "text-white"
              : "text-slate-500 hover:text-slate-300"
              }`}
          >
            {currency === "ARS" && (
              <div className="absolute inset-0 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20 -z-10 animate-in fade-in zoom-in-95 duration-200" />
            )}
            ARS (Pesos Arg)
          </button>
        </div>
      </div>

      <div className="pt-4 flex flex-col sm:flex-row items-center gap-6">
        <button
          disabled={loading}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 disabled:opacity-70 text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3 group"
        >
          {loading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Save size={20} className="group-hover:scale-110 transition-transform" />
          )}
          {loading ? "Guardando..." : "Guardar Cambios"}
        </button>

        {success && (
          <div className="flex items-center gap-2 text-green-400 font-bold animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="p-1 bg-green-500/10 rounded-full">
              <CheckCircle2 size={18} />
            </div>
            Cambios guardados con éxito
          </div>
        )}
      </div>
    </form>
  );
}

