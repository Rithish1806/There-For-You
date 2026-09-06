"use client";

import { useState, useEffect } from 'react';
import { 
  BookOpen, 
  GraduationCap, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Upload, 
  Check, 
  FlaskConical, 
  Edit3, 
  Loader2, 
  Sparkles,
  Plus,
  Trash2,
  HelpCircle,
  RotateCcw,
  Award
} from 'lucide-react';

interface SubjectItem {
  name: string;
  score: number;
}

interface LabItem {
  name: string;
  totalExperiments: number;
  completed: number;
  internalScore: number;
}

interface AcademicData {
  attendance: number;
  subjects: SubjectItem[];
  labs: LabItem[];
}

export default function AcademicPage() {
  const [student, setStudent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'performance' | 'labs' | 'quiz' | 'planner' | 'materials'>('performance');
  
  // Gate / Setup state
  const [hasDetails, setHasDetails] = useState(false);
  const [isEditingSetup, setIsEditingSetup] = useState(false);
  const [isSavingSetup, setIsSavingSetup] = useState(false);

  // Form State for Academic & Lab details
  const [attendance, setAttendance] = useState<number>(88);
  const [subjects, setSubjects] = useState<SubjectItem[]>([
    { name: 'Data Structures & Algorithms', score: 85 },
    { name: 'Database Management Systems', score: 72 },
    { name: 'Operating Systems', score: 78 },
    { name: 'Computer Networks', score: 82 },
  ]);
  const [labs, setLabs] = useState<LabItem[]>([
    { name: 'Data Structures Laboratory', totalExperiments: 10, completed: 9, internalScore: 92 },
    { name: 'DBMS & SQL Laboratory', totalExperiments: 8, completed: 8, internalScore: 95 },
    { name: 'Networks & System Admin Lab', totalExperiments: 10, completed: 7, internalScore: 84 },
  ]);

  // Quiz State
  const [quizSubject, setQuizSubject] = useState('');
  const [quizTopic, setQuizTopic] = useState('Core Concepts & Problems');
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<any[] | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizError, setQuizError] = useState<string | null>(null);

  // Planner state
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Practice Trees (DSA)', time: '30 min', priority: 'High', completed: false },
    { id: 2, title: 'Revise Normalization (DBMS)', time: '25 min', priority: 'Medium', completed: false },
    { id: 3, title: 'Submit OS Lab Record Experiment 8', time: '45 min', priority: 'High', completed: true },
  ]);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.user) {
          setStudent(data.user);
          if (data.user.academicDetails) {
            try {
              const parsed: AcademicData = typeof data.user.academicDetails === 'string'
                ? JSON.parse(data.user.academicDetails)
                : data.user.academicDetails;
              
              if (parsed.subjects && parsed.subjects.length > 0) {
                setSubjects(parsed.subjects);
                setLabs(parsed.labs || []);
                setAttendance(parsed.attendance || 88);
                setHasDetails(true);
                if (parsed.subjects[0]?.name) {
                  setQuizSubject(parsed.subjects[0].name);
                }
              }
            } catch (e) {
              console.error("Failed to parse academicDetails", e);
            }
          } else {
            // Adapt default subjects to School vs College
            if (data.user.educationLevel === 'School') {
              setSubjects([
                { name: 'Mathematics', score: 88 },
                { name: 'Physics / Science', score: 82 },
                { name: 'Chemistry', score: 79 },
                { name: 'English & Literature', score: 85 },
              ]);
              setLabs([
                { name: 'Physics Science Lab', totalExperiments: 8, completed: 7, internalScore: 90 },
                { name: 'Chemistry Practical Lab', totalExperiments: 8, completed: 8, internalScore: 94 },
              ]);
              setQuizSubject('Physics / Science');
            } else {
              setQuizSubject('Data Structures & Algorithms');
            }
          }
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const handleSaveAcademicDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSetup(true);

    const payload: AcademicData = {
      attendance,
      subjects,
      labs
    };

    try {
      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          academicDetails: payload
        })
      });

      if (res.ok) {
        setHasDetails(true);
        setIsEditingSetup(false);
        if (subjects[0]?.name && !quizSubject) {
          setQuizSubject(subjects[0].name);
        }
      }
    } catch (err) {
      console.error('Failed to save academic details', err);
    } finally {
      setIsSavingSetup(false);
    }
  };

  const handleAddSubject = () => {
    setSubjects([...subjects, { name: '', score: 80 }]);
  };

  const handleRemoveSubject = (index: number) => {
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  const handleAddLab = () => {
    setLabs([...labs, { name: '', totalExperiments: 10, completed: 8, internalScore: 90 }]);
  };

  const handleRemoveLab = (index: number) => {
    setLabs(labs.filter((_, i) => i !== index));
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  // AI Quiz Generation via Groq API
  const handleGenerateQuiz = async () => {
    if (!quizSubject) return;
    setIsGeneratingQuiz(true);
    setQuizError(null);
    setQuizQuestions(null);
    setUserAnswers({});
    setQuizSubmitted(false);

    try {
      const res = await fetch('/api/academic/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: quizSubject,
          topic: quizTopic || 'Important Exam Concepts',
          count: 4
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate quiz');
      }

      if (data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
        setQuizQuestions(data.questions);
      } else {
        throw new Error('AI returned an unexpected format. Please try again.');
      }
    } catch (err: any) {
      setQuizError(err.message || 'Error generating quiz');
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    if (quizSubmitted) return;
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const calculateQuizScore = () => {
    if (!quizQuestions) return 0;
    return quizQuestions.reduce((score, q) => {
      return userAnswers[q.id] === q.answerIndex ? score + 1 : score;
    }, 0);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 size={32} className="animate-spin text-indigo-600" />
      </div>
    );
  }

  const isSchool = student?.educationLevel === 'School';
  const studentName = student?.name || "Student";
  const studentCgpa = student?.cgpa ? `${student.cgpa} / 10` : (student?.percentage ? `${student.percentage}%` : "8.0 / 10");

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Academic & Lab Hub</h1>
          <p className="text-slate-500 mt-1">
            Tracking performance for <span className="font-semibold text-slate-800">{studentName}</span> ({student?.studentId || "Student"}) • {student?.educationLevel || "College"}
          </p>
        </div>

        {hasDetails && !isEditingSetup && (
          <button
            onClick={() => setIsEditingSetup(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
          >
            <Edit3 size={16} className="text-indigo-600" />
            <span>Update Subjects & Labs</span>
          </button>
        )}
      </div>

      {/* GATE FORM: Required entry for Academic & Lab details */}
      {(!hasDetails || isEditingSetup) ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-8 animate-in zoom-in-95 duration-200">
          <div className="border-b border-slate-100 pb-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
              <FlaskConical size={14} /> Mandatory Academic Setup
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              Enter Your Academic & Lab Details
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Please enter your current subjects and practical/laboratory coursework to unlock performance analytics and AI quiz generation.
            </p>
          </div>

          <form onSubmit={handleSaveAcademicDetails} className="space-y-8">
            {/* Attendance */}
            <div className="max-w-xs">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Current Attendance (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={attendance}
                onChange={(e) => setAttendance(Number(e.target.value))}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none"
              />
            </div>

            {/* Theory Subjects */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <BookOpen size={18} className="text-indigo-600" />
                    Theory Subjects & Marks
                  </h3>
                  <p className="text-xs text-slate-500">Add the subjects you are studying this semester along with your current internal mark or grade.</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddSubject}
                  className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus size={14} /> Add Subject
                </button>
              </div>

              <div className="space-y-3">
                {subjects.map((sub, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-slate-50/70 p-3 rounded-xl border border-slate-200/80">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Subject Name (e.g. Operating Systems)"
                        value={sub.name}
                        onChange={(e) => {
                          const updated = [...subjects];
                          updated[idx].name = e.target.value;
                          setSubjects(updated);
                        }}
                        required
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                    <div className="w-32">
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          placeholder="Score"
                          value={sub.score}
                          onChange={(e) => {
                            const updated = [...subjects];
                            updated[idx].score = Number(e.target.value);
                            setSubjects(updated);
                          }}
                          required
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-semibold">%</span>
                      </div>
                    </div>
                    {subjects.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSubject(idx)}
                        className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Practical & Lab Courses */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <FlaskConical size={18} className="text-indigo-600" />
                    Laboratory & Practical Courses
                  </h3>
                  <p className="text-xs text-slate-500">Record your lab name, total experiments, completed experiments, and internal score.</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddLab}
                  className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus size={14} /> Add Lab
                </button>
              </div>

              <div className="space-y-3">
                {labs.map((lab, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-3 bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80">
                    <div className="flex-1">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Lab Course Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Database Systems Lab"
                        value={lab.name}
                        onChange={(e) => {
                          const updated = [...labs];
                          updated[idx].name = e.target.value;
                          setLabs(updated);
                        }}
                        required
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                    
                    <div className="w-28">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Total Expts</label>
                      <input
                        type="number"
                        min="1"
                        max="30"
                        value={lab.totalExperiments}
                        onChange={(e) => {
                          const updated = [...labs];
                          updated[idx].totalExperiments = Number(e.target.value);
                          setLabs(updated);
                        }}
                        required
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>

                    <div className="w-28">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Completed</label>
                      <input
                        type="number"
                        min="0"
                        max={lab.totalExperiments}
                        value={lab.completed}
                        onChange={(e) => {
                          const updated = [...labs];
                          updated[idx].completed = Number(e.target.value);
                          setLabs(updated);
                        }}
                        required
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>

                    <div className="w-28">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Internal Score</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={lab.internalScore}
                        onChange={(e) => {
                          const updated = [...labs];
                          updated[idx].internalScore = Number(e.target.value);
                          setLabs(updated);
                        }}
                        required
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>

                    {labs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveLab(idx)}
                        className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg transition-colors cursor-pointer sm:mt-5"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              {isEditingSetup && (
                <button
                  type="button"
                  onClick={() => setIsEditingSetup(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={isSavingSetup}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm flex items-center gap-2 shadow-sm shadow-indigo-200 transition-all cursor-pointer disabled:opacity-70"
              >
                {isSavingSetup ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Saving Details...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={16} />
                    <span>Save & Access Academic Hub</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* FULL ACADEMIC HUB WHEN DATA IS ENTERED */
        <>
          {/* Navigation Tabs */}
          <div className="flex space-x-1 bg-white border border-slate-200 rounded-xl p-1 w-fit">
            {[
              { id: 'performance', label: 'Performance', icon: GraduationCap },
              { id: 'labs', label: 'Laboratory Tracker', icon: FlaskConical },
              { id: 'quiz', label: 'AI Quiz Generator', icon: Sparkles },
              { id: 'planner', label: 'Study Planner', icon: Calendar },
              { id: 'materials', label: 'PDF Summarizer', icon: FileText },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg flex items-center gap-2 transition-all cursor-pointer ${
                    activeTab === tab.id 
                      ? 'bg-slate-900 text-white shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: Performance */}
          {activeTab === 'performance' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-8">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <GraduationCap className="text-indigo-600" />
                    {studentName}'s Academic Performance
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {student?.department || "Department"} • Semester {student?.semester || "S1"}
                  </p>
                </div>
                <div className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                  <CheckCircle2 size={14} /> Synced with Supabase
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">
                      {isSchool ? "Cumulative Percentage" : "Cumulative CGPA"}
                    </p>
                    <p className="text-3xl font-extrabold text-slate-900">{studentCgpa}</p>
                    <div className="mt-2 text-xs text-emerald-600 flex items-center gap-1 font-semibold">
                      <CheckCircle2 size={14} /> Top 15% in Department
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Overall Attendance</p>
                    <p className="text-3xl font-extrabold text-slate-900">{attendance}%</p>
                    <div className="mt-2 text-xs text-indigo-600 font-semibold">
                      Eligible for semester end examinations
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-5 bg-white p-6 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-800 text-sm">Enrolled Theory Subjects</h3>
                    <span className="text-xs text-slate-400 font-medium">{subjects.length} Active Courses</span>
                  </div>
                  <div className="space-y-4">
                    {subjects.map((sub, idx) => (
                      <SubjectProgress key={idx} name={sub.name} score={sub.score} warning={sub.score < 75} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl p-5 flex items-start gap-4">
                <Sparkles className="text-indigo-600 shrink-0 mt-1" size={20} />
                <div>
                  <h4 className="font-bold text-indigo-900 text-sm">AI Academic Mentor Insight for {studentName}</h4>
                  <p className="text-indigo-800 text-xs mt-1 leading-relaxed">
                    Based on your marks in <span className="font-semibold">{subjects[0]?.name || "Core Subjects"}</span>, 
                    take practice quizzes regularly to maintain your high CGPA ({studentCgpa}) for campus recruitment and merit scholarships.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Laboratory Tracker */}
          {activeTab === 'labs' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <FlaskConical className="text-indigo-600" />
                  Practical & Laboratory Progress Tracker
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Keep track of your lab experiments completion and practical internal evaluation.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {labs.map((lab, idx) => {
                  const percent = Math.round((lab.completed / (lab.totalExperiments || 1)) * 100);
                  return (
                    <div key={idx} className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-4 hover:shadow-sm transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                          <FlaskConical size={20} />
                        </div>
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700">
                          Internal: {lab.internalScore}/100
                        </span>
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{lab.name}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {lab.completed} of {lab.totalExperiments} experiments completed
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-500">Progress</span>
                          <span className="text-indigo-600">{percent}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                          <div 
                            className="bg-indigo-600 h-2.5 rounded-full transition-all duration-700" 
                            style={{ width: `${percent}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: AI-Generated Quizzes (POWERED BY GROQ API) */}
          {activeTab === 'quiz' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-8">
              <div className="border-b border-slate-100 pb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
                  <Sparkles size={14} /> Powered by Groq AI API
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  AI Academic Quiz Generator
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Generate adaptive, syllabus-targeted multiple-choice quizzes for any of your courses in real-time.
                </p>
              </div>

              {/* Quiz Generator Controls */}
              <div className="bg-slate-50/80 p-6 rounded-2xl border border-slate-200 max-w-xl mx-auto space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Select Subject
                  </label>
                  <select
                    value={quizSubject}
                    onChange={(e) => setQuizSubject(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  >
                    {subjects.map((sub, i) => (
                      <option key={i} value={sub.name}>{sub.name}</option>
                    ))}
                    <option value="General Science & Tech">General Science & Tech</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Focus Topic / Unit (Optional)
                  </label>
                  <input
                    type="text"
                    value={quizTopic}
                    onChange={(e) => setQuizTopic(e.target.value)}
                    placeholder="e.g. Normalization, Binary Search Trees, or Newton's Laws"
                    className="w-full p-3 rounded-xl border border-slate-300 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  />
                </div>

                <button
                  onClick={handleGenerateQuiz}
                  disabled={isGeneratingQuiz}
                  className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm shadow-indigo-200 transition-all cursor-pointer disabled:opacity-70"
                >
                  {isGeneratingQuiz ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Generating Custom AI Quiz...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      <span>Generate Quiz for {quizSubject || "Subject"}</span>
                    </>
                  )}
                </button>
              </div>

              {quizError && (
                <div className="max-w-xl mx-auto p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-3">
                  <AlertCircle size={18} className="shrink-0" />
                  <span>{quizError}</span>
                </div>
              )}

              {/* Render Active Quiz */}
              {quizQuestions && quizQuestions.length > 0 && (
                <div className="space-y-6 pt-4 border-t border-slate-100 max-w-3xl mx-auto animate-in fade-in duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Quiz: {quizSubject}</h3>
                      <p className="text-xs text-slate-500">Topic: {quizTopic}</p>
                    </div>

                    {quizSubmitted && (
                      <div className="text-sm font-bold px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-2">
                        <Award size={18} />
                        <span>Score: {calculateQuizScore()} / {quizQuestions.length} ({Math.round((calculateQuizScore() / quizQuestions.length) * 100)}%)</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    {quizQuestions.map((q, qIndex) => {
                      const selectedOpt = userAnswers[q.id];
                      return (
                        <div key={q.id || qIndex} className="p-6 rounded-2xl border border-slate-200 bg-white space-y-4">
                          <p className="font-bold text-slate-900 text-base">
                            <span className="text-indigo-600 mr-2">Q{qIndex + 1}.</span>
                            {q.question}
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {q.options?.map((opt: string, optIdx: number) => {
                              const isSelected = selectedOpt === optIdx;
                              const isCorrect = q.answerIndex === optIdx;

                              let buttonStyle = "border-slate-200 hover:border-slate-300 bg-white text-slate-700";
                              if (isSelected && !quizSubmitted) {
                                buttonStyle = "border-indigo-600 bg-indigo-50 text-indigo-900 font-semibold shadow-xs";
                              } else if (quizSubmitted) {
                                if (isCorrect) {
                                  buttonStyle = "border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold";
                                } else if (isSelected && !isCorrect) {
                                  buttonStyle = "border-red-400 bg-red-50 text-red-900";
                                } else {
                                  buttonStyle = "border-slate-200 opacity-60 bg-white";
                                }
                              }

                              return (
                                <button
                                  key={optIdx}
                                  type="button"
                                  onClick={() => handleSelectOption(q.id, optIdx)}
                                  className={`p-3.5 rounded-xl border text-left text-sm transition-all flex items-start gap-2.5 cursor-pointer ${buttonStyle}`}
                                >
                                  <span className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                                    {String.fromCharCode(65 + optIdx)}
                                  </span>
                                  <span className="flex-1">{opt}</span>
                                </button>
                              );
                            })}
                          </div>

                          {quizSubmitted && (
                            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 leading-relaxed">
                              <span className="font-bold text-slate-800 mr-1">💡 Explanation:</span>
                              {q.explanation}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <button
                      onClick={handleGenerateQuiz}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw size={16} /> Generate New Questions
                    </button>

                    {!quizSubmitted ? (
                      <button
                        onClick={() => setQuizSubmitted(true)}
                        disabled={Object.keys(userAnswers).length === 0}
                        className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-sm shadow-emerald-200 transition-all cursor-pointer disabled:opacity-50"
                      >
                        Submit Answers
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setQuizQuestions(null);
                          setUserAnswers({});
                          setQuizSubmitted(false);
                        }}
                        className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold shadow-sm transition-all cursor-pointer"
                      >
                        Done
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Study Planner */}
          {activeTab === 'planner' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="text-indigo-600" />
                Study & Assignment Planner for {studentName}
              </h2>
              
              <div className="space-y-3">
                {tasks.map(task => (
                  <div key={task.id} className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${task.completed ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-200 shadow-sm hover:border-indigo-300'}`}>
                    <button 
                      onClick={() => toggleTask(task.id)}
                      className={`w-6 h-6 rounded-md border flex items-center justify-center transition-colors cursor-pointer ${task.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 text-transparent hover:border-indigo-500'}`}
                    >
                      <Check size={16} />
                    </button>
                    <div className="flex-1">
                      <p className={`font-medium text-sm ${task.completed ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{task.title}</p>
                      <p className="text-xs text-slate-500">{task.time} • {task.priority} Priority</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: Materials */}
          {activeTab === 'materials' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <FileText className="text-indigo-600" />
                Smart Lecture & Lab PDF Summarizer
              </h2>
              
              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center hover:border-indigo-500 hover:bg-indigo-50/50 transition-all cursor-pointer group">
                <div className="w-16 h-16 bg-slate-100 text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
                  <Upload size={32} />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-1">Upload Lecture or Lab Manual (PDF)</h3>
                <p className="text-slate-500 text-xs max-w-sm mx-auto leading-relaxed">
                  There For You will extract formulas, summarize procedures, and create revision flashcards automatically.
                </p>
              </div>
            </div>
          )}
        </>
      )}

    </div>
  );
}

function SubjectProgress({ name, score, warning = false }: { name: string, score: number, warning?: boolean }) {
  let color = 'bg-emerald-500';
  if (score < 75) color = 'bg-amber-500';
  if (score < 60) color = 'bg-rose-500';

  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5 font-semibold">
        <span className="text-slate-700 flex items-center gap-1.5">
          {name}
          {warning && <AlertCircle size={13} className="text-amber-500" />}
        </span>
        <span className="text-slate-900">{score}%</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
        <div className={`h-2.5 rounded-full transition-all duration-700 ${color}`} style={{ width: `${score}%` }}></div>
      </div>
    </div>
  );
}
