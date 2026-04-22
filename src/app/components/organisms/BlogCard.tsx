import { Blog } from '@/app/types';
import { Heart, MessageCircle, BookmarkPlus, MoreHorizontal } from 'lucide-react';

export const BlogCard = ({ blog }: { blog: Blog }) => {
  return (
    // ลบ bg-white, border, shadow, rounded-2xl ออก 
    // เปลี่ยนมาใช้เส้นคั่นล่าง border-b และเพิ่ม padding บน-ล่าง py-8
    <div className="flex flex-col md:flex-row gap-8 py-8 border-b border-gray-100 cursor-pointer group">
      
      {/* เนื้อหาข้อความ */}
      <div className="flex flex-col justify-center flex-1">
         <div className="flex items-center gap-2 mb-3">
           <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center overflow-hidden shrink-0">
             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${blog.author}`} alt={blog.author} className="w-full h-full" />
           </div>
           <span className="text-sm font-medium text-gray-900">{blog.author}</span>
           <span className="text-gray-400 text-sm">· 2 ชม. ที่แล้ว</span>
         </div>
         
         <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-yellow-600 transition-colors leading-snug">
           {blog.title}
         </h2>
         
         <p className="text-base text-gray-600 line-clamp-2 mb-6">
           เนื้อหาบางส่วนของบล็อกจะแสดงที่นี่ เพื่อดึงดูดให้ผู้อ่านสนใจคลิกเข้าไปอ่านรายละเอียดเพิ่มเติม...
         </p>
         
         <div className="flex items-center justify-between mt-auto text-gray-500 text-sm">
           <div className="flex items-center gap-6">
             <div className="flex items-center gap-1.5 hover:text-red-500 transition-colors"><Heart className="w-4 h-4" /> {blog.likes}</div>
             <div className="flex items-center gap-1.5 hover:text-blue-500 transition-colors"><MessageCircle className="w-4 h-4" /> {blog.comments}</div>
           </div>
           <div className="flex items-center gap-4 text-gray-400">
             <BookmarkPlus className="w-5 h-5 hover:text-gray-900 transition-colors" />
             <MoreHorizontal className="w-5 h-5 hover:text-gray-900 transition-colors" />
           </div>
         </div>
      </div>

      {/* รูปภาพ (ย้ายมาไว้ขวามือ และปรับสัดส่วนให้แบนลงแบบ Medium) */}
      <div className="w-full md:w-[200px] h-[134px] bg-gray-100 overflow-hidden shrink-0 order-first md:order-last mt-2 md:mt-0">
         <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      </div>

    </div>
  );
};