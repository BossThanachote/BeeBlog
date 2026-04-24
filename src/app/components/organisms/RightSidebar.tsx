'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { Loader2, TrendingUp, Users, ChevronDown, ChevronUp, UserPlus, UserCheck } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { useAuth } from '@/app/providers/AuthProvider'
import Link from 'next/link'

export const RightSidebar = () => {
  const supabase = createClient()
  const { user: currentUser } = useAuth()
  
  const [popularBlogs, setPopularBlogs] = useState<any[]>([])
  const [topAuthors, setTopAuthors] = useState<any[]>([])
  const [followingIds, setFollowingIds] = useState<string[]>([])
  const [showMore, setShowMore] = useState(false) // 🌟 State สำหรับสลับปุ่ม
  const [isLoading, setIsLoading] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true)
      
      // 1. ดึง Blog ที่คนอ่านมากที่สุด
      const { data: blogs, error: blogError } = await supabase
        .from('blogs')
        .select('id, title, slug, view_count')
        .eq('is_published', true)
        .order('view_count', { ascending: false })
        .limit(10)
      
      if (blogError) console.error('Error blogs:', blogError)
      else setPopularBlogs(blogs || [])

      // 2. ดึง User แนะนำ
      const { data: authors } = await supabase
        .from('users')
        .select(`
          id, 
          username, 
          avatar_url, 
          bio,
          follows:follows!following_id(count)
        `)

      if (authors) {
        const sortedAuthors = authors
          .filter((u: any) => u.id !== currentUser?.id)
          .map((u: any) => ({
            ...u,
            followerCount: u.follows?.[0]?.count || 0
          }))
          .sort((a: any, b: any) => b.followerCount - a.followerCount)
          .slice(0, 3)
        
        setTopAuthors(sortedAuthors)
      }

      // 3. เช็คสถานะการ Follow
      if (currentUser) {
        const { data: myFollows } = await supabase
          .from('follows')
          .select('following_id')
          .eq('follower_id', currentUser.id)
        
        setFollowingIds(myFollows?.map((f: any) => f.following_id) || [])
      }

    } catch (err) {
      console.error('Sidebar error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [currentUser, supabase])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleFollowAction = async (targetId: string, isCurrentlyFollowing: boolean) => {
    if (!currentUser) return alert('กรุณา Login ก่อนครับคุณ Boss')
    try {
      if (isCurrentlyFollowing) {
        await supabase.from('follows').delete().eq('follower_id', currentUser.id).eq('following_id', targetId)
        setFollowingIds(prev => prev.filter(id => id !== targetId))
      } else {
        await supabase.from('follows').insert({ follower_id: currentUser.id, following_id: targetId })
        setFollowingIds(prev => [...prev, targetId])
      }
    } catch (err) { console.error(err) }
  }

  if (isLoading) return (
    <div className="py-10 flex justify-center">
      <Loader2 className="w-6 h-6 animate-spin text-yellow-400" />
    </div>
  )

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      
      {/* ส่วนที่ 1: Blog ที่มีคนอ่านมากที่สุด */}
      <section>
        <h3 className="font-black text-gray-900 mb-8 flex items-center gap-2 uppercase text-[11px] tracking-[0.2em]">
          <TrendingUp className="w-4 h-4 text-yellow-600" />
          Blog ที่มีคนอ่านมากที่สุด
        </h3>
        <div className="space-y-7">
          {popularBlogs.length > 0 ? (
            (showMore ? popularBlogs : popularBlogs.slice(0, 3)).map((blog, i) => (
              <Link 
                key={blog.id} 
                href={`/blog/${blog.slug}`} 
                className="group flex gap-5 items-start animate-in slide-in-from-left-2 duration-300"
              >
                <span className="text-3xl font-black text-gray-100 group-hover:text-yellow-200 transition-colors leading-none mt-1 min-w-[32px]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0">
                  <span className="text-[10px] font-black text-yellow-600 tracking-wider mb-1 block uppercase">
                    Popular · {blog.view_count.toLocaleString()} Views
                  </span>
                  <h4 className="font-bold text-sm text-gray-900 group-hover:text-yellow-600 transition-colors leading-snug line-clamp-2 tracking-tight">
                    {blog.title}
                  </h4>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest text-center py-4 border border-dashed border-gray-100 rounded-2xl">No stories found</p>
          )}
        </div>
        
        {/* 🌟 ปุ่มสลับ ดูเพิ่มเติม / แสดงน้อยลง */}
        {popularBlogs.length > 3 && (
          <button 
            onClick={() => setShowMore(!showMore)}
            className="mt-8 text-[10px] font-black text-yellow-600 hover:text-yellow-700 flex items-center gap-1 transition-all uppercase tracking-[0.15em] border-b border-transparent hover:border-yellow-600 pb-0.5"
          >
            {showMore ? (
              <><ChevronUp className="w-3 h-3" /> แสดงน้อยลง</>
            ) : (
              <><ChevronDown className="w-3 h-3" /> ดูเพิ่มเติม</>
            )}
          </button>
        )}
      </section>

      {/* ส่วนที่ 2: แนะนำให้ติดตาม */}
      <section>
        <h3 className="font-black text-gray-900 mb-8 flex items-center gap-2 uppercase text-[11px] tracking-[0.2em]">
          <Users className="w-4 h-4 text-yellow-600" />
          แนะนำให้ติดตาม
        </h3>
        <div className="space-y-6">
          {topAuthors.map((author) => {
            const isFollowing = followingIds.includes(author.id)
            return (
              <div key={author.id} className="flex items-center justify-between group">
                <Link href={`/user/${author.id}`} className="flex items-center gap-3 overflow-hidden flex-1">
                  <div className="w-10 h-10 bg-gray-50 rounded-full overflow-hidden shrink-0 border border-gray-100 shadow-sm group-hover:shadow-md transition-all">
                    <img 
                      src={author.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${author.username}`} 
                      alt="" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="overflow-hidden pr-2">
                    <h4 className="font-black text-sm text-gray-900 group-hover:text-yellow-600 transition-colors truncate tracking-tight">
                      {author.username}
                    </h4>
                    <p className="text-[10px] text-gray-400 truncate font-bold uppercase tracking-tighter">
                      {author.followerCount} Followers
                    </p>
                  </div>
                </Link>
                
                <button 
                  onClick={() => handleFollowAction(author.id, isFollowing)}
                  className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border shrink-0 flex items-center gap-1.5 ${
                    isFollowing 
                    ? 'bg-gray-50 text-gray-400 border-gray-200' 
                    : 'bg-white text-black border-black hover:bg-black hover:text-white shadow-sm'
                  }`}
                >
                  {isFollowing ? (
                    <><UserCheck className="w-3.5 h-3.5" /> Following</>
                  ) : (
                    <><UserPlus className="w-3.5 h-3.5" /> Follow</>
                  )}
                </button>
              </div>
            )
          })}
        </div>
      </section>

      <div className="pt-10 border-t border-gray-50">
        <p className="text-[9px] font-black text-gray-200 uppercase tracking-[0.4em]">
          © 2026 BeeBlog by Boss
        </p>
      </div>
    </div>
  )
}