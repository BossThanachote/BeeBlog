'use client'

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation'; 
import { Navbar } from '@/app/components/organisms/Navbar';
import { Sidebar } from '@/app/components/organisms/Sidebar';
import { AuthProvider } from '@/app/providers/AuthProvider';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname(); 

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
      <head>
        <title>BeeBlog | พื้นที่แบ่งปันเรื่องราวของคนรักการเขียน</title>
        <meta name="description" content="แพลตฟอร์ม Blog ทันสมัยสำหรับคนรุ่นใหม่ สร้างโดย Boss Thanachote" />
        
        <meta property="og:title" content="BeeBlog" />
        <meta property="og:description" content="พื้นที่แบ่งปันเรื่องราวของคนรักการเขียน" />
        <meta property="og:image" content="/og-image.png" />
        <meta property="og:url" content="https://bee-blog-8cww.vercel.app" />
        <meta property="og:type" content="website" />
        

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="/og-image.png" />
        

        <link rel="icon" href="/icon.png" />
      </head>
      <body className="bg-white min-h-screen text-gray-900 overflow-x-hidden">
        <AuthProvider>
          {!isWritePage && (
            <>
              <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
              <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            </>
          )}

          <main
            className={`transition-all duration-300 ease-in-out bg-white min-h-screen flex flex-col ${
              !isWritePage ? 'pt-16' : ''
            } ${!isWritePage && isSidebarOpen ? 'md:pl-64' : 'pl-0'}`}
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