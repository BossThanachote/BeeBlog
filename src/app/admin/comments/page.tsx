'use client'

import React, { useEffect, useState, useCallback, Suspense } from 'react' // 🌟 เพิ่ม Suspense
import { createClient } from '@/utils/supabase/client'
import {
    MessageSquare,
    CheckCircle2,
    Trash2,
    Clock,
    ExternalLink,
    Loader2,
    Check
} from 'lucide-react'
import Link from 'next/link'

// 🌟 แยกส่วนเนื้อหาหลักออกมาเป็น Component ย่อย
function AdminCommentsContent() {
    const supabase = createClient()
    const [comments, setComments] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [filter, setFilter] = useState<'pending' | 'approved'>('pending')

    const fetchComments = useCallback(async () => {
        try {
            setIsLoading(true)
            const { data, error } = await supabase
                .from('comments')
                .select(`
                  *,
                  blogs (title, slug),
                  users (avatar_url)
                `)
                .eq('status', filter)
                .order('created_at', { ascending: false })

            if (error) throw error
            setComments(data || [])
        } catch (err) {
            console.error('Error:', err)
        } finally {
            setIsLoading(false)
        }
    }, [filter, supabase])

    useEffect(() => {
        fetchComments()
    }, [fetchComments])

    const handleApprove = async (id: string) => {
        try {
            const { error } = await supabase
                .from('comments')
                .update({ status: 'approved' })
                .eq('id', id)

            if (error) {
                alert("อนุมัติไม่สำเร็จ: " + error.message)
                return
            }
            setComments(prev => prev.filter(c => c.id !== id))
        } catch (err) {
            console.error("System Error:", err)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('คุณแน่ใจนะว่าจะลบ/ปฏิเสธคอมเมนต์นี้?')) return
        const { error } = await supabase.from('comments').delete().eq('id', id)
        if (!error) {
            setComments(prev => prev.filter(c => c.id !== id))
        }
    }

    return (
        <div className="max-w-6xl mx-auto pt-24 pb-20 px-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
                        <MessageSquare className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Comment Approval</h1>
                        <p className="text-gray-500 font-medium text-sm">จัดการความคิดเห็นจากผู้อ่าน BeeBlog</p>
                    </div>
                </div>

                {/* Tab Switcher */}
                <div className="flex bg-gray-100 p-1.5 rounded-2xl w-fit">
                    <button
                        onClick={() => setFilter('pending')}
                        className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === 'pending' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        Pending
                    </button>
                    <button
                        onClick={() => setFilter('approved')}
                        className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === 'approved' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        Approved
                    </button>
                </div>
            </div>

            {/* Content List */}
            <div className="space-y-4">
                {isLoading ? (
                    <div className="py-20 text-center">
                        <Loader2 className="w-10 h-10 animate-spin text-yellow-400 mx-auto" />
                        <p className="mt-4 text-sm font-bold text-gray-400 uppercase tracking-widest animate-pulse">กำลังตรวจสอบข้อมูล...</p>
                    </div>
                ) : comments.length > 0 ? (
                    comments.map((comment) => (
                        <div
                            key={comment.id}
                            className="bg-white border border-gray-100 p-6 md:p-8 rounded-[2.5rem] shadow-sm hover:shadow-md transition-all group animate-in fade-in slide-in-from-bottom-2"
                        >
                            <div className="flex flex-col md:flex-row gap-6">
                                {/* User Info */}
                                <div className="flex gap-4 shrink-0">
                                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 border border-gray-100 flex items-center justify-center">
                                        {comment.users?.avatar_url ? (
                                            <img src={comment.users.avatar_url} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="font-black text-gray-400 uppercase text-xs">{comment.sender_name?.substring(0, 2)}</span>
                                        )}
                                    </div>
                                    <div className="md:w-32">
                                        <p className="font-black text-gray-900 truncate text-sm">{comment.sender_name}</p>
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase mt-0.5">
                                            <Clock className="w-3 h-3" />
                                            {new Date(comment.created_at).toLocaleDateString('th-TH')}
                                        </div>
                                    </div>
                                </div>

                                {/* Message Content */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-[10px] font-black text-yellow-600 uppercase tracking-widest bg-yellow-50 px-2 py-0.5 rounded-md">On Post:</span>
                                        <Link
                                            href={`/blog/${comment.blogs?.slug}`}
                                            className="text-[11px] font-bold text-gray-400 hover:text-gray-900 flex items-center gap-1 transition-colors underline decoration-gray-200 underline-offset-4"
                                        >
                                            {comment.blogs?.title} <ExternalLink className="w-3 h-3" />
                                        </Link>
                                    </div>
                                    <div className="p-5 bg-gray-50 rounded-3xl border border-gray-50 text-gray-700 text-[15px] leading-relaxed font-medium italic relative">
                                        "{comment.message}"
                                        <div className="absolute top-0 right-0 p-3 opacity-10">
                                            <MessageSquare className="w-8 h-8" />
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex md:flex-col justify-end gap-3 shrink-0">
                                    {filter === 'pending' && (
                                        <button
                                            onClick={() => handleApprove(comment.id)}
                                            className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-black px-6 py-3 rounded-2xl transition-all active:scale-95 shadow-lg shadow-green-100"
                                        >
                                            <CheckCircle2 className="w-5 h-5" /> Approve
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(comment.id)}
                                        className={`flex items-center justify-center gap-2 font-black px-6 py-3 rounded-2xl transition-all active:scale-95 shadow-sm ${filter === 'pending'
                                            ? 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white'
                                            : 'bg-gray-100 text-gray-400 hover:bg-red-500 hover:text-white'
                                            }`}
                                    >
                                        <Trash2 className="w-5 h-5" /> {filter === 'pending' ? 'Reject' : 'Delete'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-32 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100">
                        <Check className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                        <p className="text-gray-400 font-bold uppercase tracking-[0.2em]">ไม่มีคอมเมนต์ที่ {filter === 'pending' ? 'รอการตรวจสอบ' : 'ได้รับอนุมัติแล้ว'} </p>
                    </div>
                )}
            </div>
        </div>
    )
}

// 🌟 Export หลักที่ห่อด้วย Suspense เพื่อให้ Build ผ่าน
export default function AdminCommentsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-yellow-400" />
            </div>
        }>
            <AdminCommentsContent />
        </Suspense>
    )
}