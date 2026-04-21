"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function saveTransaction(data: any, id?: string) {
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
