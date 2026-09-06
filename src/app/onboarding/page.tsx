"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  GraduationCap, 
  School, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Loader2, 
  Sparkles,
  Users,
  Briefcase
} from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [educationLevel, setEducationLevel] = useState<"School" | "College">("College");
  const [formData, setFormData] = useState({
    // Step 1: Demographics
    age: "20",
    gender: "male",
    category: "General",
    annualIncomeLPA: "4.0",
    isDifferentlyAbled: false,

    // Step 2: Academic Details
    gradeClass: "10th",
    percentage: "85",
    department: "Engineering",
    semester: "S5",
    cgpa: "8.5",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setCurrentStep(2);
  };

  const handleFinishOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const payload = {
        educationLevel,
        age: parseInt(formData.age) || 20,
        gender: formData.gender,
        category: formData.category,
        annualIncomeLPA: parseFloat(formData.annualIncomeLPA) || 4.0,
        isDifferentlyAbled: formData.isDifferentlyAbled,
        ...(educationLevel === "School"
          ? {
              gradeClass: formData.gradeClass,
              percentage: formData.percentage ? parseFloat(formData.percentage) : null,
              department: "General",
              semester: "S1",
              cgpa: 8.0,
            }
          : {
              department: formData.department || "Engineering",
              semester: formData.semester || "S5",
              cgpa: formData.cgpa ? parseFloat(formData.cgpa) : 8.0,
              gradeClass: null,
              percentage: null,
            }),
      };

      const res = await fetch("/api/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save profile details");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-3">
          <Sparkles size={14} /> Profile Setup Wizard
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Complete Your Student Profile
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Tell us a little more about yourself to help our AI accurately match you with verified scholarships.
        </p>

        {/* Step Indicator */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
              currentStep === 1 ? "bg-indigo-600 text-white shadow-md shadow-indigo-200" : "bg-emerald-600 text-white"
            }`}>
              {currentStep > 1 ? <CheckCircle2 size={16} /> : "1"}
            </div>
            <span className={`text-xs font-semibold ${currentStep === 1 ? "text-indigo-600" : "text-slate-600"}`}>
              Demographics
            </span>
          </div>

          <div className={`w-12 h-0.5 rounded transition-colors ${currentStep === 2 ? "bg-indigo-600" : "bg-slate-200"}`}></div>

          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
              currentStep === 2 ? "bg-indigo-600 text-white shadow-md shadow-indigo-200" : "bg-slate-200 text-slate-600"
            }`}>
              2
            </div>
            <span className={`text-xs font-semibold ${currentStep === 2 ? "text-indigo-600" : "text-slate-400"}`}>
              Academics
            </span>
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div className="sm:mx-auto sm:w-full sm:max-w-xl px-4">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-sm border border-slate-200/80 rounded-2xl">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
              <div className="shrink-0 mt-0.5 font-bold">⚠️</div>
              <div className="flex-1">{error}</div>
            </div>
          )}

          {/* STEP 1: Personal & Demographics */}
          {currentStep === 1 && (
            <form onSubmit={handleNextStep} className="space-y-6 animate-in fade-in duration-300">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Users size={20} className="text-indigo-600" />
                  Demographics & Eligibility
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Used by scholarship sponsors to verify reservation criteria and age limits.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    min="10"
                    max="45"
                    value={formData.age}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none bg-white"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other / Non-Binary</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Social Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none bg-white"
                  >
                    <option value="General">General / Open</option>
                    <option value="OBC">OBC (Other Backward Class)</option>
                    <option value="SC">SC (Scheduled Caste)</option>
                    <option value="ST">ST (Scheduled Tribe)</option>
                    <option value="EWS">EWS (Economically Weaker Section)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Annual Family Income (LPA)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    name="annualIncomeLPA"
                    value={formData.annualIncomeLPA}
                    onChange={handleChange}
                    required
                    placeholder="e.g. 4.0"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">In Lakhs per year (e.g. 3.5 = ₹3,50,000)</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                <div>
                  <span className="text-sm font-semibold text-slate-800 block">Differently Abled (PwD)</span>
                  <span className="text-xs text-slate-500">Unlocks special reservation and assistive grants</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="isDifferentlyAbled"
                    checked={formData.isDifferentlyAbled}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => router.push("/dashboard")}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
                >
                  Skip for now &rarr;
                </button>

                <button
                  type="submit"
                  className="py-2.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm flex items-center gap-2 shadow-sm shadow-indigo-200 transition-all hover:shadow-md cursor-pointer"
                >
                  <span>Continue to Academics</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Academic Profile */}
          {currentStep === 2 && (
            <form onSubmit={handleFinishOnboarding} className="space-y-6 animate-in fade-in duration-300">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <GraduationCap size={20} className="text-indigo-600" />
                  Academic Profile
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Are you studying in School or College?
                </p>
              </div>

              {/* Education Level Toggle Cards */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setEducationLevel("School")}
                  className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col gap-2 ${
                    educationLevel === "School"
                      ? "border-indigo-600 bg-indigo-50/50 shadow-sm"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className={`p-2 rounded-lg w-fit ${educationLevel === "School" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                    <School size={20} />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-slate-900 block">School Student</span>
                    <span className="text-xs text-slate-500">Classes 1st to 12th</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setEducationLevel("College")}
                  className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col gap-2 ${
                    educationLevel === "College"
                      ? "border-indigo-600 bg-indigo-50/50 shadow-sm"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className={`p-2 rounded-lg w-fit ${educationLevel === "College" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                    <GraduationCap size={20} />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-slate-900 block">College Student</span>
                    <span className="text-xs text-slate-500">Undergraduate & Postgrad</span>
                  </div>
                </button>
              </div>

              {/* School Fields */}
              {educationLevel === "School" ? (
                <div className="space-y-4 p-4 rounded-xl bg-slate-50/70 border border-slate-200/80">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                        Current Grade / Class
                      </label>
                      <select
                        name="gradeClass"
                        value={formData.gradeClass}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none bg-white"
                      >
                        {[...Array(12)].map((_, i) => (
                          <option key={i + 1} value={`Class ${i + 1}`}>
                            Class {i + 1}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                        Last Exam Percentage (%)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        name="percentage"
                        value={formData.percentage}
                        onChange={handleChange}
                        required
                        placeholder="e.g. 88.5"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none bg-white"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                /* College Fields */
                <div className="space-y-4 p-4 rounded-xl bg-slate-50/70 border border-slate-200/80">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                        Department / Stream
                      </label>
                      <select
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none bg-white"
                      >
                        <option value="Engineering">Engineering / Tech</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Medicine">Medicine & Healthcare</option>
                        <option value="Commerce">Commerce & Finance</option>
                        <option value="Arts">Arts & Humanities</option>
                        <option value="Science">Pure Science</option>
                        <option value="Law">Law & Legal</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                        Semester
                      </label>
                      <select
                        name="semester"
                        value={formData.semester}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none bg-white"
                      >
                        {["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8"].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                        Current CGPA (out of 10)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="10"
                        name="cgpa"
                        value={formData.cgpa}
                        onChange={handleChange}
                        required
                        placeholder="e.g. 8.45"
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-sm font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ArrowLeft size={16} />
                  <span>Back</span>
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="py-2.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm flex items-center gap-2 shadow-sm shadow-indigo-200 transition-all hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Saving Profile...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete & Launch Dashboard</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
