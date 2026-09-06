"use client";

import { User, Mail, Hash, Book, Calendar, Target, Edit3 } from 'lucide-react';
import { demoStudent } from '@/data/studentData';

export default function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Student Profile</h1>
        <p className="text-slate-500 mt-1">Manage your personal and academic information.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Profile Header Background */}
        <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
          <button className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 p-2 rounded-lg text-white transition-colors backdrop-blur-sm">
            <Edit3 size={18} />
          </button>
        </div>
        
        {/* Avatar & Basic Info */}
        <div className="px-8 pb-8 relative">
          <div className="flex justify-between items-end -mt-12 mb-6">
            <div className="w-24 h-24 bg-white rounded-full p-1 border border-slate-100">
              <div className="w-full h-full bg-slate-200 rounded-full flex items-center justify-center text-3xl font-bold text-slate-500">
                {demoStudent.name.charAt(0)}
              </div>
            </div>
          </div>
          
          <div className="space-y-1 mb-8">
            <h2 className="text-2xl font-bold text-slate-900">{demoStudent.name}</h2>
            <p className="text-slate-500 flex items-center gap-2">
              <Mail size={16} /> {demoStudent.email}
            </p>
          </div>
          
          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoCard icon={<Hash size={18}/>} label="Student ID" value={demoStudent.id} />
            <InfoCard icon={<Book size={18}/>} label="Project ID" value={demoStudent.projectId} />
            <InfoCard icon={<Book size={18}/>} label="Department" value={demoStudent.department} />
            <InfoCard icon={<Calendar size={18}/>} label="Semester" value={demoStudent.semester} />
            <InfoCard icon={<Target size={18}/>} label="Target Career" value={demoStudent.targetRole} />
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl border border-slate-100 bg-slate-50/50">
      <div className="text-indigo-500 mt-0.5">{icon}</div>
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
        <p className="font-medium text-slate-900">{value}</p>
      </div>
    </div>
  );
}
