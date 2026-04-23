'use client'

import React, { useState, useEffect } from 'react'
import { WriteEditor } from '@/app/components/organisms/WriteEditor'
import { WritePreview } from '@/app/components/organisms/WritePreview'
import { Loader2 } from 'lucide-react'
import { AlertModal } from '@/app/components/molecules/AlertModal'
import { SuccessModal } from '@/app/components/molecules/SuccessModal'
import { createClient } from '@/utils/supabase/client'

export default function WriteBlogPage() {
  // --- Shared States ---
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [coverImage, setCoverImage] = useState<string>('')
  const [content, setContent] = useState<string>('')

  const [showPreview, setShowPreview] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  
  // --- Modals States ---
  const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', message: '' })
  const [successModal, setSuccessModal] = useState({ isOpen: false, title: '', message: '' })
  const supabase = createClient()
  // 🌟 1. ดักจับการย้อนกลับมา (Auto-Refresh) เพื่อคืนชีพ Tiptap และโหลดข้อมูล Draft
  useEffect(() => {
    const isReturning = sessionStorage.getItem('beeblog_returning')
    if (isReturning === 'true') {
      sessionStorage.removeItem('beeblog_returning')
      window.location.reload()
      return
    }

    const savedDraft = localStorage.getItem('beeblog_draft')
    if (savedDraft) {
      try {
        const { savedTitle, savedSubtitle, savedCover, savedContent } = JSON.parse(savedDraft)
        setTitle(savedTitle || '')
        setSubtitle(savedSubtitle || '')
        setCoverImage(savedCover || '')
        setContent(savedContent || '')
      } catch (e) {
        console.error("Failed to load draft", e)
      }
    }
    setIsLoaded(true)

    return () => {
      sessionStorage.setItem('beeblog_returning', 'true')
    }
  }, [])

  // 🌟 2. เซฟข้อมูลอัตโนมัติ (Debounce 1 วินาที)
  useEffect(() => {
    if (isLoaded) {
      const timeoutId = setTimeout(() => {
        localStorage.setItem('beeblog_draft', JSON.stringify({
          savedTitle: title,
          savedSubtitle: subtitle,
          savedCover: coverImage,
          savedContent: content
        }))
      }, 1000)
      return () => clearTimeout(timeoutId)
    }
  }, [title, subtitle, coverImage, content, isLoaded])

  // 🌟 3. จัดการปุ่ม Back ของ Browser (Hash Routing #preview)
  useEffect(() => {
    const handlePopState = () => {
      if (window.location.hash !== '#preview') {
        setShowPreview(false)
      } else {
        setShowPreview(true)
      }
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // --- Helper Functions ---
  
  const extractImagesFromHTML = (html: string): string[] => {
    if (typeof window === 'undefined') return [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const groups = doc.querySelectorAll('div[data-type="image-group"]');
    const urls: string[] = [];
    groups.forEach(g => {
      const data = g.getAttribute('data-images');
      if (data) {
        try { urls.push(...JSON.parse(data)); } catch (e) { }
      }
    });
    return urls;
  }

  const showError = (title: string, message: string) => {
    setModalConfig({ isOpen: true, title, message })
  }

  // --- Action Handlers ---

  const handlePrePublish = () => {
    if (!title.trim()) {
      showError("ข้อมูลไม่ครบถ้วน", "กรุณาใส่หัวข้อบทความก่อนครับ")
      return
    }

    const currentImagesCount = extractImagesFromHTML(content).length;
    if (currentImagesCount > 6) {
      showError("รูปภาพเกินกำหนด", `คุณมีรูปภาพ ${currentImagesCount} รูป ซึ่งเกินกำหนด (สูงสุด 6 รูป) กรุณาลบออกบางส่วนก่อนครับ`)
      return
    }

    window.history.pushState(null, '', '#preview')
    setShowPreview(true)
  }

  const handleBackToEditor = () => {
    window.history.back()
  }

  const handleFinalPublish = async () => {
    if (!coverImage) return showError("ขาดรูปปก", "กรุณาอัปโหลดรูปภาพหน้าปกก่อน Publish ครับ")
    if (!title.trim()) return showError("ข้อมูลไม่ครบถ้วน", "กรุณาใส่ Preview Title ครับ")

    try {
      // 🌟 1. ดึงข้อมูล User ปัจจุบันออกมาก่อนเพื่อเอา ID
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        showError("ไม่พบผู้ใช้งาน", "กรุณาเข้าสู่ระบบใหม่อีกครั้งก่อนทำการ Publish ครับ");
        return;
      }

      const generatedSlug = title.trim().replace(/\s+/g, '-').replace(/[^\w\u0E00-\u0E7F-]+/g, '') + '-' + Date.now()
      const extractedImages = extractImagesFromHTML(content);

      const { error } = await supabase
        .from('blogs')
        .insert([
          {
            title: title,
            summary: subtitle,
            slug: generatedSlug,
            cover_image: coverImage,
            content: content,
            gallery_images: extractedImages,
            is_published: true,
            author_id: user.id // 🌟 2. ยัด id ของคนเขียนใส่เข้าไปตรงนี้แล้วครับ!
          }
        ])

      if (error) throw error

      // 🌟 เคลียร์ Draft ทิ้งเมื่อสำเร็จ
      localStorage.removeItem('beeblog_draft')
      sessionStorage.removeItem('beeblog_returning')

      // 🌟 เปิด Success Modal แทนการ Alert
      setSuccessModal({
        isOpen: true,
        title: "Publish สำเร็จ! 🎉",
        message: "บทความของคุณถูกเผยแพร่ลงระบบ BeeBlog เรียบร้อยแล้ว พร้อมให้ทุกคนเข้ามาอ่านแล้วครับ"
      })

    } catch (error) {
      console.error("Publish Error:", error)
      showError("เกิดข้อผิดพลาด", "ไม่สามารถ Publish ได้ กรุณาลองใหม่อีกครั้ง")
    }
  }

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-400 bg-[#fafafa]">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-400 mb-4" />
        <p className="font-medium animate-pulse">กำลังโหลดฉบับร่าง...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      
      {/* ⚠️ Modal แจ้งเตือนข้อผิดพลาด */}
      <AlertModal 
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
      />

      {/* ✅ Modal แจ้งเตือนเมื่อสำเร็จ */}
      <SuccessModal
        isOpen={successModal.isOpen}
        title={successModal.title}
        message={successModal.message}
        onConfirm={() => {
          setSuccessModal({ ...successModal, isOpen: false })
          window.location.href = '/' // 🚀 วาร์ปกลับหน้า Home เมื่อผู้ใช้กดรับทราบ
        }}
      />

      {!showPreview ? (
        <WriteEditor
          title={title}
          setTitle={setTitle}
          coverImage={coverImage}
          setCoverImage={setCoverImage}
          content={content}
          setContent={setContent}
          onPrePublish={handlePrePublish}
          onError={showError}
        />
      ) : (
        <WritePreview
          title={title}
          setTitle={setTitle}
          subtitle={subtitle}
          setSubtitle={setSubtitle}
          coverImage={coverImage}
          setCoverImage={setCoverImage}
          onBack={handleBackToEditor}
          onFinalPublish={handleFinalPublish}
        />
      )}
    </div>
  )
}