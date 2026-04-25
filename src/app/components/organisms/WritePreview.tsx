'use client'

import React from 'react'
import { ChevronLeft, AlertCircle } from 'lucide-react'
import { CoverUploader } from '@/app/components/organisms/CoverUploader'

interface WritePreviewProps {
  title: string
  setTitle: (t: string) => void
  subtitle: string
  setSubtitle: (s: string) => void
  coverImage: string
  setCoverImage: (c: string) => void
  onBack: () => void
  onFinalPublish: () => void
}

export const WritePreview = ({ title, setTitle, subtitle, setSubtitle, coverImage, setCoverImage, onBack, onFinalPublish }: WritePreviewProps) => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto pt-16 px-6 sm:px-12">
        
        {/* ปุ่มย้อนกลับ */}
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-10 transition-colors font-medium"
        >
          <ChevronLeft className="w-5 h-5" /> กลับไปแก้ไขเนื้อหา
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* คอลัมน์ซ้าย */}
          <div className="flex flex-col gap-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Story Preview</h2>
            
            <div className="w-full aspect-[1.9/1] bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
               <CoverUploader coverUrl={coverImage} setCoverUrl={setCoverImage} />
            </div>

            <div className="flex flex-col gap-2 mt-4">
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border-b border-gray-300 py-2 font-bold text-lg text-gray-900 outline-none focus:border-gray-900 transition-colors placeholder-gray-400"
                placeholder="Write a preview title"
              />
              <div className="flex justify-between items-center text-xs text-gray-400">
                <span>{title.length}/100</span>
                {title.length === 0 && <span className="text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> Please enter a title</span>}
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-2">
              <input 
                type="text" 
                value={subtitle} 
                onChange={(e) => setSubtitle(e.target.value)}
                maxLength={140}
                className="w-full border-b border-gray-300 py-2 text-gray-600 outline-none focus:border-gray-900 transition-colors placeholder-gray-400"
                placeholder="Write a preview subtitle..."
              />
              <span className="text-xs text-gray-400">{subtitle.length}/140</span>
            </div>

            <p className="text-sm text-gray-500 leading-relaxed mt-2 bg-gray-50 p-4 rounded-xl">
              <span className="font-bold text-gray-700">Note:</span> การเปลี่ยนแปลงในหน้านี้จะส่งผลต่อการแสดงผลบนหน้าฟีดหลักของ BeeBlog เท่านั้น จะไม่กระทบกับเนื้อหาจริงภายในบทความ
            </p>
          </div>

          {/* คอลัมน์ขวา */}
          <div className="flex flex-col gap-8 md:pt-14">
            <div className="flex flex-col gap-2">
              <h3 className="font-bold text-gray-900">Publishing to:</h3>
              <p className="text-gray-600 text-sm">BeeBlog Public Feed</p>
            </div>
            <hr className="border-gray-100" />
            <div className="flex flex-col gap-4">
              <p className="text-sm text-gray-600">เมื่อกด Publish บทความของคุณจะถูกเผยแพร่สู่สาธารณะทันที คุณสามารถกลับมาแก้ไขเนื้อหาได้ในภายหลัง</p>
              <div className="flex items-center gap-4 mt-4">
                <button 
                  onClick={onFinalPublish}
                  disabled={!title.trim() || !coverImage}
                  className="bg-green-400 disabled:bg-green-200 hover:bg-green-500 text-white px-8 py-3 rounded-full text-sm font-bold transition-all shadow-sm active:scale-95"
                >
                  Publish now
                </button>
                <button onClick={onBack} className="text-gray-500 hover:text-gray-900 font-medium text-sm transition-colors">Cancel</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}