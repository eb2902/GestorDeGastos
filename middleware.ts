import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  // 1. Create initial response
  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  // 2. Configure Supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value))
          
          res = NextResponse.next({
            request: req,
          })

          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 3. SECURE: Verify user via getUser() instead of just reading the session
  // This validates the token with the Supabase Auth server
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 4. Route Protection Logic
  const url = req.nextUrl.clone()

  // If no user exists and they are trying to access protected root, redirect to login
  if (!user && url.pathname === '/') {
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // If user is logged in and tries to access login page, redirect to home
  if (user && url.pathname === '/login') {
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}