import React from 'react';
import Link from 'next/link';

// 1. Keep this a pure Server Component (No 'use client') so Next.js can pre-render it cleanly
export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[75vh] px-6 text-center">
        {/* Visual Diagnostic Alert Node */}
        <div className="relative mb-6 flex items-center justify-center">
            <div className="absolute inset-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl animate-pulse"></div>
            <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-center text-2xl font-bold text-indigo-600">
            404
            </div>
        </div>

        {/* Text Hierarchy */}
        <div className="max-w-md mb-8">
            <div className="text-xs font-bold uppercase text-indigo-600 tracking-widest mb-2">
            Routing Exception Detected
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-3">
            Node Out of Bounds
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed">
            The requested system pathway does not contain an active endpoint. The page may have shifted locations during optimization layers.
            </p>
        </div>

        {/* Action Navigation Matrix */}
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs sm:max-w-none justify-center">
            <Link 
            href="/dashboard"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-sm font-semibold rounded-lg shadow-sm transition-all inline-flex items-center justify-center gap-2"
            >
            <span>⚡</span> Return to Core Dashboard
            </Link>
            <Link 
            href="/"
            className="px-5 py-2.5 bg-white hover:bg-slate-50 active:scale-[0.98] text-slate-700 border border-slate-200 text-sm font-semibold rounded-lg shadow-sm transition-all inline-flex items-center justify-center"
            >
            Go to Home
            </Link>
        </div>

        {/* Clean System Footer Identity */}
        <div className="mt-16 text-[11px] font-mono tracking-wider text-slate-400 uppercase">
            System Status: Online // Diagnostics Node: PH-ERR-404
        </div>
        </div>
    );
}