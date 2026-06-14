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
      setError('Invalid system access tokens provided.');
      setIsSubmitting(false);
      return;
    }

    setTimeout(() => {
      router.push('/dashboard');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 min-h-screen w-full flex bg-slate-950 overflow-hidden font-sans">
      
      {/* LEFT SIDE: Premium Cinematic Brand Canvas (Hidden on mobile) */}
      <div className="relative hidden lg:flex lg:w-1/2 bg-slate-900 items-center justify-center p-12 overflow-hidden border-r border-white/5">
        {/* Deep Ambient Neon Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px]"></div>
        
        {/* Subtle Tech Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px]"></div>

        <div className="relative z-10 max-w-lg text-left">
          <div className="flex items-center gap-3 mb-8">
            <img src="/pulsehive-logo.svg" alt="Logo" className="w-9 h-9 object-contain" />
            <span className="text-xl font-black tracking-tight text-white">
              PulseHive<span className="text-indigo-500">.</span>
            </span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white leading-tight mb-4">
            High-Velocity Telemetry & <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400">
              Ledger Reconciliation
            </span>
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed font-medium">
            Streamlining data streams, payment matching matrices, and operational visibility inside a single high-performance dashboard hub.
          </p>
          
          <div className="mt-12 flex items-center gap-6 border-t border-white/10 pt-8 text-[11px] font-mono tracking-wider text-slate-500 uppercase">
            <div>Engine // v2.4.0</div>
            <div>Cluster // ZA-JHB-01</div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Polished Form Viewport Container */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-20 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative">
        {/* Ambient mobile glow overlay */}
        <div className="absolute inset-0 lg:hidden bg-indigo-600/5 blur-[100px] pointer-events-none"></div>

        {/* Increased Width Core Login Panel */}
        <div className="w-full max-w-md space-y-8 bg-slate-900/40 backdrop-blur-xl border border-white/[0.06] p-8 sm:p-10 rounded-2xl shadow-2xl relative z-10">
          
          {/* Header Mobile Brand Identity */}
          <div>
            <div className="flex lg:hidden justify-center mb-4">
              <img src="/pulsehive-logo.svg" alt="Logo" className="w-10 h-10 object-contain" />
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-white text-center lg:text-left">
              System Authentication
            </h2>
            <p className="mt-1.5 text-xs text-slate-400 font-semibold tracking-wider uppercase text-center lg:text-left flex items-center justify-center lg:justify-start gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
              Secure Infrastructure Node
            </p>
          </div>

          {/* Dynamic Error Status Hub */}
          {error && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs font-semibold text-rose-400 flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          {/* Input Grid Area */}
          <form className="space-y-5" onSubmit={handleMockLogin}>
            <div className="space-y-2">
              <label htmlFor="email-address" className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
                Corporate Email Address
              </label>
              <input
                id="email-address"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                placeholder="operator@pulsehive.co.za"
                className="w-full px-4 py-3 bg-slate-950/60 border border-white/10 text-sm rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
                  Secure Access Password
                </label>
                <a href="#" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                  Recovery Mode
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
              className="w-full mt-4 px-5 py-3.5 bg-linear-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 active:scale-[0.99] text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-950/50 transition-all flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span className="font-medium tracking-wide">Authorizing Cryptographic Session...</span>
                </>
              ) : (
                <>
                  <span>Initialize Session</span>
                  <span className="text-indigo-200">→</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Minimal Bottom Brand Attribution */}
        <div className="absolute bottom-6 text-[10px] font-mono tracking-widest text-slate-600 uppercase">
          Secured by PulseHive Encryption Architecture
        </div>
      </div>

    </div>
  );
}