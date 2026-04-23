'use client'

import React, { useState } from 'react'
import { Image as ImageIcon, X, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface CoverUploaderProps {
  coverUrl: string
  setCoverUrl: (url: string) => void
}

export const CoverUploader = ({ coverUrl, setCoverUrl }: CoverUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    
    const file = e.target.files[0]
    setIsUploading(true)

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `cover-${Math.random()}.${fileExt}`
      const filePath = `blog-images/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('beeblog-storage')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('beeblog-storage')
        .getPublicUrl(filePath)

      setCoverUrl(data.publicUrl)
    } catch (error) {
      console.error("Upload Error:", error)
      alert("อัปโหลดรูปปกไม่สำเร็จ กรุณาลองใหม่")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="w-full mb-8">
      {!coverUrl ? (
        // 🌟 หน้าจอตอนยังไม่มีรูป (ตาม Design ของคุณ Boss)
        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-100 border-dashed rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {isUploading ? (
              <Loader2 className="w-10 h-10 text-yellow-500 animate-spin mb-3" />
            ) : (
              <div className="bg-white p-3 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                <ImageIcon className="w-6 h-6 text-yellow-500" />
              </div>
            )}
            <p className="mb-1 text-sm font-bold text-gray-700">
              {isUploading ? 'กำลังอัปโหลด...' : 'อัปโหลดรูปภาพปก (Cover Image)'}
            </p>
            <p className="text-xs text-gray-400">แนะนำขนาด 1200 x 630 px</p>
          </div>
          <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={isUploading} />
        </label>
      ) : (
        // 🌟 หน้าจอตอนมีรูปแล้ว (แสดงรูปเต็มๆ พร้อมปุ่มลบทิ้ง)
        <div className="relative w-full h-auto min-h-[250px] max-h-[400px] rounded-2xl overflow-hidden group border border-gray-100 shadow-sm">
          <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" />
          
          {/* ปุ่มลบรูปปก */}
          <button
            onClick={() => setCoverUrl('')}
            className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            title="ลบรูปปก"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  )
}