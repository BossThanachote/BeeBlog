import React from 'react';

interface SidebarItemProps {
  icon: React.ReactElement;
  label: string;
  active?: boolean;
}

export const SidebarItem = ({ icon, label, active = false }: SidebarItemProps) => {
  return (
    <button className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${
      active 
        ? 'bg-yellow-400 text-black font-bold shadow-md shadow-yellow-200' 
        : 'text-gray-500 hover:bg-yellow-50 hover:text-yellow-700'
    }`}>
      {React.cloneElement(icon, { className: 'w-6 h-6' } as React.SVGProps<SVGSVGElement>)}
      <span>{label}</span>
    </button>
  );
};