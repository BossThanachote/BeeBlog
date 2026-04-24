import { createClient } from '@/utils/supabase/server' // 🌟 ใช้ Server Client
import { redirect } from 'next/navigation'
import AdminDashboardUI from './AdminDashboardUI'

export default async function AdminPage() {
  // 🌟 เติม await หน้า createClient() ครับ
  const supabase = await createClient() 
  
  // 1. ดึง User ปัจจุบัน
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // 2. เช็ค Role จาก Database
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  // 3. ถ้าไม่ใช่ Admin ดีดออกทันที
  if (profile?.role !== 'admin') {
    redirect('/')
  }

  // 4. ถ้าผ่านสิทธิ์ ส่ง UI ไปแสดงผล
  return <AdminDashboardUI />
}