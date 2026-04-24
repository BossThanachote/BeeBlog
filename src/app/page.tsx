'use client';

import React, { useState, useEffect } from 'react';
import { BlogCard } from '@/app/components/organisms/BlogCard';
import { RightSidebar } from '@/app/components/organisms/RightSidebar';
import { Blog } from '@/app/types';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client'; 
import { Loader2, SearchX, X } from 'lucide-react';
// 🌟 1. Import useAuth เข้ามาใช้งาน
import { useAuth } from '@/app/providers/AuthProvider';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'feed' | 'followed'>('feed');
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search');
  
  const supabase = createClient(); 

  // 🌟 2. ดึงสถานะ Loading ของระบบ Auth มาเช็ค
  const { isLoading: isAuthLoading } = useAuth();

  const fetchBlogs = async () => {
    try {
      setIsLoading(true);
      
      let query = supabase
        .from('blogs')
        .select('*, users(username)') 
        .eq('is_published', true);

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,summary.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setBlogs(data as Blog[]);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // 🌟 3. ถ้าระบบ Auth ยังเตรียมตัวไม่เสร็จ ให้รอไปก่อน (แทนการตั้งเวลาตายตัว 1000ms)
    if (isAuthLoading) return;

    // พอ Auth โหลดเสร็จปุ๊บ สั่งดึงข้อมูลบล็อกได้เลยทันที!
    fetchBlogs();
  }, [searchQuery, isAuthLoading]); // เพิ่ม isAuthLoading เข้าไปใน Dependency

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 w-full max-w-6xl mx-auto min-h-[calc(100vh-4rem)]">
      
      <div className="lg:col-span-8 px-4 md:px-8 pt-8 lg:pr-14 lg:border-r lg:border-gray-100">
        
        {searchQuery && (
          <div className="mb-8 p-4 bg-yellow-50 rounded-2xl border border-yellow-100 flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center shadow-sm">
                <SearchX className="w-5 h-5 text-yellow-900" />
              </div>
              <div>
                <p className="text-xs text-yellow-700 font-medium">ผลการค้นหาสำหรับ</p>
                <p className="text-lg font-black text-yellow-900">"{searchQuery}"</p>
              </div>
            </div>
            <button 
              onClick={() => window.location.href = '/'}
              className="p-2 hover:bg-yellow-200 rounded-full transition-colors text-yellow-700"
              title="ล้างการค้นหา"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        <div className="sticky top-16 bg-white/80 backdrop-blur-md z-20 flex border-b border-gray-200 mb-6 pt-4">
          <button 
            onClick={() => setActiveTab('feed')}
            className={`pb-4 px-6 font-bold transition-all relative cursor-pointer ${
              activeTab === 'feed' ? 'text-black' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Your Feed
            {activeTab === 'feed' && <div className="absolute bottom-0 left-0 w-full h-1 bg-yellow-400 rounded-t-full" />}
          </button>
          <button 
            onClick={() => setActiveTab('followed')}
            className={`pb-4 px-6 font-bold transition-all relative cursor-pointer ${
              activeTab === 'followed' ? 'text-black' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Your Followed
            {activeTab === 'followed' && <div className="absolute bottom-0 left-0 w-full h-1 bg-yellow-400 rounded-t-full" />}
          </button>
        </div>

        <div className="space-y-6 pb-20">
          {/* โชว์ Loading หาก Auth ยังไม่เสร็จ หรือกำลังดึงข้อมูล Blog */}
          {isLoading || isAuthLoading ? (
            <div className="flex flex-col items-center py-20 text-gray-400">
              <Loader2 className="w-10 h-10 animate-spin text-yellow-400 mb-4" />
              <p className="font-medium animate-pulse">กำลังค้นหาบทความที่คุณต้องการ...</p>
            </div>
          ) : blogs.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {blogs.map(blog => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center px-4 animate-in fade-in zoom-in-95 duration-500">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <SearchX className="w-12 h-12 text-gray-200" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">
                {searchQuery ? 'ไม่พบบทความที่ค้นหา' : 'ยังไม่มีบทความในขณะนี้'}
              </h3>
              <p className="text-gray-500 max-w-xs mx-auto leading-relaxed">
                {searchQuery 
                  ? `ขออภัยครับคุณ Boss เราหา "${searchQuery}" ไม่เจอจริงๆ ลองเปลี่ยนคีย์เวิร์ดใหม่ดูไหมครับ?`
                  : 'เริ่มต้นสร้างสรรค์ผลงานชิ้นแรกของคุณด้วยการกดปุ่ม เขียน Blog ด้านบนได้เลย!'}
              </p>
              {searchQuery && (
                <button 
                  onClick={() => window.location.href = '/'}
                  className="mt-8 bg-black text-white px-8 py-3 rounded-2xl font-bold hover:bg-gray-800 transition-all active:scale-95 shadow-lg"
                >
                  ดูบทความทั้งหมด
                </button>
              )}
            </div>
          )}
        </div>

      </div>

      <div className="lg:col-span-4 relative lg:pl-14 px-4 md:px-8 pt-8">
        <div className="sticky top-28">
          <RightSidebar />
        </div>
      </div>
      
    </div>
  );
}