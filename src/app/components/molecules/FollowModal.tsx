// src/app/components/molecules/FollowModal.tsx
'use client'

import React, { useEffect, useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'

interface FollowModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  type: 'followers' | 'following'
}

export const FollowModal = ({ isOpen, onClose, userId, type }: FollowModalProps) => {
  const supabase = createClient()
  const [list, setList] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchList = async () => {
      if (!isOpen) return
      setIsLoading(true)
      try {
        let query = supabase.from('follows').select(`
          created_at,
          follower:users!follower_id(id, username, avatar_url, bio),
          following:users!following_id(id, username, avatar_url, bio)
        `)

        if (type === 'followers') {
          query = query.eq('following_id', userId)
        } else {
          query = query.eq('follower_id', userId)
        }

        const { data, error } = await query
        if (!error && data) {
          // เลือกดึงข้อมูลฝั่งที่ตรงข้ามกับตัวเรา
          const processedData = data.map((item: any) => type === 'followers' ? item.follower : item.following)
          setList(processedData)
        }
      } catch (err) { console.error(err) }
      finally { setIsLoading(false) }
    }

    fetchList()
  }, [isOpen, userId, type, supabase])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
          <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">
            {type === 'followers' ? 'Followers' : 'Following'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-full text-gray-400">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="max-h-[400px] overflow-y-auto p-4 space-y-2 scrollbar-hide">
          {isLoading ? (
            <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-yellow-400" /></div>
          ) : list.length > 0 ? (
            list.map((user) => (
              <Link 
                key={user.id} 
                href={`/user/${user.id}`} 
                onClick={onClose}
                className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-all group"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-100 shrink-0">
                  <img src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-gray-900 group-hover:text-yellow-600 transition-colors truncate">{user.username}</p>
                  <p className="text-xs text-gray-400 line-clamp-1">{user.bio || 'BeeBlog Member'}</p>
                </div>
              </Link>
            ))
          ) : (
            <div className="py-20 text-center text-gray-300 font-bold italic">ยังไม่มีรายชื่อครับ</div>
          )}
        </div>
      </div>
    </div>
  )
}