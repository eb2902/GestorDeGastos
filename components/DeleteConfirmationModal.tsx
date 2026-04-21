"use client";
import { AlertTriangle, X } from "lucide-react";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  isLoading?: boolean;
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "¿Estás seguro?",
  description = "Esta acción no se puede deshacer. El registro se eliminará permanentemente.",
  isLoading = false
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="bg-[#0f172a] border border-slate-800 w-full max-w-sm rounded-[2rem] shadow-2xl animate-in zoom-in-95 duration-300 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-red-500/10 rounded-2xl text-red-500">
              <AlertTriangle size={24} />
            </div>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-slate-800 rounded-full opacity-50 hover:opacity-100 transition-all text-white"
            >
              <X size={20} />
            </button>
          </div>

          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <p className="text-sm text-slate-400 leading-relaxed mb-8">
            {description}
          </p>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl font-bold text-sm text-slate-400 hover:bg-slate-800 transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm text-white transition-all ${
                isLoading 
                  ? 'bg-slate-800 opacity-50 cursor-not-allowed' 
                  : 'bg-red-600 hover:bg-red-700 shadow-lg shadow-red-500/20 active:scale-95'
              }`}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
              ) : "Eliminar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
