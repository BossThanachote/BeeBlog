import { TrendingUp } from 'lucide-react';
import { PopularItem, AuthorItem } from '../molecules/RightSidebarItem';

export const RightSidebar = () => {
  return (
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
  );
};