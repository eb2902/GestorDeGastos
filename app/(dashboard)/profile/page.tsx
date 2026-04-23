import { createClient } from "@/utils/supabase/server";
import { getUserStats } from "@/app/actions/transactions";
import { User, Shield, Coins, History, Wallet, AlertTriangle } from "lucide-react";
import ProfileForm from "../../../components/ProfileForm";
import LogoutButton from "../../../components/auth/LogoutButton";
import DeleteAccountButton from "../../../components/DeleteAccountButton";
import CopyEmail from "@/components/CopyEmail";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { count: transactionCount } = await getUserStats();

  const fullName = user.user_metadata?.full_name || "Usuario";
  const email = user.email;
  const currentCurrency = user.user_metadata?.currency || "USD";

  return (
    <div className="relative max-w-4xl mx-auto pb-20">
      {/* Background Glows */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] -z-10" />
      <div className="absolute top-1/2 -right-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-[120px] -z-10" />

      <header className="mb-10 animate-fade-in-up">
        <h1 className="text-4xl font-black tracking-tight text-white flex items-center gap-4">
          <div className="p-3 bg-blue-600 rounded-2xl shadow-xl shadow-blue-500/20 ring-1 ring-white/20 group-hover:rotate-0 transition-transform">
            <User size={28} className="text-white" />
          </div>
          Mi Perfil
        </h1>
        <p className="text-base text-slate-400 font-medium mt-2 max-w-xl">
          Gestiona tu información personal, preferencias de moneda y seguridad de tu cuenta desde un solo lugar.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in-up [animation-delay:100ms]">
        {/* Lado Izquierdo: Resumen Rápido */}
        <div className="md:col-span-1 space-y-6">
          <div className="glass-card p-8 rounded-[2.5rem] flex flex-col items-center text-center relative overflow-hidden group">
            {/* Avatar con Glow */}
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-blue-500 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative w-28 h-28 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-4xl font-black text-white shadow-2xl ring-4 ring-slate-900/50">
                {fullName.charAt(0).toUpperCase()}
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white tracking-tight">{fullName}</h2>
            <CopyEmail email={email || ""} />

            <div className="w-full h-px bg-slate-800/50 my-8" />

            <div className="grid grid-cols-1 gap-4 w-full">
              <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-800/50 flex items-center gap-4 text-left group/stat">
                <div className="p-2 bg-slate-800 rounded-lg text-slate-400 group-hover/stat:text-blue-400 transition-colors">
                  <History size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-0.5">Transacciones</p>
                  <p className="text-lg font-black text-white leading-none">{transactionCount}</p>
                </div>
              </div>
              <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-800/50 flex items-center gap-4 text-left group/stat">
                <div className="p-2 bg-slate-800 rounded-lg text-slate-400 group-hover/stat:text-blue-400 transition-colors">
                  <Wallet size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-0.5">Moneda</p>
                  <p className="text-lg font-black text-blue-500 leading-none">{currentCurrency}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 rounded-[2rem] space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
              <Shield size={14} className="text-blue-500" /> Seguridad y Sesión
            </h3>
            <LogoutButton />
          </div>
        </div>

        {/* Lado Derecho: Configuración Detallada */}
        <div className="md:col-span-2 space-y-8">
          <section className="glass-card p-8 md:p-10 rounded-[2.5rem]">
            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Coins size={22} className="text-blue-500" />
              </div>
              Preferencias y Datos
            </h3>

            <ProfileForm
              initialData={{
                full_name: fullName,
                currency: currentCurrency
              }}
            />
          </section>

          <section className="bg-red-500/5 border border-red-500/10 p-8 md:p-10 rounded-[2.5rem] relative overflow-hidden group">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-red-500/5 rounded-full blur-3xl group-hover:bg-red-500/10 transition-colors" />
            
            <h3 className="text-xl font-bold text-red-500 mb-3 flex items-center gap-3">
              <AlertTriangle size={22} /> Zona de Peligro
            </h3>
            <p className="text-sm text-slate-400 mb-8 max-w-md leading-relaxed">
              Al eliminar tu cuenta, todos tus datos y transacciones se borrarán permanentemente. Esta acción no se puede deshacer y perderás acceso inmediato.
            </p>
            <DeleteAccountButton />
          </section>
        </div>
      </div>
    </div>
  );
}
