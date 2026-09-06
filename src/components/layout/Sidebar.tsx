"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  MessageSquare, 
  GraduationCap, 
  Briefcase, 
  HeartPulse, 
  Award, 
  Bell, 
  User, 
  Settings,
  HelpCircle,
  LogOut,
  Sparkles
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'AI Assistant', href: '/assistant', icon: MessageSquare },
  { name: 'Academic', href: '/academic', icon: GraduationCap },
  { name: 'Career', href: '/career', icon: Briefcase },
  { name: 'Wellness', href: '/wellness', icon: HeartPulse },
  { name: 'Scholarships', href: '/scholarships', icon: Award },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-surface border-r border-slate-200 flex flex-col fixed left-0 top-0 z-40">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-primary text-white p-2 rounded-xl flex items-center justify-center">
          <Sparkles size={24} />
        </div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">There For You</h1>
      </div>
      
      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-primary/10 text-primary font-medium' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-primary' : 'text-slate-400'} />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-slate-200 space-y-1">
        <button className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all">
          <HelpCircle size={20} />
          <span>Help</span>
        </button>
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-emerald-600 bg-emerald-50">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="font-medium text-sm">Demo Mode Active</span>
        </div>
        <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all">
          <LogOut size={20} />
          <span>Logout</span>
        </Link>
      </div>
    </aside>
  );
}
