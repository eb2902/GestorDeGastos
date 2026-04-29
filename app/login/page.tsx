"use client";
import { useState } from "react";
import { Wallet } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Suspense, useEffect } from "react";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#020617] flex items-center justify-center text-white">Cargando...</div>}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  const message = searchParams.get("message");
  const error = searchParams.get("error");

  useEffect(() => {
    if (message) {
      toast.info(message);
    }
    if (error) {
      toast.error(error);
    }
  }, [message, error]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({ email, password });
      
      if (loginError) {
        toast.error(loginError.message);
        setLoading(false);
        return;
      }

      if (data?.session) {
        // 1. Refresca la ruta actual para sincronizar cookies con el servidor
        router.refresh();
        
        // 2. Pequeña espera para asegurar que el middleware vea la sesión
        // antes de ejecutar la redirección programática
        setTimeout(() => {
          router.push("/");
        }, 100);
      }
    } catch (err) {
      console.error("Error inesperado:", err);
      toast.error("Ocurrió un error inesperado al intentar iniciar sesión.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-[#020617] text-white">
      {/* Lado Izquierdo: Visual (Oculto en móviles) */}
      <div className="hidden md:flex flex-col justify-center p-12 bg-gradient-to-br from-blue-600 to-blue-900 relative overflow-hidden">
        <div className="relative z-10 max-w-sm">
          <div className="bg-white/20 p-3 w-fit rounded-2xl backdrop-blur-md mb-8">
            <Wallet size={32} />
          </div>
          <h1 className="text-5xl font-bold tracking-tighter mb-4">Domina tus finanzas.</h1>
          <p className="text-blue-100 opacity-80 text-lg">Gestiona ingresos y gastos con precisión técnica.</p>
        </div>
        {/* Elemento decorativo */}
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-white/10 rounded-full blur-[100px]" />
      </div>

      {/* Lado Derecho: Formulario de Login */}
      <div className="flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-sm">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Bienvenido</h2>
              <p className="text-sm opacity-50 mt-2 uppercase tracking-wider">Ingresa tus credenciales</p>
            </div>

            <div className="space-y-4">
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
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase opacity-60">Contraseña</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-900 border border-slate-800 p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white"
                  required
                />
                <div className="flex justify-end">
                  <Link href="/forgot-password" shaking-text="true" className="text-xs font-bold text-blue-500 hover:underline opacity-70 hover:opacity-100 transition-opacity">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Cargando..." : "Iniciar Sesión"}
            </button>
          </form>

          <p className="text-center text-sm opacity-50 mt-6">
            ¿No tienes cuenta? <Link href="/signup" className="text-blue-500 font-bold hover:underline">Regístrate</Link>
          </p>
        </div>
      </div>
    </div>
  );
}