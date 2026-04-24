'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Blog } from '@/app/types'
import { 
  FileEdit, 
  Search, 
  Plus, 
  Eye, 
  Trash2, 
  Globe, 
  Lock, 
  ChevronLeft,
  ChevronRight,
  Loader2,
  Calendar
} from 'lucide-react'
import Link from 'next/link'

export default function AdminManageBlogs() {
  const supabase = createClient()
  const [blogs, setBlogs] = useState<Partial<Blog>[]>([]) // ใช้ Partial เพราะเราจะดึงไม่ครบทุกฟิลด์
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const itemsPerPage = 10

  const fetchBlogs = useCallback(async () => {
    try {
      setIsLoading(true)
      const start = (currentPage - 1) * itemsPerPage
      const end = start + itemsPerPage - 1

      // 🌟 Optimization: ดึงเฉพาะฟิลด์ที่ต้องใช้โชว์ในตาราง (ไม่ดึง content ที่หนักๆ มา)
      let query = supabase
        .from('blogs')
        .select('id, title, slug, cover_image, is_published, view_count, created_at', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(start, end)

      if (searchTerm) {
        query = query.ilike('title', `%${searchTerm}%`)
      }

      const { data, error, count } = await query

      if (error) throw error
      setBlogs(data || [])
      setTotalCount(count || 0)
    } catch (err) {
      console.error('Error fetching blogs:', err)
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, searchTerm, supabase])

  useEffect(() => {
    fetchBlogs()
  }, [fetchBlogs])

  const togglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('blogs')
        .update({ is_published: !currentStatus })
        .eq('id', id)
      
      if (error) throw error
      setBlogs(prev => prev.map(b => b.id === id ? { ...b, is_published: !currentStatus } : b))
    } catch (err) {
      alert('ไม่สามารถอัปเดตสถานะได้')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('คุณแน่ใจนะว่าจะลบบทความนี้?')) return
    
    try {
      const { error } = await supabase.from('blogs').delete().eq('id', id)
      if (error) throw error
      fetchBlogs() // โหลดข้อมูลใหม่
    } catch (err) {
      alert('ลบไม่สำเร็จครับ')
    }
  }

  return (
    <div className="max-w-6xl mx-auto pt-24 pb-20 px-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <FileEdit className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Manage Blogs</h1>
            <p className="text-gray-500 font-medium">จัดการและแก้ไขบทความทั้งหมดในระบบ</p>
          </div>
        </div>
        <Link 
          href="/write" 
          className="flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-4 rounded-2xl transition-all active:scale-95 shadow-sm shadow-yellow-100"
        >
          <Plus className="w-5 h-5 stroke-[3]" /> สร้างบทความใหม่
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8 group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-yellow-500 transition-colors" />
        <input 
          type="text" 
          placeholder="ค้นหาชื่อบทความที่ต้องการ..."
          className="w-full pl-14 pr-6 py-5 bg-white border border-gray-100 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-yellow-400/10 focus:border-yellow-400 shadow-sm transition-all text-gray-700 font-medium"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setCurrentPage(1) // รีเซ็ตหน้ากลับไปที่ 1 เมื่อค้นหา
          }}
        />
      </div>

      {/* Blogs List Card */}
      <div className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">บทความ</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">สถานะ</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">ยอดวิว</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">เครื่องมือ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="py-24 text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-yellow-400 mx-auto" />
                    <p className="mt-4 text-sm font-bold text-gray-400 animate-pulse uppercase tracking-widest">กำลังดึงข้อมูล...</p>
                  </td>
                </tr>
              ) : blogs.length > 0 ? (
                blogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-gray-50/40 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-5">
                        <div className="w-20 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100 shadow-sm">
                          <img src={blog.cover_image} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                        </div>
                        <div className="max-w-xs md:max-w-md">
                          <h3 className="font-bold text-gray-900 truncate group-hover:text-yellow-600 transition-colors">{blog.title}</h3>
                          <div className="flex items-center gap-2 mt-1.5 text-[11px] text-gray-400">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(blog.created_at!).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            <span className="text-gray-200">|</span>
                            <span className="font-mono">{blog.slug}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <button 
                        onClick={() => togglePublish(blog.id!, blog.is_published!)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all shadow-sm ${
                          blog.is_published 
                          ? 'bg-green-50 text-green-600 ring-1 ring-green-100' 
                          : 'bg-gray-100 text-gray-500 ring-1 ring-gray-200'
                        }`}
                      >
                        {blog.is_published ? <Globe className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                        {blog.is_published ? 'Public' : 'Draft'}
                      </button>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="text-sm font-black text-gray-700 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
                        {blog.view_count || 0}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end items-center gap-2">
                        <Link 
                          href={`/blog/${blog.slug}`}
                          className="p-2.5 text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 rounded-xl transition-all"
                          title="View"
                        >
                          <Eye className="w-5 h-5" />
                        </Link>
                        <Link 
                          href={`/admin/blogs/edit/${blog.id}`}
                          className="p-2.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                          title="Edit"
                        >
                          <FileEdit className="w-5 h-5" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(blog.id!)}
                          className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-24 text-center">
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">ไม่พบบทความที่คุณค้นหาครับ</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-8 py-6 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-white border border-gray-100 px-3 py-1.5 rounded-lg shadow-sm">
              Page {currentPage}
            </span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-2">
              Showing {blogs.length} of {totalCount} Blogs
            </span>
          </div>
          <div className="flex gap-3">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="p-3 rounded-xl border border-gray-100 bg-white text-gray-600 hover:bg-yellow-400 hover:text-black disabled:opacity-20 disabled:hover:bg-white disabled:hover:text-gray-600 transition-all shadow-sm active:scale-90"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
            <button 
              disabled={currentPage * itemsPerPage >= totalCount}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="p-3 rounded-xl border border-gray-100 bg-white text-gray-600 hover:bg-yellow-400 hover:text-black disabled:opacity-20 disabled:hover:bg-white disabled:hover:text-gray-600 transition-all shadow-sm active:scale-90"
            >
              <ChevronRight className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}