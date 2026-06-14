'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleMockLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        if (!email || !password) {
            setError('Please check your login details and try again.');
            setIsSubmitting(false);
            return;
        }

        setTimeout(() => {
            router.push('/dashboard');
        }, 1200);
    };

    const handleGoogleLogin = () => {
        setIsSubmitting(true);
        setTimeout(() => {
            router.push('/dashboard');
        }, 1000);
    };

    const handleRegisterRedirect = () => {
        // TODO: Map to your actual registration flow or portal setup wizard
        router.push('/register');
    };

    return (
        <div className="fixed inset-0 min-h-screen w-full flex bg-slate-950 overflow-hidden font-sans">
        
            {/* LEFT SIDE: Professional Cinematic Brand Canvas (Hidden on mobile) */}
            <div className="relative hidden lg:flex lg:w-1/2 bg-slate-900 items-center justify-center p-12 overflow-hidden border-r border-white/5">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px]"></div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px]"></div>

                <div className="relative z-10 max-w-lg text-left">
                    <div className="flex items-center gap-3 mb-8">
                        <img src="/pulsehive-logo.svg" alt="Logo" className="w-9 h-9 object-contain" />
                        <span className="text-xl font-black tracking-tight text-white">
                            PulseHive<span className="text-indigo-500">.</span>
                        </span>
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-white leading-tight mb-4">
                        Smart Order Management & <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400">
                            Payment Reconciliation
                        </span>
                    </h1>
                    <p className="text-sm text-slate-400 leading-relaxed font-medium">
                        Seamlessly track your customer orders, verify bank deposits automatically, and gain clear visibility into your business cash flow from a single elegant portal.
                    </p>
                    
                    <div className="mt-12 flex items-center gap-6 border-t border-white/10 pt-8 text-[11px] font-mono tracking-wider text-slate-500 uppercase">
                        <div>Portal // v2.4.0</div>
                        <div>Region // South Africa</div>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE: Polished Form Viewport Container */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-20 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative">
                <div className="absolute inset-0 lg:hidden bg-indigo-600/5 blur-[100px] pointer-events-none"></div>

                {/* Core Login Panel */}
                <div className="w-full max-w-md space-y-7 bg-slate-900/40 backdrop-blur-xl border border-white/[0.06] p-8 sm:p-10 rounded-2xl shadow-2xl relative z-10">
                
                    {/* Header Brand Identity & Contextual Register Action */}
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <div className="flex lg:hidden mb-3">
                                <img src="/pulsehive-logo.svg" alt="Logo" className="w-8 h-8 object-contain" />
                            </div>
                            <h2 className="text-2xl font-extrabold tracking-tight text-white">
                                Sign In
                            </h2>
                            <p className="mt-1 text-xs text-slate-400 font-semibold tracking-wider uppercase flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                Secure Environment
                            </p>
                        </div>
                        
                        {/* Elegant Minimalist Registration Action */}
                        <div className="text-right pt-1">
                            <span className="block text-[11px] text-slate-500 font-medium mb-1">New enterprise?</span>
                            <button
                                type="button"
                                onClick={handleRegisterRedirect}
                                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors border border-indigo-500/20 bg-indigo-500/5 px-2.5 py-1 rounded-lg hover:bg-indigo-500/10 active:scale-[0.97]"
                            >
                                Register Business
                            </button>
                        </div>
                    </div>

                    {/* Dynamic Error Status Hub */}
                    {error && (
                        <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs font-semibold text-rose-400 flex items-center gap-2">
                            <span>⚠️</span> {error}
                        </div>
                    )}

                    {/* Minimalist Google Authentication Trigger */}
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={isSubmitting}
                        className="w-full py-3 px-4 bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 text-slate-200 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-[0.99]"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                        </svg>
                        <span>Continue with Google</span>
                    </button>

                    {/* Structural Modern Divider */}
                    <div className="flex items-center my-2">
                        <div className="flex-1 border-t border-white/[0.06]"></div>
                        <span className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-transparent">
                            or use email
                        </span>
                        <div className="flex-1 border-t border-white/[0.06]"></div>
                    </div>

                    {/* Email Input Grid Area */}
                    <form className="space-y-4" onSubmit={handleMockLogin}>
                        <div className="space-y-2">
                            <label htmlFor="email-address" className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
                                Registered Email Address
                            </label>
                            <input
                                id="email-address"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isSubmitting}
                                placeholder="name@yourbusiness.co.za"
                                className="w-full px-4 py-3 bg-slate-950/60 border border-white/10 text-sm rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all disabled:opacity-50"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label htmlFor="password" className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
                                    Account Password
                                </label>
                                <a href="#" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                                    Forgot Password?
                                </a>
                            </div>
                            <input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isSubmitting}
                                placeholder="••••••••••••"
                                className="w-full px-4 py-3 bg-slate-950/60 border border-white/10 text-sm rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all disabled:opacity-50"
                            />
                        </div>

                        {/* Action Trigger Block */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full mt-2 px-5 py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 active:scale-[0.99] text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-950/50 transition-all flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    <span className="font-medium tracking-wide">Securing connection...</span>
                                </>
                            ) : (
                                <>
                                    <span>Sign In to Dashboard</span>
                                    <span className="text-indigo-200">→</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Minimal Bottom Brand Attribution */}
                <div className="absolute bottom-6 text-[10px] font-mono tracking-widest text-slate-600 uppercase">
                    Protected by PulseHive Secured Infrastructure
                </div>
            </div>

        </div>
    );
}