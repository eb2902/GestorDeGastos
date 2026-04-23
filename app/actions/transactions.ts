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
  if (!user) return { success: false, error: "No autorizado" };

  // Preparar los datos base (sin user_id en la actualización)
  const transactionData = {
    description: data.description,
    amount: data.amount,
    category_id: data.category_id,
    date: data.date,
  };

  try {
    if (id) {
      // Actualización: no incluimos user_id (es redundante y nunca debe cambiar)
      const { error } = await supabase
        .from("transactions")
        .update(transactionData)
        .eq("id", id)
        .eq("user_id", user.id); // Seguridad extra: solo si pertenece al usuario
      if (error) throw error;
    } else {
      // Inserción: agregamos user_id solo aquí
      const { error } = await supabase
        .from("transactions")
        .insert([{ ...transactionData, user_id: user.id }]);
      if (error) throw error;
    }

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
    .eq("user_id", user.id);

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

  const total = data?.reduce((acc, curr) => acc + curr.amount, 0) || 0;

  return {
    count: count || 0,
    total,
  };
}