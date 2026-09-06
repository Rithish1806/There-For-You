"use client";

import { Briefcase, FileText, Target, Map, ArrowRight, Upload } from 'lucide-react';
import { demoStudent } from '@/data/studentData';

export default function CareerPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Career & Placement</h1>
        <p className="text-slate-500 mt-1">Prepare for your dream role as a {demoStudent.targetRole}.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Readiness Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-2">
                <Target className="text-indigo-600" />
                Placement Readiness
              </h2>
              <p className="text-slate-500 text-sm max-w-md">
                Based on your technical skills, resume ATS score, and mock interview performance, you are on track for placement season.
              </p>
            </div>
            <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
              {/* Circular Progress Mock */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#f1f5f9" strokeWidth="8" fill="none" />
                <circle cx="50" cy="50" r="40" stroke="#4f46e5" strokeWidth="8" fill="none" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * demoStudent.placementReadiness) / 100} strokeLinecap="round" className="transition-all duration-1000" />
              </svg>
              <div className="absolute text-2xl font-bold text-slate-900">{demoStudent.placementReadiness}%</div>
            </div>
          </div>

          {/* Skill Gap Analysis */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Skill Gap Analysis</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg inline-block mb-4 text-sm">Current Strong Skills</h3>
                <div className="space-y-3">
                  {demoStudent.skills.map(skill => (
                    <div key={skill} className="flex items-center gap-3">
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                      <span className="text-sm font-medium text-slate-700 w-24 shrink-0">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-rose-700 bg-rose-50 px-3 py-1.5 rounded-lg inline-block mb-4 text-sm">Missing for Target Role</h3>
                <ul className="space-y-3 text-sm text-slate-700 font-medium">
                  <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:bg-rose-500 before:rounded-full">System Design</li>
                  <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:bg-rose-500 before:rounded-full">Advanced Graph Algorithms</li>
                  <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:bg-rose-500 before:rounded-full">Cloud Basics (AWS/Azure)</li>
                </ul>
                <button className="mt-6 text-sm text-indigo-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                  Generate Learning Path <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="space-y-8">
          
          {/* ATS Analyzer */}
          <div className="bg-slate-900 text-white rounded-2xl shadow-lg p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <FileText className="text-indigo-400 mb-4" size={28} />
            <h3 className="text-lg font-bold mb-2">Resume ATS Analyzer</h3>
            <p className="text-slate-300 text-sm mb-6">Upload your resume to get an instant AI-powered ATS score and feedback.</p>
            
            <div className="bg-white/10 border border-white/20 border-dashed rounded-xl p-6 text-center hover:bg-white/20 transition-colors cursor-pointer group">
              <Upload className="mx-auto text-indigo-300 mb-2 group-hover:scale-110 transition-transform" size={24} />
              <span className="text-sm font-medium text-indigo-100">Upload PDF</span>
            </div>
            
            <div className="mt-4 bg-white/10 rounded-lg p-3 flex justify-between items-center backdrop-blur-sm">
              <span className="text-sm text-slate-300">Last Score:</span>
              <span className="font-bold text-emerald-400">78 / 100</span>
            </div>
          </div>

          {/* Mock Interview */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Briefcase className="text-indigo-600" size={20} />
              Mock Interview
            </h3>
            <div className="space-y-3">
              <button className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-indigo-600 hover:bg-indigo-50 transition-all group">
                <p className="font-semibold text-slate-900 group-hover:text-indigo-700">Technical (DSA)</p>
                <p className="text-xs text-slate-500 mt-1">Practice coding problem explanations.</p>
              </button>
              <button className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-indigo-600 hover:bg-indigo-50 transition-all group">
                <p className="font-semibold text-slate-900 group-hover:text-indigo-700">HR / Behavioral</p>
                <p className="text-xs text-slate-500 mt-1">STAR method practice.</p>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
