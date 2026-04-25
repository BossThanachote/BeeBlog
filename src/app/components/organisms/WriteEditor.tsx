'use client'

import React from 'react'
import Link from 'next/link'
import { Settings, Save, AlertCircle } from 'lucide-react'
import { TiptapEditor } from '@/app/components/organisms/TiptapEditor'
import { CoverUploader } from '@/app/components/organisms/CoverUploader'

// ฟังก์ชันนับจำนวนรูปภาพ 
const getImagesCount = (html: string) => {
  if (!html) return 0
  let count = 0
  // ดักจับ Array ของรูปภาพ
  const matches = html.match(/data-images="([^"]+)"/g) || html.match(/data-images='([^']+)'/g)

  if (matches) {
    matches.forEach(match => {
      try {
        // ถอดรหัส &quot; กลับมาเป็น " แล้วแปลงกลับเป็น Array เพื่อตรวจนับ
        const dataStr = match.replace(/data-images=|"|'/g, '')
        const decodedStr = dataStr.replace(/&quot;/g, '"')
        const arr = JSON.parse(decodedStr)
        if (Array.isArray(arr)) count += arr.length
      } catch (e) {
        console.error("Count Error:", e)
      }
    })
  }
  return count
}
interface WriteEditorProps {
  title: string
  setTitle: (t: string) => void
  coverImage: string
  setCoverImage: (c: string) => void
  content: string
  setContent: (c: string) => void
  onPrePublish: () => void
  onError: (title: string, message: string) => void
}

export const WriteEditor = ({ title, setTitle, coverImage, setCoverImage, content, setContent, onPrePublish, onError }: WriteEditorProps) => { // 🌟 รับ onError

  // ดึงจำนวนรูปปัจจุบันแบบ Real-time ตามตัวหนังสือที่พิมพ์
  const currentImageCount = getImagesCount(content)
  const isOverLimit = currentImageCount > 6

  return (
    <div className="pb-32">
      {/* Navbar Editor */}
      <nav className="sticky top-0 w-full h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 flex items-center justify-between z-50">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-yellow-400 rounded-xl flex items-center justify-center font-black text-black shadow-sm group-hover:rotate-12 transition-transform">B</div>
            <span className="text-xl font-bold tracking-tighter text-gray-900 hidden sm:block">BeeBlog Writer</span>
          </Link>
          <div className="h-4 w-px bg-gray-200 mx-2 hidden sm:block"></div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            บันทึกอัตโนมัติแล้ว
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2.5 text-gray-400 hover:bg-gray-100 rounded-xl transition-colors"><Settings className="w-5 h-5" /></button>
          <button className="flex items-center gap-2 px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl text-sm font-bold transition-all active:scale-95">
            <Save className="w-4 h-4" />
            <span className="hidden sm:block">บันทึกร่าง</span>
          </button>

          {/* ปุ่ม Publish เป็นสีแดงเมื่อใส่รูปเกิน 6 รูป */}
          <button
            onClick={() => {
              if (isOverLimit) {

                onError(
                  "รูปภาพเกินกำหนด",
                  `คุณใส่รูปภาพไป ${currentImageCount} รูป กรุณาลบออกให้เหลือสูงสุด 6 รูปก่อนทำการ Publish `
                )
                return
              }
              onPrePublish()
            }}
            className={`flex items-center gap-2 px-8 py-2.5 rounded-xl text-md font-bold transition-all shadow-md active:scale-95 ${isOverLimit
                ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 cursor-not-allowed'
                : 'bg-yellow-400 text-black hover:bg-yellow-500 hover:shadow-lg'
              }`}
          >
            {isOverLimit && <AlertCircle className="w-4 h-4" />}
            Publish
          </button>
        </div>
      </nav>

      {/* พื้นที่กระดาษเขียน */}
      <div className="max-w-4xl mx-auto mt-8 sm:mt-12 px-4">
        <CoverUploader coverUrl={coverImage} setCoverUrl={setCoverImage} />

        {/* กล่องเนื้อหา */}
        <div className={`bg-white rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border p-8 sm:p-16 transition-colors duration-500 ${isOverLimit ? 'border-red-300 ring-4 ring-red-50' : 'border-gray-100'}`}>
          <textarea
            placeholder="ใส่หัวข้อเรื่องที่น่าสนใจตรงนี้..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-4xl sm:text-5xl font-black text-gray-900 placeholder-gray-200 border-none outline-none resize-none overflow-hidden bg-transparent mb-10 leading-tight"
            rows={1}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = target.scrollHeight + 'px';
            }}
          />
          <TiptapEditor content={content} onChange={setContent} onError={onError} />
        </div>

        {/* Footer Stats */}
        <div className="mt-8 flex items-center justify-between text-gray-400 text-sm px-4">
          <div className="flex gap-6 items-center">
            <span>ตัวอักษร: {content.replace(/<[^>]*>/g, '').length}</span>

            {/* แสดงจำนวนรูประยะประชิด ถ้าเกินเปลี่ยนเป็นป้ายเตือนสีแดง */}
            <span className={`px-3 py-1 rounded-lg font-bold transition-colors ${isOverLimit ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-gray-100 text-gray-600'
              }`}>
              รูปภาพในเนื้อหา: {currentImageCount} / 6
            </span>
          </div>
          <p className="italic">BeeBlog Editor v1.0 — Happy Writing!</p>
        </div>
      </div>
    </div>
  )
}