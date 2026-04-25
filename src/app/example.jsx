/* File นี้เป็นเพียงแค่ไฟล์ Mockup สำหรับทดสอบ UI เท่านั้น */
/* ใช้เพื่อเป็นตัวอย่างในการออกแบบ UI และ UX เป็นต้นแบบของการนำมาใช้เป็น Design token */

import React, { useState } from 'react';
import {
  Menu,
  Search,
  PenSquare,
  Bell,
  Home,
  Library,
  User,
  BarChart2,
  Heart,
  MessageCircle,
  Repeat2,
  X,
  ChevronRight,
  TrendingUp,
  UserPlus
} from 'lucide-react';

const App = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('feed');

  // ข้อมูลจำลองสำหรับ Blog
  const blogs = [
    {
      id: 1,
      title: "10 เคล็ดลับการแต่งบ้านสไตล์ Minimal ที่ใครก็ทำได้",
      author: "HoneyBee_99",
      image: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=1000",
      likes: 124,
      comments: 18,
      reposts: 5
    },
    {
      id: 2,
      title: "รีวิวคาเฟ่เปิดใหม่ใจกลางอารีย์ มุมถ่ายรูปเยอะมาก!",
      author: "QueenBee_Travel",
      image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1000",
      likes: 89,
      comments: 12,
      reposts: 2
    },
    {
      id: 3,
      title: "วิธีทำน้ำผึ้งมะนาวสูตรพิเศษ ดื่มแล้วสดชื่นตลอดวัน",
      author: "ChefWorkerBee",
      image: "https://images.unsplash.com/photo-1589733955941-5eeaf752f6d9?q=80&w=1000",
      likes: 256,
      comments: 45,
      reposts: 32
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 w-full h-16 bg-white border-b border-gray-100 px-4 flex items-center justify-between z-50">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-yellow-50 rounded-full transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center font-bold text-black shadow-sm">B</div>
            <span className="text-xl font-bold tracking-tight hidden sm:block">BeeBlog</span>
          </div>
        </div>

        <div className="flex-1 max-w-xl mx-8 hidden md:block">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-yellow-600" />
            <input
              type="text"
              placeholder="ค้นหาหัวข้อ Blog..."
              className="w-full bg-gray-100 border-transparent focus:bg-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent rounded-2xl py-2 pl-10 pr-4 transition-all outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2 text-gray-600 hover:bg-yellow-50 hover:text-yellow-700 rounded-full transition-all md:flex items-center gap-2">
            <PenSquare className="w-6 h-6" />
            <span className="hidden lg:block font-medium">เขียน Blog</span>
          </button>
          <button className="p-2 text-gray-600 hover:bg-yellow-50 hover:text-yellow-700 rounded-full relative">
            <Bell className="w-6 h-6" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <div className="w-9 h-9 bg-black rounded-full overflow-hidden border-2 border-yellow-400 cursor-pointer hover:scale-105 transition-transform">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Profile" />
          </div>
        </div>
      </nav>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full w-64 bg-white z-50 transform transition-transform duration-300 ease-in-out border-r border-gray-100 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <span className="text-xl font-bold text-yellow-500">Menu</span>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden">
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="space-y-2">
            <SidebarItem icon={<Home />} label="Home" active />
            <SidebarItem icon={<Library />} label="Library" />
            <SidebarItem icon={<User />} label="Profile" />
            <SidebarItem icon={<BarChart2 />} label="Stat" />
          </nav>

          <div className="mt-10 p-4 bg-yellow-400 rounded-2xl">
            <p className="text-xs font-bold text-black uppercase mb-1">Bee Premium</p>
            <p className="text-sm text-black/80 mb-3">ปลดล็อกฟีเจอร์ใหม่ๆ และสนับสนุนนักเขียนที่คุณรัก</p>
            <button className="w-full py-2 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors">อัปเกรดเลย</button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="pt-20 px-4 md:px-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Feed Section */}
        <div className="lg:col-span-8">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab('feed')}
              className={`pb-4 px-6 font-bold transition-all relative ${activeTab === 'feed' ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Your Feed
              {activeTab === 'feed' && <div className="absolute bottom-0 left-0 w-full h-1 bg-yellow-400 rounded-t-full" />}
            </button>
            <button
              onClick={() => setActiveTab('followed')}
              className={`pb-4 px-6 font-bold transition-all relative ${activeTab === 'followed' ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Your Followed
              {activeTab === 'followed' && <div className="absolute bottom-0 left-0 w-full h-1 bg-yellow-400 rounded-t-full" />}
            </button>
          </div>

          {/* Blog List */}
          <div className="space-y-6">
            {blogs.map(blog => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        </div>

        {/* Right Sidebar - Recommendations */}
        <div className="lg:col-span-4 space-y-8 hidden lg:block">
          {/* Popular Today */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-yellow-600" />
              <h3 className="font-bold text-lg">ยอดนิยมวันนี้</h3>
            </div>
            <div className="space-y-4">
              <PopularItem title="เทรนด์สีปี 2024 ที่สายกราฟิกต้องรู้" category="Design" />
              <PopularItem title="รวม 5 อาหารเช้าพลังงานสูงสำหรับวัยทำงาน" category="Health" />
              <PopularItem title="ทริคการลงทุนฉบับมือใหม่ เริ่มต้นด้วยเงิน 1,000" category="Finance" />
            </div>
            <button className="w-full mt-6 py-2 text-sm font-semibold text-yellow-700 hover:bg-yellow-50 rounded-xl transition-colors">
              ดูเพิ่มเติม
            </button>
          </div>

          {/* Suggested Authors */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-lg mb-4">แนะนำให้ติดตาม</h3>
            <div className="space-y-5">
              <AuthorItem name="Honey_Designer" bio="Creative & UI Specialist" avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Annie" />
              <AuthorItem name="TravelWithBee" bio="Backpacker & Photographer" avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Jack" />
              <AuthorItem name="TheWorkerBee" bio="Productivity & Tech Tips" avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe" />
            </div>
          </div>

          {/* Footer Links */}
          <div className="px-4 text-xs text-gray-400 flex flex-wrap gap-4">
            <a href="#" className="hover:text-yellow-600">ข้อกำหนดการใช้งาน</a>
            <a href="#" className="hover:text-yellow-600">นโยบายความเป็นส่วนตัว</a>
            <a href="#" className="hover:text-yellow-600">ความช่วยเหลือ</a>
            <p>© 2024 BeeBlog Inc.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

const SidebarItem = ({ icon, label, active = false }) => (
  <button className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${active ? 'bg-yellow-400 text-black font-bold shadow-md shadow-yellow-200' : 'text-gray-500 hover:bg-yellow-50 hover:text-yellow-700'}`}>
    {React.cloneElement(icon, { className: 'w-6 h-6' })}
    <span>{label}</span>
  </button>
);

const BlogCard = ({ blog }) => (
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

const PopularItem = ({ title, category }) => (
  <div className="group cursor-pointer">
    <p className="text-[10px] font-bold text-yellow-600 uppercase tracking-wider mb-1">{category}</p>
    <h4 className="text-sm font-bold group-hover:text-yellow-600 transition-colors line-clamp-1">{title}</h4>
  </div>
);

const AuthorItem = ({ name, bio, avatar }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
        <img src={avatar} alt={name} />
      </div>
      <div>
        <h4 className="text-sm font-bold">{name}</h4>
        <p className="text-[10px] text-gray-400">{bio}</p>
      </div>
    </div>
    <button className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-full transition-colors">
      <UserPlus className="w-5 h-5" />
    </button>
  </div>
);

export default App;