import { User, Heart, MessageCircle, Repeat2, ChevronRight } from 'lucide-react';
import { Blog } from '../../types';

interface BlogCardProps {
  blog: Blog;
}

export const BlogCard = ({ blog }: BlogCardProps) => {
  return (
    <article className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex flex-col md:flex-row h-full">
        <div className="md:w-1/3 h-48 md:h-auto overflow-hidden">
          <img 
            src={blog.image} 
            alt={blog.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="md:w-2/3 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                <User className="w-3 h-3 text-yellow-700" />
              </div>
              <span className="text-xs font-bold text-gray-500">{blog.author}</span>
              <span className="text-xs text-gray-300">• 2 ชม. ที่แล้ว</span>
            </div>
            <h2 className="text-xl font-bold mb-2 group-hover:text-yellow-600 transition-colors cursor-pointer">{blog.title}</h2>
            <p className="text-gray-500 text-sm line-clamp-2">
              เนื้อหาบางส่วนของบล็อกจะแสดงที่นี่ เพื่อดึงดูดให้ผู้อ่านสนใจคลิกเข้าไปอ่านรายละเอียดเพิ่มเติม...
            </p>
          </div>
          
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-50">
            <div className="flex items-center gap-6">
              <button className="flex items-center gap-1.5 text-gray-500 hover:text-red-500 transition-colors group/btn">
                <Heart className="w-5 h-5 group-hover/btn:fill-current" />
                <span className="text-sm font-medium">{blog.likes}</span>
              </button>
              <button className="flex items-center gap-1.5 text-gray-500 hover:text-yellow-600 transition-colors">
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm font-medium">{blog.comments}</span>
              </button>
              <button className="flex items-center gap-1.5 text-gray-500 hover:text-green-600 transition-colors">
                <Repeat2 className="w-5 h-5" />
                <span className="text-sm font-medium">{blog.reposts}</span>
              </button>
            </div>
            <button className="p-2 bg-gray-50 text-gray-400 hover:bg-yellow-400 hover:text-black rounded-xl transition-all">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};