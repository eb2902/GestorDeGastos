import { createClient } from "@/utils/supabase/server";
import TransactionSearch from "@/components/TransactionSearch";
import TransactionTable from "@/components/TransactionTable";
import { formatCurrency } from "@/utils/formatters";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function TransactionsPage({
    searchParams,
}: {
    searchParams: { query?: string };
}) {
    // Manejo de búsqueda para Next.js 15+
    const params = await searchParams;
    const query = params?.query || "";
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    const currency = user?.user_metadata?.currency || "USD";

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
                <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl md:rounded-[2rem]">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-30 mb-1 text-slate-400">Balance Filtrado</p>
                    <h3 className={`text-2xl font-bold tabular-nums ${totalBalance >= 0 ? 'text-white' : 'text-red-400'}`}>
                        {formatCurrency(totalBalance, currency)}
                    </h3>
                </div>

                <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl md:rounded-[2rem]">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-30 mb-1 text-slate-400">Total Gastos</p>
                    <h3 className="text-2xl font-bold tabular-nums text-white">
                        {formatCurrency(Math.abs(totalExpenses), currency)}
                    </h3>
                </div>

                <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl md:rounded-[2rem]">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-30 mb-1 text-slate-400">Total Ingresos</p>
                    <h3 className="text-2xl font-bold tabular-nums text-green-500">
                        {formatCurrency(totalIncomes, currency)}
                    </h3>
                </div>
            </div>

            {/* 3. Tabla (Client Component) */}
            <TransactionTable transactions={transactions || []} currency={currency} />
        </div>
    );
}