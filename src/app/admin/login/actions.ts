'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

function assertSupabaseAuthConfigured() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('Supabase auth is not configured.')
  }
}

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    redirect('/admin/login?error=' + encodeURIComponent('Email and password are required.'))
  }

  assertSupabaseAuthConfigured()
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    // Ideally return state, but for simplicity redirect back with error query
    redirect('/admin/login?error=' + encodeURIComponent(error.message))
  }

  redirect('/admin')
}

export async function logout() {
  assertSupabaseAuthConfigured()

  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}