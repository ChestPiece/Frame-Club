'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    // If running locally without Supabase setup, just simulate success for dev
    console.log("No Supabase URL found. Simulating login for dev.")
    redirect('/admin')
  }

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
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    redirect('/admin/login')
  }
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}