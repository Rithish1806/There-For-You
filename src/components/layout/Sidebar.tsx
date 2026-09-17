"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  const router = useRouter();
  const [user, setUser] = useState<{name: string, studentId: string} | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
        }
      })
      .catch(console.error);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <aside className="w-64 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800/80 flex flex-col fixed left-0 top-0 z-40 transition-colors duration-250">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-gradient-to-tr from-indigo-600 to-indigo-700 text-white p-2 rounded-xl flex items-center justify-center shadow-md animate-float-slow">
          <Sparkles size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">There For You</h1>
          <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold tracking-wide uppercase">AI Academic OS</p>
        </div>
      </div>
      
      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-250 group ${
                isActive 
                  ? 'bg-indigo-50/80 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold shadow-xs border-l-4 border-indigo-600 pl-3' 
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100 hover:translate-x-1'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={20} className={`transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`} />
                <span>{item.name}</span>
              </div>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-slate-200 dark:border-slate-800/80 space-y-1">
        {user && (
          <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-700/60">
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300 flex items-center justify-center font-bold">
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{user.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.studentId}</p>
            </div>
          </div>
        )}
        <button className="flex w-full items-center gap-3 px-4 py-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100 transition-all">
          <HelpCircle size={20} />
          <span>Help</span>
        </button>
        <button 
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-4 py-2.5 rounded-xl text-red-500 dark:text-rose-400 hover:bg-red-50 dark:hover:bg-rose-950/40 transition-all cursor-pointer"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
