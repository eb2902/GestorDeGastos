import { 
  PlusIcon, ArrowUpCircle, ArrowDownCircle, Wallet, 
  LayoutDashboard, History, Settings, PieChart 
} from "lucide-react";
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import LogoutButton from "@/components/LogoutButton";

export default async function HomePage() {
  const cookieStore = await cookies(); 

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value; },
      },
    }
  );

  // 1. Obtenemos la sesión para el sidebar
  const { data: { session } } = await supabase.auth.getSession();

  // 2. Fetch de transacciones
  const { data: transactions } = await supabase
    .from('transactions')
    .select('*, categories(name, icon, color)')
    .order('date', { ascending: false });

  // Cálculos de balance
  const totalIncome = transactions?.filter(tx => tx.amount > 0).reduce((acc, tx) => acc + Number(tx.amount), 0) || 0;
  const totalExpense = transactions?.filter(tx => tx.amount < 0).reduce((acc, tx) => acc + Math.abs(Number(tx.amount)), 0) || 0;
  const balance = totalIncome - totalExpense;

  return (
    <div className="flex min-h-screen bg-[#020617] text-white font-sans">
      
      {/* SIDEBAR */}
      <aside className="hidden md:flex w-64 flex-col border-r border-slate-800 p-6 sticky top-0 h-screen bg-[#020617]">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/20">
            <Wallet className="text-white" size={20} />
          </div>
          <span className="font-bold text-xl tracking-tight">FinanzApp</span>
        </div>

        <nav className="space-y-1.5 flex-1">
          <NavItem icon={<LayoutDashboard size={20}/>} label="Dashboard" active />
          <NavItem icon={<History size={20}/>} label="Transacciones" />
          <NavItem icon={<PieChart size={20}/>} label="Estadísticas" />
          <NavItem icon={<Settings size={20}/>} label="Configuración" />
        </nav>

        {/* SECCIÓN DE USUARIO Y LOGOUT */}
        <div className="pt-6 mt-6 border-t border-slate-800/50 space-y-4">
          <div className="px-4 py-3 bg-slate-900/50 rounded-2xl border border-slate-800/50">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-30 mb-1">Sesión Iniciada</p>
            <p className="text-xs font-bold truncate opacity-80">
              {session?.user?.email || "usuario@app.com"}
            </p>
          </div>
          <LogoutButton />
        </div>
      </aside>

      <main className="flex-1 max-w-6xl mx-auto p-8">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-2xl font-bold tracking-tight">Panel de Control</h1>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2">
            <PlusIcon size={18} />
            <span>Nuevo Registro</span>
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <section className="md:col-span-2">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden text-white">
              <p className="text-blue-100/70 text-sm font-medium uppercase tracking-wider">Balance total</p>
              <h2 className="text-6xl font-bold mt-3 tracking-tighter tabular-nums">
                <span className="text-3xl opacity-60 mr-1">$</span>
                {balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </h2>
              <div className="flex gap-10 mt-12 pt-8 border-t border-white/10">
                <div>
                  <span className="flex items-center gap-1.5 text-xs text-blue-100/60 mb-2 font-bold"><ArrowUpCircle size={14} className="text-green-400" /> INGRESOS</span>
                  <span className="text-2xl font-bold">${totalIncome.toLocaleString()}</span>
                </div>
                <div>
                  <span className="flex items-center gap-1.5 text-xs text-blue-100/60 mb-2 font-bold"><ArrowDownCircle size={14} className="text-red-400" /> GASTOS</span>
                  <span className="text-2xl font-bold">${totalExpense.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </section>

          <section className="md:col-span-3 mt-10">
            <h2 className="text-xl font-bold mb-6">Actividad reciente</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {transactions?.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-blue-500/30 transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl ${tx.amount > 0 ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'}`}>
                      {tx.amount > 0 ? <ArrowUpCircle size={22} /> : <Wallet size={22} />}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{tx.description}</p>
                      <p className="text-[10px] opacity-40 font-bold uppercase tracking-widest">
                        {new Date(tx.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p className={`font-black tabular-nums ${tx.amount > 0 ? 'text-green-500' : 'text-white'}`}>
                    {tx.amount > 0 ? '+' : ''}{Number(tx.amount).toFixed(2)}
                  </p>
                </div>
              ))}
              {(!transactions || transactions.length === 0) && (
                <div className="col-span-3 text-center py-20 bg-slate-900/50 rounded-[2.5rem] border border-dashed border-slate-800">
                  <p className="opacity-40 font-medium">No hay transacciones registradas.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${active ? 'bg-blue-600/10 text-blue-500' : 'opacity-40 hover:opacity-100'}`}>
      {icon}
      <span className="font-bold text-sm">{label}</span>
    </div>
  );
}