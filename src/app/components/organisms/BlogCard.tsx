'use client'

import React from 'react'
import Link from 'next/link'
import { Heart, MessageCircle, BookmarkPlus, MoreHorizontal } from 'lucide-react'
import { Blog } from '@/app/types'

export const BlogCard = ({ blog }: { blog: Blog }) => {
  // ฟังก์ชันคำนวณเวลา (หรือจะใช้ library อย่าง date-fns ก็ได้ครับ)
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const formatRelativeTime = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInMs = now.getTime() - past.getTime();
    
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);

    // 1. ถ้าไม่ถึง 1 นาที
    if (diffInSeconds < 60) {
      return "เมื่อสักครู่";
    }
    
    // 2. ถ้าไม่ถึง 1 ชั่วโมง (แสดงเป็นนาที)
    if (diffInMinutes < 60) {
      return `${diffInMinutes} นาทีที่แล้ว`;
    }
    
    // 3. ถ้าไม่ถึง 24 ชั่วโมง (แสดงเป็นชั่วโมง)
    if (diffInHours < 24) {
      return `${diffInHours} ชั่วโมงที่แล้ว`;
    }

    // 4. ถ้าเกิน 24 ชั่วโมงไปแล้ว ให้แสดงเป็นวันที่ปกติ (เช่น 24 เม.ย. 2569)
    return past.toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // 🌟 ดึงชื่อผู้เขียนออกมา ถ้าไม่มีให้ใช้ค่าเริ่มต้น
  const authorName = blog.users?.username || 'BeeBlog User';
  // 🌟 เอาอักษรตัวแรกของชื่อมาทำเป็นตัวพิมพ์ใหญ่สำหรับโชว์ในวงกลม
  const authorInitial = authorName.charAt(0).toUpperCase();

  return (
    <Link href={`/blog/${blog.slug}`} className="group block">
      <div className="flex flex-col md:flex-row gap-8 py-8 border-b border-gray-100 cursor-pointer group">
        
        {/* เนื้อหาข้อความ */}
        <div className="flex flex-col justify-center flex-1 order-last md:order-first">
           <div className="flex items-center gap-2 mb-3">
             <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center overflow-hidden shrink-0">
               {/* 🌟 แสดงอักษรตัวแรกของชื่อ */}
               <span className="text-[10px] font-black">{authorInitial}</span>
             </div>
             {/* 🌟 แสดงชื่อผู้ใช้เต็มๆ */}
             <span className="text-sm font-medium text-gray-900">{authorName}</span>
             <span className="text-xs text-gray-400">· {formatRelativeTime(blog.created_at)}</span>
           </div>
           
           <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-yellow-600 transition-colors leading-snug">
             {blog.title}
           </h2>
           
           {/* 📄 4. คำอธิบายจริง (จาก summary ใน DB) */}
           <p className="text-base text-gray-600 line-clamp-2 mb-6">
             {blog.summary || "ไม่มีคำอธิบายเพิ่มเติม..."}
           </p>
           
           <div className="flex items-center justify-between mt-auto text-gray-500 text-sm">
             <div className="flex items-center gap-6">
               <div className="flex items-center gap-1.5 hover:text-red-500 transition-colors">
                 <Heart className="w-4 h-4" /> {blog.view_count || 0}
               </div>
               <div className="flex items-center gap-1.5 hover:text-blue-500 transition-colors">
                 <MessageCircle className="w-4 h-4" /> 0
               </div>
             </div>
             <div className="flex items-center gap-4 text-gray-400">
               <BookmarkPlus className="w-5 h-5 hover:text-gray-900 transition-colors" />
               <MoreHorizontal className="w-5 h-5 hover:text-gray-900 transition-colors" />
             </div>
           </div>
        </div>

        {/* 🖼️ รูปภาพปก (ดึงจาก cover_image) */}
        <div className="w-full md:w-[200px] h-[134px] bg-gray-100 overflow-hidden shrink-0 mt-2 md:mt-0 rounded-lg">
           <img 
            src={blog.cover_image || ''} 
            alt={blog.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
           />
        </div>

      </div>
    </Link>
  );
};