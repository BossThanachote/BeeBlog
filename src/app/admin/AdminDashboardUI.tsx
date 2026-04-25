'use client'

import React from 'react'
import { ShieldCheck, FileEdit, MessageSquare, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboardUI() {
  return (
    <div className="max-w-5xl mx-auto pt-24 pb-20 px-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex items-center gap-5 mb-12">
        <div className="w-14 h-14 bg-yellow-400 rounded-[1.25rem] flex items-center justify-center text-black shadow-lg shadow-yellow-100 ring-4 ring-yellow-50">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Admin Control Center</h1>
          <p className="text-gray-500 font-medium mt-0.5">ยินดีต้อนรับเลือกจัดการระบบ BeeBlog </p>
        </div>
      </div>

      {/* Grid Menu */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Manage Blogs Card */}
        <Link
          href="/admin/blogs"
          className="p-10 bg-white border border-gray-100 rounded-[3rem] hover:shadow-2xl hover:shadow-yellow-100/50 hover:border-yellow-200 transition-all duration-500 group relative overflow-hidden"
        >
          <div className="w-16 h-16 bg-gray-50 rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:bg-yellow-400 group-hover:rotate-6 transition-all duration-500">
            <FileEdit className="w-9 h-9 text-black" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-3 flex items-center gap-2">
            Manage Blogs
            <ArrowRight className="w-5 h-5 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
          </h2>
          <p className="text-gray-500 leading-relaxed text-sm">
            แก้ไขเนื้อหาบทความ, สลับสถานะการเผยแพร่ และจัดการ URL Slug ให้เหมาะสมกับ SEO
          </p>
          <FileEdit className="absolute -bottom-6 -right-6 w-32 h-32 text-gray-50/50 -rotate-12 group-hover:text-yellow-50 transition-colors" />
        </Link>

        {/* Comment Approval Card */}
        <Link
          href="/admin/comments"
          className="p-10 bg-white border border-gray-100 rounded-[3rem] hover:shadow-2xl hover:shadow-yellow-100/50 hover:border-yellow-200 transition-all duration-500 group relative overflow-hidden"
        >
          <div className="w-16 h-16 bg-gray-50 rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:bg-yellow-400 group-hover:-rotate-6 transition-all duration-500">
            <MessageSquare className="w-9 h-9 text-black" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-3 flex items-center gap-2">
            Comment Approval
            <ArrowRight className="w-5 h-5 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
          </h2>
          <p className="text-gray-500 leading-relaxed text-sm">
            คัดกรองความคิดเห็นจากผู้อ่าน ตรวจสอบความถูกต้องก่อนกดอนุมัติให้แสดงผลบนหน้าเว็บ
          </p>
          <MessageSquare className="absolute -bottom-6 -right-6 w-32 h-32 text-gray-50/50 rotate-12 group-hover:text-yellow-50 transition-colors" />
        </Link>
      </div>
    </div>
  )
}