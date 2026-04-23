'use client'

import React from 'react'
import { AlertCircle, X } from 'lucide-react'

interface AlertModalProps {
  isOpen: boolean
  title: string
  message: string
  onClose: () => void
}

export const AlertModal = ({ isOpen, title, message, onClose }: AlertModalProps) => {
  if (!isOpen) return null

  return (
    // 🌟 พื้นหลังดำโปร่งแสง + เบลอ (Backdrop)
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-200">
      
      {/* 🌟 กล่องข้อความ (Design Token: ขอบมน โทนสว่าง) */}
      <div className="bg-white w-full max-w-sm mx-4 rounded-3xl shadow-2xl border border-gray-100 p-6 animate-in zoom-in-95 duration-200 relative">
        
        {/* ปุ่มกากบาทปิด (มุมขวาบน) */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center mt-4">
          {/* ไอคอนแจ้งเตือน */}
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          
          {/* หัวข้อและเนื้อหา */}
          <h3 className="text-xl font-black text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-500 text-lg leading-relaxed mb-8">
            {message}
          </p>
          
          {/* ปุ่มตกลง (Design Token: BeeBlog Yellow) */}
          <button 
            onClick={onClose}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-xl transition-all active:scale-95 shadow-sm"
          >
            ok
          </button>
        </div>
      </div>

    </div>
  )
}