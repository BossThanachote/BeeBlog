'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

// ฟังก์ชันสำหรับเข้าสู่ระบบ (Login)
export async function login(formData: FormData) {
  const supabase = await createClient()
  
  // Login ใช้แค่อีเมลและรหัสผ่านเท่านั้นครับ
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  // ล้าง Cache หน้าเว็บและเด้งไปหน้าแรก
  revalidatePath('/', 'layout')
  redirect('/')
}

// ฟังก์ชันสำหรับสมัครสมาชิก (Signup)
export async function signup(formData: FormData) {
  const supabase = await createClient()
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const username = formData.get('username') as string // รับค่า username แทน

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username: username, // ส่ง username ไปให้ Database Trigger ทำงาน
      }
    }
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/') 
}

// ฟังก์ชันสำหรับออกจากระบบ (Logout)
export async function logout() {
  const supabase = await createClient()
  
  // สั่งให้ Supabase เคลียร์ Session ออกจากระบบ
  await supabase.auth.signOut()

  // รีเซ็ต Cache หน้าเว็บ และเด้งกลับไปหน้า Login
  revalidatePath('/', 'layout')
  redirect('/login')
}