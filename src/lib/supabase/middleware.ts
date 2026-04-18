import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { getConfiguredAdminEmail, isUserAdmin } from '@/lib/auth/admin'

export async function updateSession(request: NextRequest) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    if (request.nextUrl.pathname.startsWith('/admin')) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      url.searchParams.set('error', 'Supabase auth is not configured.')
      return NextResponse.redirect(url)
    }

    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname
  const isAdminLoginPath = pathname === '/admin/login' || pathname.startsWith('/admin/login/')
  const isAdminProtectedPath = pathname.startsWith('/admin') && !isAdminLoginPath

  const adminEmail = getConfiguredAdminEmail()

  if (isAdminProtectedPath) {
    if (!adminEmail) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      url.searchParams.set('error', 'admin_not_configured')
      return NextResponse.redirect(url)
    }

    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }

    if (adminEmail) {
      if (!isUserAdmin(user.email)) {
        const url = request.nextUrl.clone()
        url.pathname = '/admin/login'
        url.searchParams.set('error', 'forbidden')
        return NextResponse.redirect(url)
      }
    }
  }

  if (isAdminLoginPath && user) {
    if (adminEmail && isUserAdmin(user.email)) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}