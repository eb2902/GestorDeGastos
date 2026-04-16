"use client";
import { LogOut } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // Refrescamos para que el middleware.ts detecte que no hay sesión
    router.refresh();
    router.push("/login");
  };

  return (
    <button 
      onClick={handleLogout}
      className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all opacity-50 hover:opacity-100 hover:bg-red-500/10 hover:text-red-500 w-full group"
    >
      <LogOut size={20} className="group-hover:scale-110 transition-transform" />
      <span className="font-bold text-sm">Cerrar Sesión</span>
    </button>
  );
}