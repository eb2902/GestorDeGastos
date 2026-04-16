"use client";
import { useState } from "react";
import { Wallet, ArrowLeft } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 1. Registro en Auth de Supabase
    // Eliminamos 'data' por completo para que ESLint no lance warnings
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      alert("Error: " + error.message);
      setLoading(false);
    } else {
      alert("¡Cuenta creada! Revisa tu email para confirmar el registro.");
      router.push("/login");
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
          <h1 className="text-5xl font-bold tracking-tighter mb-4">Comienza tu viaje financiero.</h1>
          <p className="text-blue-100 opacity-80 text-lg">Crea una cuenta gratis y empieza a trackear tus movimientos en segundos.</p>
        </div>
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-white/10 rounded-full blur-[100px]" />
      </div>

      {/* Lado Derecho: Formulario de Registro */}
      <div className="flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-sm space-y-6">
          <Link href="/login" className="flex items-center gap-2 text-xs font-bold uppercase opacity-40 hover:opacity-100 transition-opacity mb-4">
            <ArrowLeft size={14} /> Volver al login
          </Link>
          
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Crear Cuenta</h2>
            <p className="text-sm opacity-50 mt-2 uppercase tracking-wider">Únete a FinanzApp</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase opacity-60">Nombre Completo</label>
              <input 
                type="text" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Juan Pérez"
                className="w-full bg-slate-900 border border-slate-800 p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase opacity-60">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full bg-slate-900 border border-slate-800 p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase opacity-60">Contraseña</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full bg-slate-900 border border-slate-800 p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                required
              />
            </div>

            <button 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] mt-2"
            >
              {loading ? "Creando cuenta..." : "Registrarse ahora"}
            </button>
          </form>

          <p className="text-center text-sm opacity-50">
            ¿Ya tienes cuenta? <Link href="/login" className="text-blue-500 font-bold hover:underline">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
}