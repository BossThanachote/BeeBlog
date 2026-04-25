'use client'

import { useEffect } from 'react';
import { X, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

export const AuthModal = ({
  isOpen,
  onClose,
  title = "ต้องเข้าสู่ระบบก่อน",
  message = "กรุณาเข้าสู่ระบบหรือสมัครสมาชิกก่อน เพื่อเริ่มเขียนและแบ่งปันเรื่องราวของคุณบน BeeBlog 🐝"
}: AuthModalProps) => {
  const router = useRouter();

  // ป้องกันหน้าเว็บ Scroll ตอนเปิด Modal
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* พื้นหลังเบลอ */}
      <div
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* กล่อง Modal */}
      <div className="relative bg-white rounded-[2rem] w-full max-w-sm overflow-hidden shadow-2xl border border-gray-100 p-8 animate-in zoom-in-95 duration-200">

        {/* ปุ่มกากบาทปิด */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center mt-2">
          {/* ไอคอนแม่กุญแจ */}
          <div className="w-16 h-16 bg-yellow-50 text-yellow-600 rounded-2xl flex items-center justify-center mb-6">
            <Lock className="w-8 h-8" />
          </div>

          <h3 className="text-2xl font-black text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-500 leading-relaxed mb-8">
            {message}
          </p>

          {/* ปุ่ม Action 2 ปุ่ม */}
          <div className="flex flex-col w-full gap-3">
            <button
              onClick={() => {
                onClose();
                router.push('/login');
              }}
              className="w-full py-3.5 bg-black text-white font-bold rounded-2xl hover:bg-gray-800 transition-all active:scale-95 shadow-md"
            >
              ไปหน้าเข้าสู่ระบบ
            </button>
            <button
              onClick={onClose}
              className="w-full py-3.5 text-gray-500 font-bold rounded-2xl hover:bg-gray-50 transition-colors"
            >
              ยกเลิก
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};