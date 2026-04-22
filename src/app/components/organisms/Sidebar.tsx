import { Home, Library, User, BarChart2, X } from 'lucide-react';
import { SidebarItem } from '../molecules/SidebarItem';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
        />
      )}
      <aside className={`fixed left-0 top-0 h-full w-64 bg-white z-50 transform transition-transform duration-300 ease-in-out border-r border-gray-100 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <span className="text-xl font-bold text-yellow-500">Menu</span>
            <button onClick={onClose} className="md:hidden">
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
    </>
  );
};