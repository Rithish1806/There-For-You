"use client";

import { useState } from 'react';
import { BookOpen, GraduationCap, Calendar, CheckCircle2, AlertCircle, FileText, Upload, Check } from 'lucide-react';
import { demoStudent } from '@/data/studentData';

export default function AcademicPage() {
  const [activeTab, setActiveTab] = useState('performance');
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Practice Trees (DSA)', time: '30 min', priority: 'High', completed: false },
    { id: 2, title: 'Revise Normalization (DBMS)', time: '25 min', priority: 'Medium', completed: false },
    { id: 3, title: 'Complete OS Assignment', time: '1 hr', priority: 'High', completed: true },
  ]);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Academic Hub</h1>
        <p className="text-slate-500 mt-1">Track your performance and manage your studies.</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-white border border-slate-200 rounded-xl p-1 w-fit">
        {['performance', 'planner', 'quiz', 'materials'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 text-sm font-medium rounded-lg capitalize transition-all ${
              activeTab === tab 
                ? 'bg-slate-900 text-white shadow-sm' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 min-h-[500px]">
        
        {activeTab === 'performance' && (
          <div className="space-y-8">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <GraduationCap className="text-indigo-600" />
              Semester Performance Overview
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                <p className="text-sm text-slate-500 font-medium mb-1">Current CGPA</p>
                <p className="text-3xl font-bold text-slate-900">{demoStudent.cgpa}</p>
                <div className="mt-2 text-sm text-emerald-600 flex items-center gap-1 font-medium">
                  <CheckCircle2 size={16} /> Top 15% of class
                </div>
              </div>
              
              <div className="md:col-span-2 space-y-5">
                <h3 className="font-semibold text-slate-700">Subject Breakdown</h3>
                <SubjectProgress name="Data Structures & Algorithms" score={85} />
                <SubjectProgress name="Database Management Systems" score={68} warning />
                <SubjectProgress name="Operating Systems" score={78} />
                <SubjectProgress name="Computer Networks" score={82} />
              </div>
            </div>
            
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5 flex gap-4">
              <AlertCircle className="text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-indigo-900">AI Insight</h4>
                <p className="text-indigo-700 text-sm mt-1">Your DBMS score has dropped slightly compared to last semester. Consider focusing on Normalization and SQL queries for the upcoming internals.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'planner' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="text-indigo-600" />
              Interactive Study Planner
            </h2>
            
            <div className="space-y-3">
              {tasks.map(task => (
                <div key={task.id} className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${task.completed ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-200 shadow-sm hover:border-indigo-300'}`}>
                  <button 
                    onClick={() => toggleTask(task.id)}
                    className={`w-6 h-6 rounded-md border flex items-center justify-center transition-colors ${task.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 text-transparent hover:border-indigo-500'}`}
                  >
                    <Check size={16} />
                  </button>
                  <div className="flex-1">
                    <p className={`font-medium ${task.completed ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{task.title}</p>
                    <p className="text-xs text-slate-500">{task.time} • {task.priority} Priority</p>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-medium hover:border-indigo-500 hover:text-indigo-600 transition-colors">
              + Add New Task
            </button>
          </div>
        )}

        {activeTab === 'quiz' && (
          <div className="max-w-2xl mx-auto text-center py-12 space-y-6">
            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <BookOpen size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">AI-Generated Quizzes</h2>
            <p className="text-slate-500 text-lg">Test your knowledge with personalized quizzes generated from your weak subject areas.</p>
            
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-left space-y-4 max-w-sm mx-auto mt-8">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                <select className="w-full p-2.5 rounded-lg border border-slate-300 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
                  <option>Database Management (Recommended)</option>
                  <option>Data Structures</option>
                  <option>Operating Systems</option>
                </select>
              </div>
              <button className="w-full py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-sm">
                Start Quiz
              </button>
            </div>
          </div>
        )}

        {activeTab === 'materials' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <FileText className="text-indigo-600" />
              Smart PDF Summarizer
            </h2>
            
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center hover:border-indigo-500 hover:bg-indigo-50/50 transition-all cursor-pointer group">
              <div className="w-16 h-16 bg-slate-100 text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
                <Upload size={32} />
              </div>
              <h3 className="font-medium text-slate-900 text-lg mb-1">Upload Lecture PDF</h3>
              <p className="text-slate-500 text-sm max-w-sm mx-auto">
                There For You will generate a summary, extract key concepts, and prepare important questions automatically.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function SubjectProgress({ name, score, warning = false }: { name: string, score: number, warning?: boolean }) {
  let color = 'bg-emerald-500';
  if (score < 75) color = 'bg-amber-500';
  if (score < 60) color = 'bg-rose-500';

  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5">
        <span className="font-medium text-slate-700 flex items-center gap-2">
          {name}
          {warning && <AlertCircle size={14} className="text-amber-500" />}
        </span>
        <span className="font-semibold text-slate-900">{score}%</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
        <div className={`h-3 rounded-full transition-all duration-1000 ${color}`} style={{ width: `${score}%` }}></div>
      </div>
    </div>
  );
}
