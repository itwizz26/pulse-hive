'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { PulseHiveLogo } from '@/components/PulseHiveLogo';

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    
    // 1. Identify context
    const isAuthPage = pathname?.startsWith('/auth');
    const isDashboardRoute = ['/dashboard', '/orders', '/payments', '/reconciliation'].includes(pathname);
    
    // 2. Logic: Show public links if not on internal/auth pages
    const showPublicLinks = !isDashboardRoute && !isAuthPage;
    
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    // Dynamic Title Logic
    useEffect(() => {
        const ROUTE_TITLES: Record<string, string> = {
            '/': 'Automated Reconciliation',
            '/dashboard': 'Business Overview',
            '/orders': 'Customer Orders',
            '/payments': 'Money Coming In',
            '/reconciliation': 'Payment Matcher',
        };
        const pageTitle = ROUTE_TITLES[pathname] || 'Operational Console';
        document.title = `PulseHive // ${pageTitle}`;
    }, [pathname]);

    // 3. Auth pages get NO navbar
    if (isAuthPage) return null;

    return (
        <nav className="sticky top-0 z-50 w-full bg-slate-900/40 backdrop-blur-xl border-b border-white/[0.06] px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            {/* Logo */}
            <div className="relative z-10">
                <PulseHiveLogo />
            </div>
            
            {/* Navigation Tracks */}
            <ul className="hidden md:flex items-center gap-1 p-1 ml-auto mr-6">
                {showPublicLinks ? (
                    // Public Links (About, Pricing, Contact)
                    [
                        { name: 'About', path: '/about' },
                        { name: 'Pricing', path: '/pricing' },
                        { name: 'Contact', path: '/contact' },
                    ].map((tab) => (
                        <li key={tab.path}>
                            <Link href={tab.path} className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                                {tab.name}
                            </Link>
                        </li>
                    ))
                ) : (
                    // Internal Workspace Links
                    [
                        { name: 'Dashboard', path: '/dashboard' },
                        { name: 'Orders', path: '/orders' },
                        { name: 'Money In', path: '/payments' },
                        { name: 'Payment Matcher', path: '/reconciliation' },
                    ].map((tab) => (
                        <li key={tab.path}>
                            <Link href={tab.path} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${pathname === tab.path ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                                {tab.name}
                            </Link>
                        </li>
                    ))
                )}
            </ul>

            {/* Right Action */}
            {showPublicLinks ? (
                <Link href="/auth/login" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl transition-all">
                    Sign In
                </Link>
            ) : (
                <div className="relative py-2" onMouseEnter={() => setIsMenuOpen(true)} onMouseLeave={() => setIsMenuOpen(false)}>
                    <button className="w-9 h-9 rounded-full bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500">DM</button>
                    {isMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-slate-900/95 backdrop-blur-xl border border-white/[0.08] p-1.5 rounded-xl shadow-2xl animate-in fade-in slide-in-from-top-1">
                            {/* Restored Flyout Content */}
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
            )}
        </nav>
    );
}