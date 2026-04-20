"use client";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export default function TransactionSearch() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    function handleSearch(term: string) {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set("query", term);
        } else {
            params.delete("query");
        }

        startTransition(() => {
            router.push(`/transactions?${params.toString()}`);
        });
    }

    return (
        <div className="relative w-full max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
                onChange={(e) => handleSearch(e.target.value)}
                defaultValue={searchParams.get("query")?.toString()}
                placeholder="Buscar por descripción..."
                className="w-full bg-slate-900 border border-slate-800 p-3 pl-12 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm text-white"
            />
            {isPending && <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] uppercase font-black opacity-30">Buscando...</div>}
        </div>
    );
}