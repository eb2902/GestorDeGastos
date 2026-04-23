// components/LogoutButton.tsx (o donde lo tengas)
"use client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    if (isLoading) return; // Evita múltiples clics
    setIsLoading(true);

    try {
      const response = await fetch("/auth/signout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        // Redirige al login después de cerrar sesión
        router.push("/login");
      } else {
        console.error("Error del servidor:", data.error);
        // Podrías mostrar un toast o notificación aquí
      }
    } catch (error) {
      console.error("Error de red:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all opacity-50 hover:opacity-100 hover:bg-red-500/10 hover:text-red-500 w-full group disabled:opacity-30 disabled:cursor-not-allowed"
    >
      <LogOut
        size={20}
        className={`group-hover:scale-110 transition-transform ${isLoading ? "animate-pulse" : ""
          }`}
      />
      <span className="font-bold text-sm">
        {isLoading ? "Cerrando..." : "Cerrar Sesión"}
      </span>
    </button>
  );
}