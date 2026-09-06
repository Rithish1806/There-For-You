import { 
  TrendingUp, 
  Clock, 
  Briefcase, 
  Heart,
  BookOpen,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { demoStudent } from '@/data/studentData';
import Link from 'next/link';

export default function Dashboard() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Good Morning, {demoStudent.name.split(' ')[0]} 👋</h1>
        <p className="text-slate-500 mt-1 text-lg">Here's your personalized student overview.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="CGPA" 
          value={demoStudent.cgpa.toString()} 
          icon={<TrendingUp size={24} className="text-indigo-600" />} 
          trend="+0.2"
          trendGood={true}
          bg="bg-indigo-50"
        />
        <KPICard 
          title="Attendance" 
          value={`${demoStudent.attendance}%`} 
          icon={<Clock size={24} className="text-emerald-600" />} 
          trend="-2%"
          trendGood={false}
          bg="bg-emerald-50"
        />
        <KPICard 
          title="Placement Readiness" 
          value={`${demoStudent.placementReadiness}%`} 
          icon={<Briefcase size={24} className="text-blue-600" />} 
          trend="+15%"
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
                    <p className="font-medium">DBMS performance needs attention</p>
                    <p className="text-indigo-200 text-sm">Your recent quiz scores were below average. Revise normalization for 25 minutes today.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                  <div className="p-1.5 bg-indigo-500/50 rounded-md mt-0.5"><Briefcase size={16} /></div>
                  <div>
                    <p className="font-medium">Resume keyword match is low</p>
                    <p className="text-indigo-200 text-sm">Your resume could benefit from stronger project keywords for the Software Engineer role.</p>
                  </div>
                </li>
              </ul>
              <div className="mt-5">
                <Link href="/assistant" className="inline-flex items-center gap-2 bg-white text-indigo-900 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-50 transition-colors">
                  Ask AI for a study plan
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>

          {/* Academic Overview */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900">Current Semester Performance</h3>
              <Link href="/academic" className="text-sm text-primary font-medium hover:underline">View details</Link>
            </div>
            
            <div className="space-y-4">
              <SubjectProgress name="Data Structures" score={85} />
              <SubjectProgress name="DBMS" score={68} />
              <SubjectProgress name="Operating Systems" score={78} />
              <SubjectProgress name="Computer Networks" score={82} />
            </div>
          </div>

        </div>

        {/* Sidebar Area - 1/3 */}
        <div className="space-y-8">
          
          {/* Career Target */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Career Goal</h3>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p className="text-sm text-slate-500 mb-1">Target Role</p>
              <p className="font-semibold text-slate-900 mb-4">{demoStudent.targetRole}</p>
              
              <p className="text-sm text-slate-500 mb-2">Top Skills Progress</p>
              <div className="flex flex-wrap gap-2">
                {demoStudent.skills.map(skill => (
                  <span key={skill} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-700">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Upcoming Tasks */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Today's Plan</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
                <input type="checkbox" className="w-5 h-5 rounded-md border-slate-300 text-primary focus:ring-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900 group-hover:text-primary transition-colors">Practice Trees (DSA)</p>
                  <p className="text-xs text-slate-500">30 min • High Priority</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
                <input type="checkbox" className="w-5 h-5 rounded-md border-slate-300 text-primary focus:ring-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900 group-hover:text-primary transition-colors">Revise Normalization</p>
                  <p className="text-xs text-slate-500">25 min • Medium Priority</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
                <input type="checkbox" className="w-5 h-5 rounded-md border-slate-300 text-primary focus:ring-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900 group-hover:text-primary transition-colors">Daily Wellness Check-in</p>
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
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between group hover:shadow-md transition-shadow">
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
