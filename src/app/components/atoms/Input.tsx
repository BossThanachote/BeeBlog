import React from 'react';
import { LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: LucideIcon;
  error?: string; // เพิ่ม Prop สำหรับรับข้อความ Error
}

export const Input = ({ label, icon: Icon, error, ...props }: InputProps) => {
  return (
    <div>
      {/* จัด Label และ Error ให้อยู่บรรทัดเดียวกันด้วย Flex */}
      <div className="flex justify-between items-end mb-1">
        <label className="block text-sm font-bold text-gray-700">{label}</label>
        {error && <span className="text-red-500 text-xs font-bold animate-pulse">{error}</span>}
      </div>
      
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input 
          className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-yellow-400 outline-none transition-all ${
            error ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-transparent'
          }`}
          {...props}
        />
      </div>
    </div>
  );
};