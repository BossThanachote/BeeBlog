'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Blog } from '@/app/types'
import { TiptapEditor } from '@/app/components/organisms/TiptapEditor'
import { 
  Loader2, 
  ArrowLeft, 
  Save, 
  Globe, 
  Lock, 
  Image as ImageIcon, 
  Trash2,
  Sparkles,
  Layout
} from 'lucide-react'
import Link from 'next/link'

export default function AdminEditBlog() {
    const params = useParams()
    const router = useRouter()
    const supabase = createClient()
    
    // States สำหรับ Blog Data
    const [blog, setBlog] = useState<Blog | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    // States สำหรับ Form Fields
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [slug, setSlug] = useState('')
    const [summary, setSummary] = useState('')
    const [coverImage, setCoverImage] = useState('')
    const [isPublished, setIsPublished] = useState(false)

    // ดึงข้อมูลบทความเดิมมาใส่ใน Form
    const fetchBlogDetail = useCallback(async () => {
        try {
            setIsLoading(true)
            const { data, error } = await supabase
                .from('blogs')
                .select('*')
                .eq('id', params.id)
                .single()

            if (error) throw error

            if (data) {
                setBlog(data)
                setTitle(data.title)
                setContent(data.content || '')
                setSlug(data.slug)
                setSummary(data.summary || '')
                setCoverImage(data.cover_image || '')
                setIsPublished(data.is_published)
            }
        } catch (err) {
            console.error('Error fetching blog:', err)
            router.push('/admin/blogs')
        } finally {
            setIsLoading(false)
        }
    }, [params.id, supabase, router])

    useEffect(() => {
        if (params.id) fetchBlogDetail()
    }, [fetchBlogDetail, params.id])

    // ฟังก์ชันจัดการรูปหน้าปก (Upload to Supabase Storage)
    const handleCoverImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            const fileExt = file.name.split('.').pop()
            const fileName = `${Date.now()}-cover.${fileExt}`
            const filePath = `covers/${fileName}`

            try {
                setIsSaving(true)
                const { error: uploadError } = await supabase.storage
                    .from('beeblog-storage')
                    .upload(filePath, file)

                if (uploadError) throw uploadError

                const { data: urlData } = supabase.storage
                    .from('beeblog-storage')
                    .getPublicUrl(filePath)

                setCoverImage(urlData.publicUrl)
            } catch (error) {
                console.error('Upload Error:', error)
                alert('อัปโหลดรูปภาพไม่สำเร็จ')
            } finally {
                setIsSaving(false)
            }
        }
    }

    // ฟังก์ชันบันทึกข้อมูล 
    const handleSave = async () => {
        if (!title.trim() || !slug.trim()) {
            alert('กรุณากรอกหัวข้อและ URL Slug ด้วย')
            return
        }

        try {
            setIsSaving(true)

            // แปลง HTML เสกแท็ก <img> ก่อน Save  
            let finalHTMLContent = content;

            if (typeof window !== 'undefined') {
                const parser = new DOMParser();
                const doc = parser.parseFromString(content, 'text/html');
                const groups = doc.querySelectorAll('div[data-type="image-group"]');

                groups.forEach(g => {
                    const data = g.getAttribute('data-images');
                    if (data) {
                        try {
                            const decodedStr = data.replace(/&quot;/g, '"');
                            const urls = JSON.parse(decodedStr);
                            g.innerHTML = ''; 

                            urls.forEach((url: string) => {
                                const imgWrapper = doc.createElement('div');
                                imgWrapper.className = 'image-item'; 
                                const img = doc.createElement('img');
                                img.src = url;
                                img.alt = title;
                                imgWrapper.appendChild(img);
                                g.appendChild(imgWrapper);
                            });
                        } catch (e) {
                            console.error("Failed to parse image data", e);
                        }
                    }
                });

                finalHTMLContent = doc.body.innerHTML; 
            }

            const { error } = await supabase
                .from('blogs')
                .update({
                    title,
                    content: finalHTMLContent,
                    slug: slug.trim().toLowerCase().replace(/\s+/g, '-'),
                    summary,
                    cover_image: coverImage,
                    is_published: isPublished,
                    updated_at: new Date().toISOString()
                })
                .eq('id', params.id)

            if (error) throw error

            alert('บันทึกการเปลี่ยนแปลงเรียบร้อยแล้ว🐝✨')
            router.push('/admin/blogs')
            router.refresh()

        } catch (err) {
            console.error('Save Error:', err)
            alert('บันทึกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง')
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white">
                <Loader2 className="w-12 h-12 animate-spin text-yellow-400 mb-4" />
                <p className="text-gray-400 font-bold uppercase tracking-widest animate-pulse">Loading Draft...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#fafafa] pt-24 pb-32 px-4 md:px-6">
            {/* Sticky Top Bar */}
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 mb-12 bg-white/80 backdrop-blur-xl p-5 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/20 sticky top-20 z-50 transition-all">
                <div className="flex items-center gap-5">
                    <Link href="/admin/blogs" className="p-3.5 bg-gray-50 hover:bg-yellow-400 hover:text-black rounded-2xl text-gray-400 transition-all active:scale-90">
                        <ArrowLeft className="w-6 h-6 stroke-[2.5]" />
                    </Link>
                    <div className="hidden sm:block">
                        <p className="text-[10px] font-black text-yellow-600 uppercase tracking-[0.2em] mb-0.5">Author Mode</p>
                        <h1 className="text-lg font-black text-gray-900 truncate max-w-[200px] md:max-w-sm">{blog?.title}</h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsPublished(!isPublished)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-sm ${isPublished
                                ? 'bg-green-50 text-green-600 ring-1 ring-green-100'
                                : 'bg-gray-100 text-gray-400 ring-1 ring-gray-200'
                            }`}
                    >
                        {isPublished ? <Globe className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                        {isPublished ? 'Public' : 'Draft'}
                    </button>

                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-200 text-black font-black px-10 py-3.5 rounded-2xl transition-all active:scale-95 shadow-lg shadow-yellow-200/50"
                    >
                        {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5 stroke-[2.5]" />}
                        <span className="hidden sm:inline">{isSaving ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                </div>
            </div>

            {/* Editor & Sidebar Grid */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr,380px] gap-10">

                {/* Left Side: Rich Text Editor */}
                <div className="bg-white p-8 md:p-14 rounded-[3.5rem] border border-gray-100 shadow-sm ring-1 ring-gray-50">
                    <div className="flex items-center gap-2 mb-6 text-yellow-500">
                        <Sparkles className="w-5 h-5 fill-current" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Main Content</span>
                    </div>

                    <input
                        type="text"
                        placeholder="Start with a great title..."
                        className="w-full text-4xl md:text-5xl font-black text-gray-900 focus:outline-none mb-8 tracking-tight placeholder:text-gray-100"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <textarea
                        placeholder="Write a brief summary to hook your readers..."
                        className="w-full text-xl text-gray-400 focus:outline-none mb-12 font-light leading-relaxed placeholder:text-gray-200 resize-none italic border-l-4 border-gray-50 pl-6"
                        rows={3}
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                    />

                    <div className="border-t border-gray-50 pt-12 ProseMirror-style-fix">
                        <TiptapEditor
                            content={content}
                            onChange={setContent}
                        />
                    </div>
                </div>

                {/* Right Side: Meta Settings */}
                <aside className="space-y-10">
                    {/* Cover Photo */}
                    <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <ImageIcon className="w-4 h-4" /> Cover Photo
                            </h3>
                        </div>

                        {coverImage ? (
                            <div className="relative group rounded-3xl overflow-hidden border border-gray-100 aspect-[16/9] bg-gray-50 shadow-inner">
                                <img src={coverImage} alt="Cover" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                                    <button
                                        onClick={() => setCoverImage('')}
                                        className="p-4 bg-white/20 hover:bg-red-500 text-white rounded-full transition-all hover:rotate-90 active:scale-75"
                                    >
                                        <Trash2 className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center w-full aspect-[16/9] border-2 border-gray-100 border-dashed rounded-[2rem] cursor-pointer bg-gray-50/50 hover:bg-yellow-50/30 hover:border-yellow-200 transition-all text-gray-300 hover:text-yellow-500 group">
                                <div className="p-4 bg-white rounded-2xl shadow-sm mb-3 group-hover:scale-110 transition-transform">
                                    <ImageIcon className="w-8 h-8" />
                                </div>
                                <span className="text-xs font-black uppercase tracking-widest">Add Cover</span>
                                <input type="file" className="hidden" accept="image/*" onChange={handleCoverImageUpload} />
                            </label>
                        )}
                    </div>

                    {/* SEO Slug */}
                    <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Layout className="w-4 h-4" /> SEO Structure
                        </h3>
                        <div className="space-y-4">
                            <p className="text-[10px] font-bold text-gray-400">URL SLUG</p>
                            <div className="flex items-center gap-2 bg-gray-50 rounded-2xl px-5 py-4 text-sm ring-1 ring-gray-100 focus-within:ring-yellow-400 focus-within:bg-white transition-all">
                                <span className="font-bold text-gray-300">/</span>
                                <input
                                    type="text"
                                    className="flex-1 bg-transparent focus:outline-none text-gray-900 font-black placeholder:text-gray-200"
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                />
                            </div>
                            <p className="text-[9px] leading-relaxed text-rose-400 font-bold uppercase tracking-tighter bg-rose-50/50 p-3 rounded-xl border border-rose-100/50">
                                Warning: Changing the slug will break existing links to this post.
                            </p>
                        </div>
                    </div>
                </aside>
            </div>

            <style jsx global>{`
                .ProseMirror-style-fix .prose {
                    max-width: none !important;
                    padding: 0 !important;
                }
            `}</style>
        </div>
    )
}