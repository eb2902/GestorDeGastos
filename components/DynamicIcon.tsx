"use client";
import * as LucideIcons from "lucide-react";
import { LucideProps, LucideIcon } from "lucide-react";

// 1. Creamos un tipo que mapea solo los componentes válidos de Lucide
type IconModule = Record<string, LucideIcon | unknown>;
const icons = LucideIcons as unknown as IconModule;

interface DynamicIconProps extends Omit<LucideProps, "ref" | "name"> {
  name?: string | null;
}

export const DynamicIcon = ({ name, ...props }: DynamicIconProps) => {
  // Caso base: si no hay nombre, usamos el icono de ayuda
  if (!name) {
    return <LucideIcons.HelpCircle {...props} />;
  }

  // 2. Normalización de nombres:
  // "gamepad-2" -> "Gamepad2"
  // "trending-up" -> "TrendingUp"
  // "utensils" -> "Utensils"
  const formattedName = name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
  
  // 3. Intento de recuperación del componente
  // Buscamos primero la versión formateada y luego la original
  const MaybeIcon = (icons[formattedName] || icons[name]) as LucideIcon | undefined;

  // 4. Verificación final
  // Validamos que exista y que tenga la estructura de un componente (objeto o función)
  if (!MaybeIcon || (typeof MaybeIcon !== 'function' && typeof MaybeIcon !== 'object')) {
    console.warn(`Icono no encontrado: "${name}" (intentado como "${formattedName}")`);
    return <LucideIcons.HelpCircle {...props} />;
  }

  const IconComponent = MaybeIcon;

  return <IconComponent {...props} />;
};