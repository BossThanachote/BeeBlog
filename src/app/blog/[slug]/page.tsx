'use client'

import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Blog } from '@/app/types'
import { AuthHeartModal } from '@/app/components/molecules/AuthHeartModal'
import { CommentSidebar } from '@/app/components/organisms/CommentSidebar'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'

import {
  Loader2,
  Heart,
  MessageCircle,
  BookmarkPlus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Lock,
  Globe,
  UserPlus,
  UserCheck
} from 'lucide-react'

// Component แยกสำหรับเมนู 3 จุด (ป้องกัน State ตีกันบน-ล่าง)
const OwnerActionMenu = ({ blog, currentUser, onTogglePublish, onDelete }: any) => {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const isAdmin = currentUser?.user_metadata?.role === 'admin'

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-1.5 rounded-full transition-all ${isOpen ? 'bg-gray-100 text-black' : 'hover:bg-gray-50 hover:text-black'}`}
      >
        <MoreHorizontal className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="absolute right-0 bottom-full mb-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-bottom-2">
          {isAdmin && (
            <Link
              href={`/admin/blogs/edit/${blog?.id}`}
              className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Edit className="w-4 h-4 text-blue-500" /> Edit Blog (Admin)
            </Link>
          )}

          <button
            onClick={() => { onTogglePublish(); setIsOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {blog?.is_published ? (
              <><Lock className="w-4 h-4 text-orange-400" /> Unpublish (Draft)</>
            ) : (
              <><Globe className="w-4 h-4 text-green-500" /> Publish Blog</>
            )}
          </button>

          <div className="h-px bg-gray-50 my-1 mx-2" />

          <button
            onClick={() => { onDelete(); setIsOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" /> Delete Blog
          </button>
        </div>
      )}
    </div>
  )
}

export default function BlogDetailPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()

  const [blog, setBlog] = useState<Blog | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [readTime, setReadTime] = useState(1)

  // Interaction States
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [isSaved, setIsSaved] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const [isAnimate, setIsAnimate] = useState(false)

  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isCommentOpen, setIsCommentOpen] = useState(false)
  const [commentCount, setCommentCount] = useState(0)

  // คำนวณเวลาอ่าน
  const calculateReadTime = (text: string) => {
    const words = text.replace(/<[^>]*>?/gm, '').split(/\s+/).length
    setReadTime(Math.ceil(words / 200) || 1)
  }

  // ดึงจำนวนคอมเมนต์
  const fetchCommentCount = useCallback(async (blogId: string) => {
    const { count } = await supabase
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('blog_id', blogId)
      .eq('status', 'approved')
    setCommentCount(count || 0)
  }, [supabase])

  // ดึงข้อมูลบทความ
  const fetchBlogDetail = useCallback(async () => {
    try {
      setIsLoading(true)
      const decodedSlug = decodeURIComponent(params.slug as string)
      const { data, error } = await supabase
        .from('blogs')
        .select('*, users(username, avatar_url)')
        .eq('slug', decodedSlug)
        .single()

      if (error) throw error

      if (data) {
        setBlog(data)
        setLikeCount(data.likes || 0)
        if (data.content) calculateReadTime(data.content)
        fetchCommentCount(data.id)

        // เพิ่มยอดวิว (RPC)
        await supabase.rpc('increment_view_count', { blog_id: data.id })
        setBlog(prev => prev ? { ...prev, view_count: (prev.view_count || 0) + 1 } : null)
      }
    } catch (error) {
      console.error('Fetch Error:', error)
    } finally {
      setIsLoading(false)
    }
  }, [params.slug, supabase, fetchCommentCount])

  // เช็คสถานะการ Interact (Like, Save, Follow)
  useEffect(() => {
    const checkInteractions = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUser(user)

      if (user && blog) {
        // เช็ค Like
        const { data: L } = await supabase.from('blog_likes').select('*').eq('user_id', user.id).eq('blog_id', blog.id).single()
        setIsLiked(!!L)

        // เช็ค Save
        const { data: S } = await supabase.from('saved_blogs').select('*').eq('user_id', user.id).eq('blog_id', blog.id).single()
        setIsSaved(!!S)

        // เช็ค Follow
        const { data: F } = await supabase.from('follows').select('*').eq('follower_id', user.id).eq('following_id', blog.author_id).single()
        setIsFollowing(!!F)
      }
    }
    if (blog?.id) checkInteractions()
  }, [blog, supabase])

  useEffect(() => {
    if (params.slug) fetchBlogDetail()
  }, [fetchBlogDetail, params.slug])

  // ACTIONS 

  const handleLike = async () => {
    if (!currentUser) return setIsAuthModalOpen(true)
    const prev = isLiked
    setIsAnimate(true)
    setIsLiked(!isLiked)
    setLikeCount(p => isLiked ? p - 1 : p + 1)
    try {
      if (!prev) await supabase.from('blog_likes').insert({ user_id: currentUser.id, blog_id: blog?.id })
      else await supabase.from('blog_likes').delete().eq('user_id', currentUser.id).eq('blog_id', blog?.id)
    } catch { setIsLiked(prev); setLikeCount(p => prev ? p : p - 1) }
    setTimeout(() => setIsAnimate(false), 500)
  }

  const handleSave = async () => {
    if (!currentUser) return setIsAuthModalOpen(true)
    const prev = isSaved
    setIsSaved(!isSaved)
    try {
      if (!prev) await supabase.from('saved_blogs').insert({ user_id: currentUser.id, blog_id: blog?.id })
      else await supabase.from('saved_blogs').delete().eq('user_id', currentUser.id).eq('blog_id', blog?.id)
    } catch { setIsSaved(prev) }
  }

  const handleFollow = async () => {
    if (!currentUser) return setIsAuthModalOpen(true)
    const prev = isFollowing
    setIsFollowing(!isFollowing)
    try {
      if (!prev) await supabase.from('follows').insert({ follower_id: currentUser.id, following_id: blog?.author_id })
      else await supabase.from('follows').delete().eq('follower_id', currentUser.id).eq('following_id', blog?.author_id)
    } catch { setIsFollowing(prev) }
  }

  const handleTogglePublish = async () => {
    if (!blog) return
    const newStatus = !blog.is_published
    const { error } = await supabase.from('blogs').update({ is_published: newStatus }).eq('id', blog.id)
    if (!error) setBlog({ ...blog, is_published: newStatus })
  }

  const handleDelete = async () => {
    if (!blog || !confirm('ยืนยันลบถาวร?')) return
    const { error } = await supabase.from('blogs').delete().eq('id', blog.id)
    if (!error) router.push('/profile')
  }

  const ActionBar = () => {
    const isOwner = currentUser?.id === blog?.author_id;
    return (
      <div className="flex items-center justify-between py-3 my-8 border-y border-gray-100">
        <div className="flex items-center gap-6 text-gray-500">
          <button onClick={handleLike} className={`flex items-center gap-2 transition-all ${isLiked ? 'text-red-500' : 'hover:text-red-500'} ${isAnimate ? 'scale-125' : ''}`}>
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
            <span className="text-sm font-bold">{likeCount}</span>
          </button>
          <button onClick={() => setIsCommentOpen(true)} className="flex items-center gap-2 hover:text-blue-500 transition-colors">
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-bold">{commentCount}</span>
          </button>
          <div className="flex items-center gap-2 text-gray-400">
            <Eye className="w-5 h-5" />
            <span className="text-sm font-medium italic text-[13px]">เข้าชม {blog?.view_count || 0} ครั้ง</span>
          </div>
        </div>

        <div className="flex items-center gap-5 text-gray-500">
          <button onClick={handleSave} className={`transition-all ${isSaved ? 'text-yellow-500' : 'hover:text-gray-900'}`}>
            <BookmarkPlus className={`w-5 h-5 ${isSaved ? 'fill-yellow-500' : ''}`} />
          </button>
          {isOwner && <OwnerActionMenu blog={blog} currentUser={currentUser} onTogglePublish={handleTogglePublish} onDelete={handleDelete} />}
        </div>
      </div>
    )
  }

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-white"><Loader2 className="w-10 h-10 animate-spin text-yellow-400" /></div>
  if (!blog) return <div className="text-center pt-20">ไม่พบบทความ</div>

  return (
    <article className="min-h-screen bg-white pt-24 pb-32">
      <div className="max-w-[720px] mx-auto px-4 sm:px-6">
        <h1 className="text-[2.5rem] md:text-[3rem] font-black text-gray-900 leading-[1.1] mb-4 tracking-tight">{blog.title}</h1>
        <p className="text-xl md:text-2xl text-gray-500 mb-8 font-light leading-snug">{blog.summary}</p>

        <div className="flex items-center gap-4 mb-2">
          {/* ลิงก์ไปหน้าโปรไฟล์คนเขียน */}
          <Link href={currentUser?.id === blog.author_id ? '/profile' : `/user/${blog.author_id}`} className="w-12 h-12 bg-gray-100 rounded-full overflow-hidden shrink-0 border border-gray-200">
            <img src={blog.users?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${blog.users?.username}`} className="w-full h-full object-cover" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <Link href={currentUser?.id === blog.author_id ? '/profile' : `/user/${blog.author_id}`} className="font-bold text-gray-900 hover:underline">
                {blog.users?.username}
              </Link>
              <span className="text-gray-400">·</span>
              {/* ปุ่ม Follow (โชว์เฉพาะถ้าไม่ใช่ตัวเอง) */}
              {currentUser?.id !== blog.author_id && (
                <button onClick={handleFollow} className={`font-bold text-sm transition-colors flex items-center gap-1 ${isFollowing ? 'text-gray-400' : 'text-yellow-600 hover:text-yellow-700'}`}>
                  {isFollowing ? <><UserCheck className="w-3 h-3" /> Following</> : 'Follow'}
                </button>
              )}
            </div>
            <div className="text-sm text-gray-500 flex items-center gap-2 mt-0.5 font-medium">
              <span>{new Date(blog.created_at).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              <span className="text-gray-300">·</span>
              <span>{readTime} min read</span>
            </div>
          </div>
        </div>

        <ActionBar />

        {blog.cover_image && (
          <figure className="mb-12">
            <div className="w-full aspect-[16/9] bg-gray-100 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
              <img src={blog.cover_image} className="w-full h-full object-cover" />
            </div>
          </figure>
        )}

        <div className="prose prose-lg md:prose-xl prose-gray max-w-none" dangerouslySetInnerHTML={{ __html: blog.content }} />

        <div className="mt-12"><ActionBar /></div>
      </div>

      <CommentSidebar isOpen={isCommentOpen} onClose={() => setIsCommentOpen(false)} blogId={blog.id} currentUser={currentUser} />
      <AuthHeartModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </article>
  )
}