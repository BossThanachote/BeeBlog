'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { BlogCard } from '@/app/components/organisms/BlogCard';
import { RightSidebar } from '@/app/components/organisms/RightSidebar';
import { Blog } from '@/app/types';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client'; 
import { Loader2, SearchX, X, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import { useAuth } from '@/app/providers/AuthProvider';

const ITEMS_PER_PAGE = 10;

export default function Home() {
  const [activeTab, setActiveTab] = useState<'feed' | 'following'>('feed'); // 🌟 เปลี่ยนชื่อแท็บ
  const [blogs, setBlogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search');
  
  const supabase = createClient(); 
  const { user, isLoading: isAuthLoading } = useAuth();

  // รีเซ็ตหน้าเมื่อเปลี่ยนแท็บหรือค้นหา
  useEffect(() => {
    setPage(1);
  }, [searchQuery, activeTab]);

  const fetchBlogs = useCallback(async () => {
    try {
      setIsLoading(true);
      const from = (page - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      
      let query = supabase
        .from('blogs')
        .select(`
          *,
          users(username, avatar_url),
          blog_likes(user_id),
          comments(user_id, status),
          saved_blogs(user_id)
        `, { count: 'exact' }) 
        .eq('is_published', true);

      // 🌟 Logic สำหรับแท็บ Following (ดึงเฉพาะคนที่ติดตาม)
      if (activeTab === 'following') {
        if (!user) {
          setBlogs([]);
          setTotalPages(0);
          setIsLoading(false);
          return;
        }

        // 1. หา ID ของทุกคนที่เราติดตามอยู่
        const { data: followData } = await supabase
          .from('follows')
          .select('following_id')
          .eq('follower_id', user.id);
        
        const followingIds = followData?.map((f: any) => f.following_id) || [];

        if (followingIds.length > 0) {
          // 2. กรองบทความที่เขียนโดย ID เหล่านั้น
          query = query.in('author_id', followingIds);
        } else {
          // ถ้าไม่ได้ติดตามใครเลย ให้บทความออกมาว่างเปล่า
          setBlogs([]);
          setTotalPages(0);
          setIsLoading(false);
          return;
        }
      }

      // Logic ค้นหา
      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,summary.ilike.%${searchQuery}%`);
      }

      const { data, count, error } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;
      
      if (data) {
        const processedBlogs = data.map((blog: any) => ({
          ...blog,
          comment_count: blog.comments?.filter((c: any) => c.status === 'approved').length || 0,
          isLiked: blog.blog_likes?.some((l: any) => l.user_id === user?.id),
          isSaved: blog.saved_blogs?.some((s: any) => s.user_id === user?.id),
          isCommented: blog.comments?.some((c: any) => c.user_id === user?.id)
        }));
        setBlogs(processedBlogs);
      }
      
      if (count !== null) {
        setTotalPages(Math.ceil(count / ITEMS_PER_PAGE));
      }

    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page, searchQuery, activeTab, user, supabase]);

  useEffect(() => {
    if (isAuthLoading) return;
    fetchBlogs();
  }, [fetchBlogs, isAuthLoading]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 w-full max-w-6xl mx-auto min-h-[calc(100vh-4rem)]">
      
      <div className="lg:col-span-8 px-4 md:px-8 pt-8 lg:pr-14 lg:border-r lg:border-gray-100">
        
        {/* Search Result Bar ... เหมือนเดิม */}

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
            onClick={() => setActiveTab('following')}
            className={`pb-4 px-6 font-bold transition-all relative cursor-pointer ${
              activeTab === 'following' ? 'text-black' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Following
            {activeTab === 'following' && <div className="absolute bottom-0 left-0 w-full h-1 bg-yellow-400 rounded-t-full" />}
          </button>
        </div>

        <div className="space-y-6 pb-20">
          {isLoading || isAuthLoading ? (
            <div className="flex flex-col items-center py-20 text-gray-400">
              <Loader2 className="w-10 h-10 animate-spin text-yellow-400 mb-4" />
              <p className="font-medium">กำลังเตรียมข้อมูล...</p>
            </div>
          ) : blogs.length > 0 ? (
            <>
              <div className="divide-y divide-gray-100">
                {blogs.map(blog => (
                  <BlogCard key={blog.id} blog={blog} />
                ))}
              </div>

              {/* Pagination UI ... เหมือนเดิม */}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center px-4">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                {activeTab === 'following' ? <Users className="w-10 h-10 text-gray-200" /> : <SearchX className="w-10 h-10 text-gray-200" />}
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">
                {activeTab === 'following' ? 'ยังไม่มีบทความจากคนที่คุณติดตาม' : 'ไม่พบบทความ'}
              </h3>
              <p className="text-gray-500 max-w-xs mx-auto leading-relaxed">
                {activeTab === 'following' 
                  ? 'ลองกดติดตามนักเขียนที่คุณชื่นชอบเพื่อรับข่าวสารใหม่ๆ ที่นี่ครับ!' 
                  : 'ไม่พบข้อมูลที่คุณกำลังมองหา ลองเปลี่ยนคำค้นหาดูนะครับ'}
              </p>
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