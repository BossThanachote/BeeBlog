'use client';

import React, { useState } from 'react';
import { BlogCard } from '@/app/components/organisms/BlogCard';
import { RightSidebar } from '@/app/components/organisms/RightSidebar';
import { Blog } from '@/app/types';

const MOCK_BLOGS: Blog[] = [
  { id: 1, title: "10 เคล็ดลับการแต่งบ้านสไตล์ Minimal ที่ใครก็ทำได้", author: "HoneyBee_99", image: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=1000", likes: 124, comments: 18, reposts: 5 },
  { id: 2, title: "รีวิวคาเฟ่เปิดใหม่ใจกลางอารีย์ มุมถ่ายรูปเยอะมาก!", author: "QueenBee_Travel", image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1000", likes: 89, comments: 12, reposts: 2 },
  { id: 3, title: "วิธีทำน้ำผึ้งมะนาวสูตรพิเศษ ดื่มแล้วสดชื่นตลอดวัน", author: "ChefWorkerBee", image: "https://images.unsplash.com/photo-1589733955941-5eeaf752f6d9?q=80&w=1000", likes: 256, comments: 45, reposts: 32 },
  { id: 4, title: "พาตระเวนกิน 5 ร้านเด็ดเยาวราช ฉบับคนท้องถิ่น", author: "FoodieBee", image: "https://images.unsplash.com/photo-1556040220-4096d522378d?q=80&w=1000", likes: 412, comments: 56, reposts: 18 },
  { id: 5, title: "เขียน React ยังไงให้โค้ดคลีนเหมือนมี Senior มานั่งคุม", author: "DevBoss", image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000", likes: 890, comments: 102, reposts: 405 }
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<'feed' | 'followed'>('feed');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 w-full max-w-6xl mx-auto min-h-[calc(100vh-4rem)]">
      
      {/* ฝั่งซ้าย: เนื้อหา Feed */}
      <div className="lg:col-span-8 px-4 md:px-8 pt-8 lg:pr-14 lg:border-r lg:border-gray-100">
        
        {/* Tabs: เติม sticky, top-16 (อยู่ใต้ Navbar), bg-white, และ z-20 */}
        <div className="sticky top-16 bg-white z-20 flex border-b border-gray-200 mb-6 pt-4">
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

        {/* รายการ Blog */}
        <div className="space-y-6">
          {MOCK_BLOGS.map(blog => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>

      </div>

      {/* ฝั่งขวา: แถบแนะนำ */}
     <div className="lg:col-span-4 relative lg:pl-14 px-4 md:px-8 pt-8">
        <div className="sticky top-28">
          <RightSidebar />
        </div>
      </div>
      
    </div>
  );
}