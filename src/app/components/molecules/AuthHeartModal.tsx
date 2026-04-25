'use client'
import { LogIn, X, AlertCircle } from 'lucide-react'

interface AuthHeartModalProps {
  isOpen: boolean
  onClose: () => void
}

export const AuthHeartModal = ({ isOpen, onClose }: AuthHeartModalProps) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-red-500">
            <AlertCircle className="w-10 h-10" />
          </div>

          <h3 className="text-2xl font-black text-gray-900 mb-2">
            ต้องเข้าสู่ระบบก่อนครับ 🐝
          </h3>
          <p className="text-gray-500 mb-8 leading-relaxed">
            การกดไลก์บทความจำเป็นต้องระบุตัวตน เพื่อป้องกันการปั๊มยอดและรักษาระบบที่ดีครับ
          </p>

          <div className="flex flex-col gap-3">
            {/* ปุ่มไปหน้า Login */}
            <button
              onClick={() => window.location.href = '/login'}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              เข้าสู่ระบบตอนนี้
            </button>

            <button
              onClick={onClose}
              className="w-full bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold py-3 rounded-2xl transition-all"
            >
              ไว้ทีหลัง
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}