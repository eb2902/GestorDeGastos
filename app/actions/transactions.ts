"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

interface TransactionInput {
  description: string;
  amount: number;
  category_id: string;
  date: string;
}

export async function saveTransaction(data: TransactionInput, id?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Verificación de autorización en el servidor
  if (!user) return { success: false, error: "No autorizado" };

  // VALIDACIONES DE SEGURIDAD (Capa de defensa final)
  // 1. Validar descripción
  if (!data.description || data.description.trim().length === 0) {
    return { success: false, error: "La descripción es obligatoria" };
  }

  // 2. Evitar montos vacíos o en cero
  if (!data.amount || data.amount === 0) {
    return { success: false, error: "El monto debe ser un valor válido distinto de cero" };
  }

  // 3. Validar categoría
  if (!data.category_id) {
    return { success: false, error: "La categoría es obligatoria" };
  }

  // 4. Validar fecha
  if (!data.date || isNaN(Date.parse(data.date))) {
    return { success: false, error: "La fecha no es válida" };
  }

  // 5. Preparar y sanear los datos base
  const transactionData = {
    description: data.description.trim().substring(0, 100), // Limitar longitud de descripción
    amount: parseFloat(data.amount.toFixed(2)), // Asegurar máximo 2 decimales para evitar errores de redondeo
    category_id: data.category_id,
    date: data.date,
  };

  try {
    if (id) {
      // Actualización: solo si la transacción pertenece al usuario autenticado
      const { error } = await supabase
        .from("transactions")
        .update(transactionData)
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;
    } else {
      // Inserción: asignación forzosa del user_id del servidor
      const { error } = await supabase
        .from("transactions")
        .insert([{ ...transactionData, user_id: user.id }]);

      if (error) throw error;
    }

    // Revalidación de rutas para actualizar la UI con los nuevos datos
    revalidatePath("/transactions");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    console.error("Error en saveTransaction:", message);
    return { success: false, error: message };
  }
}

export async function deleteTransaction(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autorizado");

  const { error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id); // Seguridad: solo borrar si es el propietario

  if (error) {
    console.error("Error en deleteTransaction:", error.message);
    throw new Error(error.message);
  }

  revalidatePath("/transactions");
  revalidatePath("/");
}

export async function getUserStats() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { count: 0, total: 0 };

  const { data, error, count } = await supabase
    .from("transactions")
    .select("amount", { count: 'exact' })
    .eq("user_id", user.id);

  if (error) {
    console.error("Error obteniendo estadísticas:", error.message);
    return { count: 0, total: 0 };
  }

  // Cálculo del total acumulado
  const total = data?.reduce((acc, curr) => acc + curr.amount, 0) || 0;

  return {
    count: count || 0,
    total,
  };
}