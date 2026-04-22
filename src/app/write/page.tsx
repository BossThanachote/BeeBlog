'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Image as ImageIcon, Settings, Save } from 'lucide-react';
import { TiptapEditor } from '@/app/components/organisms/TiptapEditor'; // อิมพอร์ต Editor เข้ามา

export default function WriteBlog() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState(''); // State สำหรับเก็บเนื้อหา Blog ที่พิมพ์

  // ฟังก์ชันจำลองตอนกด Publish
  const handlePublish = () => {
    console.log("Title:", title);
    console.log("Content HTML:", content);
    alert("เตรียมบันทึกลง Database!");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      
      {/* --- 1. Navbar เฉพาะกิจ (Theme BeeBlog) --- */}
      <nav className="sticky top-0 w-full h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between z-50">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center font-bold text-black shadow-sm">B</div>
            <span className="text-xl font-bold tracking-tight text-gray-900 hidden sm:block">BeeBlog Writer</span>
          </Link>
          <div className="h-4 w-px bg-gray-300 mx-2 hidden sm:block"></div>
          <span className="text-sm text-gray-500 font-medium">Draft (บันทึกอัตโนมัติ)</span>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl text-sm font-bold transition-colors cursor-pointer">
            <Save className="w-4 h-4" />
            <span className="hidden sm:block">บันทึก</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl text-sm font-bold transition-colors cursor-pointer">
            <Settings className="w-4 h-4" />
          </button>
          <button 
            onClick={handlePublish}
            className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-xl text-sm font-bold transition-colors shadow-sm cursor-pointer"
          >
            Publish
          </button>
        </div>
      </nav>

      {/* --- 2. พื้นที่กระดาษเขียนบล็อก (Document Layout) --- */}
      <div className="max-w-4xl mx-auto mt-8 sm:mt-12 px-4 sm:px-0">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          
          {/* โซนอัปโหลด "รูปปก" (Cover Image) - ตอบโจทย์ Assignment */}
          <div className="h-64 sm:h-80 bg-gray-50 border-b border-gray-100 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors cursor-pointer group relative">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform mb-4">
              <ImageIcon className="w-8 h-8 text-yellow-500" />
            </div>
            <p className="font-bold text-gray-700">อัปโหลดรูปภาพปก (Cover Image)</p>
            <p className="text-sm mt-1">แนะนำขนาด 1200 x 630 px</p>
          </div>

          <div className="p-8 sm:p-12">
            
            {/* Input หัวข้อ (Title) */}
            <textarea 
              placeholder="หัวข้อบทความของคุณ..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-4xl sm:text-5xl font-bold text-gray-900 placeholder-gray-300 border-none outline-none resize-none overflow-hidden bg-transparent mb-8"
              rows={1}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = target.scrollHeight + 'px';
              }}
            />

            {/* --- เรียกใช้ Tiptap Editor ที่เราสร้างไว้ --- */}
            {/* ส่ง content เข้าไปและรับค่าใหม่กลับมาอัปเดต State */}
            <TiptapEditor 
              content={content} 
              onChange={(newContent) => setContent(newContent)} 
            />

          </div>
        </div>
      </div>
    </div>
  );
}