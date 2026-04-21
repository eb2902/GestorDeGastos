"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateUserMetadata(data: { full_name?: string; currency?: string }) {
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    data: data,
  });

  if (error) {
    console.error("Error updating user metadata:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/profile");
  return { success: true };
}

export async function deleteAccount() {
  const supabase = await createClient();

  // En Supabase Auth, un usuario no puede borrarse a sí mismo fácilmente via cliente
  // A menos que uses la API de Admin. Pero podemos intentar borrar sus datos
  // Y luego cerrar sesión. Para borrar la cuenta de Auth realmente se requiere Service Role.
  // Por ahora simularemos el borrado de datos o daremos un mensaje.
  
  // Borrar transacciones del usuario
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "No user found" };

  const { error: deleteError } = await supabase
    .from("transactions")
    .delete()
    .eq("user_id", user.id);

  if (deleteError) {
    console.error("Error deleting user data:", deleteError);
    return { success: false, error: deleteError.message };
  }

  // Nota: Para borrar el usuario de auth.users se requiere supabase.auth.admin.deleteUser(user.id)
  // lo cual requiere una Service Role Key. No la tenemos configurada aquí por seguridad.
  
  return { success: true, message: "Datos eliminados correctamente. Para eliminar la cuenta completa contacte a soporte o use el panel de control." };
}
