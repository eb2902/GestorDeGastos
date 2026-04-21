"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import MobileHeader from "./MobileHeader";

interface ResponsiveLayoutProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}

export default function ResponsiveLayout({ sidebar, children }: ResponsiveLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Cerrar el sidebar cuando cambia la ruta
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  // Prevenir scroll cuando el menú está abierto en móvil
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isSidebarOpen]);

  return (
    <div className="flex min-h-screen bg-[#020617]">
      {/* Sidebar para Escritorio (Fijo) */}
      <aside className="hidden lg:block w-64 fixed inset-y-0 left-0 border-r border-slate-800 bg-[#020617] z-40">
        {sidebar}
      </aside>

      {/* Sidebar para Móvil (Overlay) */}
      <div 
        className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
          isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
        
        {/* Sidebar Content */}
        <aside 
          className={`absolute inset-y-0 left-0 w-72 bg-[#020617] border-r border-slate-800 transition-transform duration-300 ease-out transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {sidebar}
        </aside>
      </div>

      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        <MobileHeader 
          isOpen={isSidebarOpen} 
          onOpenSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
