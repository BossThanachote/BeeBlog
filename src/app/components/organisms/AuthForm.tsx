'use client'

import { useState } from 'react';
import { Mail, Lock, User } from 'lucide-react';
import { Input } from '../atoms/Input';
import { AuthHeader } from '../molecules/AuthHeader';
import { login, signup } from '@/app/login/actions';

export const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

 const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setErrorMsg('');
    
    const action = isLogin ? login : signup;
    const result = await action(formData);
    
    if (result?.error) {
      setErrorMsg(result.error);
      setIsLoading(false);
    } else if (result?.success) {
      // 🌟 บังคับ Hard Refresh เพื่อล้าง Cache และให้ Navbar ดึงข้อมูลใหม่
      // วิธีนี้จะทำให้สถานะ Login อัปเดตทันที 100% ครับ
      window.location.href = '/'; 
    }
  };
  
  return (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 flex flex-col h-[650px] overflow-hidden">
      
      <AuthHeader isLogin={isLogin} />

      <div className="p-8 flex-1 flex flex-col">
        
        {/* ลบกล่องแจ้งเตือน Error สีแดงตรงนี้ออกไปได้เลยครับ! */}
a
        <form action={handleSubmit} className="space-y-5 flex-1 flex flex-col justify-center">
          
          {!isLogin && (
            <Input 
              label="ชื่อผู้ใช้งาน"
              name="username"
              type="text"
              placeholder="เช่น BeeUser"
              icon={User}
              required={!isLogin}
              // ส่ง Error มาแสดงตรงนี้เฉพาะตอนอยู่หน้า สมัครสมาชิก
              error={!isLogin && errorMsg ? errorMsg : undefined} 
            />
          )}

          <Input 
            label="อีเมล"
            name="email"
            type="email"
            placeholder="hello@beeblog.com"
            icon={Mail}
            required
            // ส่ง Error มาแสดงตรงนี้เฉพาะตอนอยู่หน้า ล็อกอิน
            error={isLogin && errorMsg ? errorMsg : undefined}
          />

          <Input 
            label="รหัสผ่าน"
            name="password"
            type="password"
            placeholder="••••••••"
            icon={Lock}
            required
          />

          <div className="pt-2 shrink-0">
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 focus:ring-4 focus:ring-yellow-400/50 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isLoading ? 'กำลังดำเนินการ...' : (isLogin ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก')}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500 shrink-0">
          {isLogin ? 'ยังไม่มีบัญชีใช่ไหม? ' : 'มีบัญชีอยู่แล้วใช่ไหม? '}
          <button 
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setErrorMsg('');
            }}
            className="font-bold text-yellow-600 hover:text-yellow-700 transition-colors"
          >
            {isLogin ? 'สมัครสมาชิกที่นี่' : 'เข้าสู่ระบบ'}
          </button>
        </div>

      </div>
    </div>
  );
};