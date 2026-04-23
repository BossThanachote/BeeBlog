'use client'

import React, { useState, useEffect } from 'react'
import { X, Loader2, Upload } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
  currentUser: any
  onSaved: () => void // โหลดข้อมูลใหม่เมื่อเซฟเสร็จ
}

export const EditProfileModal = ({ isOpen, onClose, currentUser, onSaved }: EditProfileModalProps) => {
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)
  
  // States สำหรับเก็บค่าในฟอร์ม
  const [username, setUsername] = useState('')
  const [pronouns, setPronouns] = useState('')
  const [bio, setBio] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')

  // เมื่อเปิด Modal ให้ดึงค่าเดิมมาใส่ในช่อง
  useEffect(() => {
    if (currentUser && isOpen) {
      setUsername(currentUser.username || '')
      setPronouns(currentUser.pronouns || '')
      setBio(currentUser.bio || '')
      setAvatarUrl(currentUser.avatar_url || '')
    }
  }, [currentUser, isOpen])

  if (!isOpen) return null

  const handleSave = async () => {
    try {
      setIsLoading(true)
      const { error } = await supabase
        .from('users')
        .update({
          username: username,
          pronouns: pronouns,
          bio: bio,
          avatar_url: avatarUrl
        })
        .eq('id', currentUser.id)

      if (error) throw error
      
      onSaved() // สั่งให้หน้าหลักดึงข้อมูลใหม่
      onClose() // ปิดหน้าต่าง
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูลครับ")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl p-8 animate-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors">
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-black text-gray-900 mb-6">Profile information</h2>

        <div className="space-y-6">
          {/* Photo Section */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Photo</label>
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gray-100 rounded-full overflow-hidden border border-gray-200 shrink-0">
                <img 
                  src={avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`} 
                  alt="Avatar Preview" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                {/* อนาคตสามารถทำระบบ Upload รูปจริงได้ ตอนนี้ให้ใส่ URL ไปก่อนเพื่อความง่ายครับ */}
                <input 
                  type="text" 
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="วาง URL รูปภาพโปรไฟล์ของคุณที่นี่..."
                  className="w-full text-sm p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none"
                />
                <p className="text-xs text-gray-500 mt-2">Recommended: Square image, or leave blank to use random avatar.</p>
              </div>
            </div>
          </div>

          {/* Name Section */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Name*</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none"
            />
          </div>

          {/* Pronouns Section */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Pronouns</label>
            <input 
              type="text" 
              value={pronouns}
              onChange={(e) => setPronouns(e.target.value)}
              placeholder="e.g. he/him, she/her"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none"
            />
          </div>

          {/* Short Bio Section */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Short bio</label>
            <textarea 
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="เขียนอธิบายตัวเองสั้นๆ..."
              rows={3}
              maxLength={160}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none resize-none"
            />
            <div className="text-right text-xs text-gray-400 mt-1">{bio.length}/160</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 mt-8">
          <button onClick={onClose} className="px-6 py-2.5 text-gray-500 font-bold hover:bg-gray-50 rounded-xl transition-colors">
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            disabled={isLoading || !username}
            className="px-6 py-2.5 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            Save
          </button>
        </div>
      </div>
    </div>
  )
}