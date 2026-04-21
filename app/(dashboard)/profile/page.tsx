import { createClient } from "@/utils/supabase/server";
import { getUserStats } from "@/app/actions/transactions";
import { User, Shield, Trash2, Coins } from "lucide-react";
import ProfileForm from "../../../components/ProfileForm";
import LogoutButton from "../../../components/auth/LogoutButton";
import DeleteAccountButton from "../../../components/DeleteAccountButton";
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
    <div className="max-w-4xl mx-auto pb-20">
      <header className="mb-10">
        <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
          <span className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20">
            <User size={24} />
          </span>
          Mi Perfil
        </h1>
        <p className="text-sm text-slate-500 font-medium mt-1">Gestiona tu información y preferencias de cuenta</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Lado Izquierdo: Resumen Rápido */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-slate-900/40 border border-slate-800 p-6 md:p-8 rounded-3xl md:rounded-[2.5rem] flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-3xl font-black text-white mb-4 shadow-xl shadow-blue-500/20">
              {fullName.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-xl font-bold text-white">{fullName}</h2>
            <p className="text-sm text-slate-500">{email}</p>

            <div className="w-full h-px bg-slate-800 my-6" />

            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800/50">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Transacciones</p>
                <p className="text-xl font-black text-white">{transactionCount}</p>
              </div>
              <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800/50">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Moneda</p>
                <p className="text-xl font-black text-blue-500">{currentCurrency}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl md:rounded-[2rem] space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
              <Shield size={14} /> Seguridad
            </h3>
            <LogoutButton />
          </div>
        </div>

        {/* Lado Derecho: Configuración Detallada */}
        <div className="md:col-span-2 space-y-8">
          <section className="bg-slate-900/40 border border-slate-800 p-6 md:p-8 rounded-3xl md:rounded-[2.5rem]">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Coins size={20} className="text-blue-500" /> Preferencias y Datos
            </h3>

            <ProfileForm
              initialData={{
                full_name: fullName,
                currency: currentCurrency
              }}
            />
          </section>

          <section className="bg-red-500/5 border border-red-500/20 p-6 md:p-8 rounded-3xl md:rounded-[2.5rem]">
            <h3 className="text-lg font-bold text-red-500 mb-2 flex items-center gap-2">
              <Trash2 size={20} /> Zona de Peligro
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              Al eliminar tu cuenta, todos tus datos y transacciones se borrarán permanentemente. Esta acción no se puede deshacer.
            </p>
            <DeleteAccountButton />
          </section>
        </div>
      </div>
    </div>
  );
}
