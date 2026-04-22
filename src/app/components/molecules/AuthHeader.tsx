import React from 'react';
import { LucideIcon } from 'lucide-react';

interface AuthHeaderProps {
  isLogin: boolean;
}

export const AuthHeader = ({ isLogin }: AuthHeaderProps) => {
  return (
    <div className="bg-yellow-400 p-8 text-center relative overflow-hidden shrink-0">
      <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-300 rounded-full -mr-16 -mt-16 opacity-50 blur-2xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-500 rounded-full -ml-12 -mb-12 opacity-30 blur-xl" />
      
      <div className="relative z-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-sm mb-4">
          <span className="text-3xl">🐝</span>
        </div>
        <h2 className="text-3xl font-black text-black mb-2">
          {isLogin ? 'ยินดีต้อนรับกลับมา!' : 'เริ่มต้นใช้งานฟรี!'}
        </h2>
        <p className="text-yellow-900 font-medium">
          {isLogin 
            ? 'เข้าสู่ระบบเพื่อจัดการบล็อกของคุณ' 
            : 'สร้างบัญชีเพื่อเริ่มเขียนบล็อกวันนี้'}
        </p>
      </div>
    </div>
  );
};