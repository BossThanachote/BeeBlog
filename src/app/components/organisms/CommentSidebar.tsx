'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { X, Send, CornerDownRight, Loader2, MessageCircle, Trash2 } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

interface CommentSidebarProps {
  isOpen: boolean
  onClose: () => void
  blogId: string
  currentUser: any
}

export const CommentSidebar = ({ isOpen, onClose, blogId, currentUser }: CommentSidebarProps) => {
  const supabase = createClient()
  const [comments, setComments] = useState<any[]>([])
  const [message, setMessage] = useState('')
  const [guestName, setGuestName] = useState('')
  const [replyTo, setReplyTo] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // ดึงคอมเมนต์และ Join ตาราง users เพื่อเอา username และ avatar_url ที่ถูกต้อง
  const fetchComments = useCallback(async () => {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        users (
          username,
          avatar_url
        )
      `)
      .eq('blog_id', blogId)
      .order('created_at', { ascending: true })

    if (!error) setComments(data || [])
  }, [blogId, supabase])

  useEffect(() => {
    if (isOpen) fetchComments()
  }, [isOpen, fetchComments])

  // validate เป็นภาษาไทยและตัวเลขเท่านั้น
  const validateText = (text: string) => /^[ก-๙0-9\s]+$/.test(text)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return
    if (!validateText(message)) return alert("ภาษาไทยและตัวเลขเท่านั้นนะคุณ Boss!")

    setIsLoading(true)

    // ดึงข้อมูล Profile ล่าสุดของผู้ใช้
    let displayName = guestName
    let role = 'user'

    if (currentUser) {
      const { data: profile } = await supabase
        .from('users')
        .select('username, role')
        .eq('id', currentUser.id)
        .single()

      // ใช้ username จากตาราง users ถ้าไม่มีค่อยใช้ metadata หรือ email
      displayName = profile?.username || currentUser.user_metadata?.username || currentUser.email
      role = profile?.role || 'user'
    }

    if (!displayName && !guestName.trim()) {
      setIsLoading(false)
      return alert("กรุณาใส่ชื่อก่อน")
    }

    const isApproved = role === 'admin'

    const { error } = await supabase.from('comments').insert({
      blog_id: blogId,
      user_id: currentUser?.id || null,
      sender_name: displayName,
      message: message,
      status: isApproved ? 'approved' : 'pending',
      parent_id: replyTo?.id || null
    })

    if (!error) {
      setMessage('')
      setReplyTo(null)
      setTimeout(() => fetchComments(), 300)
    }
    setIsLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("ลบคอมเมนต์นี้ใช่ไหม?")) return
    const { error } = await supabase.from('comments').delete().eq('id', id)
    if (!error) fetchComments()
  }

  const rootComments = comments.filter(c => !c.parent_id)
  const getReplies = (parentId: string) => comments.filter(c => c.parent_id === parentId)

  return (
    <>
      <div className={`fixed inset-0 bg-black/5 backdrop-blur-[2px] z-[100] transition-all duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />

      <div className={`fixed top-0 right-0 h-full w-full max-w-[420px] bg-white shadow-[-20px_0_50px_rgba(0,0,0,0.05)] z-[101] transition-transform duration-500 ease-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="px-8 py-7 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-900"><MessageCircle className="w-5 h-5" /></div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight">Responses <span className="text-gray-300 ml-1 font-medium">({comments.length})</span></h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-xl transition-all text-gray-400 hover:text-gray-900"><X className="w-6 h-6" /></button>
          </div>

          <div className="flex-1 overflow-y-auto px-8 py-2 space-y-10 scrollbar-hide">
            {rootComments.map((mainComment) => (
              <div key={mainComment.id} className="space-y-6">
                <CommentItem
                  item={mainComment}
                  currentUser={currentUser}
                  guestName={guestName}
                  onReply={() => setReplyTo(mainComment)}
                  onDelete={handleDelete}
                  isReply={false}
                />
                <div className="ml-6 space-y-6 border-l-2 border-gray-50 pl-6">
                  {getReplies(mainComment.id).map((reply) => (
                    <CommentItem
                      key={reply.id}
                      item={reply}
                      currentUser={currentUser}
                      guestName={guestName}
                      onReply={() => setReplyTo(mainComment)}
                      onDelete={handleDelete}
                      isReply={true}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="p-8 bg-white border-t border-gray-50">
            {replyTo && (
              <div className="flex items-center justify-between mb-4 px-4 py-2 bg-yellow-50 rounded-xl border border-yellow-100">
                <p className="text-[10px] font-black text-yellow-700 uppercase flex items-center gap-2"><CornerDownRight className="w-3 h-3" /> Replying to {replyTo.users?.username || replyTo.sender_name}</p>
                <button onClick={() => setReplyTo(null)} className="text-[10px] font-black text-gray-400 hover:text-red-500 uppercase">Cancel</button>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!currentUser && (
                <input type="text" placeholder="What's your name?" className="w-full px-5 py-3 rounded-2xl bg-gray-50 border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-yellow-400 text-sm font-bold transition-all" value={guestName} onChange={(e) => setGuestName(e.target.value)} />
              )}
              <div className="relative">
                <textarea placeholder="What are your thoughts?" className="w-full p-5 pr-14 rounded-[2rem] bg-gray-50 border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-yellow-400 text-sm min-h-[120px] resize-none transition-all font-medium" value={message} onChange={(e) => setMessage(e.target.value)} />
                <button type="submit" disabled={isLoading} className="absolute bottom-4 right-4 w-10 h-10 flex items-center justify-center bg-yellow-400 text-black rounded-full hover:bg-yellow-500 transition-all shadow-lg shadow-yellow-200/50 disabled:bg-gray-100">
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 stroke-[2.5]" />}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

const CommentItem = ({ item, currentUser, guestName, onReply, onDelete, isReply }: any) => {
  const isPending = item.status === 'pending';
  const isAdmin = currentUser?.user_metadata?.role === 'admin';
  const isOwner = (currentUser?.id && currentUser.id === item.user_id) || (guestName && guestName === item.sender_name);

  if (isPending && !isAdmin && !isOwner) return null;

  // ดึงข้อมูลจากตาราง users ที่ Join มา
  const displayUsername = item.users?.username || item.sender_name;
  const avatarUrl = item.users?.avatar_url;

  return (
    <div className={`group animate-in fade-in slide-in-from-right-4 duration-500 ${isPending ? 'opacity-60' : ''}`}>
      <div className="flex gap-4">
        <div className={`shrink-0 rounded-full overflow-hidden border bg-gray-100 flex items-center justify-center ${isReply ? 'w-8 h-8' : 'w-10 h-10'} ${isPending ? 'border-gray-200' : 'border-yellow-100'}`}>
          {avatarUrl ? <img src={avatarUrl} alt="" className="w-full h-full object-cover" /> : <span className={`font-black uppercase text-yellow-700 ${isReply ? 'text-[10px]' : 'text-xs'}`}>{displayUsername.substring(0, 2)}</span>}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2 min-w-0">
              <p className="text-sm font-black text-gray-900 truncate tracking-tight">{displayUsername}</p>
              {isPending && (
                <div className="group/tooltip relative">
                  <span className="cursor-help w-4 h-4 rounded-full bg-gray-100 text-[10px] flex items-center justify-center text-gray-400 font-bold">?</span>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-3 py-1.5 bg-gray-900 text-white text-[10px] rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-20">ความคิดเห็นนี้ยังไม่ Approved 🐝<div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div></div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">{new Date(item.created_at).toLocaleDateString('th-TH')}</p>
              {(isOwner || isAdmin) && <button onClick={() => onDelete(item.id)} className="opacity-0 group-hover:opacity-100 p-1 text-gray-300 hover:text-red-500 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>}
            </div>
          </div>
          <div className={`text-[13px] leading-relaxed font-medium mb-2 ${isPending ? 'text-gray-400 italic' : 'text-gray-700'}`}>{item.message}</div>
          {!isReply && !isPending && <button onClick={onReply} className="text-[10px] font-black text-gray-400 hover:text-yellow-600 flex items-center gap-1.5 uppercase tracking-[0.15em] transition-colors"><CornerDownRight className="w-3.5 h-3.5 stroke-[3]" /> Reply</button>}
        </div>
      </div>
    </div>
  );
}