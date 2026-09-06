"use client";

import { useState, useEffect } from 'react';
import { 
  Award, Search, Filter, MapPin, Building2, ExternalLink, 
  CheckCircle2, AlertTriangle, Sparkles, Sliders, ArrowRight, MessageSquare
} from 'lucide-react';
import Link from 'next/link';

interface ScholarshipItem {
  id: string;
  name: string;
  provider: string;
  amount: string;
  deadline: string;
  minAge: number;
  maxAge: number;
  minCgpa: number;
  maxIncomeLPA: number;
  eligibleGenders: string[];
  eligibleCategories: string[];
  eligibleStreams: string[];
  specialCriteria?: string;
  applicationLink: string;
  description: string;
  matchScore: number;
  isEligible: boolean;
  reasons: string[];
  disqualifications: string[];
}

export default function ScholarshipsPage() {
  // Student Criteria State
  const [age, setAge] = useState<number>(20);
  const [gender, setGender] = useState<string>('male');
  const [category, setCategory] = useState<string>('General');
  const [income, setIncome] = useState<number>(4.5);
  const [cgpa, setCgpa] = useState<number>(8.2);
  const [stream, setStream] = useState<string>('Engineering');
  const [isDifferentlyAbled, setIsDifferentlyAbled] = useState<boolean>(false);

  // Search & Results State
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEligibleOnly, setFilterEligibleOnly] = useState(false);
  const [scholarships, setScholarships] = useState<ScholarshipItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalEligible, setTotalEligible] = useState(0);

  const fetchMatches = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/scholarships/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          age,
          gender,
          category,
          annualIncomeLPA: income,
          cgpa,
          stream,
          isDifferentlyAbled,
        }),
      });
      const data = await res.json();
      if (res.ok && data.matchedScholarships) {
        setScholarships(data.matchedScholarships);
        setTotalEligible(data.totalEligible || 0);
      }
    } catch (err) {
      console.error("Failed to match scholarships:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const filteredScholarships = scholarships.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.provider.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEligibility = filterEligibleOnly ? s.isEligible : true;
    return matchesSearch && matchesEligibility;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-950 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl border border-indigo-700/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 mb-3">
              <Sparkles size={14} className="text-amber-300" />
              AI-Powered Criteria Matcher
            </span>
            <h1 className="text-3xl font-extrabold mb-2 flex items-center gap-3">
              Scholarships & Eligibility
            </h1>
            <p className="text-indigo-200 text-sm leading-relaxed">
              Find scholarships filtered specifically to your exact age, family income, academic CGPA, and degree stream.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 text-center min-w-[160px]">
            <p className="text-xs text-indigo-200 font-medium">Eligible Opportunities</p>
            <p className="text-3xl font-black text-emerald-300 mt-1">{totalEligible}</p>
            <p className="text-[11px] text-indigo-300">out of {scholarships.length} schemes</p>
          </div>
        </div>
      </div>

      {/* Criteria Customization Panel */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <Sliders size={20} className="text-primary" />
            <h2 className="font-bold text-slate-800 text-lg">Your Profile & Eligibility Criteria</h2>
          </div>
          <button
            onClick={fetchMatches}
            disabled={isLoading}
            className="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl shadow hover:bg-indigo-700 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Sparkles size={16} />
            {isLoading ? 'Re-evaluating...' : 'Re-calculate Matches'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-sm">
          {/* Age Selector */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1">
            <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
              <span>Student Age</span>
              <span className="font-bold text-primary text-sm">{age} years</span>
            </div>
            <input 
              type="range" 
              min="15" 
              max="35" 
              value={age} 
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer mt-2"
            />
          </div>

          {/* Family Income */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1">
            <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
              <span>Annual Family Income</span>
              <span className="font-bold text-primary text-sm">₹{income} LPA</span>
            </div>
            <input 
              type="range" 
              min="1.0" 
              max="15.0" 
              step="0.5" 
              value={income} 
              onChange={(e) => setIncome(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer mt-2"
            />
          </div>

          {/* CGPA */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1">
            <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
              <span>Academic Score (CGPA)</span>
              <span className="font-bold text-primary text-sm">{cgpa} / 10</span>
            </div>
            <input 
              type="range" 
              min="5.0" 
              max="10.0" 
              step="0.1" 
              value={cgpa} 
              onChange={(e) => setCgpa(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer mt-2"
            />
          </div>

          {/* Gender */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1">
            <label className="text-xs text-slate-500 font-medium block">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl p-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="male">Male</option>
              <option value="female">Female (Unlocks Pragati / Kotak Kanya)</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Category */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1">
            <label className="text-xs text-slate-500 font-medium block">Social Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl p-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="General">General</option>
              <option value="OBC">OBC</option>
              <option value="SC">SC</option>
              <option value="ST">ST</option>
              <option value="EWS">EWS</option>
            </select>
          </div>

          {/* Stream */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1">
            <label className="text-xs text-slate-500 font-medium block">Field of Study</label>
            <select
              value={stream}
              onChange={(e) => setStream(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl p-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="Engineering">Engineering / Technical</option>
              <option value="Science">Basic / Natural Sciences</option>
              <option value="Medical">Medical / Healthcare</option>
              <option value="Arts">Arts / Humanities</option>
              <option value="Commerce">Commerce / Management</option>
            </select>
          </div>

          {/* Differently Abled Checkbox */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex items-center justify-between col-span-1 sm:col-span-2">
            <div>
              <p className="font-semibold text-slate-800 text-xs">Persons with Disabilities (PwD)</p>
              <p className="text-[11px] text-slate-500">Unlocks AICTE Saksham & specialized assistance</p>
            </div>
            <input
              type="checkbox"
              checked={isDifferentlyAbled}
              onChange={(e) => setIsDifferentlyAbled(e.target.checked)}
              className="w-5 h-5 accent-primary cursor-pointer rounded"
            />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-3 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by scholarship name or ministry..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setFilterEligibleOnly(!filterEligibleOnly)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-semibold border transition-all flex items-center gap-2 cursor-pointer ${
              filterEligibleOnly
                ? 'bg-emerald-600 text-white border-emerald-600 shadow'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <CheckCircle2 size={16} />
            {filterEligibleOnly ? 'Showing Eligible Only' : 'Show Eligible Only'}
          </button>
        </div>
      </div>

      {/* Scholarship Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredScholarships.map((item) => (
          <div
            key={item.id}
            className={`bg-white border rounded-3xl p-6 transition-all flex flex-col justify-between relative overflow-hidden ${
              item.isEligible
                ? 'border-emerald-200 shadow-md hover:shadow-lg hover:border-emerald-300'
                : 'border-slate-200 opacity-80 hover:opacity-100'
            }`}
          >
            {/* Match Badge */}
            <div className="flex justify-between items-start mb-4">
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                  item.isEligible
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-100 text-rose-800 border border-rose-200'
                }`}
              >
                {item.isEligible ? (
                  <>
                    <CheckCircle2 size={14} /> {item.matchScore}% Match (Eligible)
                  </>
                ) : (
                  <>
                    <AlertTriangle size={14} /> Ineligible ({item.matchScore}%)
                  </>
                )}
              </span>

              <span className="text-xs text-slate-400 font-medium">
                Deadline: <strong className="text-slate-700">{item.deadline}</strong>
              </span>
            </div>

            {/* Scheme Title & Provider */}
            <div className="space-y-1 mb-4">
              <h3 className="font-extrabold text-slate-900 text-lg leading-snug">
                {item.name}
              </h3>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <Building2 size={14} /> {item.provider}
              </p>
            </div>

            {/* Amount Box */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5 mb-4 flex justify-between items-center">
              <span className="text-xs text-slate-500 font-medium">Scholarship Benefit</span>
              <span className="text-sm font-bold text-emerald-600">{item.amount}</span>
            </div>

            {/* AI Eligibility Insights */}
            <div className="space-y-2 mb-6 text-xs">
              <p className="font-semibold text-slate-700">Criteria Analysis:</p>
              {item.isEligible ? (
                <ul className="space-y-1">
                  {item.reasons.map((r, i) => (
                    <li key={i} className="text-emerald-700 flex items-start gap-1.5">
                      <span className="text-emerald-500 font-bold">✓</span> {r}
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="space-y-1">
                  {item.disqualifications.map((d, i) => (
                    <li key={i} className="text-rose-600 flex items-start gap-1.5">
                      <span className="text-rose-500 font-bold">✗</span> {d}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
              <a
                href={item.applicationLink}
                target="_blank"
                rel="noreferrer"
                className={`flex-1 py-2.5 px-4 text-center rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  item.isEligible
                    ? 'bg-primary text-white hover:bg-indigo-700 shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Apply Official Portal <ExternalLink size={14} />
              </a>

              <Link
                href="/assistant"
                className="p-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl transition-colors"
                title="Ask AI Assistant about this scholarship"
              >
                <MessageSquare size={16} />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredScholarships.length === 0 && (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8">
          <Award size={48} className="mx-auto text-slate-300 mb-3" />
          <p className="font-bold text-slate-700">No scholarships match the current filter</p>
          <p className="text-xs text-slate-400 mt-1">Try relaxing the criteria or clearing the search query.</p>
        </div>
      )}
    </div>
  );
}
