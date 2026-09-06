"use client";

import { useEffect, useState, useRef } from 'react';
import { 
  Briefcase, 
  FileText, 
  Target, 
  ArrowRight, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Copy, 
  Check, 
  RefreshCw, 
  X, 
  Zap, 
  TrendingUp,
  FileCheck,
  Award,
  ChevronRight
} from 'lucide-react';
import { demoStudent } from '@/data/studentData';

const TARGET_ROLES = [
  "Software Development Engineer",
  "Full Stack Developer",
  "Data Scientist / ML Engineer",
  "Frontend Developer",
  "Backend & Systems Engineer",
  "Cloud & DevOps Engineer",
  "Cybersecurity Analyst",
  "Product / Technical Analyst"
];

export default function CareerPage() {
  const [student, setStudent] = useState<any>(null);
  
  // Analyzer UI state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(TARGET_ROLES[0]);
  const [customRole, setCustomRole] = useState('');
  const [activeInputTab, setActiveInputTab] = useState<'upload' | 'paste'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [copiedKeyword, setCopiedKeyword] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchStudentProfile = () => {
    fetch('/api/auth/me')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.user) {
          setStudent(data.user);
          if (data.user.resumeAnalysis) {
            try {
              const parsed = typeof data.user.resumeAnalysis === 'string' 
                ? JSON.parse(data.user.resumeAnalysis) 
                : data.user.resumeAnalysis;
              setAnalysisResult(parsed);
              if (parsed.targetRole) {
                setSelectedRole(parsed.targetRole);
              }
            } catch (e) {}
          }
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchStudentProfile();
  }, []);

  const studentName = student?.name || demoStudent.name;
  const currentAtsScore = student?.resumeAtsScore ?? analysisResult?.atsScore ?? 78;

  // Handle Drag & Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      validateAndSetFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    setErrorMessage(null);
    const validExtensions = ['.pdf', '.txt', '.md'];
    const lowerName = file.name.toLowerCase();
    const isValid = validExtensions.some(ext => lowerName.endsWith(ext)) || file.type === 'application/pdf';

    if (!isValid) {
      setErrorMessage('Please upload a PDF (.pdf) or Plain Text (.txt) file.');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setErrorMessage('File size exceeds 8MB. Please upload a smaller file.');
      return;
    }
    setSelectedFile(file);
  };

  const handleAnalyze = async () => {
    setErrorMessage(null);
    const roleToUse = customRole.trim() ? customRole.trim() : selectedRole;

    if (activeInputTab === 'upload' && !selectedFile) {
      setErrorMessage('Please select a resume file to upload.');
      return;
    }
    if (activeInputTab === 'paste' && (!pastedText.trim() || pastedText.trim().length < 50)) {
      setErrorMessage('Please paste at least 50 characters of your resume text.');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisStep(1);

    const stepInterval = setInterval(() => {
      setAnalysisStep(prev => (prev < 4 ? prev + 1 : prev));
    }, 1200);

    try {
      let response: Response;

      if (activeInputTab === 'upload' && selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('targetRole', roleToUse);

        response = await fetch('/api/career/analyze-resume', {
          method: 'POST',
          body: formData
        });
      } else {
        response = await fetch('/api/career/analyze-resume', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            resumeText: pastedText,
            targetRole: roleToUse
          })
        });
      }

      clearInterval(stepInterval);

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to analyze resume');
      }

      const result = await response.json();
      setAnalysisResult(result.analysis);
      setStudent((prev: any) => ({
        ...prev,
        resumeAtsScore: result.analysis.atsScore
      }));

    } catch (err: any) {
      clearInterval(stepInterval);
      setErrorMessage(err.message || 'An unexpected error occurred during resume analysis.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyKeyword = (kw: string) => {
    navigator.clipboard.writeText(kw);
    setCopiedKeyword(kw);
    setTimeout(() => setCopiedKeyword(null), 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 60) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-16">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Career & Placement Hub</h1>
          <p className="text-slate-500 mt-1">
            Empowering <span className="font-semibold text-slate-800">{studentName}</span> with automated ATS screening, skill gap tracking, and interview preparation.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm hover:shadow hover:from-indigo-700 hover:to-indigo-800 transition-all cursor-pointer shrink-0"
        >
          <Sparkles size={18} />
          <span>Launch ATS Analyzer</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2/3) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Readiness Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-2">
                <Target className="text-indigo-600" />
                Placement Readiness Score
              </h2>
              <p className="text-slate-500 text-sm max-w-md">
                Based on your resume ATS score ({currentAtsScore}/100), verified technical skills, and mock assessments.
              </p>
              <div className="mt-4 flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 size={13} />
                  {currentAtsScore >= 75 ? 'Placement Eligible' : 'Optimization In Progress'}
                </span>
                <span className="text-xs text-slate-400">
                  Target: {selectedRole}
                </span>
              </div>
            </div>
            <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#f1f5f9" strokeWidth="8" fill="none" />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  stroke={currentAtsScore >= 80 ? '#10b981' : currentAtsScore >= 60 ? '#f59e0b' : '#f43f5e'} 
                  strokeWidth="8" 
                  fill="none" 
                  strokeDasharray="251.2" 
                  strokeDashoffset={251.2 - (251.2 * currentAtsScore) / 100} 
                  strokeLinecap="round" 
                  className="transition-all duration-1000" 
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-extrabold text-slate-900">{currentAtsScore}</span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">ATS Score</span>
              </div>
            </div>
          </div>

          {/* Embedded Resume ATS Report Card (if analyzed) */}
          {analysisResult ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-xl font-bold text-slate-900">Latest Resume ATS Audit</h2>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getScoreColor(analysisResult.atsScore)}`}>
                      {analysisResult.rating || 'Evaluated'}
                    </span>
                  </div>
                  <p className="text-slate-500 text-xs mt-1">
                    Evaluated against: <span className="font-semibold text-slate-700">{analysisResult.targetRole || selectedRole}</span>
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw size={13} />
                  Re-analyze or Upload New Version
                </button>
              </div>

              {/* Summary */}
              {analysisResult.summary && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-700 leading-relaxed">
                  <p className="font-semibold text-slate-900 mb-1 flex items-center gap-1.5">
                    <Award size={16} className="text-indigo-600" />
                    Executive ATS Assessment
                  </p>
                  {analysisResult.summary}
                </div>
              )}

              {/* Breakdown Grid */}
              {analysisResult.breakdown && (
                <div>
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">Score Breakdown</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Object.entries(analysisResult.breakdown).map(([key, data]: [string, any]) => {
                      const titles: Record<string, string> = {
                        impactAndMetrics: 'Impact & Quantifiable Metrics',
                        keywordsAndSkills: 'Role Keywords & Tech Stack',
                        structureAndFormat: 'ATS Readability & Formatting',
                        experienceRelevance: 'Project & Experience Depth'
                      };
                      return (
                        <div key={key} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
                          <div className="flex justify-between items-center text-sm">
                            <span className="font-medium text-slate-800">{titles[key] || key}</span>
                            <span className={`font-bold ${data.score >= 75 ? 'text-emerald-600' : 'text-amber-600'}`}>
                              {data.score}%
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className={`h-1.5 rounded-full ${getScoreBg(data.score)}`} 
                              style={{ width: `${data.score}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-2">{data.feedback}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Missing Keywords Chips */}
              {analysisResult.missingKeywords && analysisResult.missingKeywords.length > 0 && (
                <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-amber-900 flex items-center gap-1.5">
                      <AlertTriangle size={16} className="text-amber-600" />
                      Critical Missing Keywords for {selectedRole}
                    </h3>
                    <span className="text-xs text-amber-700 font-medium">Click to copy</span>
                  </div>
                  <p className="text-xs text-amber-800 mb-3">
                    ATS filters scan directly for these technical terms. Adding them to your skills and project descriptions will immediately improve your interview call rate:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.missingKeywords.map((kw: string, i: number) => (
                      <button
                        key={i}
                        onClick={() => copyKeyword(kw)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-slate-800 border border-amber-300 hover:border-amber-400 hover:bg-amber-100/50 transition-colors shadow-2xs cursor-pointer group"
                      >
                        {copiedKeyword === kw ? (
                          <>
                            <Check size={12} className="text-emerald-600" />
                            <span className="text-emerald-700">Copied</span>
                          </>
                        ) : (
                          <>
                            <span>{kw}</span>
                            <Copy size={11} className="text-slate-400 group-hover:text-slate-700" />
                          </>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Top Actionable Improvements */}
              {analysisResult.improvements && analysisResult.improvements.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">
                    Priority Action Items to Boost Score
                  </h3>
                  <div className="space-y-3">
                    {analysisResult.improvements.map((imp: any, i: number) => (
                      <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-100 bg-white hover:border-indigo-100 transition-colors">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 mt-0.5 ${
                          imp.priority === 'High' 
                            ? 'bg-rose-100 text-rose-700 border border-rose-200' 
                            : imp.priority === 'Medium'
                            ? 'bg-amber-100 text-amber-700 border border-amber-200'
                            : 'bg-blue-100 text-blue-700 border border-blue-200'
                        }`}>
                          {imp.priority} Priority
                        </span>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-slate-900">{imp.category}</p>
                          <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{imp.recommendation}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bullet Point Transformations */}
              {analysisResult.bulletPointFixes && analysisResult.bulletPointFixes.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">
                    High-Impact STAR / XYZ Bullet Rewrites
                  </h3>
                  <div className="space-y-4">
                    {analysisResult.bulletPointFixes.map((fix: any, i: number) => (
                      <div key={i} className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 space-y-2.5">
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-bold text-rose-600 tracking-wider">Before (Weak / Low ATS Impact)</span>
                          <p className="text-xs text-slate-600 italic bg-white p-2.5 rounded-lg border border-slate-200 line-through decoration-rose-400">
                            "{fix.original}"
                          </p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">After (ATS Optimized with Metrics)</span>
                          <p className="text-xs text-slate-900 font-medium bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-200">
                            "{fix.improved}"
                          </p>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          <span className="font-semibold text-slate-700">Why this works:</span> {fix.why}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ) : (
            /* Skill Gap Analysis fallback if not analyzed yet */
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
                    <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:bg-rose-500 before:rounded-full">System Design & Architecture</li>
                    <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:bg-rose-500 before:rounded-full">Cloud Infrastructure (AWS/GCP)</li>
                    <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:bg-rose-500 before:rounded-full">Docker & Containerization</li>
                  </ul>
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="mt-6 text-sm text-indigo-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all cursor-pointer"
                  >
                    Upload Resume for Personalized Roadmap <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right Column (1/3) */}
        <div className="space-y-8">
          
          {/* Quick ATS Card */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl shadow-xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl"></div>
            <FileText className="text-indigo-400 mb-4" size={32} />
            <h3 className="text-lg font-bold mb-2">Resume ATS Scanner</h3>
            <p className="text-slate-300 text-sm mb-6 leading-relaxed">
              Upload your resume in PDF or Text format to receive an instant ATS score, missing role keywords, and rewrite suggestions.
            </p>
            
            <div 
              onClick={() => setIsModalOpen(true)}
              className="bg-white/10 border border-white/20 border-dashed rounded-xl p-6 text-center hover:bg-white/15 hover:border-indigo-400 transition-all cursor-pointer group"
            >
              <Upload className="mx-auto text-indigo-300 mb-2 group-hover:scale-110 transition-transform" size={26} />
              <span className="text-sm font-semibold text-white block">Upload Resume (PDF / TXT)</span>
              <span className="text-xs text-slate-400 mt-1 block">or paste resume text</span>
            </div>
            
            <div className="mt-5 bg-white/10 border border-white/10 rounded-xl p-3.5 flex justify-between items-center backdrop-blur-sm">
              <span className="text-sm text-slate-300 font-medium">Screening Score:</span>
              <span className={`font-bold text-base px-2.5 py-0.5 rounded-md ${
                currentAtsScore >= 80 ? 'text-emerald-400 bg-emerald-950/50' : currentAtsScore >= 60 ? 'text-amber-400 bg-amber-950/50' : 'text-rose-400 bg-rose-950/50'
              }`}>
                {currentAtsScore} / 100
              </span>
            </div>
          </div>

          {/* Placement Preparation Modules */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Briefcase className="text-indigo-600" size={20} />
              Placement Prep Hub
            </h3>
            <div className="space-y-3">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-indigo-600 hover:bg-indigo-50/50 transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-slate-900 group-hover:text-indigo-700">ATS Keyword Optimizer</p>
                  <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <p className="text-xs text-slate-500 mt-1">Target role keyword insertion and match rate.</p>
              </button>
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <p className="font-semibold text-slate-900">Technical Interview Prep</p>
                <p className="text-xs text-slate-500 mt-1">Practice Data Structures & Algorithms questions on the Academic tab.</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* FULL RESUME ANALYZER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col relative">
            
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">AI Resume ATS Analyzer</h2>
                  <p className="text-xs text-slate-500">Scan against Fortune 500 ATS filters (Workday, Greenhouse, Taleo)</p>
                </div>
              </div>
              <button 
                onClick={() => !isAnalyzing && setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 flex-1">
              
              {/* Target Role Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  1. Select Target Job Role
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  disabled={isAnalyzing}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors"
                >
                  {TARGET_ROLES.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                  <option value="custom">-- Custom Role --</option>
                </select>

                {selectedRole === 'custom' && (
                  <input
                    type="text"
                    placeholder="Enter custom job title (e.g. Embedded Firmware Engineer)"
                    value={customRole}
                    onChange={(e) => setCustomRole(e.target.value)}
                    className="w-full mt-2 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                )}
              </div>

              {/* Input Method Tabs */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  2. Provide Resume
                </label>
                <div className="flex border-b border-slate-200 mb-4">
                  <button
                    onClick={() => setActiveInputTab('upload')}
                    className={`pb-2.5 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                      activeInputTab === 'upload'
                        ? 'border-indigo-600 text-indigo-600'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Upload size={14} />
                    Upload PDF / Text File
                  </button>
                  <button
                    onClick={() => setActiveInputTab('paste')}
                    className={`pb-2.5 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                      activeInputTab === 'paste'
                        ? 'border-indigo-600 text-indigo-600'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <FileText size={14} />
                    Paste Resume Text
                  </button>
                </div>

                {activeInputTab === 'upload' ? (
                  <div>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      accept=".pdf,.txt,.md" 
                      className="hidden" 
                    />
                    
                    {!selectedFile ? (
                      <div
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-slate-200 hover:border-indigo-400 bg-slate-50/60 hover:bg-indigo-50/30 rounded-2xl p-8 text-center cursor-pointer transition-all group"
                      >
                        <Upload className="mx-auto text-indigo-500 mb-3 group-hover:scale-110 transition-transform" size={32} />
                        <p className="text-sm font-semibold text-slate-800">
                          Click to upload or drag & drop resume
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          Supported formats: PDF (.pdf), Plain Text (.txt) up to 8MB
                        </p>
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                            <FileCheck size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{selectedFile.name}</p>
                            <p className="text-xs text-slate-500">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedFile(null)}
                          disabled={isAnalyzing}
                          className="text-xs font-semibold text-rose-600 hover:text-rose-800 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <textarea
                      rows={8}
                      value={pastedText}
                      onChange={(e) => setPastedText(e.target.value)}
                      placeholder="Paste your resume content here including Education, Technical Skills, Projects, and Experience..."
                      disabled={isAnalyzing}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none leading-relaxed font-mono"
                    ></textarea>
                    <p className="text-right text-[11px] text-slate-400 mt-1">
                      {pastedText.length} characters
                    </p>
                  </div>
                )}
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                  <AlertTriangle size={16} className="shrink-0 text-rose-500" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Loading State with Animated Steps */}
              {isAnalyzing && (
                <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                      <RefreshCw size={14} className="animate-spin" />
                      Scanning Resume against {selectedRole}...
                    </span>
                    <span className="text-xs font-bold text-white">{analysisStep * 25}%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="h-1.5 bg-gradient-to-r from-indigo-500 to-purple-400 rounded-full transition-all duration-500"
                      style={{ width: `${analysisStep * 25}%` }}
                    ></div>
                  </div>
                  <ul className="text-xs text-slate-300 space-y-2 pt-2">
                    <li className={`flex items-center gap-2 ${analysisStep >= 1 ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
                      {analysisStep >= 1 ? <Check size={14} /> : <div className="w-3.5 h-3.5 border border-slate-500 rounded-full"></div>}
                      1. Parsing document text & ATS layout structure
                    </li>
                    <li className={`flex items-center gap-2 ${analysisStep >= 2 ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
                      {analysisStep >= 2 ? <Check size={14} /> : <div className="w-3.5 h-3.5 border border-slate-500 rounded-full"></div>}
                      2. Evaluating quantifiable metrics & STAR bullet points
                    </li>
                    <li className={`flex items-center gap-2 ${analysisStep >= 3 ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
                      {analysisStep >= 3 ? <Check size={14} /> : <div className="w-3.5 h-3.5 border border-slate-500 rounded-full"></div>}
                      3. Cross-referencing {selectedRole} industry keywords
                    </li>
                    <li className={`flex items-center gap-2 ${analysisStep >= 4 ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
                      {analysisStep >= 4 ? <Check size={14} /> : <div className="w-3.5 h-3.5 border border-slate-500 rounded-full"></div>}
                      4. Formulating actionable rewrite recommendations
                    </li>
                  </ul>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 sticky bottom-0 bg-white">
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={isAnalyzing}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold shadow-sm hover:shadow transition-all disabled:opacity-50 cursor-pointer"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Zap size={16} />
                    <span>Run ATS Audit</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
