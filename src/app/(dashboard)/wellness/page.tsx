"use client";

import { useState, useEffect } from 'react';
import { 
  Heart, 
  Activity, 
  Coffee, 
  Smile, 
  Frown, 
  Meh, 
  Sun, 
  Moon, 
  CheckCircle2, 
  Sparkles, 
  Loader2, 
  AlertTriangle, 
  ArrowRight, 
  Wind, 
  Brain, 
  Calendar, 
  RotateCcw, 
  Play, 
  Pause, 
  ShieldCheck, 
  Flame, 
  Zap, 
  Compass, 
  MessageSquareHeart,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';

interface MoodAnalysisResult {
  stateSummary: string;
  burnoutRisk: 'Low' | 'Moderate' | 'High';
  emotionalBandwidth: string;
  keyInsights: string[];
  recommendedStudyAdjustment: {
    intensity: 'Light Review' | 'Balanced' | 'Intensive';
    sessionLengthMinutes: number;
    breakLengthMinutes: number;
    focusStrategy: string;
    warningOrCaution: string;
  };
  copingTechnique: {
    title: string;
    type: string;
    instructions: string[];
    scienceWhyItWorks: string;
  };
  affirmation: string;
}

interface MoodHistoryEntry {
  id: string;
  timestamp: string;
  mood: string;
  emoji: string;
  energyLevel: number;
  triggers: string[];
  reflection?: string;
  burnoutRisk?: string;
}

const MOOD_OPTIONS = [
  { label: 'Great', emoji: '😄', desc: 'Positive & Motivated' },
  { label: 'Energized', emoji: '⚡', desc: 'High Focus & Stamina' },
  { label: 'Calm', emoji: '😌', desc: 'Centered & Peaceful' },
  { label: 'Okay', emoji: '😐', desc: 'Neutral & Steady' },
  { label: 'Stressed', emoji: '😟', desc: 'Under Pressure' },
  { label: 'Overwhelmed', emoji: '😫', desc: 'Too Much to Handle' },
  { label: 'Low', emoji: '😔', desc: 'Drained & Fatigue' },
  { label: 'Anxious', emoji: '😰', desc: 'Nervous / Uncertain' },
];

const COMMON_TRIGGERS = [
  'Upcoming Exams',
  'Complex Lessons / Math',
  'Pending Assignments & Labs',
  'Lack of Sleep / Fatigue',
  'Placement & Career Anxiety',
  'Time Crunch / Deadlines',
  'Personal & Social Stress',
  'Procrastination'
];

export default function WellnessPage() {
  const [student, setStudent] = useState<any>(null);
  const [selectedMood, setSelectedMood] = useState<string>('Okay');
  const [selectedEmoji, setSelectedEmoji] = useState<string>('😐');
  const [energyLevel, setEnergyLevel] = useState<number>(3);
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>(['Upcoming Exams']);
  const [reflectionText, setReflectionText] = useState<string>('');
  
  // Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<MoodAnalysisResult | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [moodHistory, setMoodHistory] = useState<MoodHistoryEntry[]>([]);
  const [hasCheckedInToday, setHasCheckedInToday] = useState<boolean>(false);

  // Interactive Breathing Tool State
  const [isBreathingActive, setIsBreathingActive] = useState<boolean>(false);
  const [breathingPhase, setBreathingPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Inhale');
  const [breathingSeconds, setBreathingSeconds] = useState<number>(4);

  // Load existing mood & user data
  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.user) {
          setStudent(data.user);
          if (data.user.academicDetails) {
            try {
              const parsed = typeof data.user.academicDetails === 'string'
                ? JSON.parse(data.user.academicDetails)
                : data.user.academicDetails;
              
              if (parsed.wellnessData) {
                if (parsed.wellnessData.latestAnalysis) {
                  setAnalysisResult(parsed.wellnessData.latestAnalysis);
                  setHasCheckedInToday(true);
                }
                if (parsed.wellnessData.history && Array.isArray(parsed.wellnessData.history)) {
                  setMoodHistory(parsed.wellnessData.history);
                }
                if (parsed.wellnessData.latestMood) {
                  setSelectedMood(parsed.wellnessData.latestMood.mood || 'Okay');
                  setSelectedEmoji(parsed.wellnessData.latestMood.emoji || '😐');
                  setEnergyLevel(parsed.wellnessData.latestMood.energyLevel || 3);
                }
              }
            } catch (e) {
              console.error('Failed to parse wellness data:', e);
            }
          }
        }
      })
      .catch(console.error);
  }, []);

  // Interactive Breathing Timer Effect
  useEffect(() => {
    if (!isBreathingActive) return;

    const interval = setInterval(() => {
      setBreathingSeconds(prev => {
        if (prev <= 1) {
          // Transition phases: 4s Inhale -> 4s Hold -> 4s Exhale -> 4s Rest
          setBreathingPhase(currPhase => {
            if (currPhase === 'Inhale') return 'Hold';
            if (currPhase === 'Hold') return 'Exhale';
            if (currPhase === 'Exhale') return 'Rest';
            return 'Inhale';
          });
          return 4;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isBreathingActive]);

  const toggleTrigger = (trigger: string) => {
    setSelectedTriggers(prev => 
      prev.includes(trigger) ? prev.filter(t => t !== trigger) : [...prev, trigger]
    );
  };

  const handleMoodPick = (item: typeof MOOD_OPTIONS[0]) => {
    setSelectedMood(item.label);
    setSelectedEmoji(item.emoji);
  };

  const handleAnalyzeMood = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsAnalyzing(true);
    setAnalysisError(null);

    const payload = {
      mood: selectedMood,
      energyLevel,
      triggers: selectedTriggers,
      reflection: reflectionText,
      studentContext: {
        name: student?.name || 'Student',
        educationLevel: student?.educationLevel || 'College',
        department: student?.department || 'Engineering'
      }
    };

    try {
      const res = await fetch('/api/wellness/analyze-mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to analyze mood');
      }

      if (data.analysis) {
        setAnalysisResult(data.analysis);
        setHasCheckedInToday(true);

        // Record in history
        const newEntry: MoodHistoryEntry = {
          id: `mood-${Date.now()}`,
          timestamp: new Date().toISOString(),
          mood: selectedMood,
          emoji: selectedEmoji,
          energyLevel,
          triggers: selectedTriggers,
          reflection: reflectionText,
          burnoutRisk: data.analysis.burnoutRisk
        };

        const updatedHistory = [newEntry, ...moodHistory.slice(0, 9)];
        setMoodHistory(updatedHistory);

        // Sync to localStorage for Study Planner
        if (typeof window !== 'undefined') {
          localStorage.setItem('student_latest_mood', selectedMood);
          localStorage.setItem('student_study_intensity', data.analysis.recommendedStudyAdjustment.intensity);
        }

        // Save to student profile in database
        saveWellnessToProfile(data.analysis, {
          mood: selectedMood,
          emoji: selectedEmoji,
          energyLevel,
          triggers: selectedTriggers
        }, updatedHistory);
      }
    } catch (err: any) {
      console.error('Mood analysis error:', err);
      setAnalysisError(err.message || 'Failed to complete mood analysis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const saveWellnessToProfile = async (
    analysis: MoodAnalysisResult,
    latestMood: any,
    history: MoodHistoryEntry[]
  ) => {
    try {
      let existingAcademic: any = {};
      if (student?.academicDetails) {
        existingAcademic = typeof student.academicDetails === 'string'
          ? JSON.parse(student.academicDetails)
          : student.academicDetails;
      }

      const updatedPayload = {
        ...existingAcademic,
        wellnessData: {
          latestMood,
          latestAnalysis: analysis,
          history
        }
      };

      await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ academicDetails: updatedPayload })
      });
    } catch (e) {
      console.error('Failed to persist wellness analysis:', e);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      
      {/* Header */}
      <div className="text-center space-y-3 pt-6 pb-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold mb-2 border border-rose-100">
          <Sparkles size={14} /> AI Emotional & Cognitive Diagnostic Companion
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Student Mood & Wellness Hub
        </h1>
        <p className="text-slate-500 text-base max-w-2xl mx-auto">
          Analyze your emotional bandwidth, identify cognitive burnout risks, practice guided calming resets, and adapt your daily study schedule to how you feel.
        </p>
      </div>

      {/* Main Grid: Left Check-In Form, Right Analysis / Diagnostics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Mood Check-in Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-7 space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Heart size={20} className="text-rose-500" /> Daily Mood Check-In
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">How are you feeling right now?</p>
              </div>

              {hasCheckedInToday && (
                <button
                  onClick={() => setHasCheckedInToday(false)}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw size={12} /> New Check-In
                </button>
              )}
            </div>

            {/* Mood Emotion Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                1. Select Current Emotional State
              </label>
              <div className="grid grid-cols-4 gap-2.5">
                {MOOD_OPTIONS.map((item) => {
                  const isSelected = selectedMood === item.label;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => handleMoodPick(item)}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-rose-50 border-rose-400 ring-2 ring-rose-200 scale-105 shadow-xs' 
                          : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-2xl sm:text-3xl mb-1">{item.emoji}</span>
                      <span className={`text-xs font-semibold ${isSelected ? 'text-rose-700' : 'text-slate-700'}`}>
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Energy Level Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  2. Energy & Stamina Level
                </label>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  energyLevel <= 2 
                    ? 'bg-rose-100 text-rose-700' 
                    : energyLevel === 3 
                      ? 'bg-amber-100 text-amber-800' 
                      : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {energyLevel}/5 — {
                    energyLevel === 1 ? 'Depleted' :
                    energyLevel === 2 ? 'Fatigued' :
                    energyLevel === 3 ? 'Moderate' :
                    energyLevel === 4 ? 'Energized' : 'Peak Stamina'
                  }
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                step={1}
                value={energyLevel}
                onChange={(e) => setEnergyLevel(Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer h-2 bg-slate-100 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-1">
                <span>1 (Exhausted)</span>
                <span>3 (Balanced)</span>
                <span>5 (Peak Focus)</span>
              </div>
            </div>

            {/* Contributing Pressure Factors */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                3. What's Influencing Your State Today?
              </label>
              <div className="flex flex-wrap gap-2">
                {COMMON_TRIGGERS.map((trigger) => {
                  const isChecked = selectedTriggers.includes(trigger);
                  return (
                    <button
                      key={trigger}
                      type="button"
                      onClick={() => toggleTrigger(trigger)}
                      className={`text-xs px-3 py-1.5 rounded-xl font-medium border transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-semibold shadow-2xs'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {isChecked ? '✓ ' : '+ '}{trigger}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Written Reflection / Journal */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                4. Thoughts or Specific Concerns (Optional)
              </label>
              <textarea
                value={reflectionText}
                onChange={(e) => setReflectionText(e.target.value)}
                placeholder="e.g., Having trouble keeping up with the OS paging topic and feeling overwhelmed by upcoming midterms..."
                rows={3}
                className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 text-slate-800"
              />
            </div>

            {/* Analyze CTA */}
            <button
              onClick={handleAnalyzeMood}
              disabled={isAnalyzing}
              className="w-full py-3.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Running AI Psychological & Mood Analysis...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Analyze My Mood & Get Guidance
                </>
              )}
            </button>

            {analysisError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                <AlertTriangle size={15} /> {analysisError}
              </div>
            )}
          </div>

          {/* Quick Support / Helpline Notice */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 space-y-1 leading-relaxed">
            <p className="font-semibold text-slate-700 flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-indigo-600" /> Confidential & Supportive
            </p>
            <p>
              Your wellness check-ins are private to your profile. If you are experiencing overwhelming distress, please contact your university student counselor or national crisis helpline (e.g. Tele-MANAS: 14416).
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: AI Mood Analysis Report & Coping Tools (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {analysisResult ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
              
              {/* Burnout Risk & State Banner */}
              <div className={`p-6 sm:p-7 rounded-3xl border shadow-sm ${
                analysisResult.burnoutRisk === 'High' 
                  ? 'bg-rose-50/70 border-rose-200' 
                  : analysisResult.burnoutRisk === 'Moderate'
                    ? 'bg-amber-50/70 border-amber-200'
                    : 'bg-emerald-50/60 border-emerald-200'
              }`}>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="text-3xl">{selectedEmoji}</span>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">
                        {selectedMood} State Assessment
                      </h3>
                      <p className="text-xs text-slate-600">{analysisResult.emotionalBandwidth}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Burnout Risk:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                      analysisResult.burnoutRisk === 'High'
                        ? 'bg-rose-600 text-white'
                        : analysisResult.burnoutRisk === 'Moderate'
                          ? 'bg-amber-500 text-white'
                          : 'bg-emerald-600 text-white'
                    }`}>
                      {analysisResult.burnoutRisk} Risk
                    </span>
                  </div>
                </div>

                <p className="text-sm text-slate-800 leading-relaxed font-medium">
                  {analysisResult.stateSummary}
                </p>

                {/* Key Insights Bullets */}
                {analysisResult.keyInsights && analysisResult.keyInsights.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-200/60 space-y-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                      Core Diagnostic Signals:
                    </span>
                    <ul className="space-y-1 text-xs text-slate-700">
                      {analysisResult.keyInsights.map((insight, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-indigo-600 font-bold">•</span>
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Study Adjustment Bridge to Academic Section */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-indigo-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Brain size={18} className="text-indigo-600" />
                    Recommended Study Schedule Adjustment
                  </h4>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
                    Mode: {analysisResult.recommendedStudyAdjustment.intensity}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-xs text-slate-500 block">Focus Session</span>
                    <span className="text-lg font-bold text-slate-900">
                      {analysisResult.recommendedStudyAdjustment.sessionLengthMinutes} min
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-xs text-slate-500 block">Rest Interval</span>
                    <span className="text-lg font-bold text-slate-900">
                      {analysisResult.recommendedStudyAdjustment.breakLengthMinutes} min
                    </span>
                  </div>
                  <div className="col-span-2 sm:col-span-1 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-xs text-slate-500 block">Strategy</span>
                    <span className="text-xs font-bold text-indigo-700 mt-1 block">
                      {analysisResult.recommendedStudyAdjustment.intensity}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {analysisResult.recommendedStudyAdjustment.focusStrategy}
                </p>

                {analysisResult.recommendedStudyAdjustment.warningOrCaution && (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2">
                    <AlertTriangle size={15} className="shrink-0 mt-0.5 text-amber-600" />
                    <span>{analysisResult.recommendedStudyAdjustment.warningOrCaution}</span>
                  </div>
                )}

                {/* Direct action bridge */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="text-xs text-slate-500">
                    Your mood pacing is synced with your 1-Day Study Planner.
                  </span>
                  <Link
                    href="/academic"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
                  >
                    Open Daily Study Planner <ChevronRight size={14} />
                  </Link>
                </div>
              </div>

              {/* Actionable Calming & Grounding Technique */}
              {analysisResult.copingTechnique && (
                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <Compass size={18} className="text-emerald-600" />
                        Targeted Calming Technique: {analysisResult.copingTechnique.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {analysisResult.copingTechnique.scienceWhyItWorks}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {analysisResult.copingTechnique.instructions.map((step, sIdx) => (
                      <div key={sIdx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800">
                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                          {sIdx + 1}
                        </span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>

                  {/* Affirmation */}
                  {analysisResult.affirmation && (
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-50 to-orange-50 border border-rose-100 text-center">
                      <span className="text-xs font-bold uppercase tracking-wider text-rose-700 block mb-1">
                        Daily Mental Affirmation
                      </span>
                      <p className="text-sm font-semibold text-slate-800 italic">
                        "{analysisResult.affirmation}"
                      </p>
                    </div>
                  )}
                </div>
              )}

            </div>
          ) : (
            /* Initial Welcoming Card */
            <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center space-y-4">
              <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-3xl flex items-center justify-center mx-auto">
                <Heart size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Check In With Your Emotional State</h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
                Select how you're feeling on the left and click <strong>"Analyze My Mood"</strong>. Our AI will assess your cognitive energy, burnout levels, and give you custom study pacing advice.
              </p>
            </div>
          )}

          {/* Interactive Breathing Reset Widget */}
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5 mb-1">
                  <Wind size={14} /> Parasympathetic Nerve Reset
                </span>
                <h4 className="text-lg font-bold">Guided 4-4-4-4 Box Breathing</h4>
              </div>

              <button
                onClick={() => setIsBreathingActive(!isBreathingActive)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isBreathingActive 
                    ? 'bg-rose-500 hover:bg-rose-600 text-white' 
                    : 'bg-white text-slate-900 hover:bg-indigo-50'
                }`}
              >
                {isBreathingActive ? <><Pause size={14} /> Stop Exercise</> : <><Play size={14} /> Start 2-Min Reset</>}
              </button>
            </div>

            {/* Visual Animated Breathing Circle */}
            <div className="flex flex-col items-center justify-center py-6">
              <div className="relative flex items-center justify-center">
                {/* Expanding / Pulsing ring */}
                <div 
                  className={`w-36 h-36 rounded-full border-4 border-indigo-400/40 flex items-center justify-center transition-all duration-1000 ${
                    isBreathingActive 
                      ? breathingPhase === 'Inhale' 
                        ? 'scale-125 bg-indigo-500/20 border-indigo-300' 
                        : breathingPhase === 'Exhale'
                          ? 'scale-90 bg-indigo-500/5 border-indigo-400/20'
                          : 'scale-110 bg-indigo-500/15 border-indigo-300/60'
                      : 'bg-indigo-950/40'
                  }`}
                >
                  <div className="text-center space-y-1">
                    <span className="text-xs uppercase tracking-widest text-indigo-200 font-bold block">
                      {isBreathingActive ? breathingPhase : 'Ready'}
                    </span>
                    <span className="text-3xl font-extrabold text-white">
                      {isBreathingActive ? `${breathingSeconds}s` : '4s'}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-indigo-200 mt-5 text-center max-w-sm">
                {isBreathingActive 
                  ? breathingPhase === 'Inhale' ? 'Breathe in slowly through your nose...' :
                    breathingPhase === 'Hold' ? 'Gently hold your breath without tension...' :
                    breathingPhase === 'Exhale' ? 'Release your breath gently through your mouth...' :
                    'Rest your lungs before the next cycle...'
                  : 'Click Start to begin 4-second paced box breathing to soothe study anxiety.'}
              </p>
            </div>
          </div>

          {/* Past Mood History Log */}
          {moodHistory.length > 0 && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Activity size={16} className="text-emerald-500" /> Recent Mood History
              </h4>

              <div className="space-y-2">
                {moodHistory.slice(0, 4).map((entry) => (
                  <div key={entry.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{entry.emoji}</span>
                      <div>
                        <span className="font-bold text-slate-800">{entry.mood}</span>
                        <span className="text-slate-400 ml-2">Energy: {entry.energyLevel}/5</span>
                        {entry.triggers && entry.triggers.length > 0 && (
                          <p className="text-[11px] text-slate-500 truncate max-w-xs">
                            {entry.triggers.join(', ')}
                          </p>
                        )}
                      </div>
                    </div>

                    <span className="text-[10px] text-slate-400 font-medium">
                      {new Date(entry.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
