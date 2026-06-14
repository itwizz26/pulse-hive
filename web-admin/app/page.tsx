'use client';

import Link from 'next/link';

export default function LandingPage() {
    return (
        <div className="h-screen w-full bg-slate-950 text-white flex flex-col font-sans overflow-hidden">
            
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px]"></div>

            {/* HERO: Now includes the footer as the final element in the stack */}
            <main className="relative z-10 flex-grow w-full max-w-7xl mx-auto flex flex-col items-center justify-center text-center px-8">
                
                {/* Branding */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="relative w-6 h-6 flex items-center justify-center">
                         <div className="absolute inset-0 bg-indigo-500 rounded-full animate-ping opacity-40"></div>
                         <img src="/pulsehive-logo.svg" alt="Logo" className="relative z-10 w-full h-full" />
                    </div>
                    <span className="font-black text-lg tracking-tight text-white">
                        PulseHive<span className="text-indigo-500">.</span>
                    </span>
                </div>

                <h1 className="text-5xl font-black tracking-tighter max-w-2xl leading-[1.1] mb-6">
                    Automate your business reconciliation.
                </h1>
                <p className="text-lg text-slate-400 max-w-lg font-medium mb-10">
                    Automatically match customer payments with your bank deposits. Save time and gain total clarity on your cash flow.
                </p>
                
                <div className="flex gap-4 mb-16">
                    <Link 
                        href="/auth/register" 
                        className="px-8 py-3 bg-white text-slate-950 font-bold rounded-xl hover:bg-slate-200 transition-all active:scale-[0.98]"
                    >
                        Get Started
                    </Link>
                    <Link 
                        href="/auth/login" 
                        className="px-8 py-3 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-all active:scale-[0.98]"
                    >
                        My Workspaces
                    </Link>
                </div>

                {/* Footer now sits naturally below the buttons */}
                <div className="text-[10px] font-mono tracking-wider text-slate-600 uppercase">
                    PulseHive // Workspace Management Platform v1.0.0
                </div>
            </main>
        </div>
    );
}