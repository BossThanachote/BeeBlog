'use client'

import { useState } from 'react'
import { login, signup } from './actions'
import { Mail, Lock, User, Hexagon } from 'lucide-react'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // ฟังก์ชันช่วยจัดการ Form Submit
  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true)
    setErrorMsg('')
    
    const action = isLogin ? login : signup
    const result = await action(formData)
    
    if (result?.error) {
      setErrorMsg(result.error)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* Header Section */}
        <div className="bg-yellow-400 p-8 text-center relative overflow-hidden">
          <Hexagon className="absolute -top-10 -right-10 w-40 h-40 text-yellow-300 opacity-50" />
          <div className="relative z-10">
            <div className="w-16 h-16 bg-black text-yellow-400 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl font-bold shadow-lg">
              B
            </div>
            <h1 className="text-2xl font-bold text-black mb-1">
              {isLogin ? 'ยินดีต้อนรับกลับมา!' : 'ร่วมเป็นส่วนหนึ่งของรังผึ้ง'}
            </h1>
            <p className="text-black/70 text-sm">
              {isLogin ? 'เข้าสู่ระบบเพื่อเขียนและแบ่งปันเรื่องราวของคุณ' : 'สมัครสมาชิก BeeBlog วันนี้ ฟรี!'}
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-8">
          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg">
              {errorMsg}
            </div>
          )}

          <form action={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">ชื่อผู้ใช้งาน</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    name="fullName"
                    type="text" 
                    required={!isLogin}
                    placeholder="เช่น Boss Thanachote"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">อีเมล</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  name="email"
                  type="email" 
                  required
                  placeholder="hello@beeblog.com"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">รหัสผ่าน</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  name="password"
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 focus:ring-4 focus:ring-yellow-400/50 transition-all disabled:opacity-70 flex items-center justify-center gap-2 mt-6"
            >
              {isLoading ? 'กำลังดำเนินการ...' : (isLogin ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก')}
            </button>
          </form>

          {/* Toggle Login/Signup */}
          <div className="mt-8 text-center text-sm text-gray-500">
            {isLogin ? 'ยังไม่มีบัญชีใช่ไหม? ' : 'มีบัญชีอยู่แล้วใช่ไหม? '}
            <button 
              onClick={() => {
                setIsLogin(!isLogin)
                setErrorMsg('')
              }}
              className="font-bold text-yellow-600 hover:text-yellow-700 transition-colors"
            >
              {isLogin ? 'สมัครสมาชิกที่นี่' : 'เข้าสู่ระบบ'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}