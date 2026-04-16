import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  // 1. Creamos una respuesta inicial
  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  // 2. Configuramos el cliente de Supabase
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Actualizamos las cookies en la petición original para que 
          // los componentes que lean de 'req' vean los cambios inmediatamente
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value))
          
          // Sincronizamos la respuesta con la petición actualizada
          res = NextResponse.next({
            request: req,
          })

          // Escribimos las cookies en la respuesta final para el navegador
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 3. Obtenemos la sesión (esto dispara setAll si es necesario refrescar el token)
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // 4. Lógica de protección de rutas
  const url = req.nextUrl.clone()

  // Si no hay sesión y va a la raíz, al login
  if (!session && url.pathname === '/') {
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Si hay sesión e intenta ir al login, al home
  if (session && url.pathname === '/login') {
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return res
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}