"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, ArrowRight, BookOpen, Briefcase, HeartPulse, Loader2, Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";

export default function LoginPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) {
      setError("Please fill in all fields");
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to log in");
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
    <div className="min-h-screen flex bg-background text-text-main transition-colors duration-250">
      {/* Left Side - Branding */}
      <div className="flex-1 bg-gradient-to-br from-indigo-700 via-indigo-800 to-indigo-950 text-white p-12 flex flex-col relative overflow-hidden hidden lg:flex">
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
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-900 transition-colors duration-250 relative">
        {/* Floating Theme Toggle in Top-Right */}
        <div className="absolute top-6 right-6">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={theme === 'dark' ? "Switch to Light Theme" : "Switch to Dark Theme"}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-amber-400 bg-slate-100/80 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
          >
            {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} className="text-indigo-600" />}
          </button>
        </div>

        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Welcome Back</h2>
            <p className="text-slate-500 dark:text-slate-400">Sign in to continue to There For You</p>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-300 p-3 rounded-lg text-sm border border-red-100 dark:border-red-900/60">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Student ID / Email</label>
              <input 
                type="text" 
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter your Student ID or Email"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded text-primary focus:ring-primary dark:bg-slate-800 dark:border-slate-700" defaultChecked />
                <span className="text-sm text-slate-600 dark:text-slate-400">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
                Forgot password?
              </Link>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-3.5 bg-slate-900 dark:bg-indigo-600 text-white rounded-xl font-medium hover:bg-slate-800 dark:hover:bg-indigo-700 transition-colors shadow-sm flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : "Sign In"}
            </button>
            
            <div className="text-center mt-6">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Don't have an account?{" "}
                <Link href="/register" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
          
          <p className="text-center text-sm text-slate-500 dark:text-slate-500 mt-8">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
