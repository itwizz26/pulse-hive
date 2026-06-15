'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PulseHiveLogo } from '@/components/PulseHiveLogo';

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleAuth = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="fixed inset-0 min-h-screen w-full flex bg-slate-950 overflow-hidden font-sans">
        
            {/* LEFT SIDE: Visual Brand Context */}
            <div className="relative hidden lg:flex lg:w-1/2 bg-slate-900 flex-col justify-between p-16 border-r border-white/5">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px]"></div>
                
                {/* Logo integrated here */}
                <div className="relative z-10">
                    <PulseHiveLogo />
                </div>

                <div className="relative z-10 space-y-6 max-w-md">
                    <h2 className="text-4xl font-black text-white tracking-tight leading-tight">
                        {isLogin ? "Welcome back to PulseHive." : "Start your journey."}
                    </h2>
                    <p className="text-base text-slate-400 leading-relaxed font-medium">
                        {isLogin 
                            ? "Sign in to access your business workspaces, reconciliation dashboards, and financial insights." 
                            : "Create your secure account to begin centralising your business cash flow and automated matching."}
                    </p>
                </div>
                
                {/* Footer Flag - Positioned at the bottom */}
                <div className="relative z-10 text-[10px] font-mono tracking-wider text-slate-600 uppercase">
                    Workspace Management Portal v1.0.0
                </div>
            </div>

            {/* RIGHT SIDE: Authentication Form */}
            <div className="w-full lg:w-1/2 min-h-screen flex flex-col pt-24 pb-16 px-6 sm:px-12 md:px-24 items-center overflow-y-auto bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
                
                <div className="w-full max-w-[440px] bg-slate-900/30 backdrop-blur-xl border border-white/[0.05] p-8 sm:p-10 rounded-3xl shadow-2xl">
                    
                    <div className="mb-8">
                        <h3 className="text-xl font-bold text-white tracking-tight">
                            {isLogin ? "Sign in to your account" : "Create your account"}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                            {isLogin ? "Don't have an account?" : "Already have an account?"} 
                            <button 
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-indigo-400 hover:text-indigo-300 font-semibold ml-1 transition-colors"
                            >
                                {isLogin ? "Register here" : "Sign in instead"}
                            </button>
                        </p>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Email Address</label>
                            <input 
                                type="email" required
                                className="w-full px-4 py-2.5 bg-slate-950/60 border border-white/10 text-sm rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                                placeholder="name@company.com"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Password</label>
                            <input 
                                type="password" required
                                className="w-full px-4 py-2.5 bg-slate-950/60 border border-white/10 text-sm rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full mt-4 px-5 py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 active:scale-[0.99] text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-950/50 transition-all flex items-center justify-center gap-2.5 disabled:opacity-60"
                        >
                            {isLoading ? "Authenticating..." : (isLogin ? "Sign In" : "Register Account")}
                        </button>

                        <div className="relative pt-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/[0.06]"></div>
                            </div>
                            <div className="relative flex justify-center text-[10px] uppercase">
                                <span className="bg-slate-900/50 px-2 text-slate-500 font-bold tracking-widest">Or continue with</span>
                            </div>
                        </div>

                        <button type="button" className="w-full mt-4 px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/5 text-white text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2">
                            <span>Continue with Google</span>
                        </button>

                        {/* Back to Home Link added below the buttons */}
                        <div className="pt-6 text-center">
                            <Link href="/" className="text-[10px] text-slate-500 hover:text-indigo-400 uppercase tracking-widest font-bold transition-colors">
                                ← Return to homepage
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}