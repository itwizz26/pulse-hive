'use client';

import React from 'react';
import Link from 'next/link';
import BackButton from '@/components/BackButton';

export default function NotFound() {
    const isAuthenticated = false;

    return (
        <div className="fixed inset-0 z-0 flex h-dvh w-full flex-col items-center justify-center overflow-hidden bg-slate-950 px-6 pb-6 pt-20 text-center font-sans text-white selection:bg-indigo-500/30">
            {/* Ambient background glows */}
            <div
                className="pointer-events-none absolute inset-0 overflow-hidden"
                aria-hidden="true"
            >
                <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />
                <div className="absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl" />
            </div>

            {/* Subtle grid overlay */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.04]"
                aria-hidden="true"
                style={{
                    backgroundImage:
                        'linear-gradient(rgba(148, 163, 184, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.5) 1px, transparent 1px)',
                    backgroundSize: '32px 32px',
                }}
            />

            {/* 404 content */}
            <div className="relative z-10 flex max-w-full flex-col items-center">
                {/* Error Badge */}
                <div className="relative mb-8 flex shrink-0 items-center justify-center">
                    <div className="absolute h-28 w-28 animate-pulse rounded-full bg-indigo-600/20 blur-2xl" />

                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-slate-900 text-3xl font-black text-indigo-400 shadow-xl backdrop-blur-md">
                        404
                    </div>
                </div>

                {/* Error Message */}
                <div className="mb-8 max-w-md space-y-3">
                    <div className="text-[11px] font-bold uppercase tracking-widest text-indigo-400">
                        Page Not Found
                    </div>

                    <h1 className="text-3xl font-extrabold tracking-tight text-white">
                        Let's get you back on track
                    </h1>

                    <p className="text-sm font-medium leading-relaxed text-slate-400">
                        The link you clicked might be broken, or the page may
                        have moved. Use the buttons below to head back to your
                        workspace or home.
                    </p>
                </div>

                {/* Navigation Actions */}
                <div className="flex w-full max-w-xs flex-col items-center justify-center gap-3 sm:max-w-none sm:flex-row">
                    {isAuthenticated ? (
                        <Link
                            href="/dashboard"
                            className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-linear-to-r from-indigo-600 to-indigo-500 px-5 text-sm font-semibold text-white shadow-md shadow-indigo-950/50 transition-all hover:from-indigo-500 hover:to-indigo-600 active:scale-[0.98] sm:w-52"
                        >
                            Return to Dashboard
                        </Link>
                    ) : (
                        <Link
                            href="/"
                            className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-linear-to-r from-indigo-600 to-indigo-500 px-5 text-sm font-semibold text-white shadow-md shadow-indigo-950/50 transition-all hover:from-indigo-500 hover:to-indigo-600 active:scale-[0.98] sm:w-52"
                        >
                            Return to Homepage
                        </Link>
                    )}

                    <div className="h-11 w-full sm:w-52 [&_a]:!flex [&_a]:!h-11 [&_a]:!w-full [&_a]:!items-center [&_a]:!justify-center [&_button]:!h-11 [&_button]:!w-full">
                        <BackButton />
                    </div>
                </div>

                {/* System Footer */}
                <div className="mt-10 font-mono text-[10px] uppercase tracking-widest text-slate-600">
                    Error Reference Code 404
                </div>
            </div>
        </div>
    );
}
