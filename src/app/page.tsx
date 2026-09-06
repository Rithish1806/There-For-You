"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, ArrowRight, BookOpen, Briefcase, HeartPulse, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
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

          <form className="space-y-5" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Student ID / Email</label>
              <input 
                type="text" 
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter your Student ID or Email"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded text-primary focus:ring-primary" defaultChecked />
                <span className="text-sm text-slate-600">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-sm text-primary hover:underline font-medium">
                Forgot password?
              </Link>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors shadow-sm flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : "Sign In"}
            </button>
            
            <div className="text-center mt-6">
              <p className="text-sm text-slate-600">
                Don't have an account?{" "}
                <Link href="/register" className="text-primary font-medium hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
          
          <p className="text-center text-sm text-slate-500 mt-8">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
