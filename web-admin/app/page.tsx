'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
	const router = useRouter();
	
	// Local state for tracking credentials and UI interaction
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [error, setError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

	const handleMockLogin = (e: React.FormEvent<HTMLFormElement>) => {
	  e.preventDefault();
	  setError(null);
	  setIsSubmitting(true);

	  // Basic client-side validation guard
	  if (!email || !password) {
		setError('Please provide valid access credentials.');
		setIsSubmitting(false);
		return;
	  }

	  // Mimic API telemetry response delay
	  setTimeout(() => {
		// Direct routing push to the unified dashboard layout track
		router.push('/dashboard');
	  }, 1200);
	};

	return (
	  <div className="flex min-h-[80vh] items-center justify-center px-4 sm:px-6 lg:px-8">
		<div className="w-full max-w-sm space-y-8 bg-white border border-slate-200/80 p-8 rounded-2xl shadow-sm">
		  
		  {/* Brand Header Architecture */}
		  <div className="text-center">
			<div className="flex justify-center mb-4">
			  <div className="relative flex items-center justify-center">
				<div className="absolute inset-0 w-12 h-12 bg-indigo-500/10 rounded-full blur-md animate-pulse"></div>
				<img 
				  src="/pulsehive-logo.svg" 
				  alt="PulseHive Logo" 
				  className="w-10 h-10 object-contain relative z-10" 
				/>
			  </div>
			</div>
			<h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
			  Welcome back
			</h2>
			<p className="mt-1 text-xs text-slate-500 font-medium tracking-wide uppercase">
			  Enterprise Ledger Access
			</p>
		  </div>

		  {/* Dynamic Error Banner Notification */}
		  {error && (
			<div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs font-semibold text-rose-600 flex items-center gap-2 animate-shake">
			  <span>⚠️</span> {error}
			</div>
		  )}

		  {/* Authentication Input Form Grid */}
		  <form className="mt-8 space-y-4" onSubmit={handleMockLogin}>
			<div className="space-y-1">
			  <label htmlFor="email-address" className="text-xs font-bold text-slate-700 tracking-wide uppercase">
				Corporate Email Address
			  </label>
			  <input
				id="email-address"
				name="email"
				type="email"
				autoComplete="email"
				required
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				disabled={isSubmitting}
				placeholder="operator@pulsehive.co.za"
				className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-sm rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all disabled:opacity-60"
			  />
			</div>

			<div className="space-y-1">
			  <div className="flex justify-between items-center">
				<label htmlFor="password" className="text-xs font-bold text-slate-700 tracking-wide uppercase">
				  Secure Password
				</label>
				<a href="#" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
				  Forgot password?
				</a>
			  </div>
			  <input
				id="password"
				name="password"
				type="password"
				autoComplete="current-password"
				required
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				disabled={isSubmitting}
				placeholder="••••••••••••"
				className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-sm rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all disabled:opacity-60"
			  />
			</div>

			{/* Action Trigger Interface Button */}
			<button
			  type="submit"
			  disabled={isSubmitting}
			  className="w-full mt-6 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white text-sm font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100"
			>
			  {isSubmitting ? (
				<>
				  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
					<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
					<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
				  </svg>
				  <span>Synchronizing Session...</span>
				</>
			  ) : (
				<>
				  <span>Secure Sign In</span>
				  <span>→</span>
				</>
			  )}
			</button>
		  </form>
		  
		</div>
	  </div>
	);
}
