'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PulseHiveLogo } from '@/components/PulseHiveLogo';
import { apiCall } from '@/lib/api-client';
import { AuthResponse } from '@/types/auth';

export default function LoginPage() {
    const router = useRouter();
    
    // State management
    const [isLogin, setIsLogin] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    // Authentication Logic
    const handleAuth = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        try {
            // Inside handleAuth
            if (isLogin) {
                // Pass 'true' for public page
                const response = await apiCall<AuthResponse>('/auth/signin', { 
                    method: 'POST',
                    body: JSON.stringify({ email, password }) 
                }, true); 
                
                localStorage.setItem('token', response.accessToken);
                router.push('/dashboard');
            } else {
                // 1. Register process
                await apiCall<AuthResponse>('/auth/signup', {
                    method: 'POST',
                    body: JSON.stringify({ email, password }) 
                }, true); 
                
                // 2. Set "Success" message to provide feedback
                setMessage({ 
                    type: 'success', 
                    text: "Account created! Now configuring your workspace..." 
                });

                // 3. Add a deliberate delay so they can read the message
                await new Promise(resolve => setTimeout(resolve, 4000));

                // 4. Log them in to get the token
                const loginResponse = await apiCall<AuthResponse>('/auth/signin', { 
                    method: 'POST',
                    body: JSON.stringify({ email, password }) 
                }, true);
                
                localStorage.setItem('token', loginResponse.accessToken);
                localStorage.setItem('userEmail', email);
                
                // 5. Final redirect
                router.push('/auth/onboarding');
            }
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 min-h-screen w-full flex bg-slate-950 overflow-hidden font-sans">

            {/* LEFT SIDE: Visual Brand Context */}
            <div className="relative hidden lg:flex lg:w-1/2 bg-slate-900 flex-col justify-between p-16 border-r border-white/5">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-size-[32px_32px]"></div>
                
                <div className="relative z-10"><PulseHiveLogo /></div>

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
                
                <div className="relative z-10 text-[10px] font-mono tracking-wider text-slate-600 uppercase">
                    Workspace Management Portal v1.0.0
                </div>
            </div>

            {/* RIGHT SIDE: Authentication Form */}
            <div className="w-full lg:w-1/2 min-h-screen grid place-items-center bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 overflow-y-auto">
                
                <div className="w-full max-w-110 bg-slate-900/30 backdrop-blur-xl border border-white/5 p-8 sm:p-10 rounded-3xl shadow-2xl m-6">
                    
                    <div className="mb-8">
                        <h3 className="text-xl font-bold text-white tracking-tight">
                            {isLogin ? "Sign in to your account" : "Create your account"}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                            {isLogin ? "Don't have an account?" : "Already have an account?"} 
                            <button 
                                type="button"
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-indigo-400 hover:text-indigo-300 font-semibold ml-1 transition-colors"
                            >
                                {isLogin ? "Sign up here" : "Sign in instead"}
                            </button>
                        </p>
                    </div>

                    {message && (
                        <div className={`mb-6 p-4 rounded-xl text-xs font-medium ${message.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleAuth} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Email Address</label>
                            <input 
                                type="email" 
                                required 
                                autoComplete="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2.5 bg-slate-950/60 border border-white/10 text-sm rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                                placeholder="name@company.com"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Password</label>
                            <input 
                                type="password" 
                                required 
                                autoComplete={isLogin ? "current-password" : "new-password"} 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2.5 bg-slate-950/60 border border-white/10 text-sm rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit" 
                            disabled={isLoading}
                            className="w-full mt-4 px-5 py-3.5 bg-linear-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 active:scale-[0.99] text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-950/50 transition-all flex items-center justify-center gap-2.5 disabled:opacity-60"
                        >
                            {isLoading ? (isLogin ? "Authenticating..." : "Registering...") : (isLogin ? "Sign In" : "Sign Up")}
                        </button>

                        <div className="relative pt-6 flex items-center">
                            <div className="grow border-t border-white/6"></div>
                            <span className="shrink-0 mx-4 text-[10px] uppercase text-slate-500 font-bold tracking-widest">Or</span>
                            <div className="grow border-t border-white/6"></div>
                        </div>

                        <button 
                            type="button" 
                            className="w-full mt-4 px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/5 text-white text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-3"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                                <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.9c1.908 0 3.616.716 4.95 1.884l3.655-3.655C17.95 1.543 15.257 0 12 0 7.382 0 3.42 2.592 1.346 6.368l3.92 3.397z"/>
                                <path fill="#34A853" d="M23.64 12.27c0-.79-.07-1.55-.2-2.27H12v4.45h6.45c-.27 1.45-1.1 2.68-2.3 3.48l3.35 2.6c1.96-1.8 3.14-4.45 3.14-7.66z"/>
                                <path fill="#4A90E2" d="M12 24c3.24 0 5.96-1.07 7.94-2.9l-3.35-2.6c-1.12.75-2.55 1.2-4.59 1.2-3.53 0-6.52-2.39-7.58-5.6l-3.92 3.39C3.42 21.408 7.382 24 12 24z"/>
                                <path fill="#FBBC05" d="M4.42 14.54c-.27-.8-.42-1.65-.42-2.54s.15-1.74.42-2.54l-3.92-3.4C.48 7.54 0 9.7 0 12c0 2.3.48 4.46 1.34 6.46l3.08-2.92z"/>
                            </svg>
                            <span>Continue with Google</span>
                        </button>

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