"use client";
import { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { DynamicIcon } from "./DynamicIcon";
import AddTransactionModal from "./AddTransactionModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { formatCurrency } from "@/utils/formatters";

interface Category {
  id: string;
  name: string;
  icon: string;
  color?: string;
}

interface Transaction {
  id: string;
  description: string;
  amount: number;
  category_id: string;
  date: string;
  categories?: Category;
}

interface TransactionTableProps {
  transactions: Transaction[];
  currency?: string;
}

import { deleteTransaction } from "@/app/actions/transactions";

export default function TransactionTable({ transactions, currency = "USD" }: TransactionTableProps) {
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deletingTransactionId, setDeletingTransactionId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("query");

  // Notificación de búsqueda sin resultados
  useEffect(() => {
    if (query && transactions.length === 0) {
      toast.info(`Sin resultados para "${query}"`, {
        description: "Intenta con otros términos de búsqueda.",
        duration: 4000,
      });
    }
  }, [query, transactions.length]);

  const handleDelete = async () => {
    if (!deletingTransactionId) return;

    setIsDeleting(true);
    try {
      await deleteTransaction(deletingTransactionId); // Elimina la transacción

      toast.success("Transacción eliminada correctamente");
      setDeletingTransactionId(null);
      router.refresh(); // Recarga la página para actualizar la lista
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast.error("Error al eliminar la transacción");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-transparent lg:bg-slate-900/40 lg:border lg:border-slate-800 lg:rounded-[2.5rem] overflow-hidden">
      {/* Desktop Table */}
      <table className="hidden lg:table w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-800">
            <th className="p-6 text-[10px] font-black uppercase tracking-widest opacity-30 text-slate-400">Fecha</th>
            <th className="p-6 text-[10px] font-black uppercase tracking-widest opacity-30 text-slate-400">Detalle</th>
            <th className="p-6 text-[10px] font-black uppercase tracking-widest opacity-30 text-slate-400">Tipo</th>
            <th className="p-6 text-right text-[10px] font-black uppercase tracking-widest opacity-30 text-slate-400">Monto</th>
            <th className="p-6 text-right text-[10px] font-black uppercase tracking-widest opacity-30 text-slate-400">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length > 0 ? (
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
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${tx.amount > 0
                    ? 'bg-green-500/10 text-green-500'
                    : 'bg-slate-800 text-slate-400'
                    }`}>
                    {tx.amount > 0 ? 'Ingreso' : 'Egreso'}
                  </span>
                </td>
                <td className={`p-6 text-right font-black tabular-nums text-lg ${tx.amount > 0 ? 'text-green-500' : 'text-white'}`}>
                  {tx.amount > 0 ? '+' : ''}
                  {formatCurrency(tx.amount, currency).replace(/\$/g, '').replace(/AR\$/g, '')}
                </td>
                <td className="p-6 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setEditingTransaction(tx)}
                      className="p-2 hover:bg-blue-500/10 text-slate-400 hover:text-blue-500 rounded-lg transition-all"
                      title="Editar"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => setDeletingTransactionId(tx.id)}
                      className="p-2 hover:bg-red-500/10 text-slate-400 hover:text-red-500 rounded-lg transition-all"
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="p-20 text-center text-slate-500 text-sm">
                No se encontraron movimientos.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Mobile List */}
      <div className="lg:hidden space-y-4">
        {transactions.length > 0 ? (
          transactions.map((tx) => (
            <div key={tx.id} className="bg-slate-900/40 border border-slate-800 p-5 rounded-[2rem] space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div
                    className="p-2.5 rounded-xl"
                    style={{
                      backgroundColor: `${tx.categories?.color || '#1e293b'}20`,
                      color: tx.categories?.color || '#94a3b8'
                    }}
                  >
                    <DynamicIcon name={tx.categories?.icon} size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white leading-tight">{tx.description}</h4>
                    <p className="text-[10px] font-black uppercase tracking-tight opacity-40 text-slate-400">{tx.categories?.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-black text-xl tabular-nums ${tx.amount > 0 ? 'text-green-500' : 'text-white'}`}>
                    {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount, currency)}
                  </p>
                  <p className="text-[10px] text-slate-500 font-bold mt-1">
                    {new Date(tx.date).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-800/50">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${tx.amount > 0
                  ? 'bg-green-500/10 text-green-500'
                  : 'bg-slate-800 text-slate-400'
                  }`}>
                  {tx.amount > 0 ? 'Ingreso' : 'Egreso'}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingTransaction(tx)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-500 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                  >
                    <Pencil size={14} /> Editar
                  </button>
                  <button
                    onClick={() => setDeletingTransactionId(tx.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                  >
                    <Trash2 size={14} /> Borrar
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-10 text-center text-slate-500 text-sm bg-slate-900/20 rounded-[2rem] border border-dashed border-slate-800">
            No se encontraron movimientos.
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <AddTransactionModal
        transactionToEdit={editingTransaction}
        isOpen={!!editingTransaction}
        onClose={() => setEditingTransaction(null)}
        showTrigger={false}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmationModal
        isOpen={!!deletingTransactionId}
        onClose={() => setDeletingTransactionId(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
