import { Search, Bell, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { demoStudent } from '@/data/studentData';

export default function Topbar() {
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
        <Link href="/assistant" className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-100 transition-colors">
          <Sparkles size={16} />
          <span className="text-sm font-medium">Ask There For You</span>
        </Link>
        
        <button className="relative text-slate-500 hover:text-slate-900 transition-colors">
          <Bell size={24} />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium text-slate-900">{demoStudent.name}</span>
            <span className="text-xs text-slate-500">{demoStudent.id}</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold shadow-sm">
            {demoStudent.name.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
}
