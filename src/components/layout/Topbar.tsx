"use client";

import { useEffect, useState } from 'react';
import { Search, Bell, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function Topbar() {
  const [student, setStudent] = useState<{ name: string; studentId: string } | null>(null);

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
    <header className="h-20 bg-surface/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-30 ml-64">
      <div className="flex items-center flex-1">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search resources, topics, or ask AI..." 
            className="w-full bg-slate-100 border-none rounded-full py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <Link 
          href="/assistant" 
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-200/60 rounded-full hover:bg-indigo-100/70 hover:border-indigo-300 transition-all hover-lift shadow-xs group"
        >
          <Sparkles size={16} className="text-indigo-600 group-hover:rotate-12 transition-transform duration-300 animate-pulse" />
          <span className="text-sm font-semibold">Ask AI Tutor</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        </Link>
        
        <Link 
          href="/notifications" 
          className="relative text-slate-500 hover:text-slate-900 transition-colors p-1.5 rounded-xl hover:bg-slate-100"
        >
          <Bell size={22} />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse"></span>
        </Link>
        
        <Link href="/profile" className="flex items-center gap-3 pl-6 border-l border-slate-200 group">
          <div className="flex flex-col items-end">
            <span className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{name}</span>
            <span className="text-xs text-slate-500">{studentId}</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-sm group-hover:scale-110 group-hover:shadow-indigo-300 group-hover:shadow-md transition-all duration-300">
            {initial}
          </div>
        </Link>
      </div>
    </header>
  );
}
