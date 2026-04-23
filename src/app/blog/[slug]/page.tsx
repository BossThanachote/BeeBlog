'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Blog } from '@/app/types'
import { Loader2, Heart, MessageCircle, BookmarkPlus, PlayCircle, Share, MoreHorizontal } from 'lucide-react'
import Link from 'next/link'

export default function BlogDetailPage() {
  const params = useParams()
  const [blog, setBlog] = useState<Blog | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [readTime, setReadTime] = useState(1)

  // 🌟 ฟังก์ชันคำนวณเวลาอ่าน (อิงจาก 200 คำต่อนาที)
  const calculateReadTime = (text: string) => {
    const words = text.replace(/<[^>]*>?/gm, '').split(/\s+/).length
    const minutes = Math.ceil(words / 200)
    setReadTime(minutes || 1)
  }

  useEffect(() => {
    const fetchBlogDetail = async () => {
      try {
        setIsLoading(true)
        const decodedSlug = decodeURIComponent(params.slug as string)

        const { data, error } = await supabase
          .from('blogs')
          .select('*, users(username)')
          .eq('slug', decodedSlug)
          .single()

        if (error) throw error
        setBlog(data)
        if (data.content) calculateReadTime(data.content)

        // 🌟 อัปเดตยอดวิว
        if (data) {
          await supabase
            .from('blogs')
            .update({ view_count: (data.view_count || 0) + 1 })
            .eq('id', data.id)
        }

      } catch (error) {
        console.error('Error fetching blog detail:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (params.slug) fetchBlogDetail()
  }, [params.slug])

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-400 bg-white">
        <Loader2 className="w-10 h-10 animate-spin text-yellow-400 mb-4" />
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4 bg-white">
        <h1 className="text-4xl font-black text-gray-900 mb-4">ขออภัยครับคุณ Boss 🙏</h1>
        <p className="text-gray-500 mb-8">ไม่พบบทความที่คุณกำลังตามหา หรือบทความนี้อาจถูกลบไปแล้ว</p>
        <Link href="/" className="bg-yellow-400 text-black px-8 py-3 rounded-2xl font-bold hover:bg-yellow-500 transition-all active:scale-95 shadow-sm">
          กลับไปหน้าแรก
        </Link>
      </div>
    )
  }

  // 🌟 Component แถบเครื่องมือ (Medium Style Engagement Bar)
  const ActionBar = () => (
    <div className="flex items-center justify-between py-3 my-8 border-y border-gray-100">
      <div className="flex items-center gap-6 text-gray-500">
        <button className="flex items-center gap-2 hover:text-gray-900 transition-colors group">
          <Heart className="w-5 h-5 group-hover:fill-red-500 group-hover:text-red-500" /> 
          <span className="text-sm font-medium">{blog.view_count || 0}</span> {/* ใช้ view_count แทนไลก์ไปก่อน */}
        </button>
        <button className="flex items-center gap-2 hover:text-gray-900 transition-colors group">
          <MessageCircle className="w-5 h-5 group-hover:fill-blue-500 group-hover:text-blue-500" /> 
          <span className="text-sm font-medium">0</span>
        </button>
      </div>
      <div className="flex items-center gap-5 text-gray-500">
        <button className="hover:text-gray-900 transition-colors" title="ฟังบทความนี้"><PlayCircle className="w-5 h-5" /></button>
        <button className="hover:text-gray-900 transition-colors" title="บันทึก"><BookmarkPlus className="w-5 h-5" /></button>
        <button className="hover:text-gray-900 transition-colors" title="แชร์"><Share className="w-5 h-5" /></button>
        <button className="hover:text-gray-900 transition-colors"><MoreHorizontal className="w-5 h-5" /></button>
      </div>
    </div>
  )

  return (
    <article className="min-h-screen bg-white pt-24 pb-32">
      
      {/* 🌟 1. Main Container (Medium Style: ตรงกลาง ความกว้างอ่านสบาย) */}
      <div className="max-w-[720px] mx-auto px-4 sm:px-6">
        
        {/* 🌟 2. หัวข้อบทความ (ใหญ่ ชัดเจน) */}
        <h1 className="text-[2.5rem] md:text-[3rem] font-black text-gray-900 leading-[1.1] mb-4 tracking-tight">
          {blog.title}
        </h1>
        
        {/* 🌟 3. คำอธิบายรอง (Subtitle) */}
        <p className="text-xl md:text-2xl text-gray-500 mb-8 font-light leading-snug">
          {blog.summary}
        </p>

        {/* 🌟 4. แถบข้อมูลผู้เขียน (Author Row) */}
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 bg-gray-100 rounded-full overflow-hidden shrink-0 border border-gray-200">
            {/* 🌟 เปลี่ยน seed เป็นชื่อคนเขียน เพื่อให้รูปหน้าแต่ละคนไม่ซ้ำกัน */}
            <img 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${blog.users?.username || 'Boss'}`} 
              alt="Author" 
              className="w-full h-full object-cover" 
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              {/* 🌟 ดึงชื่อมาแสดง */}
              <span className="font-bold text-gray-900">{blog.users?.username || 'BeeBlog User'}</span>
              <span className="text-gray-400">·</span>
              <button className="text-yellow-600 font-bold text-sm hover:text-yellow-700 hover:underline">
                Follow
              </button>
            </div>
            <div className="text-sm text-gray-500 flex items-center gap-2 mt-0.5">
              <span>{new Date(blog.created_at).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              <span className="text-gray-300">·</span>
              <span>{readTime} min read</span>
            </div>
          </div>
        </div>

        {/* 🌟 5. แถบเครื่องมือด้านบน (Top Action Bar) */}
        <ActionBar />

        {/* 🌟 6. รูปภาพหน้าปก (อยู่ใต้ Title แบบ Medium) */}
        {blog.cover_image && (
          <figure className="mb-12">
            <div className="w-full aspect-[16/9] bg-gray-100 rounded-2xl overflow-hidden border border-gray-100">
              <img 
                src={blog.cover_image} 
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          </figure>
        )}

        {/* 🌟 7. เนื้อหาบทความ (Clean Typography) */}
        <div 
          className="prose prose-lg md:prose-xl prose-gray max-w-none 
            prose-headings:font-black prose-headings:tracking-tight
            prose-p:text-gray-800 prose-p:leading-relaxed prose-p:mb-8
            prose-img:rounded-2xl prose-img:border prose-img:border-gray-100 prose-img:shadow-sm
            prose-a:text-yellow-600 prose-a:no-underline hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: blog.content }} 
        />

        {/* 🌟 8. แถบเครื่องมือด้านล่าง (Bottom Action Bar) */}
        <div className="mt-12">
          <ActionBar />
        </div>

      </div>

      {/* 🌟 CSS สำหรับจัดการ Gallery Images ให้เหมือนเดิม */}
      <style dangerouslySetInnerHTML={{ __html: `
        div[data-type="image-group"] {
          display: flex;
          flex-wrap: nowrap;
          gap: 16px;
          margin: 2.5rem 0;
          width: 100%;
        }
        div[data-type="image-group"] > div {
          flex: 1;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid #f3f4f6;
          background-color: #f9fafb;
        }
        div[data-type="image-group"] img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          margin: 0 !important;
          transition: transform 0.5s;
        }
        div[data-type="image-group"] img:hover {
          transform: scale(1.02);
        }
        @media (max-width: 768px) {
          div[data-type="image-group"] {
            flex-direction: column;
          }
        }
      `}} />
    </article>
  )
}