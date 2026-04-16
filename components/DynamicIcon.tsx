"use client";
import * as LucideIcons from "lucide-react";
import { LucideProps } from "lucide-react";

interface DynamicIconProps extends Omit<LucideProps, "name"> {
  name?: string | null; // Permitimos null por si viene así de Supabase
}

export const DynamicIcon = ({ name, ...props }: DynamicIconProps) => {
  // 1. Si no hay nombre, icono de ayuda por defecto
  if (!name) {
    return <LucideIcons.HelpCircle {...props} />;
  }

  // 2. Transformación segura (ej: "home" -> "Home")
  const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
  
  // 3. Buscamos el componente en el objeto de iconos
  const IconComponent = (LucideIcons as any)[formattedName];

  // 4. Fallback si el nombre no existe en la librería
  if (!IconComponent) {
    return <LucideIcons.HelpCircle {...props} />;
  }

  return <IconComponent {...props} />;
};