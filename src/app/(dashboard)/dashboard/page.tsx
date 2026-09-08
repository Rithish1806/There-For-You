"use client";

import { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  Clock, 
  Briefcase, 
  Heart, 
  BookOpen, 
  ArrowRight, 
  Sparkles,
  Award
} from 'lucide-react';
import { demoStudent } from '@/data/studentData';
import Link from 'next/link';

export default function Dashboard() {
  const [student, setStudent] = useState<any>(null);

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

  const displayName = student?.name 
    ? student.name.split(' ')[0] 
    : demoStudent.name.split(' ')[0];

  const isSchool = student?.educationLevel === 'School';
  const academicScoreTitle = isSchool ? "Percentage" : "CGPA";
  const academicScoreValue = isSchool 
    ? (student?.percentage ? `${student.percentage}%` : "85%") 
    : (student?.cgpa !== undefined && student?.cgpa !== null ? Number(student.cgpa).toFixed(2) : "8.00");

  let academicData: any = null;
  try {
    if (student?.academicDetails) {
      academicData = typeof student.academicDetails === 'string' ? JSON.parse(student.academicDetails) : student.academicDetails;
    }
  } catch (e) {}

  const attendanceValue = academicData?.attendance 
    ? `${academicData.attendance}%` 
    : (student?.attendance ? `${student.attendance}%` : "88%");

  const placementScore = student?.resumeAtsScore 
    ? `${student.resumeAtsScore}%` 
    : `${demoStudent.placementReadiness}%`;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Good Morning, {displayName} 👋</h1>
        <p className="text-slate-500 mt-1 text-lg">
          {student?.educationLevel === 'School' 
            ? `Welcome to your School Portal (${student.gradeClass || 'High School'}). Here's your personalized student overview.`
            : `Welcome to your College Portal (${student?.department || 'Engineering'}). Here's your personalized student overview.`
          }
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title={academicScoreTitle} 
          value={academicScoreValue} 
          icon={<TrendingUp size={24} className="text-indigo-600" />} 
          trend="+0.2"
          trendGood={true}
          bg="bg-indigo-50"
        />
        <KPICard 
          title="Attendance" 
          value={attendanceValue} 
          icon={<Clock size={24} className="text-emerald-600" />} 
          trend={academicData ? "Logged" : "Default"}
          trendGood={true}
          bg="bg-emerald-50"
        />
        <KPICard 
          title="Placement Readiness" 
          value={placementScore} 
          icon={<Briefcase size={24} className="text-blue-600" />} 
          trend={student?.resumeAtsScore ? "ATS Evaluated" : "+15%"}
          trendGood={true}
          bg="bg-blue-50"
        />
        <KPICard 
          title="Wellness" 
          value="Good" 
          icon={<Heart size={24} className="text-rose-600" />} 
          trend="Stable"
          trendGood={true}
          bg="bg-rose-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Area - 2/3 */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* AI Recommendations */}
          <div className="bg-gradient-to-br from-indigo-900 to-indigo-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={20} className="text-indigo-200" />
                <h3 className="font-semibold text-lg text-indigo-50">AI Insights & Priorities</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                  <div className="p-1.5 bg-indigo-500/50 rounded-md mt-0.5"><BookOpen size={16} /></div>
                  <div>
                    <p className="font-medium">Scholarships matching your profile</p>
                    <p className="text-indigo-200 text-sm">
                      Based on your {student?.category || 'General'} category and family income (₹{student?.annualIncomeLPA || '4.0'} LPA), new scholarships are available!
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3 bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                  <div className="p-1.5 bg-indigo-500/50 rounded-md mt-0.5"><Award size={16} /></div>
                  <div>
                    <p className="font-medium">Academic Recommendation</p>
                    <p className="text-indigo-200 text-sm">
                      Keep your {academicScoreTitle} above threshold to qualify for merit-based financial aid.
                    </p>
                  </div>
                </li>
              </ul>
              <div className="mt-5 flex gap-3">
                <Link href="/scholarships" className="inline-flex items-center gap-2 bg-white text-indigo-900 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-50 transition-colors">
                  Explore Matched Scholarships
                  <ArrowRight size={16} />
                </Link>
                <Link href="/assistant" className="inline-flex items-center gap-2 bg-white/10 text-white border border-white/20 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-white/20 transition-colors">
                  Ask AI Tutor
                </Link>
              </div>
            </div>
          </div>

          {/* Academic Overview */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900">Current Performance Tracker</h3>
              <Link href="/academic" className="text-sm text-indigo-600 font-medium hover:underline">View details</Link>
            </div>
            
            <div className="space-y-4">
              {academicData?.subjects && academicData.subjects.length > 0 ? (
                academicData.subjects.slice(0, 4).map((sub: any, i: number) => (
                  <SubjectProgress 
                    key={i} 
                    name={sub.name || `Subject ${i + 1}`} 
                    score={Math.min(100, Math.round(Number(sub.marks) || 75))} 
                  />
                ))
              ) : (
                <>
                  <SubjectProgress name="Core Subjects" score={85} />
                  <SubjectProgress name="Practical / Labs" score={78} />
                  <SubjectProgress name="Assignments" score={90} />
                  <SubjectProgress name="Attendance" score={92} />
                </>
              )}
            </div>
          </div>

        </div>

        {/* Sidebar Area - 1/3 */}
        <div className="space-y-8">
          
          {/* Career Target */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Student Profile Summary</h3>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase">Education</p>
                <p className="font-semibold text-slate-900 text-sm">{student?.educationLevel || "College"} Student</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase">Student ID</p>
                <p className="font-semibold text-slate-900 text-sm">{student?.studentId || "—"}</p>
              </div>
              <div className="pt-2">
                <Link href="/profile" className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1">
                  Edit Full Profile &rarr;
                </Link>
              </div>
            </div>
          </div>

          {/* Upcoming Tasks */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Today's Goals</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
                <input type="checkbox" className="w-5 h-5 rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900 group-hover:text-indigo-600 transition-colors">Apply for Matched Scholarship</p>
                  <p className="text-xs text-slate-500">Deadline approaching</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
                <input type="checkbox" className="w-5 h-5 rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900 group-hover:text-indigo-600 transition-colors">Review AI Study Plan</p>
                  <p className="text-xs text-slate-500">25 min • High Priority</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
                <input type="checkbox" className="w-5 h-5 rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900 group-hover:text-indigo-600 transition-colors">Daily Wellness Check-in</p>
                  <p className="text-xs text-slate-500">5 min</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Sub-components

function KPICard({ title, value, icon, trend, trendGood, bg }: any) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between group hover-lift transition-all cursor-default">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
          <span className={`text-xs font-medium ${trendGood ? 'text-emerald-600' : 'text-rose-600'}`}>
            {trend}
          </span>
        </div>
      </div>
      <div className={`p-3 rounded-xl ${bg} group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
    </div>
  );
}

function SubjectProgress({ name, score }: { name: string, score: number }) {
  let color = 'bg-emerald-500';
  if (score < 75) color = 'bg-amber-500';
  if (score < 60) color = 'bg-rose-500';

  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5">
        <span className="font-medium text-slate-700">{name}</span>
        <span className="text-slate-500">{score}%</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
        <div className={`h-2.5 rounded-full ${color}`} style={{ width: `${score}%` }}></div>
      </div>
    </div>
  );
}
