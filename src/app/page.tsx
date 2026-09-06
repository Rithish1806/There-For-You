"use client";

import Link from "next/link";
import { Sparkles, ArrowRight, BookOpen, Briefcase, HeartPulse } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="flex-1 bg-primary text-white p-12 flex flex-col relative overflow-hidden hidden lg:flex">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute top-32 -right-32 w-96 h-96 bg-secondary/30 rounded-full blur-3xl"></div>
        
        <div className="flex items-center gap-3 relative z-10">
          <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
            <Sparkles size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">There For You</h1>
        </div>

        <div className="mt-auto mb-32 relative z-10 max-w-lg">
          <h2 className="text-5xl font-bold leading-tight mb-6">
            Your entire student journey,<br/>powered by AI.
          </h2>
          <p className="text-xl text-indigo-100 mb-12">
            Academic support, career guidance, scholarships and well-being — all in one unified platform.
          </p>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-center gap-3 text-indigo-100">
              <div className="p-2 bg-white/10 rounded-lg"><BookOpen size={20}/></div>
              <span>Academic Companion</span>
            </div>
            <div className="flex items-center gap-3 text-indigo-100">
              <div className="p-2 bg-white/10 rounded-lg"><Briefcase size={20}/></div>
              <span>Career & Placement</span>
            </div>
            <div className="flex items-center gap-3 text-indigo-100">
              <div className="p-2 bg-white/10 rounded-lg"><HeartPulse size={20}/></div>
              <span>Wellness Support</span>
            </div>
            <div className="flex items-center gap-3 text-indigo-100">
              <div className="p-2 bg-white/10 rounded-lg"><Sparkles size={20}/></div>
              <span>AI Recommendations</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-surface">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h2>
            <p className="text-slate-500">Sign in to continue to There For You</p>
          </div>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Student ID / Email</label>
              <input 
                type="text" 
                defaultValue="7376242AL195"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input 
                type="password" 
                defaultValue="password123"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded text-primary focus:ring-primary" defaultChecked />
                <span className="text-sm text-slate-600">Remember me</span>
              </label>
              <a href="#" className="text-sm text-primary hover:underline font-medium">Forgot password?</a>
            </div>

            <button className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors shadow-sm">
              Sign In
            </button>
            
            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink-0 mx-4 text-slate-400 text-sm">Or</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <Link href="/dashboard" className="w-full py-3.5 bg-indigo-50 text-indigo-700 rounded-xl font-medium hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2">
              Continue as Demo Student
              <ArrowRight size={18} />
            </Link>
          </form>
          
          <p className="text-center text-sm text-slate-500 mt-8">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
