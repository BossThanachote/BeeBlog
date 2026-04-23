'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Loader2, Edit3, MoreHorizontal } from 'lucide-react'
import { Navbar } from '@/app/components/organisms/Navbar'
import { EditProfileModal } from '@/app/components/organisms/EditProfileModal'

export default function ProfilePage() {
  const supabase = createClient()
  const [userProfile, setUserProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // States สำหรับควบคุม UI
  const [activeTab, setActiveTab] = useState<'home' | 'about'>('about')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isEditingAbout, setIsEditingAbout] = useState(false)
  const [aboutMeContent, setAboutMeContent] = useState('')

  const fetchProfile = async () => {
    try {
      setIsLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()
          
        if (error) throw error
        setUserProfile(data)
        setAboutMeContent(data.about_me || '')
      } else {
        window.location.href = '/login' // ถ้ายังไม่ Login ให้เตะกลับ
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const handleSaveAboutMe = async () => {
    try {
      setIsLoading(true)
      await supabase
        .from('users')
        .update({ about_me: aboutMeContent })
        .eq('id', userProfile.id)
      
      setIsEditingAbout(false)
      fetchProfile() // รีเฟรชข้อมูล
    } catch (error) {
      console.error("Save error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading && !userProfile) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-yellow-400" /></div>
  }

  if (!userProfile) return null

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <EditProfileModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        currentUser={userProfile}
        onSaved={fetchProfile} // เซฟเสร็จให้โหลดข้อมูลใหม่
      />

      <div className="max-w-6xl mx-auto pt-24 px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* 🌟 ฝั่งซ้าย: เนื้อหาหลัก (Tabs & About) */}
        <div className="lg:col-span-8 md:pr-8">
          
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-black text-gray-900">{userProfile.username}</h1>
            <button className="p-2 text-gray-400 hover:text-gray-900 transition-colors hidden md:block">
              <MoreHorizontal className="w-6 h-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-8">
            <button 
              onClick={() => setActiveTab('home')}
              className={`pb-4 px-2 mr-6 font-bold transition-all relative ${activeTab === 'home' ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Home
              {activeTab === 'home' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black" />}
            </button>
            <button 
              onClick={() => setActiveTab('about')}
              className={`pb-4 px-2 font-bold transition-all relative ${activeTab === 'about' ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}
            >
              About
              {activeTab === 'about' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black" />}
            </button>
          </div>

          {/* Content Area */}
          <div>
            {activeTab === 'home' && (
              <div className="text-center py-20 text-gray-400">
                <p>บทความของคุณจะมาแสดงที่นี่ในอนาคตครับ 🐝</p>
              </div>
            )}

            {activeTab === 'about' && (
              <div className="animate-in fade-in duration-500">
                {isEditingAbout ? (
                  /* ✏️ โหมดแก้ไข About Me */
                  <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                    <p className="text-sm font-bold text-gray-700 mb-4">เขียนเรื่องราวเกี่ยวกับตัวคุณ...</p>
                    
                    {/* 💡 Note: ถ้าอยากใช้ WriteEditor (Tiptap) ของคุณ Boss สามารถเอามาแปะแทน textarea นี้ได้เลยครับ! */}
                    <textarea 
                      value={aboutMeContent}
                      onChange={(e) => setAboutMeContent(e.target.value)}
                      className="w-full min-h-[200px] p-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-yellow-400 outline-none resize-none mb-4"
                      placeholder="เล่าเรื่องราวของคุณให้โลกฟัง..."
                    />
                    
                    <div className="flex justify-end gap-3">
                      <button onClick={() => setIsEditingAbout(false)} className="px-6 py-2 rounded-xl text-gray-500 font-bold hover:bg-gray-200 transition-colors">
                        Cancel
                      </button>
                      <button onClick={handleSaveAboutMe} className="px-6 py-2 rounded-xl bg-black text-white font-bold hover:bg-gray-800 transition-colors">
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  /* 📖 โหมดอ่าน About Me */
                  <div className="relative group min-h-[200px]">
                    {userProfile.about_me ? (
                      <div className="prose prose-lg prose-yellow max-w-none prose-p:text-gray-600">
                        {/* ถ้าใช้ Tiptap สามารถใช้ dangerouslySetInnerHTML ได้ครับ */}
                        <p className="whitespace-pre-wrap">{userProfile.about_me}</p>
                      </div>
                    ) : (
                      <div className="bg-gray-50 border border-dashed border-gray-300 rounded-3xl p-12 text-center">
                        <p className="text-gray-500 mb-4">คุณยังไม่ได้เขียนอธิบายเกี่ยวกับตัวเองเลย</p>
                        <button 
                          onClick={() => setIsEditingAbout(true)}
                          className="px-6 py-2 bg-yellow-400 text-black font-bold rounded-full hover:bg-yellow-500 transition-colors shadow-sm"
                        >
                          เริ่มเขียน About Me
                        </button>
                      </div>
                    )}
                    
                    {/* ปุ่มแก้ไขโผล่มาตอน Hover (สไตล์ Medium) */}
                    {userProfile.about_me && (
                      <button 
                        onClick={() => setIsEditingAbout(true)}
                        className="absolute top-0 right-0 p-2 bg-white border border-gray-200 shadow-sm rounded-full text-gray-500 hover:text-black opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 -translate-y-4"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 🌟 ฝั่งขวา: Sidebar (Avatar, Bio, Pronouns) */}
        <div className="lg:col-span-4 lg:pl-8 lg:border-l lg:border-gray-100">
          <div className="sticky top-28">
            <div className="w-24 h-24 bg-gray-100 rounded-full overflow-hidden border-2 border-gray-100 mb-4 shadow-sm">
              <img 
                src={userProfile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userProfile.username}`} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-xl font-black text-gray-900">{userProfile.username}</h2>
              {userProfile.pronouns && (
                <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold rounded-md uppercase tracking-wider">
                  {userProfile.pronouns}
                </span>
              )}
            </div>

            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              {userProfile.bio || "ยังไม่มีคำอธิบาย Bio"}
            </p>

            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="text-sm font-bold text-green-600 hover:text-green-700 transition-colors hover:underline"
            >
              Edit profile
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}