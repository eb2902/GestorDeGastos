import {
  ArrowUpCircle, ArrowDownCircle, Wallet,
  LayoutDashboard, History, Settings, PieChart
} from "lucide-react";
import Link from "next/link";

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import LogoutButton from "@/components/auth/LogoutButton";
import AddTransactionModal from "@/components/AddTransactionModal";
import { DynamicIcon } from "@/components/DynamicIcon";
import TimeFilters from "@/components/TimeFilters";
import { calculateDashboardMetrics } from "@/utils/calculations";
import ExpenseChart from "@/components/ExpenseChart";

// Función de utilidad para calcular los rangos de fecha
const getFilterDates = (range: string) => {
  const now = new Date();
  const start = new Date();

  if (range === '7D') start.setDate(now.getDate() - 7);
  else if (range === '1M') start.setMonth(now.getMonth() - 1);
  else if (range === '1Y') start.setFullYear(now.getFullYear() - 1);
  else start.setMonth(now.getMonth() - 1); // Default a 1 mes

  return {
    start: start.toISOString(),
    end: now.toISOString()
  };
};

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const cookieStore = await cookies();
  const params = await searchParams;
  const range = params.range || '1M';
  const { start, end } = getFilterDates(range);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value; },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Consulta filtrada por fecha
  const { data: transactions, error } = await supabase
    .from('transactions')
    .select('*, categories(name, icon, color)')
    .gte('date', start)
    .lte('date', end)
    .order('date', { ascending: false });

  if (error) {
    console.error("Error fetching transactions:", error);
    // Optionally throw an error here to be caught by an error.tsx boundary
  }

  // Cálculos de métricas extraídos a utils/calculations.ts
  const { totalIncome, totalExpense, balance, chartData } = calculateDashboardMetrics(transactions);

  // Etiqueta de texto para el rango actual
  const rangeLabel = range === '7D' ? 'últimos 7 días' : range === '1M' ? 'este mes' : 'este año';

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
          <NavItem href="/" icon={<LayoutDashboard size={20} />} label="Dashboard" active />
          <NavItem href="/transactions" icon={<History size={20} />} label="Transacciones" />
          <NavItem href="#" icon={<PieChart size={20} />} label="Estadísticas" />
          <NavItem href="#" icon={<Settings size={20} />} label="Configuración" />
        </nav>

        <div className="pt-6 mt-6 border-t border-slate-800/50 space-y-4">
          <div className="px-4 py-3 bg-slate-900/50 rounded-2xl border border-slate-800/50">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-30 mb-1">Sesión Iniciada</p>
            <p className="text-xs font-bold truncate opacity-80">{user.email}</p>
          </div>
          <LogoutButton />
        </div>
      </aside>

      <main className="flex-1 max-w-6xl mx-auto p-8">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-2xl font-bold tracking-tight">Panel de Control</h1>
          <div className="flex items-center gap-4">
            <TimeFilters />
            <AddTransactionModal />
          </div>
        </header>

        {/* SECCIÓN SUPERIOR: Balance Principal */}
        <section className="mb-10">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden text-white">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-100/50">
                Balance {rangeLabel}
              </span>
              <h2 className="text-6xl font-bold mt-2 tracking-tighter tabular-nums">
                <span className="text-3xl opacity-60 mr-1">$</span>
                {balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h2>
            </div>

            <div className="flex gap-10 mt-12 pt-8 border-t border-white/10">
              <div>
                <span className="flex items-center gap-1.5 text-xs text-blue-100/60 mb-2 font-bold">
                  <ArrowUpCircle size={14} className="text-green-400" /> INGRESOS
                </span>
                <span className="text-2xl font-bold">${totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div>
                <span className="flex items-center gap-1.5 text-xs text-blue-100/60 mb-2 font-bold">
                  <ArrowDownCircle size={14} className="text-red-400" /> GASTOS
                </span>
                <span className="text-2xl font-bold">${totalExpense.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECCIÓN INFERIOR: Grid de 2 Columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* COLUMNA IZQUIERDA: Transacciones */}
          <section className="lg:col-span-2">
            <h2 className="text-xl font-bold mb-6">Actividad de {rangeLabel}</h2>
            <div className="space-y-4">
              {transactions?.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-5 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/30 transition-all group">
                  <div className="flex items-center gap-4">
                    <div
                      className="p-3 rounded-2xl"
                      style={{
                        backgroundColor: tx.categories?.color ? `${tx.categories.color}20` : '#1e293b',
                        color: tx.categories?.color || '#64748b'
                      }}
                    >
                      <DynamicIcon name={tx.categories?.icon} size={22} />
                    </div>
                    <div>
                      <p className="font-bold text-sm group-hover:text-blue-400 transition-colors">{tx.description}</p>
                      <p className="text-[10px] opacity-40 font-bold uppercase tracking-widest">
                        {tx.categories?.name || 'General'} • {new Date(tx.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p className={`font-black tabular-nums ${tx.amount > 0 ? 'text-green-500' : 'text-white'}`}>
                    {tx.amount > 0 ? '+' : ''}{Number(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              ))}

              {(!transactions || transactions.length === 0) && (
                <div className="text-center py-20 bg-slate-900/30 rounded-[2.5rem] border border-dashed border-slate-800">
                  <p className="opacity-40 font-medium">No hay movimientos en este periodo.</p>
                </div>
              )}
            </div>
          </section>

          {/* COLUMNA DERECHA: Gráfico */}
          <aside className="lg:col-span-1">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] sticky top-8">
              <h3 className="text-sm font-black uppercase tracking-widest opacity-30 mb-6 text-center lg:text-left">
                Distribución de Gastos
              </h3>

              <div className="min-h-[250px] flex items-center justify-center">
                {chartData.length > 0 ? (
                  <ExpenseChart data={chartData} />
                ) : (
                  <p className="text-xs opacity-40 italic text-center">Sin datos para graficar</p>
                )}
              </div>

              {chartData.length > 0 && (
                <div className="mt-8 space-y-3">
                  {chartData.map((item) => (
                    <div key={item.name} className="flex justify-between items-center text-xs p-2 rounded-xl hover:bg-slate-800/30 transition-colors">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.fill }} />
                        <span className="opacity-70 font-medium">{item.name}</span>
                      </div>
                      <span className="font-bold text-slate-200">
                        ${item.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>

        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, href, active = false }: { icon: React.ReactNode, label: string, href: string, active?: boolean }) {
  return (
    <Link href={href}>
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${active
        ? 'bg-blue-600/10 text-blue-500'
        : 'opacity-40 hover:opacity-100 hover:bg-slate-800/50'
        }`}>
        {icon}
        <span className="font-bold text-sm">{label}</span>
      </div>
    </Link>
  );
}