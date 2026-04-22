export const RightSidebar = () => {
  return (
    // ถอด bg, border, shadow, rounded ทิ้งหมด ใช้แค่ระยะห่าง space-y-10
    <div className="space-y-10">
      
      {/* กล่องยอดนิยม */}
      <div>
        <h3 className="font-bold text-gray-900 mb-6">ยอดนิยมวันนี้</h3>
        <div className="space-y-6">
          {[
            { tag: 'DESIGN', title: 'เทรนด์สีปี 2024 ที่สายกราฟิกต้องรู้' },
            { tag: 'HEALTH', title: 'รวม 5 อาหารเช้าพลังงานสูงสำหรับวัยทำงาน' },
            { tag: 'FINANCE', title: 'ทริคการลงทุนฉบับมือใหม่ เริ่มต้นด้วยเงิน 1,000 บาท' }
          ].map((item, i) => (
            <div key={i} className="group cursor-pointer flex gap-4 items-start">
              <span className="text-3xl font-bold text-gray-200 leading-none mt-1">0{i+1}</span>
              <div>
                <span className="text-[10px] font-bold text-yellow-600 tracking-wider mb-1 block">{item.tag}</span>
                <h4 className="font-bold text-sm text-gray-900 group-hover:text-yellow-600 transition-colors leading-snug">
                  {item.title}
                </h4>
              </div>
            </div>
          ))}
        </div>
        <button className="mt-6 text-sm font-medium text-yellow-600 hover:text-yellow-700 transition-colors">
          ดูเพิ่มเติม
        </button>
      </div>

      {/* กล่องแนะนำให้ติดตาม */}
      <div>
        <h3 className="font-bold text-gray-900 mb-6">แนะนำให้ติดตาม</h3>
        <div className="space-y-5">
          {[
            { name: 'Honey_Designer', role: 'Creative & UI Specialist' },
            { name: 'TravelWithBee', role: 'Backpacker & Photographer' },
            { name: 'TheWorkerBee', role: 'Productivity & Tech Tips' }
          ].map((user, i) => (
            <div key={i} className="flex items-center justify-between group cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full overflow-hidden shrink-0">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt={user.name} />
                </div>
                <div className="overflow-hidden pr-2">
                  <h4 className="font-bold text-sm text-gray-900 group-hover:text-yellow-600 transition-colors truncate">{user.name}</h4>
                  <p className="text-xs text-gray-500 truncate line-clamp-1">{user.role}</p>
                </div>
              </div>
              <button className="px-3 py-1.5 border border-gray-300 text-gray-900 text-xs font-medium rounded-full hover:border-gray-900 hover:bg-gray-50 transition-all shrink-0">
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};