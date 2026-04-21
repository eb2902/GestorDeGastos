import { Wallet, LayoutDashboard, History, PieChart, Settings } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import LogoutButton from "@/components/auth/LogoutButton";

export default async function Sidebar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  return (
    <aside className="flex w-64 flex-col border-r border-slate-800/50 p-8 sticky top-0 h-screen bg-[#020617] z-40">
      <div className="flex items-center gap-3 mb-12">
        <div className="bg-blue-600 p-2.5 rounded-2xl shadow-xl shadow-blue-500/20 rotate-3 group-hover:rotate-0 transition-transform">
          <Wallet className="text-white" size={24} />
        </div>
        <span className="font-black text-2xl tracking-tighter text-white">Finanz<span className="text-blue-500">App</span></span>
      </div>

      <nav className="space-y-2 flex-1">
        <NavItem href="/" icon={<LayoutDashboard size={20} />} label="Dashboard" />
        <NavItem href="/transactions" icon={<History size={20} />} label="Transacciones" />
        <NavItem href="#" icon={<PieChart size={20} />} label="Estadísticas" />
        <NavItem href="#" icon={<Settings size={20} />} label="Configuración" />
      </nav>

      <div className="pt-8 mt-auto space-y-6">
        <div className="p-5 bg-slate-900/40 rounded-[2rem] border border-slate-800/50 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-12 h-12 bg-blue-500/5 rounded-full blur-xl group-hover:bg-blue-500/10 transition-all" />
          <p className="text-[10px] font-black uppercase tracking-widest opacity-20 mb-2 text-white">Usuario Activo</p>
          <p className="text-xs font-bold truncate text-slate-300">{user.email}</p>
        </div>
        <LogoutButton />
      </div>
    </aside>
  );
}

function NavItem({ icon, label, href }: { icon: React.ReactNode, label: string, href: string }) {
  return (
    <Link href={href}>
      <div className="flex items-center gap-4 px-5 py-4 rounded-2xl cursor-pointer transition-all hover:bg-slate-900 border border-transparent hover:border-slate-800 group text-slate-400 hover:text-white">
        <div className="opacity-40 group-hover:opacity-100 transition-opacity">
          {icon}
        </div>
        <span className="font-bold text-sm tracking-tight">{label}</span>
      </div>
    </Link>
  );
}
