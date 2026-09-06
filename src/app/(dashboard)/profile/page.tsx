"use client";

import { useEffect, useState } from "react";
import { 
  User, 
  Mail, 
  Hash, 
  GraduationCap, 
  Calendar, 
  Target, 
  Edit3, 
  Loader2, 
  Award, 
  DollarSign, 
  School,
  X,
  Check
} from "lucide-react";

export default function ProfilePage() {
  const [student, setStudent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: "",
    educationLevel: "College",
    gradeClass: "",
    percentage: "",
    department: "",
    semester: "",
    cgpa: "",
    age: "20",
    gender: "male",
    category: "General",
    annualIncomeLPA: "4.0",
    isDifferentlyAbled: false
  });

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setStudent(data.user);
          setEditForm({
            name: data.user.name || "",
            educationLevel: data.user.educationLevel || "College",
            gradeClass: data.user.gradeClass || "Class 10",
            percentage: data.user.percentage?.toString() || "",
            department: data.user.department || "Engineering",
            semester: data.user.semester || "S5",
            cgpa: data.user.cgpa?.toString() || "8.0",
            age: data.user.age?.toString() || "20",
            gender: data.user.gender || "male",
            category: data.user.category || "General",
            annualIncomeLPA: data.user.annualIncomeLPA?.toString() || "4.0",
            isDifferentlyAbled: data.user.isDifferentlyAbled || false
          });
        }
      }
    } catch (err) {
      console.error("Failed to load profile", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editForm,
          age: parseInt(editForm.age),
          annualIncomeLPA: parseFloat(editForm.annualIncomeLPA),
          percentage: editForm.percentage ? parseFloat(editForm.percentage) : null,
          cgpa: editForm.cgpa ? parseFloat(editForm.cgpa) : null
        })
      });

      if (res.ok) {
        const data = await res.json();
        setStudent(data.user);
        setIsEditing(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Failed to update profile", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 size={32} className="animate-spin text-indigo-600" />
      </div>
    );
  }

  const isSchool = student?.educationLevel === "School";

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Student Profile</h1>
          <p className="text-slate-500 mt-1">Manage and update your personal and academic information.</p>
        </div>

        {saveSuccess && (
          <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
            <Check size={16} /> Profile updated!
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Profile Header Background */}
        <div className="h-32 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 relative">
          <button 
            onClick={() => setIsEditing(true)}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-white text-xs font-semibold transition-colors backdrop-blur-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Edit3 size={14} /> Edit Profile
          </button>
        </div>
        
        {/* Avatar & Basic Info */}
        <div className="px-8 pb-8 relative">
          <div className="flex justify-between items-end -mt-12 mb-6">
            <div className="w-24 h-24 bg-white rounded-2xl p-1.5 shadow-md border border-slate-100">
              <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-3xl font-bold text-white shadow-inner">
                {student?.name ? student.name.charAt(0).toUpperCase() : "S"}
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
              {student?.educationLevel || "College"} Student
            </span>
          </div>
          
          <div className="space-y-1 mb-8">
            <h2 className="text-2xl font-bold text-slate-900">{student?.name || "Student"}</h2>
            <p className="text-slate-500 flex items-center gap-2 text-sm">
              <Mail size={16} /> {student?.email}
            </p>
          </div>
          
          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <InfoCard icon={<Hash size={18}/>} label="Student ID / Roll No" value={student?.studentId || "—"} />
            
            {isSchool ? (
              <>
                <InfoCard icon={<School size={18}/>} label="Class / Grade" value={student?.gradeClass || "Class 10"} />
                <InfoCard icon={<Award size={18}/>} label="Percentage" value={student?.percentage ? `${student.percentage}%` : "—"} />
              </>
            ) : (
              <>
                <InfoCard icon={<GraduationCap size={18}/>} label="Department" value={student?.department || "Engineering"} />
                <InfoCard icon={<Calendar size={18}/>} label="Current Semester" value={student?.semester || "S5"} />
                <InfoCard icon={<Award size={18}/>} label="Current CGPA" value={student?.cgpa ? `${student.cgpa} / 10` : "8.0"} />
              </>
            )}

            <InfoCard icon={<User size={18}/>} label="Demographics" value={`${student?.age || 20} yrs • ${student?.gender || "Male"}`} />
            <InfoCard icon={<Target size={18}/>} label="Social Category" value={student?.category || "General"} />
            <InfoCard icon={<DollarSign size={18}/>} label="Family Income" value={`₹${student?.annualIncomeLPA || 4.0} Lakhs/yr`} />
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <h3 className="text-lg font-bold text-slate-900">Edit Student Profile</h3>
              <button 
                onClick={() => setIsEditing(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Full Name</label>
                <input 
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Education Level</label>
                  <select
                    value={editForm.educationLevel}
                    onChange={(e) => setEditForm(prev => ({ ...prev, educationLevel: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 bg-white"
                  >
                    <option value="School">School</option>
                    <option value="College">College</option>
                  </select>
                </div>

                {editForm.educationLevel === "School" ? (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Grade / Class</label>
                    <input 
                      type="text"
                      placeholder="e.g. Class 10"
                      value={editForm.gradeClass}
                      onChange={(e) => setEditForm(prev => ({ ...prev, gradeClass: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Semester</label>
                    <input 
                      type="text"
                      placeholder="e.g. S5"
                      value={editForm.semester}
                      onChange={(e) => setEditForm(prev => ({ ...prev, semester: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900"
                    />
                  </div>
                )}
              </div>

              {editForm.educationLevel === "School" ? (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Percentage (%)</label>
                  <input 
                    type="number"
                    step="0.1"
                    placeholder="e.g. 88.5"
                    value={editForm.percentage}
                    onChange={(e) => setEditForm(prev => ({ ...prev, percentage: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Department</label>
                    <input 
                      type="text"
                      placeholder="e.g. Engineering"
                      value={editForm.department}
                      onChange={(e) => setEditForm(prev => ({ ...prev, department: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">CGPA (out of 10)</label>
                    <input 
                      type="number"
                      step="0.01"
                      placeholder="e.g. 8.4"
                      value={editForm.cgpa}
                      onChange={(e) => setEditForm(prev => ({ ...prev, cgpa: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Age</label>
                  <input 
                    type="number"
                    value={editForm.age}
                    onChange={(e) => setEditForm(prev => ({ ...prev, age: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Gender</label>
                  <select
                    value={editForm.gender}
                    onChange={(e) => setEditForm(prev => ({ ...prev, gender: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 bg-white"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Category</label>
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 bg-white"
                  >
                    <option value="General">General</option>
                    <option value="OBC">OBC</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                    <option value="EWS">EWS</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Income (LPA)</label>
                  <input 
                    type="number"
                    step="0.1"
                    value={editForm.annualIncomeLPA}
                    onChange={(e) => setEditForm(prev => ({ ...prev, annualIncomeLPA: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-70"
                >
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoCard({ icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl border border-slate-100 bg-slate-50/60">
      <div className="text-indigo-600 mt-0.5">{icon}</div>
      <div>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
        <p className="font-semibold text-slate-800 text-sm">{value}</p>
      </div>
    </div>
  );
}
