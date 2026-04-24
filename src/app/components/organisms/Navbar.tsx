'use client'

import { useState, useRef, useEffect } from 'react'
import { Menu, Search, PenSquare, Bell, LogOut, Settings, HelpCircle, X, LogIn } from 'lucide-react'
import { logout } from '@/app/login/actions'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { AuthModal } from '@/app/components/molecules/AuthModal'
import { useAuth } from '@/app/providers/AuthProvider'

interface NavbarProps {
  onToggleSidebar?: () => void
}

interface UserProfile {
  id: string
  email: string
  username: string
  avatar_url: string | null
  bio: string | null
  about_me: string | null
  pronouns: string | null
  role: string | null
  created_at: string
}

const maskEmail = (email: string) => {
  if (!email) return ''
  const [name, domain] = email.split('@')
  if (!domain) return email
  if (name.length <= 2) return `${name}***@${domain}`
  const visiblePart = name.substring(0, 2)
  const maskedPart = '*'.repeat(name.length - 2)
  return `${visiblePart}${maskedPart}@${domain}`
}

export const Navbar = ({ onToggleSidebar }: NavbarProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient() 

  const { user, isLoading: isAuthLoading } = useAuth()
  const isAuthenticated = !!user
  const userEmail = user?.email || ''

  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false)
  
  const [userName, setUserName] = useState<string>('ผู้ใช้งาน BeeBlog')
  // 🌟 1. เพิ่ม State สำหรับเก็บ URL รูปภาพ
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null) 
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')

  const dropdownRef = useRef<HTMLDivElement>(null)
  const mobileSearchRef = useRef<HTMLDivElement>(null)

  // ── Fetch User Data ─────────────────────────────────────
  useEffect(() => {
    let isMounted = true

    const fetchUserData = async () => {
      if (!user?.id) {
        if (isMounted) {
          setUserName('')
          setAvatarUrl(null)
        }
        return
      }

      // 🌟 2. สั่งให้ดึง avatar_url มาพร้อมกับ username เลย
      const { data, error } = await supabase
        .from('users')
        .select('username, avatar_url') 
        .eq('id', user.id)
        .single()

      if (isMounted && data) {
        setUserName(data.username || 'ผู้ใช้งาน BeeBlog')
        setAvatarUrl(data.avatar_url) // 🌟 3. เก็บ URL ลง State
      } else if (error) {
        console.error("Error fetching user data:", error)
      }
    }

    fetchUserData()

    const handleProfileUpdate = () => {
      fetchUserData()
    }

    // 🌟 3. ติดตั้งหูฟัง รอรับ Event ชื่อ 'profileUpdated'
    window.addEventListener('profileUpdated', handleProfileUpdate)

    return () => {
      isMounted = false
      // 🌟 4. ถอดหูฟังออกเมื่อ Navbar ถูกทำลายทิ้ง (กันบัคความจำรั่วไหล)
      window.removeEventListener('profileUpdated', handleProfileUpdate)
    }
  }, [user?.id, supabase])

  // ── Click outside ─────────────────────────────────────
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target as Node)) {
        setIsMobileSearchOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // ── Handlers ──────────────────────────────────────────
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/?search=${encodeURIComponent(searchTerm.trim())}`)
      setIsMobileSearchOpen(false)
    } else {
      router.push('/')
    }
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      if (typeof logout === 'function') await logout()
      setIsProfileOpen(false)
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Logout Error:', error)
    }
  }

  const handleWriteClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault()
      setIsWriteModalOpen(true)
    }
  }

  // ── Render ────────────────────────────────────────────
  return (
    <>
      <nav className="fixed top-0 w-full h-16 bg-white border-b border-gray-100 px-4 flex items-center justify-between z-50">

        {/* Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 hover:bg-yellow-50 rounded-full transition-colors text-gray-900 cursor-pointer"
          >
            <Menu className="w-6 h-6" />
          </button>
          <Link href="/" className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center font-bold text-black shadow-sm">
              B
            </div>
            <span className="text-xl font-bold tracking-tight hidden text-gray-900 sm:block">BeeBlog</span>
          </Link>
        </div>

        {/* Search (Desktop) */}
        <div className="flex-1 max-w-xl mx-8 hidden md:block">
          <form onSubmit={handleSearchSubmit} className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-yellow-600" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหาหัวข้อ Blog..."
              className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent rounded-2xl py-2 pl-10 pr-4 transition-all outline-none"
            />
          </form>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4">

          <button
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            className="p-2 text-gray-600 hover:bg-yellow-50 rounded-full md:hidden transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>

          <Link
            href="/write"
            onClick={handleWriteClick}
            className="p-2 text-gray-600 hover:bg-yellow-50 hover:text-yellow-700 rounded-full transition-all flex items-center gap-2 cursor-pointer"
          >
            <PenSquare className="w-5 h-5" />
            <span className="hidden lg:block font-medium text-sm">เขียน Blog</span>
          </Link>

          {isAuthLoading ? (
            <div className="w-20 h-9 bg-gray-100 animate-pulse rounded-full ml-2" />
          ) : isAuthenticated ? (
            <>
              <button className="p-2 text-gray-600 hover:bg-yellow-50 hover:text-yellow-700 rounded-full relative cursor-pointer hidden sm:block">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
              </button>

              <div className="relative ml-1 sm:ml-2" ref={dropdownRef}>
                <div
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="w-9 h-9 bg-gray-100 rounded-full overflow-hidden border-2 border-yellow-400 cursor-pointer hover:scale-105 transition-transform"
                >
                  {/* 🌟 4. ใช้ avatarUrl ถ้าไม่มีค่อยใช้รูป Dicebear สำรอง (เพิ่ม object-cover กันรูปเบี้ยว) */}
                  <img 
                    src={avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userEmail}`} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-gray-50 flex items-center gap-3 bg-gray-50/50">
                      <div className="w-10 h-10 bg-gray-100 rounded-full overflow-hidden shrink-0">
                        {/* 🌟 อัปเดตตรงนี้ด้วยเหมือนกัน */}
                        <img 
                          src={avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userEmail}`} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="font-bold text-sm truncate text-gray-900">{userName}</span>
                        <Link href="/profile" onClick={() => setIsProfileOpen(false)}>
                          <span className="text-[10px] text-gray-500 hover:text-yellow-600 cursor-pointer">
                            ดูโปรไฟล์ของคุณ
                          </span>
                        </Link>
                      </div>
                    </div>
                    <div className="py-2 border-b border-gray-50">
                      <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors cursor-pointer">
                        <Settings className="w-4 h-4 text-gray-400" />ตั้งค่าบัญชี
                      </button>
                      <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors cursor-pointer">
                        <HelpCircle className="w-4 h-4 text-gray-400" />ช่วยเหลือ
                      </button>
                    </div>
                    <div className="py-2">
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <div className="flex flex-col">
                          <span className="font-medium">ออกจากระบบ</span>
                          <span className="text-[10px] text-red-400/80">{maskEmail(userEmail)}</span>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link
              href="/login"
              className="ml-2 px-5 py-2 md:px-6 md:py-2.5 bg-black hover:bg-gray-800 text-white font-bold rounded-full transition-all active:scale-95 text-xs md:text-sm shadow-md flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              เข้าสู่ระบบ
            </Link>
          )}
        </div>
      </nav>

      {/* Search (Mobile) */}
      <div
        ref={mobileSearchRef}
        className={`fixed top-0 left-0 w-full bg-white z-[60] border-b border-gray-100 p-3 transition-all duration-300 transform md:hidden ${isMobileSearchOpen ? 'translate-y-0 opacity-100 shadow-lg' : '-translate-y-full opacity-0'
          }`}
      >
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              autoFocus={isMobileSearchOpen}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหาบทความ..."
              className="w-full bg-gray-100 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          <button
            type="button"
            onClick={() => setIsMobileSearchOpen(false)}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </form>
      </div>

      <AuthModal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
      />
    </>
  )
}