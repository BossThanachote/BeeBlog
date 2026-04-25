'use client'

import React, { useState, useEffect } from 'react'
import { X, Loader2, Upload, Image as ImageIcon } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
  currentUser: any
  onSaved: () => void
}

export const EditProfileModal = ({ isOpen, onClose, currentUser, onSaved }: EditProfileModalProps) => {
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [dragActive, setDragActive] = useState(false)

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

  // ── ส่วนจัดการ Drag & Drop ──────────────────────────
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await uploadImage(e.dataTransfer.files[0])
    }
  }

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      await uploadImage(e.target.files[0])
    }
  }

  // ── ส่วนจัดการ Upload รูปขึ้น Supabase ────────────────
  const uploadImage = async (file: File) => {
    try {
      // 1. ตรวจสอบว่าเป็นไฟล์รูปภาพเท่านั้น
      if (!file.type.startsWith('image/')) {
        alert('กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น')
        return
      }

      // 2. ตรวจสอบขนาดไฟล์ (เช่น ไม่เกิน 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('ขนาดไฟล์ต้องไม่เกิน 5MB')
        return
      }

      setIsUploadingImage(true)

      // สร้างชื่อไฟล์ให้ไม่ซ้ำกัน (ใช้ userId + เวลาปัจจุบัน)
      const fileExt = file.name.split('.').pop()
      const fileName = `${currentUser.id}-${Date.now()}.${fileExt}`
      const filePath = `${fileName}`

      // อัปโหลดขึ้น Bucket 'avatars'
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          upsert: true, // ทับไฟล์เดิมได้
          cacheControl: '3600'
        })

      if (uploadError) throw uploadError

      // ดึง Public URL กลับมาแสดงผล
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      // อัปเดต State ให้โชว์รูปใหม่ทันที
      setAvatarUrl(publicUrl)

    } catch (error) {
      console.error("Upload error:", error)
      alert("เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ")
    } finally {
      setIsUploadingImage(false)
    }
  }

  // ส่วนบันทึกข้อมูล Profile 
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

      onSaved()
      onClose()
      window.dispatchEvent(new Event('profileUpdated'))
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล")
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
          {/* 🌟 Photo Section (อัปเดตใหม่) */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Photo</label>
            <div className="flex flex-col sm:flex-row items-center gap-6">

              {/* Avatar Preview */}
              <div className="w-24 h-24 bg-gray-100 rounded-full overflow-hidden border-4 border-white shadow-md shrink-0 relative group">
                <img
                  src={avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`}
                  alt="Avatar Preview"
                  className={`w-full h-full object-cover transition-opacity ${isUploadingImage ? 'opacity-50' : 'opacity-100'}`}
                />
                {isUploadingImage && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-gray-600" />
                  </div>
                )}
              </div>

              {/* Drag & Drop Zone */}
              <div
                className={`flex-1 w-full relative border-2 border-dashed rounded-2xl p-4 text-center transition-all duration-200 ${dragActive
                    ? 'border-yellow-400 bg-yellow-50'
                    : 'border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300'
                  }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  disabled={isUploadingImage}
                />
                <div className="flex flex-col items-center justify-center gap-2 pointer-events-none">
                  {isUploadingImage ? (
                    <p className="text-sm font-medium text-yellow-600">กำลังอัปโหลด...</p>
                  ) : (
                    <>
                      <Upload className={`w-6 h-6 ${dragActive ? 'text-yellow-500' : 'text-gray-400'}`} />
                      <p className="text-sm text-gray-600">
                        <span className="font-bold text-gray-900">คลิกเพื่ออัปโหลด</span> หรือลากไฟล์มาวาง
                      </p>
                      <p className="text-[10px] text-gray-400">รองรับ JPEG, PNG, WEBP (สูงสุด 5MB)</p>
                    </>
                  )}
                </div>
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
            disabled={isLoading || !username || isUploadingImage}
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