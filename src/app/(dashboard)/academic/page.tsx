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
  Award,
  Copy,
  Download,
  Clock,
  BookMarked,
  Layers,
  Eye,
  EyeOff,
  FileCheck,
  RefreshCw,
  X,
  Brain,
  Timer,
  CheckSquare,
  ListTodo,
  Target,
  Flame,
  Zap,
  ArrowRight,
  Coffee,
  HeartPulse,
  Share2,
  Save
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

export interface LessonItem {
  id: string;
  subject: string;
  topic: string;
}

export interface StudyPlanBlock {
  id: string;
  timeSlot: string;
  subject: string;
  lesson: string;
  type: 'deep_study' | 'spaced_repetition' | 'practice_problems' | 'break' | 'quick_quiz';
  durationMinutes: number;
  goal: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'pending' | 'completed';
}

export interface DailyPlanData {
  date?: string;
  dayGoal: string;
  motivationalQuote: string;
  pedagogicalTip: string;
  totalMinutesPlanned: number;
  blocks: StudyPlanBlock[];
}

interface AcademicData {
  attendance: number;
  subjects: SubjectItem[];
  labs: LabItem[];
  completedLessons?: LessonItem[];
  currentlyStudyingLessons?: LessonItem[];
  dailyPlan?: DailyPlanData | null;
  wellnessData?: any;
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

  // Daily Study Planner Enhanced State
  const [completedLessons, setCompletedLessons] = useState<LessonItem[]>([
    { id: 'comp-1', subject: 'Data Structures & Algorithms', topic: 'Stacks, Queues & Linked Lists' },
    { id: 'comp-2', subject: 'Database Management Systems', topic: 'Relational Model & SQL Queries' },
    { id: 'comp-3', subject: 'Operating Systems', topic: 'Process Scheduling & Threads' },
  ]);
  const [currentlyStudyingLessons, setCurrentlyStudyingLessons] = useState<LessonItem[]>([
    { id: 'curr-1', subject: 'Data Structures & Algorithms', topic: 'Binary Search Trees & AVL Rotations' },
    { id: 'curr-2', subject: 'Database Management Systems', topic: 'Normalization (3NF, BCNF) & ACID Transactions' },
    { id: 'curr-3', subject: 'Computer Networks', topic: 'Transport Layer & TCP Flow Control' },
  ]);
  const [dailyPlan, setDailyPlan] = useState<DailyPlanData | null>(null);
  const [targetStudyHours, setTargetStudyHours] = useState<number>(4);
  const [scheduleWindow, setScheduleWindow] = useState<'Full Day' | 'Morning' | 'Afternoon' | 'Evening'>('Full Day');
  const [studyIntensity, setStudyIntensity] = useState<'Light Review' | 'Balanced' | 'Intensive'>('Balanced');
  const [studentMood, setStudentMood] = useState<string>('Okay');
  const [isGeneratingPlan, setIsGeneratingPlan] = useState<boolean>(false);
  const [planError, setPlanError] = useState<string | null>(null);
  const [customFocus, setCustomFocus] = useState<string>('');
  const [plannerTab, setPlannerTab] = useState<'schedule' | 'lessons'>('schedule');
  const [isSavingPlan, setIsSavingPlan] = useState<boolean>(false);
  const [planSavedMessage, setPlanSavedMessage] = useState<string | null>(null);

  // Add lesson form states
  const [newCompletedSubject, setNewCompletedSubject] = useState<string>('');
  const [newCompletedTopic, setNewCompletedTopic] = useState<string>('');
  const [newCurrentSubject, setNewCurrentSubject] = useState<string>('');
  const [newCurrentTopic, setNewCurrentTopic] = useState<string>('');

  // Add custom block modal state
  const [customBlockTopic, setCustomBlockTopic] = useState<string>('');
  const [customBlockSubject, setCustomBlockSubject] = useState<string>('');
  const [customBlockTime, setCustomBlockTime] = useState<string>('');
  const [showAddBlockModal, setShowAddBlockModal] = useState<boolean>(false);

  // PDF Summarizer state
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfPastedText, setPdfPastedText] = useState('');
  const [pdfInputMode, setPdfInputMode] = useState<'upload' | 'paste'>('upload');
  const [pdfFocusMode, setPdfFocusMode] = useState<'comprehensive' | 'formulas' | 'cheatsheet' | 'flashcards'>('comprehensive');
  const [pdfSubject, setPdfSubject] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summarizeStep, setSummarizeStep] = useState(1);
  const [summaryResult, setSummaryResult] = useState<any>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [activeResultTab, setActiveResultTab] = useState<'notes' | 'formulas' | 'flashcards' | 'exam'>('notes');
  const [revealedFlashcards, setRevealedFlashcards] = useState<Record<number, boolean>>({});
  const [copiedSummary, setCopiedSummary] = useState(false);

  useEffect(() => {
    // Check local storage for mood
    if (typeof window !== 'undefined') {
      const localMood = localStorage.getItem('student_latest_mood');
      if (localMood) setStudentMood(localMood);
    }

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
                  setNewCompletedSubject(parsed.subjects[0].name);
                  setNewCurrentSubject(parsed.subjects[0].name);
                }
              }

              if (parsed.completedLessons && Array.isArray(parsed.completedLessons) && parsed.completedLessons.length > 0) {
                setCompletedLessons(parsed.completedLessons);
              }
              if (parsed.currentlyStudyingLessons && Array.isArray(parsed.currentlyStudyingLessons) && parsed.currentlyStudyingLessons.length > 0) {
                setCurrentlyStudyingLessons(parsed.currentlyStudyingLessons);
              }
              if (parsed.dailyPlan) {
                setDailyPlan(parsed.dailyPlan);
              }
              if (parsed.wellnessData?.latestMood?.mood) {
                setStudentMood(parsed.wellnessData.latestMood.mood);
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
              setCompletedLessons([
                { id: 'comp-1', subject: 'Mathematics', topic: 'Linear Equations & Polynomials' },
                { id: 'comp-2', subject: 'Physics / Science', topic: 'Laws of Motion & Work Energy' },
              ]);
              setCurrentlyStudyingLessons([
                { id: 'curr-1', subject: 'Mathematics', topic: 'Quadratic Equations & Trigonometry' },
                { id: 'curr-2', subject: 'Physics / Science', topic: 'Gravitation & Fluid Mechanics' },
              ]);
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

  // Daily Study Planner Handlers
  const savePlanToProfile = async (
    planToSave?: DailyPlanData | null,
    completedToSave?: LessonItem[],
    currentToSave?: LessonItem[]
  ) => {
    setIsSavingPlan(true);
    setPlanSavedMessage(null);

    const payload: AcademicData = {
      attendance,
      subjects,
      labs,
      completedLessons: completedToSave || completedLessons,
      currentlyStudyingLessons: currentToSave || currentlyStudyingLessons,
      dailyPlan: planToSave !== undefined ? planToSave : dailyPlan,
    };

    try {
      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ academicDetails: payload })
      });

      if (res.ok) {
        setPlanSavedMessage('Daily plan & lessons saved!');
        setTimeout(() => setPlanSavedMessage(null), 3500);
      }
    } catch (e) {
      console.error('Failed to save study plan:', e);
    } finally {
      setIsSavingPlan(false);
    }
  };

  const handleGenerateStudyPlan = async () => {
    setIsGeneratingPlan(true);
    setPlanError(null);

    try {
      const res = await fetch('/api/academic/study-planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName,
          educationLevel: student?.educationLevel || 'College',
          department: student?.department || 'Engineering',
          subjects: subjects.map(s => s.name),
          completedLessons,
          currentlyStudyingLessons,
          targetHours: targetStudyHours,
          intensity: studyIntensity,
          scheduleWindow,
          studentMood,
          customFocus
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate study plan');
      }

      if (data.blocks && Array.isArray(data.blocks)) {
        setDailyPlan(data);
        savePlanToProfile(data, completedLessons, currentlyStudyingLessons);
      } else {
        throw new Error('Unexpected response format from study planner AI');
      }
    } catch (err: any) {
      console.error('Study planner generation error:', err);
      setPlanError(err.message || 'Failed to generate study plan');
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const togglePlanBlock = (blockId: string) => {
    if (!dailyPlan) return;
    const updatedBlocks = dailyPlan.blocks.map(b => 
      b.id === blockId 
        ? { ...b, status: (b.status === 'completed' ? 'pending' : 'completed') as 'pending' | 'completed' } 
        : b
    );
    const updatedPlan = { ...dailyPlan, blocks: updatedBlocks };
    setDailyPlan(updatedPlan);
    savePlanToProfile(updatedPlan, completedLessons, currentlyStudyingLessons);
  };

  const handleAddCompletedLesson = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newCompletedTopic.trim()) return;
    const sub = newCompletedSubject || (subjects[0]?.name || 'General');
    const newLesson: LessonItem = {
      id: `comp-${Date.now()}`,
      subject: sub,
      topic: newCompletedTopic.trim()
    };
    const updated = [...completedLessons, newLesson];
    setCompletedLessons(updated);
    setNewCompletedTopic('');
    savePlanToProfile(dailyPlan, updated, currentlyStudyingLessons);
  };

  const handleRemoveCompletedLesson = (id: string) => {
    const updated = completedLessons.filter(l => l.id !== id);
    setCompletedLessons(updated);
    savePlanToProfile(dailyPlan, updated, currentlyStudyingLessons);
  };

  const handleAddCurrentLesson = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newCurrentTopic.trim()) return;
    const sub = newCurrentSubject || (subjects[0]?.name || 'General');
    const newLesson: LessonItem = {
      id: `curr-${Date.now()}`,
      subject: sub,
      topic: newCurrentTopic.trim()
    };
    const updated = [...currentlyStudyingLessons, newLesson];
    setCurrentlyStudyingLessons(updated);
    setNewCurrentTopic('');
    savePlanToProfile(dailyPlan, completedLessons, updated);
  };

  const handleRemoveCurrentLesson = (id: string) => {
    const updated = currentlyStudyingLessons.filter(l => l.id !== id);
    setCurrentlyStudyingLessons(updated);
    savePlanToProfile(dailyPlan, completedLessons, updated);
  };

  const handleMoveLessonToCompleted = (lesson: LessonItem) => {
    const updatedCurrent = currentlyStudyingLessons.filter(l => l.id !== lesson.id);
    const updatedComp = [...completedLessons, { ...lesson, id: `comp-${Date.now()}` }];
    setCurrentlyStudyingLessons(updatedCurrent);
    setCompletedLessons(updatedComp);
    savePlanToProfile(dailyPlan, updatedComp, updatedCurrent);
  };

  const handleAddCustomBlock = () => {
    if (!customBlockTopic.trim()) return;
    const newBlock: StudyPlanBlock = {
      id: `block-custom-${Date.now()}`,
      timeSlot: customBlockTime.trim() || 'Flexible Time',
      subject: customBlockSubject || (subjects[0]?.name || 'General'),
      lesson: customBlockTopic.trim(),
      type: 'deep_study',
      durationMinutes: 40,
      goal: 'Complete assignment tasks and targeted problem solving',
      priority: 'Medium',
      status: 'pending'
    };
    const updatedPlan: DailyPlanData = dailyPlan 
      ? { 
          ...dailyPlan, 
          totalMinutesPlanned: dailyPlan.totalMinutesPlanned + 40,
          blocks: [...dailyPlan.blocks, newBlock] 
        }
      : {
          dayGoal: 'Daily focus session',
          motivationalQuote: 'Consistency is the DNA of mastery.',
          pedagogicalTip: 'Break complex problems into smaller testable sub-units.',
          totalMinutesPlanned: 40,
          blocks: [newBlock]
        };
    setDailyPlan(updatedPlan);
    setCustomBlockTopic('');
    setCustomBlockTime('');
    setShowAddBlockModal(false);
    savePlanToProfile(updatedPlan, completedLessons, currentlyStudyingLessons);
  };

  const handlePrepopulateSyllabus = () => {
    const isSchool = student?.educationLevel === 'School';
    const newCompleted = isSchool ? [
      { id: `comp-${Date.now()}-1`, subject: 'Mathematics', topic: 'Linear Equations & Polynomials' },
      { id: `comp-${Date.now()}-2`, subject: 'Physics / Science', topic: 'Laws of Motion & Work Energy' },
      { id: `comp-${Date.now()}-3`, subject: 'Chemistry', topic: 'Chemical Reactions & Equations' },
    ] : [
      { id: `comp-${Date.now()}-1`, subject: 'Data Structures & Algorithms', topic: 'Stacks, Queues & Linked Lists' },
      { id: `comp-${Date.now()}-2`, subject: 'Database Management Systems', topic: 'Relational Model & SQL Queries' },
      { id: `comp-${Date.now()}-3`, subject: 'Operating Systems', topic: 'Process Scheduling & Threads' },
    ];
    const newCurrent = isSchool ? [
      { id: `curr-${Date.now()}-1`, subject: 'Mathematics', topic: 'Quadratic Equations & Trigonometry' },
      { id: `curr-${Date.now()}-2`, subject: 'Physics / Science', topic: 'Gravitation & Fluid Mechanics' },
      { id: `curr-${Date.now()}-3`, subject: 'English & Literature', topic: 'Analytical Essay Writing & Grammar' },
    ] : [
      { id: `curr-${Date.now()}-1`, subject: 'Data Structures & Algorithms', topic: 'Binary Search Trees & AVL Rotations' },
      { id: `curr-${Date.now()}-2`, subject: 'Database Management Systems', topic: 'Normalization (3NF, BCNF) & Transactions' },
      { id: `curr-${Date.now()}-3`, subject: 'Computer Networks', topic: 'Transport Layer & TCP Flow Control' },
    ];
    setCompletedLessons(newCompleted);
    setCurrentlyStudyingLessons(newCurrent);
    savePlanToProfile(dailyPlan, newCompleted, newCurrent);
  };

  const handleCopySchedule = () => {
    if (!dailyPlan) return;
    const text = `Daily Study Plan (${new Date().toLocaleDateString()}):\n` +
      `Goal: ${dailyPlan.dayGoal}\n` +
      `Tip: ${dailyPlan.pedagogicalTip}\n\n` +
      dailyPlan.blocks.map(b => `[${b.status === 'completed' ? 'X' : ' '}] ${b.timeSlot} | ${b.subject}: ${b.lesson} (${b.durationMinutes}m)\n   Goal: ${b.goal}`).join('\n\n');
    navigator.clipboard.writeText(text);
    setPlanSavedMessage('Schedule copied to clipboard!');
    setTimeout(() => setPlanSavedMessage(null), 3000);
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

  const handleSummarizePdf = async () => {
    setPdfError(null);
    if (pdfInputMode === 'upload' && !pdfFile) {
      setPdfError('Please select or drag a PDF/Text lecture or lab file to summarize.');
      return;
    }
    if (pdfInputMode === 'paste' && (!pdfPastedText.trim() || pdfPastedText.trim().length < 50)) {
      setPdfError('Please paste at least 50 characters of study or lab manual content.');
      return;
    }

    setIsSummarizing(true);
    setSummarizeStep(1);

    const stepTimer = setInterval(() => {
      setSummarizeStep(prev => (prev < 4 ? prev + 1 : prev));
    }, 1300);

    try {
      let res: Response;
      const targetSub = pdfSubject || (subjects[0]?.name || 'Academic Course');

      if (pdfInputMode === 'upload' && pdfFile) {
        const formData = new FormData();
        formData.append('file', pdfFile);
        formData.append('focusMode', pdfFocusMode);
        formData.append('subject', targetSub);

        res = await fetch('/api/academic/summarize-pdf', {
          method: 'POST',
          body: formData
        });
      } else {
        res = await fetch('/api/academic/summarize-pdf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            documentText: pdfPastedText,
            focusMode: pdfFocusMode,
            subject: targetSub
          })
        });
      }

      clearInterval(stepTimer);

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to summarize document.');
      }

      const json = await res.json();
      setSummaryResult(json.data);
      setActiveResultTab('notes');
      setRevealedFlashcards({});
    } catch (err: any) {
      clearInterval(stepTimer);
      setPdfError(err.message || 'An error occurred while generating the summary.');
    } finally {
      setIsSummarizing(false);
    }
  };

  const toggleFlashcard = (idx: number) => {
    setRevealedFlashcards(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const handleCopySummary = () => {
    if (!summaryResult) return;
    const textToCopy = `# ${summaryResult.title}\n\n## Overview\n${summaryResult.overview}\n\n## Key Takeaways\n${summaryResult.keyTakeaways?.map((t: string) => `- ${t}`).join('\n')}\n\n## Core Sections\n${summaryResult.sections?.map((s: any) => `### ${s.heading}\n${s.summary}\n${s.bulletPoints?.map((b: string) => `* ${b}`).join('\n')}`).join('\n\n')}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
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
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Header & Sub-nav */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
                      <Sparkles size={14} /> AI Cognitive Study Planner
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                      <Calendar className="text-indigo-600" />
                      1-Day Study Planner for {studentName}
                    </h2>
                    <p className="text-slate-500 text-sm mt-1 max-w-2xl">
                      Generates a tailored daily study plan balancing <strong className="text-slate-700">Deep Focus on Currently Studying lessons</strong> with <strong className="text-slate-700">Spaced Repetition of Completed lessons</strong> for peak retention.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {studentMood && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 text-xs font-medium border border-rose-100">
                        <HeartPulse size={14} /> Mood Sync: <strong className="capitalize">{studentMood}</strong>
                      </div>
                    )}
                    <button
                      onClick={() => handleCopySchedule()}
                      disabled={!dailyPlan}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <Copy size={14} /> Copy Schedule
                    </button>
                    <button
                      onClick={() => savePlanToProfile()}
                      disabled={isSavingPlan}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors disabled:opacity-60 cursor-pointer"
                    >
                      {isSavingPlan ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                      Save Plan & Progress
                    </button>
                  </div>
                </div>

                {planSavedMessage && (
                  <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 size={16} className="text-emerald-600" /> {planSavedMessage}
                  </div>
                )}

                {/* Subtab Navigation */}
                <div className="flex items-center gap-3 pt-6">
                  <button
                    onClick={() => setPlannerTab('schedule')}
                    className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                      plannerTab === 'schedule'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <ListTodo size={16} />
                    Today's Schedule & Sessions
                    {dailyPlan && (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        plannerTab === 'schedule' ? 'bg-indigo-500 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {dailyPlan.blocks.filter(b => b.status === 'completed').length}/{dailyPlan.blocks.length}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => setPlannerTab('lessons')}
                    className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                      plannerTab === 'lessons'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <BookMarked size={16} />
                    Manage Lessons ({currentlyStudyingLessons.length} Current • {completedLessons.length} Completed)
                  </button>
                </div>
              </div>

              {/* TAB 4.1: DAILY SCHEDULE VIEW */}
              {plannerTab === 'schedule' && (
                <div className="space-y-6">
                  
                  {/* Generation Controls Card */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                        <Zap size={16} className="text-amber-500" />
                        Plan Parameters For Today
                      </h3>
                      <span className="text-xs text-slate-500 font-medium">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Target Hours */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Study Duration Today</label>
                        <select
                          value={targetStudyHours}
                          onChange={(e) => setTargetStudyHours(Number(e.target.value))}
                          disabled={isGeneratingPlan}
                          className="w-full p-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        >
                          <option value={2}>2 Hours (Light Focus)</option>
                          <option value={3}>3 Hours (Standard Session)</option>
                          <option value={4}>4 Hours (Recommended)</option>
                          <option value={5}>5 Hours (Intensive)</option>
                          <option value={6}>6 Hours (Exam Mode)</option>
                          <option value={8}>8 Hours (Marathon Sprint)</option>
                        </select>
                      </div>

                      {/* Time Window */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Schedule Window</label>
                        <select
                          value={scheduleWindow}
                          onChange={(e: any) => setScheduleWindow(e.target.value)}
                          disabled={isGeneratingPlan}
                          className="w-full p-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        >
                          <option value="Full Day">Full Day (Distributed with breaks)</option>
                          <option value="Morning">Morning (8:00 AM - 1:00 PM)</option>
                          <option value="Afternoon">Afternoon (1:00 PM - 6:00 PM)</option>
                          <option value="Evening">Evening (6:00 PM - 11:00 PM)</option>
                        </select>
                      </div>

                      {/* Intensity */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Focus Intensity</label>
                        <select
                          value={studyIntensity}
                          onChange={(e: any) => setStudyIntensity(e.target.value)}
                          disabled={isGeneratingPlan}
                          className="w-full p-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        >
                          <option value="Balanced">Balanced (Theory + Problems + Spaced Review)</option>
                          <option value="Light Review">Light Review (Gentle Pacing & Short Blocks)</option>
                          <option value="Intensive">Intensive (Deep Problem Solving & Recall)</option>
                        </select>
                      </div>

                      {/* Special Focus / Note */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Specific Focus / Exam (Optional)</label>
                        <input
                          type="text"
                          value={customFocus}
                          onChange={(e) => setCustomFocus(e.target.value)}
                          placeholder="e.g. Midterm prep, Trees code"
                          disabled={isGeneratingPlan}
                          className="w-full p-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                      <div className="text-xs text-slate-500 flex items-center gap-2">
                        <span>Includes:</span>
                        <span className="inline-flex items-center gap-1 font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                          {currentlyStudyingLessons.length} Active Lessons
                        </span>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1 font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                          {completedLessons.length} Revision Lessons
                        </span>
                      </div>

                      <button
                        onClick={handleGenerateStudyPlan}
                        disabled={isGeneratingPlan}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm transition-all disabled:opacity-60 cursor-pointer"
                      >
                        {isGeneratingPlan ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            Synthesizing Daily Cognitive Schedule...
                          </>
                        ) : (
                          <>
                            <Sparkles size={16} />
                            Generate AI 1-Day Study Plan
                          </>
                        )}
                      </button>
                    </div>

                    {planError && (
                      <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                        <AlertCircle size={15} /> {planError}
                      </div>
                    )}
                  </div>

                  {/* Generated Daily Plan Display */}
                  {dailyPlan ? (
                    <div className="space-y-6">
                      
                      {/* Daily Motivation & Pedagogy Card */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-5 rounded-2xl border border-indigo-100 flex flex-col justify-between">
                          <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1.5 mb-1.5">
                              <Target size={14} /> Today's Core Mission
                            </span>
                            <p className="text-sm font-semibold text-slate-800 leading-snug">{dailyPlan.dayGoal}</p>
                          </div>
                          <div className="mt-4 flex items-center gap-2 text-xs text-indigo-700 font-medium">
                            <Clock size={13} /> {dailyPlan.totalMinutesPlanned} Minutes Total Planned
                          </div>
                        </div>

                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-5 rounded-2xl border border-amber-100 flex flex-col justify-between">
                          <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5 mb-1.5">
                              <Brain size={14} /> Cognitive Technique
                            </span>
                            <p className="text-xs text-slate-700 leading-relaxed">{dailyPlan.pedagogicalTip}</p>
                          </div>
                          <div className="mt-4 text-xs font-semibold text-amber-800">
                            Spaced Interleaving Model
                          </div>
                        </div>

                        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-5 rounded-2xl border border-emerald-100 flex flex-col justify-between">
                          <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5 mb-1.5">
                              <Flame size={14} /> Daily Motivation
                            </span>
                            <p className="text-xs italic text-slate-700 leading-relaxed font-medium">"{dailyPlan.motivationalQuote}"</p>
                          </div>
                          <div className="mt-4 flex items-center justify-between text-xs text-emerald-800 font-semibold">
                            <span>Today's Progress</span>
                            <span>
                              {Math.round((dailyPlan.blocks.filter(b => b.status === 'completed').length / Math.max(1, dailyPlan.blocks.length)) * 100)}%
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar Strip */}
                      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1.5 flex-1">
                          <div className="flex justify-between text-xs font-semibold text-slate-700">
                            <span>Schedule Completion</span>
                            <span>
                              {dailyPlan.blocks.filter(b => b.status === 'completed').length} of {dailyPlan.blocks.length} Sessions Completed
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                            <div 
                              className="bg-indigo-600 h-3 rounded-full transition-all duration-500 ease-out"
                              style={{
                                width: `${Math.round((dailyPlan.blocks.filter(b => b.status === 'completed').length / Math.max(1, dailyPlan.blocks.length)) * 100)}%`
                              }}
                            />
                          </div>
                        </div>

                        <button
                          onClick={() => setShowAddBlockModal(true)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer shrink-0"
                        >
                          <Plus size={14} /> Add Custom Task / Session
                        </button>
                      </div>

                      {/* Schedule Timeline Blocks */}
                      <div className="space-y-3">
                        {dailyPlan.blocks.map((block, idx) => {
                          const isCompleted = block.status === 'completed';
                          const isBreak = block.type === 'break';
                          const isRevision = block.type === 'spaced_repetition';
                          const isPractice = block.type === 'practice_problems';

                          return (
                            <div 
                              key={block.id || idx}
                              className={`p-5 rounded-2xl border transition-all ${
                                isCompleted 
                                  ? 'bg-slate-50 border-slate-200 opacity-80' 
                                  : isBreak
                                    ? 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-300'
                                    : isRevision
                                      ? 'bg-amber-50/30 border-amber-200 hover:border-amber-300 shadow-sm'
                                      : 'bg-white border-slate-200 hover:border-indigo-300 shadow-sm'
                              }`}
                            >
                              <div className="flex items-start gap-4">
                                <button
                                  onClick={() => togglePlanBlock(block.id)}
                                  className={`w-7 h-7 rounded-xl border flex items-center justify-center transition-colors cursor-pointer shrink-0 mt-0.5 ${
                                    isCompleted 
                                      ? 'bg-emerald-500 border-emerald-500 text-white' 
                                      : 'border-slate-300 text-transparent hover:border-indigo-500 bg-white'
                                  }`}
                                >
                                  <Check size={16} />
                                </button>

                                <div className="flex-1 space-y-1.5">
                                  <div className="flex flex-wrap items-center justify-between gap-2">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                                        {block.timeSlot}
                                      </span>

                                      {isBreak ? (
                                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
                                          <Coffee size={12} /> Rest & Hydrate
                                        </span>
                                      ) : isRevision ? (
                                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                                          <RotateCcw size={12} /> Spaced Recall (Completed Lesson)
                                        </span>
                                      ) : isPractice ? (
                                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full">
                                          <CheckSquare size={12} /> Practice Problems (Current Lesson)
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 bg-indigo-100 px-2.5 py-0.5 rounded-full">
                                          <Brain size={12} /> Deep Focus (Currently Studying)
                                        </span>
                                      )}

                                      <span className="text-xs text-slate-500 font-medium">
                                        {block.durationMinutes} min
                                      </span>
                                    </div>

                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                                      block.priority === 'High' ? 'text-rose-700 bg-rose-50' : 'text-slate-600 bg-slate-100'
                                    }`}>
                                      {block.priority} Priority
                                    </span>
                                  </div>

                                  <div>
                                    <h4 className={`text-base font-bold ${isCompleted ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                                      {block.subject} — {block.lesson}
                                    </h4>
                                    <p className={`text-xs mt-1 leading-relaxed ${isCompleted ? 'text-slate-400' : 'text-slate-600'}`}>
                                      {block.goal}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    /* Initial Empty State */
                    <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
                      <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
                        <Calendar size={32} />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">No Study Plan Generated for Today Yet</h3>
                      <p className="text-slate-500 text-sm max-w-md mx-auto">
                        Click the button above to generate a smart 1-day study plan customized with your active and completed lessons.
                      </p>
                      <button
                        onClick={handleGenerateStudyPlan}
                        disabled={isGeneratingPlan}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm transition-all cursor-pointer"
                      >
                        {isGeneratingPlan ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                        Generate Today's Study Plan
                      </button>
                    </div>
                  )}

                  {/* Add Custom Block Modal */}
                  {showAddBlockModal && (
                    <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4 backdrop-blur-xs">
                      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                            <Plus size={16} className="text-indigo-600" />
                            Add Custom Study Task / Session
                          </h3>
                          <button 
                            onClick={() => setShowAddBlockModal(false)}
                            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                          >
                            <X size={18} />
                          </button>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                            <select
                              value={customBlockSubject || (subjects[0]?.name || '')}
                              onChange={(e) => setCustomBlockSubject(e.target.value)}
                              className="w-full p-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50"
                            >
                              {subjects.map((sub, i) => (
                                <option key={i} value={sub.name}>{sub.name}</option>
                              ))}
                              <option value="General & Lab">General / Lab / Assignment</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Task or Topic Name</label>
                            <input
                              type="text"
                              value={customBlockTopic}
                              onChange={(e) => setCustomBlockTopic(e.target.value)}
                              placeholder="e.g. Finish Operating Systems Lab Record Exp 8"
                              className="w-full p-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Time Slot (Optional)</label>
                            <input
                              type="text"
                              value={customBlockTime}
                              onChange={(e) => setCustomBlockTime(e.target.value)}
                              placeholder="e.g. 04:30 PM - 05:15 PM"
                              className="w-full p-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-3">
                          <button
                            onClick={() => setShowAddBlockModal(false)}
                            className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-100"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleAddCustomBlock}
                            disabled={!customBlockTopic.trim()}
                            className="px-5 py-2 text-xs font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 cursor-pointer"
                          >
                            Add To Schedule
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4.2: CURRICULUM TRACKER (CURRENTLY STUDYING vs COMPLETED) */}
              {plannerTab === 'lessons' && (
                <div className="space-y-6">
                  
                  {/* Top helper banner */}
                  <div className="bg-gradient-to-r from-indigo-50 via-white to-amber-50 p-6 rounded-2xl border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Syllabus & Lesson Progress Management</h3>
                      <p className="text-xs text-slate-600 mt-1 max-w-xl">
                        Keep track of what lessons you are currently mastering vs what you have finished. The AI study planner uses this exact breakdown to schedule your day!
                      </p>
                    </div>
                    <button
                      onClick={handlePrepopulateSyllabus}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white border border-slate-200 text-indigo-600 hover:bg-indigo-50 transition-colors shrink-0 shadow-xs cursor-pointer"
                    >
                      <RotateCcw size={13} /> Reset Standard Syllabus Topics
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* COLUMN 1: Currently Studying Lessons */}
                    <div className="bg-white rounded-2xl shadow-sm border border-indigo-100 p-6 space-y-5">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                            <Brain size={18} />
                          </div>
                          <div>
                            <h4 className="text-base font-bold text-slate-900">Currently Studying Lessons</h4>
                            <p className="text-xs text-slate-500">Active chapters receiving deep focus blocks</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {currentlyStudyingLessons.length} Active
                        </span>
                      </div>

                      {/* Add Currently Studying Form */}
                      <form onSubmit={handleAddCurrentLesson} className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                          + Add Currently Studying Topic
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <div className="sm:col-span-1">
                            <select
                              value={newCurrentSubject || (subjects[0]?.name || '')}
                              onChange={(e) => setNewCurrentSubject(e.target.value)}
                              className="w-full p-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-800"
                            >
                              {subjects.map((s, idx) => (
                                <option key={idx} value={s.name}>{s.name}</option>
                              ))}
                            </select>
                          </div>
                          <div className="sm:col-span-2">
                            <input
                              type="text"
                              value={newCurrentTopic}
                              onChange={(e) => setNewCurrentTopic(e.target.value)}
                              placeholder="e.g. Binary Search Trees & AVL Rotations"
                              className="w-full p-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-800"
                            />
                          </div>
                        </div>
                        <button
                          type="submit"
                          disabled={!newCurrentTopic.trim()}
                          className="w-full py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <Plus size={14} /> Add To Currently Studying
                        </button>
                      </form>

                      {/* List of currently studying */}
                      <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                        {currentlyStudyingLessons.map((lesson) => (
                          <div
                            key={lesson.id}
                            className="p-3.5 rounded-xl border border-indigo-100 bg-indigo-50/30 flex items-center justify-between gap-3 hover:border-indigo-300 transition-all"
                          >
                            <div className="space-y-0.5 flex-1 min-w-0">
                              <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block truncate">
                                {lesson.subject}
                              </span>
                              <p className="text-sm font-semibold text-slate-900 truncate">
                                {lesson.topic}
                              </p>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                onClick={() => handleMoveLessonToCompleted(lesson)}
                                title="Mark completed and move to revision list"
                                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <Check size={12} /> Finished
                              </button>
                              <button
                                onClick={() => handleRemoveCurrentLesson(lesson.id)}
                                title="Remove lesson"
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* COLUMN 2: Completed Lessons */}
                    <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-6 space-y-5">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                            <CheckCircle2 size={18} />
                          </div>
                          <div>
                            <h4 className="text-base font-bold text-slate-900">Completed Lessons</h4>
                            <p className="text-xs text-slate-500">Mastered chapters receiving active recall revision</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                          {completedLessons.length} Completed
                        </span>
                      </div>

                      {/* Add Completed Form */}
                      <form onSubmit={handleAddCompletedLesson} className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                          + Add Completed / Mastered Topic
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <div className="sm:col-span-1">
                            <select
                              value={newCompletedSubject || (subjects[0]?.name || '')}
                              onChange={(e) => setNewCompletedSubject(e.target.value)}
                              className="w-full p-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-800"
                            >
                              {subjects.map((s, idx) => (
                                <option key={idx} value={s.name}>{s.name}</option>
                              ))}
                            </select>
                          </div>
                          <div className="sm:col-span-2">
                            <input
                              type="text"
                              value={newCompletedTopic}
                              onChange={(e) => setNewCompletedTopic(e.target.value)}
                              placeholder="e.g. Stacks, Queues & Linked Lists"
                              className="w-full p-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-800"
                            />
                          </div>
                        </div>
                        <button
                          type="submit"
                          disabled={!newCompletedTopic.trim()}
                          className="w-full py-2 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-700 text-white transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <Plus size={14} /> Add To Completed
                        </button>
                      </form>

                      {/* List of completed */}
                      <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                        {completedLessons.map((lesson) => (
                          <div
                            key={lesson.id}
                            className="p-3.5 rounded-xl border border-amber-100 bg-amber-50/20 flex items-center justify-between gap-3 hover:border-amber-300 transition-all"
                          >
                            <div className="space-y-0.5 flex-1 min-w-0">
                              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block truncate">
                                {lesson.subject}
                              </span>
                              <p className="text-sm font-semibold text-slate-800 truncate">
                                {lesson.topic}
                              </p>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                                <CheckCircle2 size={11} /> Mastered
                              </span>
                              <button
                                onClick={() => handleRemoveCompletedLesson(lesson.id)}
                                title="Remove lesson"
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 5: Materials / PDF Summarizer */}
          {activeTab === 'materials' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-8 animate-in fade-in duration-300">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
                    <Sparkles size={14} /> Powered by Groq AI API
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="text-indigo-600" />
                    Smart Lecture & Lab PDF Summarizer
                  </h2>
                  <p className="text-slate-500 text-sm mt-1">
                    Upload textbooks, lecture slides, or lab manuals to extract structured revision notes, formulas, and interactive flashcards.
                  </p>
                </div>

                {summaryResult && (
                  <button
                    onClick={() => {
                      setSummaryResult(null);
                      setPdfFile(null);
                      setPdfPastedText('');
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3.5 py-2 rounded-xl transition-colors cursor-pointer shrink-0"
                  >
                    <RefreshCw size={13} />
                    Summarize Another Document
                  </button>
                )}
              </div>

              {!summaryResult ? (
                /* Document Input Controls */
                <div className="max-w-2xl mx-auto space-y-6">
                  
                  {/* Focus Mode & Subject */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Related Subject
                      </label>
                      <select
                        value={pdfSubject || (subjects[0]?.name || '')}
                        onChange={(e) => setPdfSubject(e.target.value)}
                        disabled={isSummarizing}
                        className="w-full p-3 rounded-xl border border-slate-200 text-sm text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                      >
                        {subjects.map((sub, i) => (
                          <option key={i} value={sub.name}>{sub.name}</option>
                        ))}
                        <option value="General Science & Technology">General Science & Technology</option>
                        <option value="Engineering & Lab Practical">Engineering & Lab Practical</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Summarization Focus
                      </label>
                      <select
                        value={pdfFocusMode}
                        onChange={(e: any) => setPdfFocusMode(e.target.value)}
                        disabled={isSummarizing}
                        className="w-full p-3 rounded-xl border border-slate-200 text-sm text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                      >
                        <option value="comprehensive">Comprehensive Lecture Notes</option>
                        <option value="formulas">Formulas, Equations & Lab Steps</option>
                        <option value="cheatsheet">1-Page Exam Cramming Cheat Sheet</option>
                        <option value="flashcards">Revision Flashcards & Q&A</option>
                      </select>
                    </div>
                  </div>

                  {/* Input Method Toggle */}
                  <div>
                    <div className="flex border-b border-slate-200 mb-4">
                      <button
                        onClick={() => setPdfInputMode('upload')}
                        className={`pb-2.5 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                          pdfInputMode === 'upload'
                            ? 'border-indigo-600 text-indigo-600'
                            : 'border-transparent text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        <Upload size={14} />
                        Upload PDF Document (.pdf, .txt)
                      </button>
                      <button
                        onClick={() => setPdfInputMode('paste')}
                        className={`pb-2.5 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                          pdfInputMode === 'paste'
                            ? 'border-indigo-600 text-indigo-600'
                            : 'border-transparent text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        <FileText size={14} />
                        Paste Lecture / Lab Text
                      </button>
                    </div>

                    {pdfInputMode === 'upload' ? (
                      <div>
                        {!pdfFile ? (
                          <label className="border-2 border-dashed border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/30 rounded-2xl p-10 text-center block cursor-pointer transition-all group">
                            <input
                              type="file"
                              accept=".pdf,.txt,.md"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  setPdfFile(e.target.files[0]);
                                  setPdfError(null);
                                }
                              }}
                              className="hidden"
                            />
                            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                              <Upload size={28} />
                            </div>
                            <h3 className="font-bold text-slate-900 text-sm mb-1">Click to browse or drop PDF lecture manual</h3>
                            <p className="text-slate-400 text-xs">
                              Supports PDF textbooks, research papers, and lab manuals up to 10MB
                            </p>
                          </label>
                        ) : (
                          <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                                <FileCheck size={20} />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-slate-900">{pdfFile.name}</p>
                                <p className="text-xs text-slate-500">{(pdfFile.size / 1024).toFixed(1)} KB • Ready to summarize</p>
                              </div>
                            </div>
                            <button
                              onClick={() => setPdfFile(null)}
                              disabled={isSummarizing}
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
                          value={pdfPastedText}
                          onChange={(e) => setPdfPastedText(e.target.value)}
                          placeholder="Paste lecture excerpts, textbook chapters, or lab procedure notes here..."
                          disabled={isSummarizing}
                          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none leading-relaxed font-mono"
                        ></textarea>
                        <p className="text-right text-[11px] text-slate-400 mt-1">
                          {pdfPastedText.length} characters
                        </p>
                      </div>
                    )}
                  </div>

                  {pdfError && (
                    <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                      <AlertCircle size={16} className="shrink-0 text-rose-500" />
                      <span>{pdfError}</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    onClick={handleSummarizePdf}
                    disabled={isSummarizing}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm shadow-indigo-200 transition-all cursor-pointer disabled:opacity-60"
                  >
                    {isSummarizing ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Synthesizing Academic Material...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={18} />
                        <span>Generate Smart Summary & Flashcards</span>
                      </>
                    )}
                  </button>

                  {/* Animated Progress Box */}
                  {isSummarizing && (
                    <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3 animate-in fade-in">
                      <div className="flex items-center justify-between text-xs font-semibold text-indigo-300">
                        <span className="flex items-center gap-1.5">
                          <RefreshCw size={13} className="animate-spin" />
                          Analyzing Academic Content...
                        </span>
                        <span>{summarizeStep * 25}%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="h-1.5 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full transition-all duration-500"
                          style={{ width: `${summarizeStep * 25}%` }}
                        ></div>
                      </div>
                      <ul className="text-xs text-slate-300 space-y-1.5 pt-1">
                        <li className={`flex items-center gap-2 ${summarizeStep >= 1 ? 'text-emerald-400 font-medium' : 'text-slate-500'}`}>
                          {summarizeStep >= 1 ? <Check size={13} /> : '•'} 1. Extracting text & structure from document
                        </li>
                        <li className={`flex items-center gap-2 ${summarizeStep >= 2 ? 'text-emerald-400 font-medium' : 'text-slate-500'}`}>
                          {summarizeStep >= 2 ? <Check size={13} /> : '•'} 2. Synthesizing core theoretical concepts & takeaways
                        </li>
                        <li className={`flex items-center gap-2 ${summarizeStep >= 3 ? 'text-emerald-400 font-medium' : 'text-slate-500'}`}>
                          {summarizeStep >= 3 ? <Check size={13} /> : '•'} 3. Extracting mathematical formulas & lab procedures
                        </li>
                        <li className={`flex items-center gap-2 ${summarizeStep >= 4 ? 'text-emerald-400 font-medium' : 'text-slate-500'}`}>
                          {summarizeStep >= 4 ? <Check size={13} /> : '•'} 4. Generating revision flashcards & test questions
                        </li>
                      </ul>
                    </div>
                  )}

                </div>
              ) : (
                /* SUMMARY RESULTS VIEW */
                <div className="space-y-8 animate-in fade-in duration-300">
                  
                  {/* Results Header Card */}
                  <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="relative z-10 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full bg-white/20 text-indigo-100 text-xs font-semibold backdrop-blur-sm">
                            {summaryResult.totalPages ? `${summaryResult.totalPages} Page Document` : 'Lecture Material'}
                          </span>
                          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 text-xs font-semibold border border-emerald-400/30 flex items-center gap-1">
                            <Clock size={12} />
                            {summaryResult.readingTimeMinutes || 3} min read
                          </span>
                        </div>
                        <button
                          onClick={handleCopySummary}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium border border-white/20 backdrop-blur-sm transition-colors cursor-pointer"
                        >
                          {copiedSummary ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                          <span>{copiedSummary ? 'Copied to Clipboard!' : 'Copy Summary'}</span>
                        </button>
                      </div>

                      <h3 className="text-2xl font-bold text-white tracking-tight">
                        {summaryResult.title}
                      </h3>
                      <p className="text-indigo-100 text-sm leading-relaxed max-w-4xl">
                        {summaryResult.overview}
                      </p>
                    </div>
                  </div>

                  {/* Key Takeaways */}
                  {summaryResult.keyTakeaways && summaryResult.keyTakeaways.length > 0 && (
                    <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-6 space-y-3">
                      <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Award size={16} className="text-indigo-600" />
                        Executive Key Takeaways
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {summaryResult.keyTakeaways.map((takeaway: string, idx: number) => (
                          <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-indigo-100/80 shadow-2xs">
                            <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                              <Check size={12} />
                            </div>
                            <span className="text-xs text-slate-800 leading-relaxed font-medium">{takeaway}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Results Navigation Tabs */}
                  <div className="flex border-b border-slate-200">
                    <button
                      onClick={() => setActiveResultTab('notes')}
                      className={`pb-3 px-5 text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
                        activeResultTab === 'notes'
                          ? 'border-indigo-600 text-indigo-600'
                          : 'border-transparent text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <BookOpen size={16} />
                      <span>Lecture Notes ({summaryResult.sections?.length || 0})</span>
                    </button>
                    <button
                      onClick={() => setActiveResultTab('formulas')}
                      className={`pb-3 px-5 text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
                        activeResultTab === 'formulas'
                          ? 'border-indigo-600 text-indigo-600'
                          : 'border-transparent text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <FlaskConical size={16} />
                      <span>Formulas & Procedures ({summaryResult.formulasAndDefinitions?.length || 0})</span>
                    </button>
                    <button
                      onClick={() => setActiveResultTab('flashcards')}
                      className={`pb-3 px-5 text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
                        activeResultTab === 'flashcards'
                          ? 'border-indigo-600 text-indigo-600'
                          : 'border-transparent text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <Layers size={16} />
                      <span>Revision Flashcards ({summaryResult.flashcards?.length || 0})</span>
                    </button>
                    <button
                      onClick={() => setActiveResultTab('exam')}
                      className={`pb-3 px-5 text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
                        activeResultTab === 'exam'
                          ? 'border-indigo-600 text-indigo-600'
                          : 'border-transparent text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <HelpCircle size={16} />
                      <span>Exam Questions ({summaryResult.examQuestions?.length || 0})</span>
                    </button>
                  </div>

                  {/* TAB 1: Lecture Sections Breakdown */}
                  {activeResultTab === 'notes' && (
                    <div className="space-y-6">
                      {summaryResult.sections && summaryResult.sections.map((sec: any, idx: number) => (
                        <div key={idx} className="p-6 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-3">
                          <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold">
                              {idx + 1}
                            </span>
                            {sec.heading}
                          </h4>
                          <p className="text-xs text-slate-600 leading-relaxed font-normal">
                            {sec.summary}
                          </p>
                          {sec.bulletPoints && sec.bulletPoints.length > 0 && (
                            <ul className="space-y-1.5 pt-2 pl-2">
                              {sec.bulletPoints.map((bp: string, bIdx: number) => (
                                <li key={bIdx} className="text-xs text-slate-700 flex items-start gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0"></span>
                                  <span>{bp}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* TAB 2: Formulas & Definitions */}
                  {activeResultTab === 'formulas' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {summaryResult.formulasAndDefinitions && summaryResult.formulasAndDefinitions.map((item: any, idx: number) => (
                        <div key={idx} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2.5">
                          <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider block">
                            {item.term}
                          </span>
                          <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs font-mono text-indigo-950 font-semibold break-words">
                            {item.definitionOrFormula}
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed">
                            <span className="font-semibold text-slate-700">Lab/Exam Usage: </span>
                            {item.exampleOrUsage}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* TAB 3: Interactive Revision Flashcards */}
                  {activeResultTab === 'flashcards' && (
                    <div className="space-y-4">
                      <p className="text-xs text-slate-500">
                        Click on any flashcard to flip and reveal the academic solution.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {summaryResult.flashcards && summaryResult.flashcards.map((fc: any, idx: number) => {
                          const isFlipped = revealedFlashcards[idx];
                          return (
                            <div
                              key={idx}
                              onClick={() => toggleFlashcard(idx)}
                              className={`p-6 rounded-2xl border transition-all cursor-pointer select-none min-h-[160px] flex flex-col justify-between ${
                                isFlipped
                                  ? 'bg-gradient-to-br from-indigo-50 to-white border-indigo-300 shadow-sm'
                                  : 'bg-white border-slate-200 hover:border-indigo-300 shadow-2xs'
                              }`}
                            >
                              <div>
                                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider mb-2">
                                  <span className={isFlipped ? 'text-indigo-600' : 'text-slate-400'}>
                                    Card #{idx + 1} {isFlipped ? '• Solution' : '• Prompt'}
                                  </span>
                                  <span className="text-slate-400 flex items-center gap-1">
                                    {isFlipped ? <EyeOff size={13} /> : <Eye size={13} />}
                                    {isFlipped ? 'Hide' : 'Reveal'}
                                  </span>
                                </div>
                                <p className={`text-sm font-semibold ${isFlipped ? 'text-indigo-950' : 'text-slate-800'} leading-relaxed`}>
                                  {isFlipped ? fc.answer : fc.question}
                                </p>
                              </div>
                              <p className="text-[10px] text-slate-400 mt-4">
                                {isFlipped ? 'Click again to flip back' : 'Click card to see answer'}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* TAB 4: Practice Exam Questions */}
                  {activeResultTab === 'exam' && (
                    <div className="space-y-4">
                      {summaryResult.examQuestions && summaryResult.examQuestions.map((eq: any, idx: number) => (
                        <div key={idx} className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3">
                          <div className="flex items-start gap-3">
                            <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <div className="flex-1 space-y-2">
                              <p className="text-sm font-semibold text-slate-900 leading-relaxed">
                                {eq.question}
                              </p>
                              <details className="group">
                                <summary className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer list-none flex items-center gap-1">
                                  <span>View Model Answer</span>
                                </summary>
                                <div className="mt-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed font-normal">
                                  {eq.answerKey}
                                </div>
                              </details>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              )}

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
