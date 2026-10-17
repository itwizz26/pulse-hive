'use client';

import Link from 'next/link';

export default function LandingPage() {
    return (
        <div className="fixed inset-0 z-0 flex h-dvh w-full flex-col overflow-hidden bg-slate-950 font-sans text-white">
            {/* Background Grid */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-size-[32px_32px]"></div>

            {/* Centered Hero */}
            <main className="relative z-10 mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col items-center justify-center px-6 py-8 text-center sm:px-8">
                <h1 className="mb-6 max-w-2xl text-4xl font-black leading-[1.1] tracking-tighter sm:text-5xl">
                    Automate your business reconciliation.
                </h1>

                <p className="mb-10 max-w-lg text-base font-medium text-slate-400 sm:text-lg">
                    Automatically match customer payments with your bank deposits. Save time and gain total clarity on your cash flow.
                </p>

                <div className="mb-12 flex flex-wrap justify-center gap-4">
                    <Link
                        href="/"
                        className="w-40 rounded-xl bg-white px-8 py-3 text-center font-bold text-slate-950 transition-all hover:bg-slate-200 active:scale-[0.98]"
                    >
                        Demo
                    </Link>

                    <Link
                        href="/auth/login"
                        className="w-40 rounded-xl border border-white/10 bg-white/5 px-8 py-3 text-center font-bold text-white transition-all hover:bg-white/10 active:scale-[0.98]"
                    >
                        Workspace
                    </Link>
                </div>

                <div className="font-mono text-[10px] uppercase tracking-wider text-slate-600">
                    Workspace Management Portal v1.0.0
                </div>
            </main>
        </div>
    );
}
