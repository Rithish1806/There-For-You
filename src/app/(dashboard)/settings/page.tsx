"use client";

import { Settings as SettingsIcon, Shield, Bell, Eye, Database, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function SettingsPage() {
  const [resetting, setResetting] = useState(false);

  const handleReset = () => {
    setResetting(true);
    setTimeout(() => {
      setResetting(false);
      alert("Demo data successfully reset to default state.");
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your application preferences and demo data.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Sidebar */}
        <div className="md:col-span-1 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl bg-primary text-white">
            <SettingsIcon size={18} /> General
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
            <Shield size={18} /> Privacy
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
            <Bell size={18} /> Notifications
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
            <Eye size={18} /> Appearance
          </button>
        </div>

        {/* Content */}
        <div className="md:col-span-3 space-y-8">
          
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Database className="text-indigo-500" />
                Demo Data Management
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <p className="text-sm font-medium text-slate-900 mb-1">Reset Application State</p>
                <p className="text-sm text-slate-500 mb-4">
                  Restore all student records, chatbot history, tasks, and wellness check-ins to their original demonstration state.
                </p>
                <button 
                  onClick={handleReset}
                  disabled={resetting}
                  className="px-5 py-2.5 bg-rose-50 text-rose-600 border border-rose-200 rounded-xl text-sm font-semibold hover:bg-rose-100 transition-colors flex items-center gap-2"
                >
                  <AlertTriangle size={16} />
                  {resetting ? 'Resetting...' : 'Reset Demo Data'}
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
             <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">About Project</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-slate-500 mb-1">Project Title</p>
                <p className="font-medium text-slate-900">AI-Powered Student Assistance Platform (There For You)</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Project ID</p>
                <p className="font-medium text-slate-900">2026MIN525</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Disclaimer</p>
                <p className="text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100 mt-2">
                  This application is a project prototype. Some AI responses, scholarship schemes, and academic datasets are demonstration data for validation purposes.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
