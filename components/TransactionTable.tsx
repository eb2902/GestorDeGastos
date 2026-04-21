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

import { deleteTransactionAction } from "@/app/actions/transactions";

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
      const result = await deleteTransactionAction(deletingTransactionId);

      if (!result.success) {
        throw new Error(result.error);
      }
      
      toast.success("Transacción eliminada correctamente");
      setDeletingTransactionId(null);
      router.refresh();
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast.error("Error al eliminar la transacción");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] overflow-hidden">
      <table className="w-full text-left border-collapse">
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
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${
                    tx.amount > 0 
                      ? 'bg-green-500/10 text-green-500' // Verde para ingresos
                      : 'bg-slate-800 text-slate-400'    // Gris oscuro para egresos
                  }`}>
                    {tx.amount > 0 ? 'Ingreso' : 'Egreso'}
                  </span>
                </td>
                <td className={`p-6 text-right font-black tabular-nums text-lg ${tx.amount > 0 ? 'text-green-500' : 'text-white'}`}>
                  {tx.amount > 0 ? '+' : ''}
                  {formatCurrency(tx.amount, currency).replace('$', '').replace('AR$', '')}
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
