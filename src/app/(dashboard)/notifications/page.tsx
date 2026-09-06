"use client";

import { Bell, GraduationCap, Briefcase, Award, HeartPulse, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

const initialNotifications = [
  { id: 1, type: 'academic', title: 'Pending Task', message: 'DBMS revision task is pending. Click to start.', time: '2 hours ago', read: false },
  { id: 2, type: 'career', title: 'Placement Milestone', message: 'You have reached 72% placement readiness. New mock interviews unlocked!', time: 'Yesterday', read: false },
  { id: 3, type: 'scholarship', title: 'New Scholarship Match', message: 'Pragati Scholarship for Technical Education matches your profile.', time: 'Yesterday', read: true },
  { id: 4, type: 'wellness', title: 'Daily Check-in', message: 'Time for your daily wellness check-in.', time: '2 days ago', read: true },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'academic': return <GraduationCap className="text-indigo-500" />;
      case 'career': return <Briefcase className="text-blue-500" />;
      case 'scholarship': return <Award className="text-emerald-500" />;
      case 'wellness': return <HeartPulse className="text-rose-500" />;
      default: return <Bell className="text-slate-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Notifications</h1>
          <p className="text-slate-500 mt-1">Stay updated with your personalized alerts.</p>
        </div>
        <button 
          onClick={markAllRead}
          className="text-sm font-medium text-primary hover:text-indigo-700 flex items-center gap-2"
        >
          <CheckCircle2 size={16} /> Mark all as read
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 divide-y divide-slate-100">
        {notifications.map(notification => (
          <div key={notification.id} className={`p-6 flex gap-4 transition-colors hover:bg-slate-50 ${!notification.read ? 'bg-indigo-50/30' : ''}`}>
            <div className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
              !notification.read ? 'bg-white shadow-sm border border-indigo-100' : 'bg-slate-50'
            }`}>
              {getIcon(notification.type)}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h3 className={`font-semibold ${!notification.read ? 'text-slate-900' : 'text-slate-700'}`}>
                  {notification.title}
                </h3>
                <span className="text-xs text-slate-400">{notification.time}</span>
              </div>
              <p className={`text-sm ${!notification.read ? 'text-slate-700' : 'text-slate-500'}`}>
                {notification.message}
              </p>
            </div>
            {!notification.read && (
              <div className="shrink-0 flex items-center">
                <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
