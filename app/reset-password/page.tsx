"use client";
import { useState } from "react";
import { Wallet, Lock, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updatePassword } from "@/app/actions/user";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const router = useRouter();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    try {
      const result = await updatePassword(password);

      if (!result.success) {
        toast.error(result.error);
      } else {
        toast.success("Contraseña actualizada correctamente");
        setCompleted(true);
        // Pequeña espera antes de redirigir
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  if (completed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617] p-8">
        <div className="w-full max-w-md bg-slate-900/50 border border-slate-800 p-8 rounded-3xl text-center space-y-6 backdrop-blur-xl">
          <div className="bg-green-500/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <CheckCircle2 size={40} className="text-green-500" />
          </div>
          <h2 className="text-3xl font-bold">¡Todo listo!</h2>
          <p className="text-slate-400">Tu contraseña ha sido actualizada exitosamente. Serás redirigido al login en unos segundos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-[#020617] text-white">
      {/* Lado Izquierdo: Visual */}
      <div className="hidden md:flex flex-col justify-center p-12 bg-gradient-to-br from-blue-600 to-blue-900 relative overflow-hidden">
        <div className="relative z-10 max-w-sm">
          <div className="bg-white/20 p-3 w-fit rounded-2xl backdrop-blur-md mb-8">
            <Wallet size={32} />
          </div>
          <h1 className="text-5xl font-bold tracking-tighter mb-4">Nueva Seguridad.</h1>
          <p className="text-blue-100 opacity-80 text-lg">Elige una contraseña fuerte y única para proteger tus datos financieros.</p>
        </div>
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-white/10 rounded-full blur-[100px]" />
      </div>

      {/* Lado Derecho: Formulario */}
      <div className="flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-sm space-y-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Reiniciar Contraseña</h2>
            <p className="text-sm opacity-50 mt-2 uppercase tracking-wider">Ingresa tu nueva clave</p>
          </div>

          <form onSubmit={handleResetPassword} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase opacity-60">Nueva Contraseña</label>
                <div className="relative">
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-900 border border-slate-800 p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white pl-12"
                    required
                  />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase opacity-60">Confirmar Contraseña</label>
                <div className="relative">
                  <input 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-900 border border-slate-800 p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white pl-12"
                    required
                  />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18} />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? "Actualizando..." : "Actualizar Contraseña"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
