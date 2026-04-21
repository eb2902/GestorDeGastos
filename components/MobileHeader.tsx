"use client";
import { Menu, X, Wallet } from "lucide-react";

interface MobileHeaderProps {
  onOpenSidebar: () => void;
  isOpen: boolean;
}

export default function MobileHeader({ onOpenSidebar, isOpen }: MobileHeaderProps) {
  return (
    <header className="lg:hidden flex items-center justify-between p-4 bg-[#020617] border-b border-slate-800 sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/20">
          <Wallet className="text-white" size={20} />
        </div>
        <span className="font-black text-xl tracking-tighter text-white">
          Finanz<span className="text-blue-500">App</span>
        </span>
      </div>
      
      <button 
        onClick={onOpenSidebar}
        className="p-2 text-slate-400 hover:text-white transition-colors"
        aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
    </header>
  );
}
