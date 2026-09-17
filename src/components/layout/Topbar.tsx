"use client";

import { useEffect, useState } from 'react';
import { Search, Bell, Sparkles, Sun, Moon } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '@/components/theme/ThemeProvider';

export default function Topbar() {
  const [student, setStudent] = useState<{ name: string; studentId: string } | null>(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.user) {
          setStudent(data.user);
        }
      })
      .catch(() => {});
  }, []);

  const name = student?.name || "Student";
  const studentId = student?.studentId || "Student Portal";
  const initial = name.charAt(0).toUpperCase();

  return (
    <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between px-8 sticky top-0 z-30 ml-64 transition-colors duration-250">
      <div className="flex items-center flex-1 mr-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={20} />
          <input 
            type="text" 
            placeholder="Search resources, topics, or ask AI..." 
            className="w-full bg-slate-100 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-transparent dark:border-slate-700/60 rounded-full py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 dark:focus:ring-indigo-500/30 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          title={theme === 'dark' ? "Switch to Light Theme" : "Switch to Dark Theme"}
          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-amber-400 bg-slate-100/70 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xs group"
        >
          {theme === 'dark' ? (
            <Sun size={19} className="transition-transform duration-300 group-hover:rotate-45" />
          ) : (
            <Moon size={19} className="text-indigo-600 transition-transform duration-300 group-hover:-rotate-12" />
          )}
        </button>

        <Link 
          href="/assistant" 
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/70 dark:to-purple-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/70 rounded-full hover:bg-indigo-100/70 dark:hover:bg-indigo-900/50 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all hover-lift shadow-xs group"
        >
          <Sparkles size={16} className="text-indigo-600 dark:text-indigo-400 group-hover:rotate-12 transition-transform duration-300 animate-pulse" />
          <span className="text-sm font-semibold">Ask AI Tutor</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        </Link>
        
        <Link 
          href="/notifications" 
          className="relative text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Bell size={21} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse"></span>
        </Link>
        
        <Link href="/profile" className="flex items-center gap-3 pl-5 border-l border-slate-200 dark:border-slate-800 group">
          <div className="flex flex-col items-end">
            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{name}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">{studentId}</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-sm group-hover:scale-105 group-hover:shadow-indigo-500/30 group-hover:shadow-md transition-all duration-300">
            {initial}
          </div>
        </Link>
      </div>
    </header>
  );
}
