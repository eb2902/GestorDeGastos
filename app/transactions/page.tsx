import { createClient } from "@/utils/supabase/server";
import { DynamicIcon } from "@/components/DynamicIcon";
import TransactionSearch from "@/components/TransactionSearch";

export default async function TransactionsPage({
    searchParams,
}: {
    searchParams: { query?: string };
}) {
    // En Next.js 15+, searchParams debe ser awaited si se accede de forma asíncrona
    // Para versiones anteriores o compatibilidad simple:
    const query = (await searchParams)?.query || "";
    const supabase = await createClient();

    // Iniciamos la base de la consulta
    let request = supabase
        .from("transactions")
        .select("*, categories(*)")
        .order("date", { ascending: false });

    // Aplicamos el filtro si existe un término de búsqueda
    if (query) {
        request = request.ilike("description", `%${query}%`);
    }

    const { data: transactions } = await request;

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Todas las Transacciones</h1>
                    <p className="text-slate-400 text-sm mt-1">
                        {query
                            ? `Resultados para "${query}"`
                            : "Historial completo de tus movimientos financieros."}
                    </p>
                </div>
                {/* Componente de búsqueda */}
                <div className="w-full md:w-auto">
                    <TransactionSearch />
                </div>
            </header>

            <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-800">
                            <th className="p-6 text-[10px] font-black uppercase tracking-widest opacity-30">Fecha</th>
                            <th className="p-6 text-[10px] font-black uppercase tracking-widest opacity-30">Categoría</th>
                            <th className="p-6 text-[10px] font-black uppercase tracking-widest opacity-30">Descripción</th>
                            <th className="p-6 text-right text-[10px] font-black uppercase tracking-widest opacity-30">Monto</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions && transactions.length > 0 ? (
                            transactions.map((tx) => (
                                <tr key={tx.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors group">
                                    <td className="p-6 text-sm text-slate-400">
                                        {new Date(tx.date).toLocaleDateString()}
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="p-2 rounded-lg"
                                                style={{
                                                    backgroundColor: `${tx.categories?.color}15`,
                                                    color: tx.categories?.color
                                                }}
                                            >
                                                <DynamicIcon name={tx.categories?.icon} size={16} />
                                            </div>
                                            <span className="text-sm font-medium text-white">{tx.categories?.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-6 text-sm font-bold text-slate-200">
                                        {tx.description}
                                    </td>
                                    <td className={`p-6 text-right font-black tabular-nums ${tx.amount > 0 ? 'text-green-500' : 'text-white'}`}>
                                        {tx.amount > 0 ? '+' : ''}
                                        {tx.amount.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="p-20 text-center text-slate-500 text-sm">
                                    No se encontraron transacciones que coincidan con la búsqueda.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}