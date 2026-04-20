import { createClient } from "@/utils/supabase/server";
import { DynamicIcon } from "@/components/DynamicIcon";
import TransactionSearch from "@/components/TransactionSearch";

export default async function TransactionsPage({
    searchParams,
}: {
    searchParams: { query?: string };
}) {
    // Manejo de búsqueda para Next.js 15+
    const query = (await searchParams)?.query || "";
    const supabase = await createClient();

    // Consulta a Supabase
    let request = supabase
        .from("transactions")
        .select("*, categories(*)")
        .order("date", { ascending: false });

    if (query) {
        request = request.ilike("description", `%${query}%`);
    }

    const { data: transactions } = await request;

    // 1. Lógica de Cálculos (Server-side)
    const totalBalance = transactions?.reduce((acc, tx) => acc + tx.amount, 0) || 0;
    const totalExpenses = transactions?.filter(tx => tx.amount < 0).reduce((acc, tx) => acc + tx.amount, 0) || 0;
    const totalIncomes = transactions?.filter(tx => tx.amount > 0).reduce((acc, tx) => acc + tx.amount, 0) || 0;

    return (
        <div className="p-8 max-w-6xl mx-auto">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Todas las Transacciones</h1>
                    <p className="text-slate-400 text-sm mt-1">
                        {query
                            ? `Mostrando resultados para "${query}"`
                            : "Historial completo de tus movimientos financieros."}
                    </p>
                </div>
                <div className="w-full md:w-auto">
                    <TransactionSearch />
                </div>
            </header>

            {/* 2. Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-[2rem]">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-30 mb-1 text-slate-400">Balance Filtrado</p>
                    <h3 className={`text-2xl font-bold tabular-nums ${totalBalance >= 0 ? 'text-white' : 'text-red-400'}`}>
                        ${totalBalance.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                    </h3>
                </div>

                <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-[2rem]">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-30 mb-1 text-slate-400">Total Gastos</p>
                    <h3 className="text-2xl font-bold tabular-nums text-white">
                        ${Math.abs(totalExpenses).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                    </h3>
                </div>

                <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-[2rem]">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-30 mb-1 text-slate-400">Total Ingresos</p>
                    <h3 className="text-2xl font-bold tabular-nums text-green-500">
                        ${totalIncomes.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                    </h3>
                </div>
            </div>

            {/* 3. Tabla Mejorada */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-800">
                            <th className="p-6 text-[10px] font-black uppercase tracking-widest opacity-30 text-slate-400">Fecha</th>
                            <th className="p-6 text-[10px] font-black uppercase tracking-widest opacity-30 text-slate-400">Detalle</th>
                            <th className="p-6 text-[10px] font-black uppercase tracking-widest opacity-30 text-slate-400">Tipo</th>
                            <th className="p-6 text-right text-[10px] font-black uppercase tracking-widest opacity-30 text-slate-400">Monto</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions && transactions.length > 0 ? (
                            transactions.map((tx) => (
                                <tr key={tx.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-all group">
                                    <td className="p-6">
                                        <span className="text-sm text-slate-400 font-medium">
                                            {new Date(tx.date).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })}
                                        </span>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="p-2 rounded-xl"
                                                style={{
                                                    backgroundColor: `${tx.categories?.color || '#1e293b'}20`,
                                                    color: tx.categories?.color || '#94a3b8'
                                                }}
                                            >
                                                <DynamicIcon name={tx.categories?.icon} size={16} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-white leading-tight mb-0.5">{tx.description}</span>
                                                <span className="text-[10px] font-black uppercase tracking-tight opacity-40 text-slate-400">{tx.categories?.name}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${tx.amount > 0 ? 'bg-green-500/10 text-green-500' : 'bg-slate-800 text-slate-400'
                                            }`}>
                                            {tx.amount > 0 ? 'Ingreso' : 'Egreso'}
                                        </span>
                                    </td>
                                    <td className={`p-6 text-right font-black tabular-nums text-lg ${tx.amount > 0 ? 'text-green-500' : 'text-white'}`}>
                                        {tx.amount > 0 ? '+' : ''}
                                        {tx.amount.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="p-20 text-center text-slate-500 text-sm">
                                    No se encontraron movimientos.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}