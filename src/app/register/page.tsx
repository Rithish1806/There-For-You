"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [educationLevel, setEducationLevel] = useState("College");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    studentId: "",
    password: "",
    age: "20",
    gender: "male",
    category: "General",
    gradeClass: "",
    percentage: "",
    department: "",
    semester: "",
    cgpa: "",
    annualIncomeLPA: "4.0",
    isDifferentlyAbled: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, educationLevel }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="bg-primary p-8 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md mb-4 inline-flex">
              <Sparkles size={32} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Create Your Account</h2>
            <p className="text-indigo-100 max-w-md mx-auto">
              Join There For You to get AI-powered academic support and personalized scholarship matches.
            </p>
          </div>
        </div>

        <div className="p-8">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-6">
            {/* Section 1: Basic Info */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 border-b pb-2 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <input required name="name" value={formData.name} onChange={handleChange} type="text" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input required name="email" value={formData.email} onChange={handleChange} type="email" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Student ID / Roll No</label>
                  <input required name="studentId" value={formData.studentId} onChange={handleChange} type="text" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                  <input required name="password" value={formData.password} onChange={handleChange} type="password" minLength={6} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                </div>
              </div>
            </div>

            {/* Section 2: Demographics */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 border-b pb-2 mb-4">Demographics & Financials</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                  <input required name="age" value={formData.age} onChange={handleChange} type="number" min="10" max="100" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
                    <option value="General">General</option>
                    <option value="OBC">OBC</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Family Annual Income (LPA)</label>
                  <input required name="annualIncomeLPA" value={formData.annualIncomeLPA} onChange={handleChange} type="number" step="0.1" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                </div>
                <div className="md:col-span-2 flex items-center gap-2 mt-2">
                  <input type="checkbox" name="isDifferentlyAbled" id="pwd" checked={formData.isDifferentlyAbled} onChange={handleChange} className="w-4 h-4 text-primary rounded" />
                  <label htmlFor="pwd" className="text-sm text-slate-700">I am differently abled (PwD)</label>
                </div>
              </div>
            </div>

            {/* Section 3: Academics */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 border-b pb-2 mb-4">Academics</h3>
              
              <div className="mb-4 flex p-1 bg-slate-100 rounded-lg w-full max-w-xs">
                <button
                  type="button"
                  onClick={() => setEducationLevel("School")}
                  className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${educationLevel === "School" ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                  School Student
                </button>
                <button
                  type="button"
                  onClick={() => setEducationLevel("College")}
                  className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${educationLevel === "College" ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                  College Student
                </button>
              </div>

              {educationLevel === "School" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Grade / Class</label>
                    <select required name="gradeClass" value={formData.gradeClass} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
                      <option value="">Select Class</option>
                      {Array.from({length: 12}, (_, i) => i + 1).map(num => (
                        <option key={num} value={`${num}th`}>{num}th Grade</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Last Exam Percentage (%)</label>
                    <input required name="percentage" value={formData.percentage} onChange={handleChange} type="number" step="0.1" max="100" placeholder="e.g. 85.5" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Department / Stream</label>
                    <input required name="department" value={formData.department} onChange={handleChange} type="text" placeholder="e.g. Computer Science" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Current Semester</label>
                    <select required name="semester" value={formData.semester} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
                      <option value="">Select Sem</option>
                      {Array.from({length: 10}, (_, i) => i + 1).map(num => (
                        <option key={num} value={`S${num}`}>Semester {num}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Current CGPA</label>
                    <input required name="cgpa" value={formData.cgpa} onChange={handleChange} type="number" step="0.01" max="10" placeholder="e.g. 8.5" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary-dark transition-colors shadow-md flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader2 size={24} className="animate-spin" /> : "Create Account"}
              </button>
            </div>
            
            <p className="text-center text-sm text-slate-600 mt-6">
              Already have an account?{" "}
              <Link href="/" className="text-primary font-bold hover:underline">
                Sign in here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
