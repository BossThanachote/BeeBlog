'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useAuth } from '@/app/providers/AuthProvider'
import {
  Loader2,
  Heart,
  MessageCircle,
  Bookmark,
  ChevronRight,
  Clock,
  Layout
} from 'lucide-react'
import Link from 'next/link'

type Activity = {
  id: string
  type: 'like' | 'comment' | 'saved'
  created_at: string
  message?: string
  blog: {
    title: string
    slug: string
    summary: string
    cover_image: string
  }
}

export default function LibraryPage() {
  const supabase = createClient()
  const { user, isLoading: isAuthLoading } = useAuth()

  const [activeTab, setActiveTab] = useState<'saved' | 'responses'>('saved')
  const [activities, setActivities] = useState<Activity[]>([])
  const [savedBlogs, setSavedBlogs] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchLibraryData = useCallback(async () => {
    if (!user) return
    setIsLoading(true)
    try {
      // ดึงข้อมูลที่ Save ไว้
      const { data: savedData } = await supabase
        .from('saved_blogs')
        .select('id, created_at, blogs(title, slug, summary, cover_image)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      // ดึงข้อมูล Responses (Likes & Comments)
      const { data: likes } = await supabase
        .from('blog_likes')
        .select('id, created_at, blogs(title, slug, summary, cover_image)')
        .eq('user_id', user.id)

      const { data: comments } = await supabase
        .from('comments')
        .select('id, created_at, message, blogs(title, slug, summary, cover_image)')
        .eq('user_id', user.id)

      // จัดการข้อมูล Saved Blogs
      setSavedBlogs(savedData?.map((s: any) => ({ ...s, type: 'saved', blog: s.blogs })) as any || [])

      // จัดการข้อมูล Responses (Likes + Comments)
      const combinedResponses: Activity[] = [
        ...(likes?.map((l: any) => ({ ...l, type: 'like', blog: l.blogs })) || []),
        ...(comments?.map((c: any) => ({ ...c, type: 'comment', blog: c.blogs })) || [])
      ] as any

      // เรียงลำดับ Responses จากใหม่ไปเก่า
      combinedResponses.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      setActivities(combinedResponses)

    } catch (error) {
      console.error('Error fetching library:', error)
    } finally {
      setIsLoading(false)
    }
  }, [user, supabase])

  useEffect(() => {
    if (!isAuthLoading && user) fetchLibraryData()
    else if (!isAuthLoading && !user) window.location.href = '/login'
  }, [user, isAuthLoading, fetchLibraryData])

  if (isAuthLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 animate-spin text-yellow-400" />
      </div>
    )
  }

  const currentList = activeTab === 'saved' ? savedBlogs : activities

  return (
    <div className="max-w-5xl mx-auto pt-24 pb-20 px-6 animate-in fade-in duration-700">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <Layout className="w-6 h-6" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Your library</h1>
        </div>
        <Link href="/write" className="bg-black text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-gray-800 transition-all active:scale-95 shadow-sm">
          New story
        </Link>
      </div>

      {/* Tabs สไตล์ Medium */}
      <div className="flex border-b border-gray-100 mb-10">
        <button
          onClick={() => setActiveTab('saved')}
          className={`pb-4 px-2 mr-8 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === 'saved' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
        >
          Saved blogs ({savedBlogs.length})
          {activeTab === 'saved' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-900 animate-in fade-in zoom-in" />}
        </button>
        <button
          onClick={() => setActiveTab('responses')}
          className={`pb-4 px-2 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === 'responses' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
        >
          Responses ({activities.length})
          {activeTab === 'responses' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-900 animate-in fade-in zoom-in" />}
        </button>
      </div>

      {/* Content Area */}
      <div className="space-y-6">
        {currentList.length > 0 ? (
          currentList.map((item) => (
            <Link
              key={`${item.type}-${item.id}`}
              href={`/blog/${item.blog?.slug}`}
              className="block group"
            >
              <div className="bg-white border border-gray-50 p-6 md:p-8 rounded-[2.5rem] hover:shadow-2xl hover:shadow-gray-100 transition-all duration-500 border-l-4 border-l-transparent hover:border-l-yellow-400">
                <div className="flex items-start justify-between gap-8">
                  <div className="flex-1 min-w-0">
                    {/* Status Badge */}
                    <div className="flex items-center gap-3 mb-4">
                      {item.type === 'saved' && (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-50 text-yellow-600 rounded-full text-[10px] font-black uppercase tracking-wider border border-yellow-100">
                          <Bookmark className="w-3 h-3 fill-yellow-500" /> Saved
                        </div>
                      )}
                      {item.type === 'like' && (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-500 rounded-full text-[10px] font-black uppercase tracking-wider border border-red-100">
                          <Heart className="w-3 h-3 fill-red-500" /> Liked
                        </div>
                      )}
                      {item.type === 'comment' && (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-500 rounded-full text-[10px] font-black uppercase tracking-wider border border-blue-100">
                          <MessageCircle className="w-3 h-3 fill-blue-500" /> Commented
                        </div>
                      )}
                      <span className="text-[10px] font-bold text-gray-300 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(item.created_at).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>

                    <h2 className="text-2xl font-black text-gray-900 mb-3 group-hover:text-yellow-600 transition-colors leading-tight line-clamp-2">
                      {item.blog?.title}
                    </h2>

                    {/* ถ้าเป็น Comment ให้โชว์สิ่งที่เขียนไว้ */}
                    {item.type === 'comment' && (
                      <div className="mb-4 p-4 bg-gray-50 rounded-2xl border-l-4 border-blue-200">
                        <p className="text-[13px] text-gray-600 font-medium italic leading-relaxed">
                          "{item.message}"
                        </p>
                      </div>
                    )}

                    <p className="text-sm text-gray-400 font-medium line-clamp-1">
                      {item.blog?.summary}
                    </p>
                  </div>

                  {/* Blog Image */}
                  {item.blog?.cover_image && (
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2rem] overflow-hidden bg-gray-50 border border-gray-100 shrink-0 hidden sm:block">
                      <img src={item.blog.cover_image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                    </div>
                  )}

                  <div className="self-center p-3 rounded-full bg-gray-50 text-gray-300 group-hover:bg-yellow-400 group-hover:text-black transition-all shadow-sm">
                    <ChevronRight className="w-5 h-5 stroke-[3]" />
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="py-32 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200 animate-pulse">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              {activeTab === 'saved' ? <Bookmark className="w-6 h-6 text-gray-300" /> : <MessageCircle className="w-6 h-6 text-gray-300" />}
            </div>
            <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-xs">
              No {activeTab} blogs found
            </p>
          </div>
        )}
      </div>
    </div>
  )
}