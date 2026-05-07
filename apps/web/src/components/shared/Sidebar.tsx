'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Store, 
  GitPullRequest, 
  Calendar, 
  MessageSquare, 
  Settings,
  X
} from 'lucide-react';
import { cn } from '@web/lib/utils';

export const NAV_ITEMS = [
  { label: 'Dashboard', href: '/profile', icon: LayoutDashboard },
  { label: 'Marketplace', href: '/marketplace', icon: Store },
  { label: 'Requests', href: '/requests', icon: GitPullRequest },
  { label: 'Sessions', href: '/sessions', icon: Calendar },
  { label: 'Messages', href: '/messages', icon: MessageSquare },
  { label: 'Settings', href: '/settings', icon: Settings },
];

interface SidebarProps {
  onClose?: () => void;
  className?: string;
}

export function Sidebar({ onClose, className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={cn("flex flex-col h-full bg-white border-r w-64", className)}>
      <div className="p-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">X</span>
          </div>
          <span className="text-xl font-bold tracking-tight">SkillX</span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all group",
                isActive 
                  ? "bg-blue-50 text-blue-600" 
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon 
                size={20} 
                className={cn(
                  "transition-colors",
                  isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-900"
                )} 
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-4 text-white shadow-md">
          <p className="text-xs font-bold opacity-80 uppercase tracking-widest mb-1">My Credits</p>
          <p className="text-2xl font-bold">500</p>
          <button className="mt-3 w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold transition-colors border border-white/20">
            Earn More
          </button>
        </div>
      </div>
    </aside>
  );
}
