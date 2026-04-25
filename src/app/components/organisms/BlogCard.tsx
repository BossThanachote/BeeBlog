'use client'
import Link from 'next/link'
import { Eye, MessageCircle, Bookmark, MoreHorizontal, Heart } from 'lucide-react'
import { Blog } from '@/app/types'

// Interface ให้รองรับสถานะจากหน้า Feed
interface BlogCardProps {
  blog: Blog & {
    comment_count?: number
    isLiked?: boolean
    isSaved?: boolean
    isCommented?: boolean
  }
}

export const BlogCard = ({ blog }: BlogCardProps) => {
  // ฟังก์ชันคำนวณเวลาแบบ Relative Time
  const formatRelativeTime = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInMs = now.getTime() - past.getTime();

    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);

    if (diffInSeconds < 60) return "เมื่อสักครู่";
    if (diffInMinutes < 60) return `${diffInMinutes} นาทีที่แล้ว`;
    if (diffInHours < 24) return `${diffInHours} ชั่วโมงที่แล้ว`;

    return past.toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const authorName = blog.users?.username || 'BeeBlog User';
  const authorAvatar = blog.users?.avatar_url;

  return (
    <Link href={`/blog/${blog.slug}`} className="group block">
      <div className="flex flex-col md:flex-row gap-8 py-8 border-b border-gray-100 cursor-pointer">

        {/* เนื้อหาข้อความ (ฝั่งซ้าย) */}
        <div className="flex flex-col justify-center flex-1 order-last md:order-first">
          <div className="flex items-center gap-2 mb-3">
            {/* วงกลมรูปโปรไฟล์คนเขียน */}
            <div className="w-6 h-6 bg-gray-50 rounded-full flex items-center justify-center overflow-hidden shrink-0 border border-gray-100">
              <img
                src={authorAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${authorName}`}
                alt={authorName}
                className="w-full h-full object-cover"
              />
            </div>
            {/* ชื่อผู้ใช้และเวลา */}
            <span className="text-sm font-bold text-gray-900">{authorName}</span>
            <span className="text-xs text-gray-400 font-medium">· {formatRelativeTime(blog.created_at)}</span>
          </div>

          <h2 className="text-2xl font-black text-gray-900 mb-2 group-hover:text-yellow-600 transition-colors leading-tight tracking-tight">
            {blog.title}
          </h2>

          <p className="text-sm text-gray-500 line-clamp-2 mb-6 font-medium leading-relaxed">
            {blog.summary || "ไม่มีคำอธิบายเพิ่มเติม..."}
          </p>

          {/* Engagement Bar */}
          <div className="flex items-center justify-between mt-auto text-gray-400">
            <div className="flex items-center gap-6">

              {/* like : เปลี่ยนเป็นสีแดงถ้า User เคย like */}
              <div className={`flex items-center gap-1.5 transition-colors ${blog.isLiked ? 'text-red-500' : 'hover:text-red-500'}`}>
                <Heart className={`w-4 h-4 ${blog.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                <span className={`text-xs font-black ${blog.isLiked ? 'text-red-500' : ''}`}>
                  {blog.likes || 0}
                </span>
              </div>

              {/* comment : แสดงยอดจริง และเป็นสีฟ้าถ้า User เคย comment */}
              <div className={`flex items-center gap-1.5 transition-colors ${blog.isCommented ? 'text-blue-500' : 'hover:text-blue-500'}`}>
                <MessageCircle className={`w-4 h-4 ${blog.isCommented ? 'fill-blue-500 text-blue-500' : ''}`} />
                <span className={`text-xs font-black ${blog.isCommented ? 'text-blue-500' : ''}`}>
                  {blog.comment_count || 0}
                </span>
              </div>

              {/* ยอดวิว */}
              <div className="flex items-center gap-1.5 hover:text-gray-900 transition-colors">
                <Eye className="w-4 h-4" />
                <span className="text-xs font-black">{blog.view_count || 0}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* save: เปลี่ยนเป็นสีเหลืองถ้า User เคย save */}
              <Bookmark
                className={`w-5 h-5 transition-all ${blog.isSaved
                  ? 'fill-yellow-500 text-yellow-500'
                  : 'text-gray-300 hover:text-gray-900'
                  }`}
              />
              <MoreHorizontal className="w-5 h-5 hover:text-gray-900 transition-colors" />
            </div>
          </div>
        </div>

        {/* รูปภาพปกบทความ (ฝั่งขวา) */}
        {blog.cover_image && (
          <div className="w-full md:w-[200px] h-[134px] bg-gray-50 overflow-hidden shrink-0 mt-2 md:mt-0 rounded-2xl border border-gray-100 shadow-sm">
            <img
              src={blog.cover_image}
              alt={blog.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}

      </div>
    </Link>
  );
};