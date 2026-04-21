"use client";

import { useState } from "react";
import { Trash2, AlertTriangle, X } from "lucide-react";
import { deleteAccount } from "@/app/actions/user";
import { useRouter } from "next/navigation";

export default function DeleteAccountButton() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    const result = await deleteAccount();
    if (result.success) {
      alert(result.message || "Tus datos han sido eliminados.");
      // Forzamos cierre de sesión o redirigimos
      router.push("/login");
    } else {
      alert("Error al eliminar cuenta: " + result.error);
    }
    setLoading(false);
  };

  if (!showConfirm) {
    return (
      <button 
        onClick={() => setShowConfirm(true)}
        className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-6 py-3 rounded-2xl font-bold transition-all text-sm border border-red-500/20 flex items-center gap-2"
      >
        <Trash2 size={16} /> Eliminar mi cuenta definitivamente
      </button>
    );
  }

  return (
    <div className="bg-slate-900 border border-red-500/50 p-6 rounded-3xl space-y-4 animate-in zoom-in-95 duration-200">
      <div className="flex items-start gap-4">
        <div className="bg-red-500/20 p-2 rounded-xl text-red-500">
          <AlertTriangle size={24} />
        </div>
        <div>
          <h4 className="font-bold text-white text-lg">¿Estás absolutamente seguro?</h4>
          <p className="text-sm text-slate-400 mt-1">
            Esta acción eliminará todas tus transacciones. No se puede deshacer.
          </p>
        </div>
      </div>
      
      <div className="flex gap-3 pt-2">
        <button
          onClick={handleDelete}
          disabled={loading}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold transition-all text-sm"
        >
          {loading ? "Eliminando..." : "Sí, eliminar todo"}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl font-bold transition-all text-sm flex items-center justify-center gap-2"
        >
          <X size={16} /> Cancelar
        </button>
      </div>
    </div>
  );
}
