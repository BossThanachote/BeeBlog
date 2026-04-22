'use client';

import React, { useState } from 'react';
import { Navbar } from '@/app/components/organisms/Navbar';
import { Sidebar } from '@/app/components/organisms/Sidebar';
import { BlogCard } from '@/app/components/organisms/BlogCard';
import { RightSidebar } from '@/app/components/organisms/RightSidebar';
import { Blog } from '@/app/types';

// จำลองข้อมูล (ในอนาคตจะดึงจาก Supabase ผ่าน Server Component หรือ SWR/React Query)
const MOCK_BLOGS: Blog[] = [
  {
    id: 1,
    title: "10 เคล็ดลับการแต่งบ้านสไตล์ Minimal ที่ใครก็ทำได้",
    author: "HoneyBee_99",
    image: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=1000",
    likes: 124,
    comments: 18,
    reposts: 5
  },
  {
    id: 2,
    title: "รีวิวคาเฟ่เปิดใหม่ใจกลางอารีย์ มุมถ่ายรูปเยอะมาก!",
    author: "QueenBee_Travel",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1000",
    likes: 89,
    comments: 12,
    reposts: 2
  },
  {
    id: 3,
    title: "วิธีทำน้ำผึ้งมะนาวสูตรพิเศษ ดื่มแล้วสดชื่นตลอดวัน",
    author: "ChefWorkerBee",
    image: "https://images.unsplash.com/photo-1589733955941-5eeaf752f6d9?q=80&w=1000",
    likes: 256,
    comments: 45,
    reposts: 32
  }
];

export default function Home() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'feed' | 'followed'>('feed');

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Navbar onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
      
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      <main className="pt-20 px-4 md:px-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Feed Section */}
        <div className="lg:col-span-8">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button 
              onClick={() => setActiveTab('feed')}
              className={`pb-4 px-6 font-bold transition-all relative ${
                activeTab === 'feed' ? 'text-black' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Your Feed
              {activeTab === 'feed' && <div className="absolute bottom-0 left-0 w-full h-1 bg-yellow-400 rounded-t-full" />}
            </button>
            <button 
              onClick={() => setActiveTab('followed')}
              className={`pb-4 px-6 font-bold transition-all relative ${
                activeTab === 'followed' ? 'text-black' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Your Followed
              {activeTab === 'followed' && <div className="absolute bottom-0 left-0 w-full h-1 bg-yellow-400 rounded-t-full" />}
            </button>
          </div>

          {/* Blog List */}
          <div className="space-y-6">
            {MOCK_BLOGS.map(blog => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <RightSidebar />
        
      </main>
    </div>
  );
}