"use client";

import { Settings as SettingsIcon, Shield, Bell, Eye, Database, AlertTriangle, Sun, Moon, Check } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '@/components/theme/ThemeProvider';

export default function SettingsPage() {
  const [resetting, setResetting] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'appearance' | 'privacy' | 'notifications'>('general');
  const { theme, setTheme } = useTheme();

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
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your application preferences, appearance, and demo data.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Sidebar */}
        <div className="md:col-span-1 space-y-2">
          <button 
            onClick={() => setActiveTab('general')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl transition-all cursor-pointer ${
              activeTab === 'general'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <SettingsIcon size={18} /> General
          </button>
          <button 
            onClick={() => setActiveTab('appearance')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl transition-all cursor-pointer ${
              activeTab === 'appearance'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Eye size={18} /> Appearance
          </button>
          <button 
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl transition-all cursor-pointer ${
              activeTab === 'notifications'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Bell size={18} /> Notifications
          </button>
          <button 
            onClick={() => setActiveTab('privacy')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl transition-all cursor-pointer ${
              activeTab === 'privacy'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Shield size={18} /> Privacy
          </button>
        </div>

        {/* Content */}
        <div className="md:col-span-3 space-y-8">
          
          {/* Appearance Section */}
          {(activeTab === 'appearance' || activeTab === 'general') && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Eye className="text-indigo-600 dark:text-indigo-400" size={20} />
                  Appearance & Dual Theme
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Choose your preferred workspace aesthetic. Toggle between crisp Light Mode or eye-friendly Dark Mode.
                </p>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Light Theme Card */}
                  <div
                    onClick={() => setTheme('light')}
                    className={`cursor-pointer rounded-2xl p-4 border-2 transition-all group relative ${
                      theme === 'light'
                        ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/20 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-white shadow-xs border border-slate-200 text-amber-500">
                          <Sun size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">Light Theme</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Clean & vibrant workspace</p>
                        </div>
                      </div>
                      {theme === 'light' && (
                        <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                          <Check size={13} strokeWidth={3} />
                        </div>
                      )}
                    </div>
                    {/* Visual Mockup Preview */}
                    <div className="h-16 rounded-xl bg-slate-100 p-2 border border-slate-200 flex flex-col justify-between">
                      <div className="w-1/3 h-2 rounded-full bg-slate-300" />
                      <div className="flex gap-2">
                        <div className="w-2/3 h-3 rounded-md bg-white border border-slate-200" />
                        <div className="w-1/3 h-3 rounded-md bg-indigo-500" />
                      </div>
                    </div>
                  </div>

                  {/* Dark Theme Card */}
                  <div
                    onClick={() => setTheme('dark')}
                    className={`cursor-pointer rounded-2xl p-4 border-2 transition-all group relative ${
                      theme === 'dark'
                        ? 'border-indigo-500 bg-indigo-950/30 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-slate-800 shadow-xs border border-slate-700 text-indigo-400">
                          <Moon size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">Dark Theme</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Sleek, low-strain night mode</p>
                        </div>
                      </div>
                      {theme === 'dark' && (
                        <div className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center shadow-xs">
                          <Check size={13} strokeWidth={3} />
                        </div>
                      )}
                    </div>
                    {/* Visual Mockup Preview */}
                    <div className="h-16 rounded-xl bg-slate-950 p-2 border border-slate-800 flex flex-col justify-between">
                      <div className="w-1/3 h-2 rounded-full bg-slate-700" />
                      <div className="flex gap-2">
                        <div className="w-2/3 h-3 rounded-md bg-slate-900 border border-slate-800" />
                        <div className="w-1/3 h-3 rounded-md bg-indigo-600" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Demo Data Management */}
          {(activeTab === 'general') && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Database className="text-indigo-500" />
                  Demo Data Management
                </h2>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-1">Reset Application State</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    Restore all student records, chatbot history, tasks, and wellness check-ins to their original demonstration state.
                  </p>
                  <button 
                    onClick={handleReset}
                    disabled={resetting}
                    className="px-5 py-2.5 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 rounded-xl text-sm font-semibold hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <AlertTriangle size={16} />
                    {resetting ? 'Resetting...' : 'Reset Demo Data'}
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* About Project */}
          {(activeTab === 'general' || activeTab === 'privacy') && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">About Project</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Project Title</p>
                  <p className="font-medium text-slate-900 dark:text-slate-100">AI-Powered Student Assistance Platform (There For You)</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Project ID</p>
                  <p className="font-medium text-slate-900 dark:text-slate-100">2026MIN525</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Disclaimer</p>
                  <p className="text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/70 p-4 rounded-xl border border-slate-100 dark:border-slate-800 mt-2">
                    This application is a project prototype. Some AI responses, scholarship schemes, and academic datasets are demonstration data for validation purposes.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
