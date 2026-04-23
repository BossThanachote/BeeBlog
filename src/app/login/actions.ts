'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

// 🟢 ฟังก์ชันสำหรับเข้าสู่ระบบ (Login)
export async function login(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  return { success: true } 
}

// 🔵 ฟังก์ชันสำหรับสมัครสมาชิก (Signup)
export async function signup(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const username = formData.get('username') as string

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username: username }
    }
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}

// 🔴 ฟังก์ชันสำหรับออกจากระบบ (Logout) ที่หายไป! กลับมาแล้วครับ
export async function logout() {
  const supabase = await createClient()
  
  // สั่งให้ Supabase เคลียร์ Session ฝั่ง Server
  await supabase.auth.signOut()

  // รีเซ็ต Cache หน้าเว็บ แล้วส่ง success กลับไปให้ Navbar จัดการต่อ
  revalidatePath('/', 'layout')
  return { success: true }
}