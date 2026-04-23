'use client'

import { useState, useRef, useEffect } from 'react';
import { Menu, Search, PenSquare, Bell, LogOut, Settings, HelpCircle } from 'lucide-react';
import { logout } from '@/app/login/actions';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link'; // Import Link ของ Next.js มาใช้กับโลโก้

interface NavbarProps {
  onToggleSidebar?: () => void;
}

const maskEmail = (email: string) => {
  if (!email) return '';
  const [name, domain] = email.split('@');
  if (!domain) return email; 
  
  if (name.length <= 2) {
    return `${name}***@${domain}`;
  }
  
  const visiblePart = name.substring(0, 2);
  const maskedPart = '*'.repeat(name.length - 2); 
  return `${visiblePart}${maskedPart}@${domain}`;
};

export const Navbar = ({ onToggleSidebar }: NavbarProps) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [userName, setUserName] = useState<string>('กำลังโหลด...');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user?.email) {
        setUserEmail(user.email);
        
        const { data: userData } = await supabase
          .from('users')
          .select('username')
          .eq('id', user.id)
          .single();
          
        if (userData?.username) {
          setUserName(userData.username);
        } else {
          setUserName('ผู้ใช้งาน BeeBlog');
        }
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 w-full h-16 bg-white border-b border-gray-100 px-4 flex items-center justify-between z-50">
      
      <div className="flex items-center gap-4">
        {/* Hamburger Menu - เพิ่ม cursor-pointer เพื่อความชัวร์ */}
        <button 
          onClick={onToggleSidebar}
          className="p-2 hover:bg-yellow-50 rounded-full transition-colors text-gray-900 cursor-pointer"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* โลโก้ BeeBlog - ใช้ Link หุ้มและใส่ cursor-pointer เพื่อให้กดกลับหน้าแรกได้ */}
        <Link href="/" className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center font-bold text-black shadow-sm">B</div>
          <span className="text-xl font-bold tracking-tight hidden text-gray-900 sm:block">BeeBlog</span>
        </Link>
      </div>

      <div className="flex-1 max-w-xl mx-8 hidden md:block">
        <div className="relative group ">
          <Search className="absolute left-3 top-1/2  -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-yellow-600" />
          <input 
            type="text" 
            placeholder="ค้นหาหัวข้อ Blog..."
            className="w-full bg-gray-50 border border-gray-200 focus:bg-white  focus:ring-2 focus:ring-yellow-400 focus:border-transparent rounded-2xl py-2 pl-10 pr-4 transition-all outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* ปุ่มเขียน Blog */}
        <Link href="/write" className="p-2 text-gray-600 hover:bg-yellow-50 hover:text-yellow-700 rounded-full transition-all md:flex items-center gap-2 cursor-pointer">
          <PenSquare className="w-5 h-5" />
          <span className="hidden lg:block font-medium text-sm">เขียน Blog</span>
        </Link>
        
        {/* ปุ่มแจ้งเตือน */}
        <button className="p-2 text-gray-600 hover:bg-yellow-50 hover:text-yellow-700 rounded-full relative cursor-pointer">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="relative ml-2" ref={dropdownRef}>
          {/* รูปโปรไฟล์ */}
          <div 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-9 h-9 bg-black rounded-full overflow-hidden border-2 border-yellow-400 cursor-pointer hover:scale-105 transition-transform"
          >
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Boss" alt="Profile" />
          </div>

          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200">
              
              <div className="px-4 py-3 border-b border-gray-50 flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full overflow-hidden shrink-0 cursor-pointer">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Boss" alt="Profile" />
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="font-bold text-sm truncate text-gray-900 cursor-pointer">{userName}</span>
                  {/* ลิงก์ดูโปรไฟล์ */}
                  <span className="text-xs text-gray-500 hover:text-yellow-600 cursor-pointer">ดูโปรไฟล์ของคุณ</span>
                </div>
              </div>

              <div className="py-2 border-b border-gray-50">
                {/* เมนูตั้งค่าบัญชี */}
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors cursor-pointer">
                  <Settings className="w-4 h-4 text-gray-400" />
                  ตั้งค่าบัญชี
                </button>
                {/* เมนูช่วยเหลือ */}
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors cursor-pointer">
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                  ช่วยเหลือ
                </button>
              </div>

              <div className="py-2">
                {/* ปุ่มออกจากระบบ */}
                <button 
                  onClick={() => logout()}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  <div className="flex flex-col overflow-hidden">
                    <span className="font-medium">ออกจากระบบ</span>
                    <span className="text-xs text-red-400/80 font-normal truncate">
                      {userEmail ? maskEmail(userEmail) : 'กำลังโหลด...'}
                    </span>
                  </div>
                </button>
              </div>

            </div>
          )}
        </div>
      </div>
    </nav>
  );
};