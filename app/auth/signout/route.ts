// app/auth/signout/route.ts
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST() {
    // ✅ IMPORTANTE: crear el cliente con await
    const supabase = await createClient();

    try {
        // Verificar si hay sesión
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
            // Cerrar sesión en Supabase (invalida cookies)
            await supabase.auth.signOut();
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        return NextResponse.json(
            { success: false, error: 'Error al cerrar sesión' },
            { status: 500 }
        );
    }
}