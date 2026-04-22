import { createBrowserClient } from '@supabase/ssr';

/* ฟังก์ชันสำหรับสร้าง Supabase Client 
  เพื่อนำไปเรียกใช้งานในฝั่ง Client Components 
*/
export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );