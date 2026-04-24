'use client'

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation'; // <-- เพิ่มบรรทัดนี้
import { Navbar } from '@/app/components/organisms/Navbar';
import { Sidebar } from '@/app/components/organisms/Sidebar';
import { AuthProvider } from '@/app/providers/AuthProvider';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname(); // <-- เก็บค่า URL ปัจจุบัน

  // เช็คว่าตอนนี้อยู่หน้าเขียนบล็อกหรือเปล่า
  const isWritePage = pathname === '/write';

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <html lang="th">
      <body className="bg-white min-h-screen text-gray-900 overflow-x-hidden">
        <AuthProvider>


          {/* ถ้าไม่ใช่หน้า Write ค่อยแสดง Navbar และ Sidebar แบบเดิม */}
          {!isWritePage && (
            <>
              <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
              <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            </>
          )}

          {/* เนื้อหาหลัก: ถ้าเป็นหน้า Write ให้เต็มจอไปเลย ไม่ต้องมี padding ซ้าย */}
          <main
            className={`transition-all duration-300 ease-in-out bg-white min-h-screen flex flex-col ${!isWritePage ? 'pt-16' : '' // ถ้าหน้าปกติเว้นบนให้ Navbar
              } ${!isWritePage && isSidebarOpen ? 'md:pl-64' : 'pl-0'
              }`}
          >
            <div className={`${!isWritePage ? 'max-w-7xl mx-auto px-4 sm:px-8' : 'w-full'} w-full flex-1 bg-white`}>
              {children}
            </div>
          </main>

        </AuthProvider>
      </body>
    </html>
  );
}