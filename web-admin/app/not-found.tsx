'use client';

import React from 'react';
import Link from 'next/link';
import BackButton from '@/components/BackButton';

export default function NotFound() {
    // In a production environment, you would replace this with a real session check
    // e.g., const { status } = useSession(); 
    const isAuthenticated = false; 

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center bg-slate-950 text-white font-sans selection:bg-indigo-500/30">
            
            {/* Elegant Error Badge */}
            <div className="relative mb-8 flex items-center justify-center">
                <div className="absolute inset-0 w-28 h-28 bg-indigo-600/20 rounded-full blur-2xl animate-pulse"></div>
                <div className="w-20 h-20 rounded-2xl bg-slate-900 border border-white/10 shadow-xl flex items-center justify-center text-3xl font-black text-indigo-400 backdrop-blur-md">
                    404
                </div>
            </div>

            {/* Clear, Everyday Language Copy */}
            <div className="max-w-md mb-8 space-y-3">
                <div className="text-[11px] font-bold uppercase text-indigo-400 tracking-widest">
                    Page Not Found
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight text-white">
                    Let's get you back on track
                </h1>
                <p className="text-sm text-slate-400 leading-relaxed font-medium">
                    The link you clicked might be broken, or the page may have moved. Use the buttons below to head back to your workspace or home.
                </p>
            </div>

            {/* Modern Navigation Actions */}
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs sm:max-w-none justify-center items-center">
                {isAuthenticated ? (
                    <Link 
                        href="/dashboard"
                        className="w-full sm:w-auto px-5 py-2.5 bg-linear-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 active:scale-[0.98] text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-950/50 transition-all inline-flex items-center justify-center gap-2"
                    >
                        Return to Dashboard
                    </Link>
                ) : (
                    <Link 
                        href="/"
                        className="w-full sm:w-auto px-5 py-2.5 bg-linear-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 active:scale-[0.98] text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-950/50 transition-all inline-flex items-center justify-center gap-2"
                    >
                        Return to Homepage
                    </Link>
                )}
                
                {/* Secondary Go Back Action */}
                <div className="w-full sm:w-auto">
                    <BackButton />
                </div>
            </div>

            {/* Clean System Footer */}
            <div className="mt-20 text-[10px] font-mono tracking-widest text-slate-600 uppercase">
                Error Reference Code 404
            </div>
        </div>
    );
}