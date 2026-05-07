-- ============================================================================
-- Migración: Habilitar Row Level Security (RLS) en tablas principales
-- Fecha: 2026-05-07
-- ============================================================================
-- Esta migración agrega RLS como capa de defensa en profundidad.
-- Anteriormente la seguridad dependía 100% del código del servidor (Server Actions).
-- Con RLS, incluso si alguien hace consultas directas desde el cliente
-- (o si hay un bug en el código), los datos están protegidos a nivel BD.
-- ============================================================================

-- 1. TRANSACTIONS: Habilitar RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Policy SELECT: Solo ver transacciones propias
CREATE POLICY "users_select_own_transactions"
ON transactions
FOR SELECT
USING (auth.uid() = user_id);

-- Policy INSERT: Solo insertar transacciones propias
CREATE POLICY "users_insert_own_transactions"
ON transactions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy UPDATE: Solo actualizar transacciones propias
CREATE POLICY "users_update_own_transactions"
ON transactions
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy DELETE: Solo eliminar transacciones propias
CREATE POLICY "users_delete_own_transactions"
ON transactions
FOR DELETE
USING (auth.uid() = user_id);

-- 2. CATEGORIES: Habilitar RLS (categorías globales/compartidas)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Policy SELECT: Cualquier usuario autenticado puede ver categorías
CREATE POLICY "authenticated_select_categories"
ON categories
FOR SELECT
USING (auth.role() = 'authenticated');

-- Nota: Las categorías son datos de referencia globales.
-- Solo el admin/seed debería insertar/actualizar/eliminar.
-- Para operaciones administrativas se usa service_role.