'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Session, User } from '@supabase/supabase-js'

// สร้าง Context (กระเป๋ากลาง)
type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    let isMounted = true

    // ดึงข้อมูลครั้งแรกแค่ "ครั้งเดียว"
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (isMounted) {
        setSession(session)
        setUser(session?.user ?? null)
        setIsLoading(false)
      }
    }
    getInitialSession()

    // รอรับ Event เวลาล๊อกอิน/ล๊อกเอาท์
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      if (isMounted) {
        setSession(session)
        setUser(session?.user ?? null)
        setIsLoading(false)
      }
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, []) // ทำงานแค่ครั้งเดียวตอนเปิดเว็บ

  return (
    <AuthContext.Provider value={{ user, session, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

// สร้าง Hook ไว้ให้ Component อื่นเรียกใช้เรียกใช้ง่ายๆ
export const useAuth = () => useContext(AuthContext)