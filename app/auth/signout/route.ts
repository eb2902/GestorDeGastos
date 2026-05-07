import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST() {
    const supabase = await createClient();

    try {
        // Cerrar sesión en Supabase (invalida tokens y limpia cookies)
        await supabase.auth.signOut();

        // Responder con éxito y forzar limpieza de cookies de sesión
        const response = NextResponse.json({ success: true });
        
        // Forzar expiración de cookies de Supabase por si signOut() no las limpia
        response.cookies.set('sb-opxrlfqswsavhbnvraal-auth-token', '', {
            maxAge: 0,
            path: '/',
        });
        response.cookies.set('sb-opxrlfqswsavhbnvraal-auth-token-code-verifier', '', {
            maxAge: 0,
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        return NextResponse.json(
            { success: false, error: 'Error al cerrar sesión' },
            { status: 500 }
        );
    }
}
