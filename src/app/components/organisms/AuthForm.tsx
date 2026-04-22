'use client'

import { useState } from 'react';
import { Mail, Lock, User } from 'lucide-react';
import { Input } from '@/app/components/atoms/Input';
import { AuthHeader } from '@/app/components/molecules/AuthHeader';
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
    }
  };

  return (
    /* กำหนด h-[650px] เพื่อให้กล่องมีความสูงเท่ากันเสมอ ไม่ว่าจะอยู่หน้า Login หรือ Signup */
    <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 flex flex-col h-[650px] overflow-hidden">
      
      <AuthHeader isLogin={isLogin} />

      {/* ใช้ flex-1 และ flex-col เพื่อกระจายพื้นที่ให้พอดีกับความสูงที่กำหนดไว้ */}
      <div className="p-8 flex-1 flex flex-col">
        
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg shrink-0">
            {errorMsg}
          </div>
        )}

        <form action={handleSubmit} className="space-y-5 flex-1 flex flex-col justify-center">
          {/* ช่องกรอกชื่อ: ใช้การซ่อน/แสดง แต่ไม่ทำให้ Layout พัง เพราะกล่องหลักถูกล็อคความสูงไว้แล้ว */}
          {!isLogin && (
            <Input 
              label="ชื่อผู้ใช้งาน"
              name="fullName"
              type="text"
              placeholder="เช่น Boss Thanachote"
              icon={User}
              required={!isLogin}
            />
          )}

          <Input 
            label="อีเมล"
            name="email"
            type="email"
            placeholder="hello@beeblog.com"
            icon={Mail}
            required
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