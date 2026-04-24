'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { useAuth } from '@/app/providers/AuthProvider'
import { Loader2, Calendar, Eye, UserPlus, UserCheck, BookOpen, User as UserIcon } from 'lucide-react'
import Link from 'next/link'

export default function PublicProfilePage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const { user: currentUser, isLoading: isAuthLoading } = useAuth()
  
  const [activeTab, setActiveTab] = useState<'home' | 'about'>('home')
  const [targetUser, setTargetUser] = useState<any>(null)
  const [blogs, setBlogs] = useState<any[]>([])
  const [isFollowing, setIsFollowing] = useState(false)
  const [followerCount, setFollowerCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const fetchData = useCallback(async () => {
    if (isAuthLoading) return
    if (currentUser?.id === params.id) {
      router.push('/profile')
      return
    }

    try {
      setIsLoading(true)
      
      // 1. ดึงข้อมูล User
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', params.id)
        .single()
      
      if (userError || !userData) return router.push('/')
      setTargetUser(userData)

      // 2. นับ Followers
      const { count } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', params.id)
      
      setFollowerCount(count || 0)

      // 3. ดึง Blogs พร้อมรูปภาพ Cover
      const { data: blogData } = await supabase
        .from('blogs')
        .select('*, users(username, avatar_url)')
        .eq('author_id', params.id)
        .eq('is_published', true)
        .order('created_at', { ascending: false })
      
      setBlogs(blogData || [])

      // 4. เช็คการติดตาม
      if (currentUser) {
        const { data: followCheck } = await supabase
          .from('follows')
          .select('*')
          .eq('follower_id', currentUser.id)
          .eq('following_id', params.id)
          .single()
        setIsFollowing(!!followCheck)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [params.id, currentUser, isAuthLoading, supabase, router])

  useEffect(() => { fetchData() }, [fetchData])

  const handleFollow = async () => {
    if (!currentUser) return alert('กรุณาเข้าสู่ระบบก่อนนะครับ')
    try {
      if (isFollowing) {
        await supabase.from('follows').delete().eq('follower_id', currentUser.id).eq('following_id', params.id)
        setFollowerCount(prev => prev - 1)
      } else {
        await supabase.from('follows').insert({ follower_id: currentUser.id, following_id: params.id as string })
        setFollowerCount(prev => prev + 1)
      }
      setIsFollowing(!isFollowing)
    } catch (err) { console.error(err) }
  }

  if (isLoading || isAuthLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Loader2 className="w-10 h-10 animate-spin text-yellow-400" />
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto pt-24 px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16">
      
      {/* ฝั่งซ้าย: Content Area */}
      <div className="lg:col-span-8">
        <h1 className="text-4xl font-black text-gray-900 mb-8">{targetUser.username}</h1>

        {/* Tab Navigation เหมือนหน้า Profile */}
        <div className="flex border-b border-gray-100 mb-10">
          <button 
            onClick={() => setActiveTab('home')}
            className={`pb-4 px-2 mr-8 text-sm font-bold transition-all relative ${
              activeTab === 'home' ? 'text-black' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Home
            {activeTab === 'home' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black" />}
          </button>
          <button 
            onClick={() => setActiveTab('about')}
            className={`pb-4 px-2 text-sm font-bold transition-all relative ${
              activeTab === 'about' ? 'text-black' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            About
            {activeTab === 'about' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black" />}
          </button>
        </div>

        {/* Tab Content */}
        <div className="pb-20">
          {activeTab === 'home' ? (
            <div className="space-y-12">
              {blogs.length > 0 ? blogs.map(blog => (
                <div key={blog.id} className="flex flex-col md:flex-row gap-6 items-start group">
                  <div className="flex-1 order-2 md:order-1">
                    <Link href={`/blog/${blog.slug}`}>
                      <h3 className="text-2xl font-black text-gray-900 group-hover:text-yellow-600 transition-colors mb-2 leading-tight">
                        {blog.title}
                      </h3>
                      <p className="text-gray-500 line-clamp-3 mb-4 font-medium leading-relaxed">
                        {blog.summary}
                      </p>
                    </Link>
                    <div className="flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5"/>{new Date(blog.created_at).toLocaleDateString('th-TH')}</span>
                      <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5"/>{blog.view_count || 0} VIEWS</span>
                    </div>
                  </div>
                  
                  {/* 🌟 แสดงรูปภาพ Blog ถ้ามี */}
                  {blog.cover_image && (
                    <Link href={`/blog/${blog.slug}`} className="w-full md:w-48 h-32 shrink-0 rounded-2xl overflow-hidden border border-gray-100 order-1 md:order-2 shadow-sm group-hover:shadow-md transition-shadow">
                      <img src={blog.cover_image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={blog.title} />
                    </Link>
                  )}
                </div>
              )) : (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                  <BookOpen className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-400 font-bold italic">User ท่านนี้ยังไม่มีบทความที่เผยแพร่ครับ</p>
                </div>
              )}
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h4 className="text-xl font-black text-gray-900 mb-6">About {targetUser.username}</h4>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-loose whitespace-pre-wrap font-medium">
                  {targetUser.bio || "คนนี้ยังไม่ได้เขียนประวัติส่วนตัวครับ"}
                </p>
              </div>
              <div className="mt-12 pt-8 border-t border-gray-100 flex gap-10">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Followers</p>
                  <p className="text-xl font-black text-black">{followerCount}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Blogs</p>
                  <p className="text-xl font-black text-black">{blogs.length}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ฝั่งขวา: Sidebar User Info */}
      <div className="lg:col-span-4 lg:pl-12 lg:border-l border-gray-50">
        <div className="sticky top-28">
          <div className="w-24 h-24 rounded-[2rem] overflow-hidden mb-6 border-4 border-white shadow-2xl shadow-gray-200">
            <img 
              src={targetUser.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${targetUser.username}`} 
              className="w-full h-full object-cover" 
            />
          </div>
          <h2 className="text-xl font-black text-gray-900 mb-1">{targetUser.username}</h2>
          <div className="flex items-center gap-2 mb-6">
            <span className="text-sm font-black text-gray-400 uppercase tracking-widest">{followerCount} Followers</span>
          </div>
          
          <button 
            onClick={handleFollow}
            className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 mb-8 ${
              isFollowing 
                ? 'bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-500' 
                : 'bg-yellow-400 text-black hover:bg-yellow-500 shadow-yellow-100'
            }`}
          >
            {isFollowing ? (
              <><UserCheck className="w-4 h-4" /> Following</>
            ) : (
              <><UserPlus className="w-4 h-4" /> Follow</>
            )}
          </button>

          <div className="space-y-4">
             <div className="flex items-center gap-3 text-gray-500 text-sm font-medium">
                <UserIcon className="w-4 h-4 text-gray-400" />
                <span>Joined BeeBlog {new Date(targetUser.created_at).getFullYear()}</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}