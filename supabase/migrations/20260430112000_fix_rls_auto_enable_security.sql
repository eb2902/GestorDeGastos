-- Corrección de seguridad para la función rls_auto_enable()
-- Esta función estaba expuesta públicamente como SECURITY DEFINER, lo que permitía
-- su ejecución por usuarios no autenticados y autenticados con privilegios elevados.

-- 1. Cambiamos la función a SECURITY INVOKER para que se ejecute con los permisos del usuario que la llama.
ALTER FUNCTION public.rls_auto_enable() SECURITY INVOKER;

-- 2. Revocamos el permiso de ejecución para los roles públicos (anon y authenticated).
-- Esto evita que la función sea invocable a través de la API REST de Supabase.
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM anon;
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM authenticated;

-- 3. (Opcional) Otorgamos permisos explícitos solo al rol de servicio si es necesario para tareas administrativas.
GRANT EXECUTE ON FUNCTION public.rls_auto_enable() TO service_role;
