import { Menu, Search, PenSquare, Bell } from 'lucide-react';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export const Navbar = ({ onToggleSidebar }: NavbarProps) => {
  return (
    <nav className="fixed top-0 w-full h-16 bg-white border-b border-gray-100 px-4 flex items-center justify-between z-50">
      <div className="flex items-center gap-4">
        <button 
          onClick={onToggleSidebar}
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
  );
};