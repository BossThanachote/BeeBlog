import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server'; // ใช้ของฝั่ง Server

export default async function WriteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  
  // 🌟 ดึงข้อมูล User ฝั่ง Server
  const { data: { user } } = await supabase.auth.getUser();

  // 🌟 ถ้าไม่มี User (ไม่ได้ Login) ให้เตะกลับไปหน้า Login ทันที!
  if (!user) {
    redirect('/login');
  }

  // ถ้า Login แล้ว ก็อนุญาตให้แสดงหน้าเขียน Blog ได้ปกติ
  return <>{children}</>;
}