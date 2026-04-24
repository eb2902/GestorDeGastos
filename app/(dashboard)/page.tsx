import {
  ArrowUpCircle, ArrowDownCircle, Wallet, History as HistoryIcon, PieChart as PieChartIcon
} from "lucide-react";

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AddTransactionModal from "@/components/AddTransactionModal";
import { DynamicIcon } from "@/components/DynamicIcon";
import TimeFilters from "@/components/TimeFilters";
import { calculateDashboardMetrics } from "@/utils/calculations";
import ExpenseChart from "@/components/ExpenseChart";
import { formatCurrency, formatDate, formatAmount } from "@/utils/formatters";

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

  const currency = user.user_metadata?.currency || 'USD';

  // Consulta filtrada por fecha
  const { data: transactions, error } = await supabase
    .from('transactions')
    .select('*, categories(name, icon, color)')
    .gte('date', start)
    .lte('date', end)
    .order('date', { ascending: false });

  if (error) {
    console.error("Error fetching transactions:", error);
  }

  const { totalIncome, totalExpense, balance, chartData } = calculateDashboardMetrics(transactions);
  const rangeLabel = range === '7D' ? 'últimos 7 días' : range === '1M' ? 'este mes' : 'este año';

  return (
    <div className="max-w-6xl mx-auto pb-20 px-4 md:px-0">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-3">
            <span className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20">
              <Wallet size={24} />
            </span>
            Panel de Control
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Gestiona tus finanzas con precisión</p>
        </div>
        <div className="flex items-center gap-2 md:gap-4 bg-slate-900/50 p-1.5 rounded-2xl border border-slate-800 w-full md:w-auto justify-between md:justify-start">
          <TimeFilters />
          <div className="hidden md:block w-px h-6 bg-slate-800 mx-1" />
          <AddTransactionModal />
        </div>
      </header>

      {/* SECCIÓN SUPERIOR: Balance Principal */}
      <section className="mb-12 animate-fade-in-up">
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] shadow-2xl relative overflow-hidden text-white border border-white/10 group hover:scale-[1.01] transition-all duration-500">
          {/* Decoración de fondo */}
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700" />
          <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-100/60 mb-2">
                Balance disponible • {rangeLabel}
              </span>
              <h2 className="text-4xl md:text-7xl font-black tracking-tighter tabular-nums flex items-baseline flex-wrap">
                <span className="text-xl md:text-2xl opacity-50 mr-2">{currency === 'USD' ? '$' : 'AR$'}</span>
                {balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </h2>
            </div>

            {/* MEJORA AQUÍ: Grid 2 columnas en mobile, flex en desktop */}
            <div className="grid grid-cols-2 md:flex gap-4 md:gap-12 bg-black/20 backdrop-blur-md p-4 md:p-6 rounded-2xl md:rounded-3xl border border-white/5">
              <div className="min-w-0">
                <span className="flex items-center gap-2 text-[10px] text-blue-100/60 mb-1 md:mb-2 font-black uppercase tracking-widest">
                  <ArrowUpCircle size={12} className="text-green-400" /> Ingresos
                </span>
                <span className="text-lg md:text-2xl font-bold block truncate">{formatCurrency(totalIncome, currency)}</span>
              </div>

              {/* Separador oculto en mobile si usamos el grid */}
              <div className="hidden md:block w-px h-8 md:h-10 bg-white/10 self-center" />

              <div className="min-w-0">
                <span className="flex items-center gap-2 text-[10px] text-blue-100/60 mb-1 md:mb-2 font-black uppercase tracking-widest">
                  <ArrowDownCircle size={12} className="text-red-400" /> Gastos
                </span>
                <span className="text-lg md:text-2xl font-bold block truncate">{formatCurrency(totalExpense, currency)}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN INFERIOR: Grid de 2 Columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-fade-in-up [animation-delay:200ms]">
        <section className="lg:col-span-2">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Movimientos Recientes
              <span className="text-[10px] font-black bg-slate-800 px-2 py-1 rounded-full text-slate-500 uppercase">
                {transactions?.length || 0}
              </span>
            </h2>
          </div>

          <div className="space-y-3">
            {transactions?.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4 md:p-5 rounded-[1.5rem] md:rounded-[2rem] bg-slate-900/40 border border-slate-800/50 hover:bg-slate-900/80 hover:border-blue-500/30 transition-all group">
                <div className="flex items-center gap-3 md:gap-5 min-w-0">
                  <div
                    className="p-2.5 md:p-3.5 rounded-xl md:rounded-2xl shadow-inner flex-shrink-0"
                    style={{
                      backgroundColor: tx.categories?.color ? `${tx.categories.color}15` : '#1e293b',
                      color: tx.categories?.color || '#64748b'
                    }}
                  >
                    <DynamicIcon name={tx.categories?.icon} size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm md:text-base text-slate-200 group-hover:text-white transition-colors truncate">{tx.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] md:text-[10px] opacity-40 font-black uppercase tracking-widest bg-slate-800/50 px-1.5 py-0.5 rounded text-white truncate max-w-[80px] md:max-w-none">
                        {tx.categories?.name || 'General'}
                      </span>
                      <span className="text-slate-600 font-bold">•</span>
                      <span className="text-[9px] md:text-[10px] text-slate-500 font-bold">
                        {formatDate(tx.date)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <p className={`font-black text-base md:text-lg tabular-nums ${tx.amount > 0 ? 'text-green-500' : 'text-red-400'
                    }`}>
                    {tx.amount > 0 ? '+' : '-'}{formatAmount(tx.amount)}
                  </p>
                </div>
              </div>
            ))}

            {(!transactions || transactions.length === 0) && (
              <div className="text-center py-24 bg-slate-900/20 rounded-[3rem] border border-dashed border-slate-800/50">
                <div className="bg-slate-800/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HistoryIcon size={24} className="text-slate-600" />
                </div>
                <p className="text-slate-500 font-bold">No hay movimientos en este periodo.</p>
                <p className="text-xs text-slate-600 mt-1">Prueba cambiando los filtros o agrega uno nuevo.</p>
              </div>
            )}
          </div>
        </section>

        <aside className="lg:col-span-1">
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800 p-8 rounded-[3rem] sticky top-8">
            <h3 className="text-[10px] font-black uppercase tracking-widest opacity-30 mb-8 text-center lg:text-left text-white">
              Distribución de Gastos
            </h3>

            <div className="min-h-[260px] flex items-center justify-center relative">
              {chartData.length > 0 ? (
                <>
                  <ExpenseChart data={chartData} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[10px] font-black opacity-20 uppercase">Total</span>
                    <span className="text-lg font-black text-white">{formatCurrency(totalExpense, currency)}</span>
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <div className="bg-slate-800/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <PieChartIcon size={20} className="text-slate-700" />
                  </div>
                  <p className="text-xs opacity-40 font-bold italic">Sin datos para graficar</p>
                </div>
              )}
            </div>

            {chartData.length > 0 && (
              <div className="mt-10 space-y-2">
                {chartData.map((item) => (
                  <div key={item.name} className="flex justify-between items-center text-xs p-3 rounded-2xl hover:bg-white/5 transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full shadow-lg group-hover:scale-125 transition-transform" style={{ backgroundColor: item.fill }} />
                      <span className="text-slate-400 font-bold group-hover:text-slate-200 transition-colors">{item.name}</span>
                    </div>
                    <span className="font-black text-slate-200 tabular-nums">
                      {formatCurrency(item.value, currency)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}