"use client";

import { useState } from 'react';
import { Heart, Activity, Coffee, Smile, Frown, Meh, Sun, Moon, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function WellnessPage() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [showCheckIn, setShowCheckIn] = useState(true);

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    setTimeout(() => {
      setShowCheckIn(false);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="text-center space-y-3 pt-8 pb-4">
        <div className="w-16 h-16 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-2">
          <Heart size={32} />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Wellness Companion</h1>
        <p className="text-slate-500 text-lg max-w-lg mx-auto">Take a moment to check in with yourself. Your well-being is just as important as your academics.</p>
      </div>

      {/* Daily Check-in */}
      {showCheckIn ? (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-10 text-center relative overflow-hidden">
          <h2 className="text-xl font-semibold text-slate-800 mb-8 relative z-10">How are you feeling today?</h2>
          
          <div className="flex justify-center gap-4 md:gap-8 relative z-10">
            <MoodButton emoji="😄" label="Great" onClick={() => handleMoodSelect('Great')} selected={selectedMood === 'Great'} />
            <MoodButton emoji="🙂" label="Good" onClick={() => handleMoodSelect('Good')} selected={selectedMood === 'Good'} />
            <MoodButton emoji="😐" label="Okay" onClick={() => handleMoodSelect('Okay')} selected={selectedMood === 'Okay'} />
            <MoodButton emoji="😟" label="Stressed" onClick={() => handleMoodSelect('Stressed')} selected={selectedMood === 'Stressed'} />
            <MoodButton emoji="😔" label="Low" onClick={() => handleMoodSelect('Low')} selected={selectedMood === 'Low'} />
          </div>

          {selectedMood && (
            <div className="mt-8 text-emerald-600 flex items-center justify-center gap-2 font-medium animate-in slide-in-from-bottom-4">
              <CheckCircle2 /> Thanks for checking in! Saving your response...
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-3xl shadow-sm border border-rose-100 p-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-rose-200 text-rose-700 rounded-xl">
              <Heart size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">AI Wellness Insight</h3>
              <p className="text-slate-700 mt-2 leading-relaxed">
                I noticed you've been studying Data Structures for over 2 hours today. Based on your "Okay" mood, I recommend taking a 15-minute break away from screens. Grab some water and stretch!
              </p>
              <div className="mt-4 flex gap-3">
                <button className="px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700 transition-colors">
                  Start 15min Break Timer
                </button>
                <Link href="/assistant" className="px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                  Chat with AI
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Wellness Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Study Balance */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Activity className="text-emerald-500" /> Study Balance
          </h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-600 flex items-center gap-2"><Sun size={16}/> Study Time Today</span>
                <span className="font-semibold text-slate-900">4h 30m</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-600 flex items-center gap-2"><Moon size={16}/> Sleep Last Night</span>
                <span className="font-semibold text-slate-900">6h 15m</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Reminders */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Coffee className="text-orange-500" /> Healthy Habits
          </h3>
          <div className="space-y-3 text-sm">
            <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
              <input type="checkbox" className="w-5 h-5 rounded text-primary focus:ring-primary border-slate-300" defaultChecked />
              <span className="font-medium text-slate-700 line-through">Drink water (Morning)</span>
            </label>
            <label className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
              <input type="checkbox" className="w-5 h-5 rounded text-primary focus:ring-primary border-slate-300" />
              <span className="font-medium text-slate-700">10-minute stretch</span>
            </label>
            <label className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
              <input type="checkbox" className="w-5 h-5 rounded text-primary focus:ring-primary border-slate-300" />
              <span className="font-medium text-slate-700">Log off by 11:00 PM</span>
            </label>
          </div>
        </div>
      </div>
      
      <p className="text-center text-xs text-slate-400 pt-8 pb-4">
        Note: This is an AI wellness companion, not a medical tool. If you are experiencing severe distress, please seek professional support.
      </p>
    </div>
  );
}

function MoodButton({ emoji, label, onClick, selected }: { emoji: string, label: string, onClick: () => void, selected: boolean }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-3 p-4 rounded-2xl transition-all duration-300 ${
        selected 
          ? 'bg-rose-100 scale-110 shadow-md ring-2 ring-rose-300' 
          : 'bg-slate-50 hover:bg-slate-100 hover:scale-105'
      }`}
    >
      <span className="text-4xl">{emoji}</span>
      <span className={`text-sm font-medium ${selected ? 'text-rose-700' : 'text-slate-600'}`}>{label}</span>
    </button>
  );
}
