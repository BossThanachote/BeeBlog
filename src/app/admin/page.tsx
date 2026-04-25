import { createClient } from '@/utils/supabase/server' 
import { redirect } from 'next/navigation'
import AdminDashboardUI from './AdminDashboardUI'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // เช็ค Role 
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  // ถ้าไม่ใช่ Admin ดีดออกทันที
  if (profile?.role !== 'admin') {
    redirect('/')
  }

  // ถ้าผ่านสิทธิ์ ส่ง UI ไปแสดงผล
  return <AdminDashboardUI />
}