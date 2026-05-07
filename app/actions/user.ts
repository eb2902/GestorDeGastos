"use server";

import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { revalidatePath } from "next/cache";

export async function updateUserMetadata(data: { full_name?: string; currency?: string }) {
  const supabase = await createClient();

  // Validaciones de servidor
  if (data.full_name && data.full_name.trim().length < 3) {
    return { success: false, error: "El nombre debe tener al menos 3 caracteres" };
  }

  if (data.currency && !["USD", "ARS"].includes(data.currency)) {
    return { success: false, error: "Moneda no soportada" };
  }

  const { error } = await supabase.auth.updateUser({
    data: {
      full_name: data.full_name?.trim(),
      currency: data.currency,
    },
  });

  if (error) {
    console.error("Error updating user metadata:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/profile");
  revalidatePath("/"); // Revalidar el home por si se muestra la moneda allí
  return { success: true };
}

export async function deleteAccount() {
  const supabase = await createClient();

  // 1. Obtener el usuario autenticado
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "No user found" };

  const userId = user.id;

  // 2. Eliminar datos del usuario en tablas públicas
  // Usamos el server client normal (con anon key + sesión) porque tiene RLS
  // que permite al usuario eliminar sus propios registros.
  const tablesToClean = ["transactions", "budgets", "profiles", "categories"];

  for (const table of tablesToClean) {
    const { error: deleteError } = await supabase
      .from(table)
      .delete()
      .eq("user_id", userId);

    if (deleteError) {
      console.error(`Error deleting from ${table}:`, deleteError);
      // No retornamos error inmediatamente, seguimos intentando
    }
  }

  // 3. Eliminar la cuenta de auth.users usando el admin client (service_role)
  const adminClient = createAdminClient();
  const { error: adminDeleteError } = await adminClient.auth.admin.deleteUser(userId);

  if (adminDeleteError) {
    console.error("Error deleting auth user:", adminDeleteError);
    return { success: false, error: adminDeleteError.message };
  }

  // 4. Cerrar sesión
  await supabase.auth.signOut();

  // 5. Revalidar rutas
  revalidatePath("/");
  revalidatePath("/profile");

  return { success: true, message: "Cuenta eliminada correctamente." };
}

export async function updatePassword(password: string) {
  const supabase = await createClient();

  if (password.length < 6) {
    return { success: false, error: "La contraseña debe tener al menos 6 caracteres" };
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    console.error("Error updating password:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}