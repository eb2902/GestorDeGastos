"use client";
import { useState } from "react";
import { Wallet, ArrowLeft, Send } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Enlace de recuperación enviado. Revisa tu email.");
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-[#020617] text-white">
      {/* Lado Izquierdo: Visual */}
      <div className="hidden md:flex flex-col justify-center p-12 bg-gradient-to-br from-blue-600 to-blue-900 relative overflow-hidden">
        <div className="relative z-10 max-w-sm">
          <div className="bg-white/20 p-3 w-fit rounded-2xl backdrop-blur-md mb-8">
            <Wallet size={32} />
          </div>
          <h1 className="text-5xl font-bold tracking-tighter mb-4">Recupera tu acceso.</h1>
          <p className="text-blue-100 opacity-80 text-lg">Te enviaremos un enlace seguro para que puedas restablecer tu contraseña.</p>
        </div>
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-white/10 rounded-full blur-[100px]" />
      </div>

      {/* Lado Derecho: Formulario */}
      <div className="flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-sm space-y-8">
          <Link href="/login" className="flex items-center gap-2 text-xs font-bold uppercase opacity-40 hover:opacity-100 transition-opacity">
            <ArrowLeft size={14} /> Volver al login
          </Link>

          <div>
            <h2 className="text-3xl font-bold tracking-tight">¿Olvidaste tu contraseña?</h2>
            <p className="text-sm opacity-50 mt-2 uppercase tracking-wider">Ingresa tu email de registro</p>
          </div>

          <form onSubmit={handleResetRequest} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase opacity-60">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full bg-slate-900 border border-slate-800 p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white"
                required
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? "Enviando..." : (
                <>
                  <Send size={18} />
                  Enviar enlace de recuperación
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
