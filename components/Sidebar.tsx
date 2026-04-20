import { Wallet, LayoutDashboard, History, PieChart, Settings } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import LogoutButton from "@/components/auth/LogoutButton";

export default async function Sidebar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  return (
    <aside className="flex w-64 flex-col border-r border-slate-800 p-6 sticky top-0 h-screen bg-[#020617]">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/20">
          <Wallet className="text-white" size={20} />
        </div>
        <span className="font-bold text-xl tracking-tight text-white">FinanzApp</span>
      </div>

      <nav className="space-y-1.5 flex-1">
        <NavItem href="/" icon={<LayoutDashboard size={20} />} label="Dashboard" />
        <NavItem href="/transactions" icon={<History size={20} />} label="Transacciones" />
        <NavItem href="#" icon={<PieChart size={20} />} label="Estadísticas" />
        <NavItem href="#" icon={<Settings size={20} />} label="Configuración" />
      </nav>

      <div className="pt-6 mt-6 border-t border-slate-800/50 space-y-4">
        <div className="px-4 py-3 bg-slate-900/50 rounded-2xl border border-slate-800/50">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-30 mb-1 text-slate-400">Sesión Iniciada</p>
          <p className="text-xs font-bold truncate opacity-80 text-white">{user.email}</p>
        </div>
        <LogoutButton />
      </div>
    </aside>
  );
}

function NavItem({ icon, label, href }: { icon: React.ReactNode, label: string, href: string }) {
  return (
    <Link href={href}>
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all opacity-40 hover:opacity-100 hover:bg-slate-800/50 text-white">
        {icon}
        <span className="font-bold text-sm">{label}</span>
      </div>
    </Link>
  );
}
