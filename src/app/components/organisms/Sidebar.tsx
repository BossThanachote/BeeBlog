'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Library, User, BarChart2, LayoutDashboard, ShieldCheck } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const supabase = createClient();
  const pathname = usePathname();
  const router = useRouter();

  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const checkUserStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);

      if (user) {
        const { data: profile } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profile?.role === 'admin') {
          setIsAdmin(true);
        }
      }
    };
    checkUserStatus();
  }, [supabase]);

  const isActive = (path: string) => pathname === path;
  const isAdminActive = pathname?.startsWith('/admin');

  // ฟังก์ชันจัดการเมื่อกดปุ่ม Profile
  const handleProfileClick = (e: React.MouseEvent) => {
    if (!currentUser) {
      e.preventDefault();
      onClose();
      router.push('/login');
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden cursor-pointer"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-100 
        flex flex-col z-40 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
      `}>
        <div className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">

          <Link
            href="/"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive('/')
                ? 'bg-yellow-400 text-black font-bold shadow-sm'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium'
              }`}
          >
            <Home className={`w-5 h-5 ${isActive('/') ? 'fill-current' : ''}`} />
            Home
          </Link>

          <Link
            href="/library"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive('/library')
                ? 'bg-yellow-400 text-black font-bold shadow-sm'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium'
              }`}
          >
            <Library className="w-5 h-5" />
            Library
          </Link>

          {/* Profile Link พร้อมระบบเช็ค Login */}
          <Link
            href="/profile"
            onClick={handleProfileClick}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive('/profile')
                ? 'bg-yellow-400 text-black font-bold shadow-sm'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium'
              }`}
          >
            <User className="w-5 h-5" />
            Profile
          </Link>

          {isAdmin && (
            <div className="pt-6 mt-6 border-t border-gray-100">
              <div className="px-4 mb-3 flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Management</span>
              </div>

              <Link
                href="/admin"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isAdminActive
                    ? 'bg-yellow-400 text-black font-bold shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium'
                  }`}
              >
                <LayoutDashboard className={`w-5 h-5 ${isAdminActive ? 'fill-current text-black' : 'group-hover:text-gray-900'}`} />
                <span className={isAdminActive ? 'text-black' : ''}>Admin Panel</span>
              </Link>
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="bg-yellow-400 rounded-[1.5rem] p-5 shadow-sm">
            <h4 className="font-black text-black text-xs mb-1 tracking-tight">BEE PREMIUM</h4>
            <p className="text-black/70 text-[11px] mb-4 leading-tight">เข้าถึงระบบวิเคราะห์ข้อมูลขั้นสูงและฟีเจอร์พิเศษ</p>
            <button className="w-full py-2.5 bg-black text-white text-xs font-bold rounded-xl hover:bg-gray-800 transition-all active:scale-95 shadow-sm">
              อัปเกรดเลย
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};