"use client";
import { useRouter, useSearchParams } from 'next/navigation';

export default function TimeFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentRange = searchParams.get('range') || '1M';

    const ranges = [
        { label: '7 Días', value: '7D' },
        { label: 'Este Mes', value: '1M' },
        { label: 'Este Año', value: '1Y' },
    ];

    return (
        <div className="flex bg-slate-900/50 p-1 rounded-2xl border border-slate-800">
            {ranges.map((r) => (
                <button
                    key={r.value}
                    onClick={() => router.push(`/?range=${r.value}`)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${currentRange === r.value
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                            : 'text-slate-400 hover:text-white'
                        }`}
                >
                    {r.label}
                </button>
            ))}
        </div>
    );
}