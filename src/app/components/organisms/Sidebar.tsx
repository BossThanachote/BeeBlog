'use client'

import Link from 'next/link';
import { Home, Library, User, BarChart2 } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  return (
    <>
      {/* Overlay สำหรับจอมือถือ: จะซ่อนบนจอใหญ่ (md:hidden) */}
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
         <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
            <Link href="/" className="flex items-center gap-3 px-4 py-3 bg-yellow-400 text-black font-bold rounded-xl cursor-pointer hover:opacity-90 transition-opacity">
              <Home className="w-5 h-5" />
              Home
            </Link>
            
            <Link href="/library" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium rounded-xl transition-colors cursor-pointer">
              <Library className="w-5 h-5" />
              Library
            </Link>
            <Link href="/profile" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium rounded-xl transition-colors cursor-pointer">
              <User className="w-5 h-5" />
              Profile
            </Link>
            <Link href="/stat" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium rounded-xl transition-colors cursor-pointer">
              <BarChart2 className="w-5 h-5" />
              Stat
            </Link>
         </div>

         <div className="p-4">
           <div className="bg-yellow-400 rounded-2xl p-5 shadow-sm">
             <h4 className="font-bold text-black text-sm mb-2">BEE PREMIUM</h4>
             <p className="text-black/80 text-xs mb-4">ปลดล็อกฟีเจอร์ใหม่ๆ และสนับสนุนนักเขียนที่คุณรัก</p>
             <button className="w-full py-2 bg-black text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-colors cursor-pointer">
               อัปเกรดเลย
             </button>
           </div>
         </div>
      </aside>
    </>
  );
};