'use client'

import React from 'react'
import { CheckCircle } from 'lucide-react'

interface SuccessModalProps {
  isOpen: boolean
  title: string
  message: string
  onConfirm: () => void // 🌟 เมื่อกดปุ่มตกลง จะสั่งให้ทำงานต่อไป (เช่น Redirect)
}

export const SuccessModal = ({ isOpen, title, message, onConfirm }: SuccessModalProps) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-sm mx-4 rounded-3xl shadow-2xl border border-gray-100 p-8 animate-in zoom-in-95 duration-200 relative">
        <div className="flex flex-col items-center text-center mt-2">
          
          {/* 🌟 ไอคอนติ๊กถูกสีเขียว (Success Icon) */}
          <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <CheckCircle className="w-10 h-10" />
          </div>
          
          <h3 className="text-2xl font-black text-gray-900 mb-3">{title}</h3>
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            {message}
          </p>
          
          {/* 🌟 ปุ่มตกลง (โทนสีเขียวตาม Design Token) */}
          <button 
            onClick={onConfirm}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 px-6 rounded-xl transition-all active:scale-95 shadow-md hover:shadow-lg"
          >
            กลับสู่หน้าแรก
          </button>
        </div>
      </div>
    </div>
  )
}