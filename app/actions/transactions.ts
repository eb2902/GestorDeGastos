"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export interface TransactionData {
  user_id: string;
  description: string;
  amount: number;
  category_id: string;
  date: string;
}

export async function saveTransaction(data: TransactionData, id?: string) {
  const supabase = await createClient();

  let error;
  if (id) {
    const { error: updateError } = await supabase
      .from("transactions")
      .update(data)
      .eq("id", id);
    error = updateError;
  } else {
    const { error: insertError } = await supabase
      .from("transactions")
      .insert(data);
    error = insertError;
  }

  if (error) {
    console.error("Error saving transaction:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/transactions");
  revalidatePath("/"); // Also refresh dashboard
  return { success: true };
}

export async function deleteTransactionAction(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting transaction:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/transactions");
  revalidatePath("/");
  return { success: true };
}

export async function getUserStats() {
  const supabase = await createClient();
  
  const { count, error } = await supabase
    .from("transactions")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("Error fetching user stats:", error);
    return { count: 0 };
  }

  return { count: count || 0 };
}
