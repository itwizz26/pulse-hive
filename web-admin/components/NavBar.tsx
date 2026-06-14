'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

// Centralized Document Title Registry Map
const ROUTE_TITLES: Record<string, string> = {
    '/': 'Sign In',
    '/dashboard': 'Business Overview',
    '/orders': 'Customer Orders',
    '/payments': 'Money Coming In',
    '/reconciliation': 'Payment Matcher',
};

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const isLoginPage = pathname === '/';
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    // Watch the active browser routing tracks and set document titles dynamically
    useEffect(() => {
        const pageTitle = ROUTE_TITLES[pathname] || 'Operational Console';
        document.title = `${pageTitle} // PulseHive`;
    }, [pathname]);

    if (isLoginPage) return null;

    return (
        <nav className="sticky top-0 z-50 w-full bg-slate-900/40 backdrop-blur-xl border-b border-white/[0.06] px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            
            {/* Left Brand Container */}
            <div className="flex items-center gap-3 shrink-0">
                <div className="relative w-6 h-6 flex items-center justify-center">
                    <div className="absolute inset-0 bg-indigo-500 rounded-full animate-ping opacity-40"></div>
                    <img 
                        src="/pulsehive-logo.svg" 
                        alt="Logo" 
                        className="relative z-10 w-full h-full" 
                    />
                </div>
                <span className="font-black text-lg tracking-tight text-white">
                    PulseHive<span className="text-indigo-500">.</span>
                </span>
            </div>
            
            {/* Navigation Tracks Aligned to Right Side */}
            <ul className="hidden md:flex items-center gap-1 p-1 ml-auto mr-6">
                {[
                    { name: 'Dashboard', path: '/dashboard' },
                    { name: 'Orders', path: '/orders' },
                    { name: 'Money In', path: '/payments' },
                    { name: 'Payment Matcher', path: '/reconciliation' },
                ].map((tab) => {
                    const isActive = pathname === tab.path;
                    return (
                        <li key={tab.path}>
                            <Link 
                                href={tab.path} 
                                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                                    isActive 
                                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/40' 
                                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                {tab.name}
                            </Link>
                        </li>
                    );
                })}
            </ul>

            {/* Profile Action Flyout triggered on Mouse Hover */}
            <div 
                className="relative py-2"
                onMouseEnter={() => setIsMenuOpen(true)}
                onMouseLeave={() => setIsMenuOpen(false)}
            >
                <button 
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shadow-md transition-all ${
                        isMenuOpen 
                            ? 'bg-rose-600 text-white ring-2 ring-rose-500/30' 
                            : 'bg-indigo-600 text-white hover:bg-indigo-500'
                    }`}
                >
                    DM
                </button>
                
                {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-slate-900/95 backdrop-blur-xl border border-white/[0.08] p-1.5 rounded-xl shadow-2xl animate-in fade-in slide-in-from-top-1 duration-150">
                        <div className="px-3 py-2 border-b border-white/[0.05] mb-1">
                            <p className="text-xs font-bold text-white">Daniel Mathebula</p>
                            <p className="text-[10px] text-slate-500 font-mono mt-0.5">Administrator</p>
                        </div>
                        <button 
                            onClick={() => router.push('/')} 
                            className="w-full text-left px-3 py-2 hover:bg-rose-500/10 text-rose-400 hover:text-rose-300 rounded-lg text-xs font-bold transition-colors flex items-center justify-between group"
                        >
                            <span>Sign Out Session</span>
                            <span className="transition-transform duration-150 group-hover:translate-x-0.5">→</span>
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}