'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Loader2, Edit3, MoreHorizontal, Calendar, Eye, Heart, Users } from 'lucide-react'
import { EditProfileModal } from '@/app/components/organisms/EditProfileModal'
import { FollowModal } from '@/app/components/molecules/FollowModal' 
import { useAuth } from '@/app/providers/AuthProvider'
import Link from 'next/link'

export default function ProfilePage() {
  const supabase = createClient()
  const { user, isLoading: isAuthLoading } = useAuth()

  const [userProfile, setUserProfile] = useState<any>(null)
  const [userBlogs, setUserBlogs] = useState<any[]>([])
  const [isProfileLoading, setIsProfileLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'home' | 'about'>('home')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isEditingAbout, setIsEditingAbout] = useState(false)
  const [aboutMeContent, setAboutMeContent] = useState('')

  // Follow States
  const [followStats, setFollowStats] = useState({ followers: 0, following: 0 })
  const [followModal, setFollowModal] = useState<{ isOpen: boolean; type: 'followers' | 'following' }>({
    isOpen: false,
    type: 'followers'
  })

  // ฟังก์ชันดึงยอด Follow
  const fetchFollowStats = useCallback(async (userId: string) => {
    const [{ count: followers }, { count: following }] = await Promise.all([
      supabase.from('follows').select('*', { count: 'exact', head: true }).eq('following_id', userId),
      supabase.from('follows').select('*', { count: 'exact', head: true }).eq('follower_id', userId)
    ])
    setFollowStats({ followers: followers || 0, following: following || 0 })
  }, [supabase])

  // ฟังก์ชันดึงบทความ (พร้อมรูป Cover)
  const fetchUserBlogs = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('author_id', userId)
        .order('created_at', { ascending: false })
      if (!error) setUserBlogs(data || [])
    } catch (error) { console.error(error) }
  }, [supabase])

  const fetchProfile = useCallback(async () => {
    if (isAuthLoading || !user) return
    try {
      setIsProfileLoading(true)
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (data) {
        setUserProfile(data)
        setAboutMeContent(data.about_me || '')
        await Promise.all([
          fetchUserBlogs(user.id),
          fetchFollowStats(user.id)
        ])
      }
    } catch (error) { console.error(error) }
    finally { setIsProfileLoading(false) }
  }, [user, isAuthLoading, fetchUserBlogs, fetchFollowStats])

  useEffect(() => { fetchProfile() }, [fetchProfile])

  const handleSaveAboutMe = async () => {
    if (!userProfile) return
    try {
      const { error } = await supabase.from('users').update({ about_me: aboutMeContent }).eq('id', userProfile.id)
      if (!error) { setIsEditingAbout(false); fetchProfile(); }
    } catch (error) { console.error(error) }
  }

  if ((isAuthLoading || isProfileLoading) && !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 animate-spin text-yellow-400" />
      </div>
    )
  }

  if (!userProfile) return null

  return (
    <div className="min-h-screen bg-white">
      {/* Modal สำหรับดูรายชื่อคนติดตาม */}
      <FollowModal 
        isOpen={followModal.isOpen} 
        onClose={() => setFollowModal({ ...followModal, isOpen: false })}
        userId={userProfile.id}
        type={followModal.type}
      />

      <EditProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} currentUser={userProfile} onSaved={fetchProfile} />

      <div className="max-w-6xl mx-auto pt-24 px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 md:pr-8">
          <div className="flex flex-col mb-8">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">{userProfile.username}</h1>
              <button className="p-2 text-gray-400 hover:text-gray-900 transition-colors"><MoreHorizontal className="w-6 h-6" /></button>
            </div>
            
            {/* คลิกที่ตัวเลขเพื่อเปิด Modal */}
            <div className="flex items-center gap-6 mt-2">
              <button 
                onClick={() => setFollowModal({ isOpen: true, type: 'followers' })}
                className="group flex items-center gap-2 text-sm"
              >
                <span className="font-black text-gray-900 group-hover:underline">{followStats.followers}</span>
                <span className="text-gray-400 font-medium">Followers</span>
              </button>
              <button 
                onClick={() => setFollowModal({ isOpen: true, type: 'following' })}
                className="group flex items-center gap-2 text-sm"
              >
                <span className="font-black text-gray-900 group-hover:underline">{followStats.following}</span>
                <span className="text-gray-400 font-medium">Following</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-100 mb-10">
            <button onClick={() => setActiveTab('home')} className={`pb-4 px-2 mr-8 font-black uppercase text-xs tracking-widest transition-all relative ${activeTab === 'home' ? 'text-black' : 'text-gray-400'}`}>
              Home ({userBlogs.length})
              {activeTab === 'home' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black animate-in fade-in zoom-in" />}
            </button>
            <button onClick={() => setActiveTab('about')} className={`pb-4 px-2 font-black uppercase text-xs tracking-widest transition-all relative ${activeTab === 'about' ? 'text-black' : 'text-gray-400'}`}>
              About
              {activeTab === 'about' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black animate-in fade-in zoom-in" />}
            </button>
          </div>

          {/* Content Area */}
          <div>
            {activeTab === 'home' && (
              <div className="space-y-10 animate-in fade-in duration-700">
                {userBlogs.length > 0 ? (
                  userBlogs.map((blog) => (
                    <div key={blog.id} className="group block">
                      <div className="flex flex-col md:flex-row gap-6 items-start">
                        <div className="flex-1 order-2 md:order-1">
                          <Link href={`/blog/${blog.slug}`}>
                            <h2 className="text-2xl font-black text-gray-900 mb-2 group-hover:text-yellow-600 transition-colors leading-tight">{blog.title}</h2>
                            <p className="text-gray-500 line-clamp-2 mb-4 font-medium leading-relaxed">{blog.summary}</p>
                          </Link>
                          <div className="flex items-center gap-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{new Date(blog.created_at).toLocaleDateString('th-TH')}</span>
                            <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{blog.view_count || 0}</span>
                            <span className="flex items-center gap-1 text-red-400"><Heart className="w-3.5 h-3.5 fill-red-400" />{blog.likes || 0}</span>
                            {!blog.is_published && <span className="bg-gray-100 px-2 py-0.5 rounded text-[9px]">Draft</span>}
                          </div>
                        </div>
                        {blog.cover_image && (
                          <Link href={`/blog/${blog.slug}`} className="w-full md:w-48 h-32 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0 order-1 md:order-2 shadow-sm group-hover:shadow-md transition-all">
                            <img src={blog.cover_image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          </Link>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-20 text-center bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-100">
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-sm mb-4">ยังไม่มีบทความที่เขียน</p>
                    <Link href="/write" className="text-yellow-600 font-black text-xs underline underline-offset-4 uppercase">สร้างบทความแรก</Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'about' && (
              <div className="animate-in fade-in duration-500">
                {isEditingAbout ? (
                  <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100">
                    <textarea value={aboutMeContent} onChange={(e) => setAboutMeContent(e.target.value)} className="w-full min-h-[250px] p-6 bg-white border border-gray-100 rounded-3xl outline-none resize-none mb-6 font-medium" />
                    <div className="flex justify-end gap-3">
                      <button onClick={() => setIsEditingAbout(false)} className="px-6 py-2 rounded-xl text-gray-500 font-bold hover:bg-gray-200 transition-colors">Cancel</button>
                      <button onClick={handleSaveAboutMe} className="px-8 py-2 rounded-xl bg-black text-white font-bold hover:bg-gray-800 transition-all">Save</button>
                    </div>
                  </div>
                ) : (
                  <div className="relative group">
                    {userProfile.about_me ? (
                      <div className="relative">
                        <p className="whitespace-pre-wrap text-lg text-gray-600 leading-relaxed font-medium">{userProfile.about_me}</p>
                        <button onClick={() => setIsEditingAbout(true)} className="absolute -top-4 -right-4 p-2 bg-white border border-gray-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"><Edit3 className="w-4 h-4 text-gray-400" /></button>
                      </div>
                    ) : (
                      <div className="bg-gray-50 border border-dashed border-gray-200 rounded-[2.5rem] p-16 text-center">
                        <button onClick={() => setIsEditingAbout(true)} className="px-8 py-3 bg-yellow-400 text-black font-black rounded-full shadow-lg shadow-yellow-100 hover:bg-yellow-500 transition-all">เริ่มเขียน About Me</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar ฝั่งขวา */}
        <div className="lg:col-span-4 lg:pl-8 lg:border-l lg:border-gray-50">
          <div className="sticky top-28">
            <div className="w-24 h-24 bg-gray-50 rounded-full overflow-hidden border-4 border-white shadow-xl mb-6 ring-1 ring-gray-100">
              <img src={userProfile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userProfile.username}`} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-xl font-black text-gray-900 tracking-tight">{userProfile.username}</h2>
              {userProfile.pronouns && <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[9px] font-black rounded uppercase tracking-tighter">{userProfile.pronouns}</span>}
            </div>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed font-medium italic">"{userProfile.bio || "BeeBlog Enthusiast"}"</p>
            
            <div className="border-t border-gray-100 pt-6 mt-6 space-y-4">
              <button onClick={() => setFollowModal({ isOpen: true, type: 'followers' })} className="flex items-center justify-between w-full text-sm group">
                <span className="text-gray-400 font-bold uppercase tracking-tighter text-[10px]">Followers</span>
                <span className="font-black text-gray-900 group-hover:text-yellow-600 transition-colors">{followStats.followers}</span>
              </button>
              <button onClick={() => setFollowModal({ isOpen: true, type: 'following' })} className="flex items-center justify-between w-full text-sm group">
                <span className="text-gray-400 font-bold uppercase tracking-tighter text-[10px]">Following</span>
                <span className="font-black text-gray-900 group-hover:text-yellow-600 transition-colors">{followStats.following}</span>
              </button>
            </div>

            <button onClick={() => setIsEditModalOpen(true)} className="mt-10 w-full py-3 bg-gray-50 hover:bg-gray-100 rounded-2xl text-xs font-black text-gray-600 uppercase tracking-widest transition-all">Edit profile</button>
          </div>
        </div>
      </div>
    </div>
  )
}