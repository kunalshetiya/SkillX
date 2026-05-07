'use client';

import { Menu, Bell, Search, User } from 'lucide-react';

interface TopNavbarProps {
  onMenuClick: () => void;
}

export function TopNavbar({ onMenuClick }: TopNavbarProps) {
  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-500"
        >
          <Menu size={24} />
        </button>
        
        <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 w-96">
          <Search size={18} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Search for skills or mentors..." 
            className="bg-transparent border-none focus:outline-none text-sm w-full"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 lg:gap-4">
        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="h-8 w-[1px] bg-gray-200 mx-2 hidden sm:block"></div>
        
        <button className="flex items-center gap-2 p-1 lg:p-2 hover:bg-gray-100 rounded-xl transition-colors">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-xs uppercase">
            DU
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-gray-900 leading-tight">Dev User</p>
            <p className="text-[10px] text-gray-500 leading-tight">Free Plan</p>
          </div>
        </button>
      </div>
    </header>
  );
}
