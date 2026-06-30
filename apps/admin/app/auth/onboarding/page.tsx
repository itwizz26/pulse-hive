'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PulseHiveLogo } from '@/components/PulseHiveLogo';
import { RegistrationData } from '@/types/onboarding';
import { apiCall } from '@/lib/api-client';
import { useAuthGuard } from '@/lib/hooks/useAuthGuard';
import { AuthResponse } from '@/types/auth';

type OnboardingStep = 1 | 2 | 3;

export default function OnboardingPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState<OnboardingStep>(1);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const { isAuthenticated, userEmail } = useAuthGuard();
    const [formData, setFormData] = useState<RegistrationData>({
        ownerName: '',
        businessName: '',
        businessType: 'e-commerce',
        currency: 'ZAR',
        bankName: '',
        matchMethod: 'automatic'
    });

    // AUTHENTICATION GUARD: Redirect if no token found
    if (!isAuthenticated) return null;

    const updateField = (key: keyof RegistrationData, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleNextStep = (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (currentStep < 3) {
            setCurrentStep((prev) => (prev + 1) as OnboardingStep);
        } else {
            handleSubmit();
        }
    };

    const handlePrevStep = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => (prev - 1) as OnboardingStep);
        }
    };

    const handleSignOut = async () => {
        try {
            await apiCall<AuthResponse>('/auth/signout', { 
                method: 'POST' 
            }, true);
        } finally {
            localStorage.clear();
            router.push('/');
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            // Send the full form data. Ensure 'isPublic' is false!
            await apiCall<AuthResponse>('/auth/onboard', {
                method: 'POST',
                body: JSON.stringify(formData),
            }, false); 
            
            // This will only execute if the call above succeeds
            router.push('/dashboard');
        } catch (error) {
            console.error('Submission error:', error);
            // Do NOT redirect here, otherwise errors send them to login
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 min-h-screen w-full flex bg-slate-950 overflow-hidden font-sans">
            
            {/* LEFT SIDE: Information Canvas */}
            <div className="relative hidden lg:flex lg:w-1/2 bg-slate-900 flex-col justify-between p-16 border-r border-white/5">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-size-[32px_32px]"></div>
                <div className="relative z-10"><PulseHiveLogo /></div>

                <div className="relative z-10 space-y-6 max-w-md mx-auto lg:mx-0">
                    <div className="text-[10px] font-mono tracking-widest text-indigo-400 uppercase font-bold">
                        Setup Status // Step 0{currentStep} of 03
                    </div>
                    {currentStep === 1 && (
                        <>
                            <h2 className="text-4xl font-black text-white tracking-tight leading-tight">Define your business profile.</h2>
                            <p className="text-base text-slate-400 leading-relaxed font-medium">We initialise your localised workspace database and configure features around your specific core business type and operational focus.</p>
                        </>
                    )}
                    {currentStep === 2 && (
                        <>
                            <h2 className="text-4xl font-black text-white tracking-tight leading-tight">Financial connection setup.</h2>
                            <p className="text-base text-slate-400 leading-relaxed font-medium">Set your primary operating currency and transactional ledger connections. PulseHive works using secure, read-only data tracking.</p>
                        </>
                    )}
                    {currentStep === 3 && (
                        <>
                            <h2 className="text-4xl font-black text-white tracking-tight leading-tight">Match settings configuration.</h2>
                            <p className="text-base text-slate-400 leading-relaxed font-medium">Choose how the payment matching dashboard behaves by default. You control tracking rules, sensitivity settings, and how exceptions are handled.</p>
                        </>
                    )}
                    <div className="flex gap-2 pt-4">
                        <div className={`h-1 rounded-full transition-all duration-300 ${currentStep >= 1 ? 'w-12 bg-indigo-500' : 'w-4 bg-slate-800'}`}></div>
                        <div className={`h-1 rounded-full transition-all duration-300 ${currentStep >= 2 ? 'w-12 bg-indigo-500' : 'w-4 bg-slate-800'}`}></div>
                        <div className={`h-1 rounded-full transition-all duration-300 ${currentStep === 3 ? 'w-12 bg-indigo-500' : 'w-4 bg-slate-800'}`}></div>
                    </div>
                </div>

                <div className="relative z-10 text-[10px] font-mono tracking-wider text-slate-600 uppercase">
                    Workspace Management Portal v1.0.0
                </div>
            </div>

            {/* RIGHT SIDE: Authentication Form - Centered */}
            <div className="w-full lg:w-1/2 min-h-screen flex items-center justify-center p-6 bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 overflow-y-auto">
                <div className="w-full max-w-110 bg-slate-900/30 backdrop-blur-xl border border-white/5 p-8 sm:p-10 rounded-3xl shadow-2xl">
                    
                    {userEmail && (
                        <div className="mb-6 p-4 rounded-2xl border border-white/5 bg-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                                    {userEmail.slice(0, 2)}
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Authenticated</p>
                                    <p className="text-sm text-white font-medium">{userEmail}</p>
                                </div>
                            </div>
                            <button onClick={handleSignOut} className="text-[10px] text-red-400 hover:text-red-300 uppercase font-bold tracking-wider">
                                Sign out
                            </button>
                        </div>
                    )}

                    <div className="flex items-center justify-between border-b border-white/6 pb-5 mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-white tracking-tight">
                                {currentStep === 1 && "Identity & Business Type"}
                                {currentStep === 2 && "Currency & Banking Details"}
                                {currentStep === 3 && "Reconciliation Settings"}
                            </h3>
                        </div>
                    </div>

                    <form onSubmit={handleNextStep} className="space-y-5">
                        {currentStep === 1 && (
                            <div className="space-y-4 animate-in fade-in duration-300">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Authorised Account Owner Name</label>
                                    <input type="text" required value={formData.ownerName} onChange={(e) => updateField('ownerName', e.target.value)} placeholder="e.g., Sarah Jenkins" className="w-full px-4 py-2.5 bg-slate-950/60 border border-white/10 text-sm rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Registered Business Name</label>
                                    <input type="text" required value={formData.businessName} onChange={(e) => updateField('businessName', e.target.value)} placeholder="e.g., Apex Logistics Ltd" className="w-full px-4 py-2.5 bg-slate-950/60 border border-white/10 text-sm rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Primary Business Type</label>
                                    <select value={formData.businessType} onChange={(e) => updateField('businessType', e.target.value)} className="w-full px-4 py-2.5 bg-slate-950/60 border border-white/10 text-sm rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all">
                                        <option value="e-commerce">E-Commerce & Online Retail Storefront</option>
                                        <option value="services">Client Services, Consulting & Projects</option>
                                        <option value="saas">Software, Apps & Tech Platforms</option>
                                        <option value="wholesale">Wholesale Supply, Bulk Sales & Delivery</option>
                                    </select>
                                </div>
                            </div>
                        )}
                        {currentStep === 2 && (
                            <div className="space-y-4 animate-in fade-in duration-300">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Main Settlement Currency</label>
                                    <select value={formData.currency} onChange={(e) => updateField('currency', e.target.value)} className="w-full px-4 py-2.5 bg-slate-950/60 border border-white/10 text-sm rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all">
                                        <option value="ZAR">South African Rand (ZAR - R)</option>
                                        <option value="USD">United States Dollar (USD - $)</option>
                                        <option value="EUR">Euro (EUR - €)</option>
                                        <option value="GBP">British Pound (GBP - £)</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Primary Business Bank Account</label>
                                    <select value={formData.bankName} required onChange={(e) => updateField('bankName', e.target.value)} className="w-full px-4 py-2.5 bg-slate-950/60 border border-white/10 text-sm rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all">
                                        <option value="">-- Select Your Business Bank --</option>
                                        <option value="FNB">First National Bank (FNB)</option>
                                        <option value="StandardBank">Standard Bank</option>
                                        <option value="Nedbank">Nedbank</option>
                                        <option value="Absa">ABSA Bank</option>
                                        <option value="Capitec">Capitec Business</option>
                                    </select>
                                </div>
                            </div>
                        )}
                        {currentStep === 3 && (
                            <div className="space-y-4 animate-in fade-in duration-300">
                                <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">Payment Matching Strategy</label>
                                <div className="grid grid-cols-1 gap-3">
                                    <div onClick={() => updateField('matchMethod', 'automatic')} className={`p-4 rounded-xl border transition-all cursor-pointer ${formData.matchMethod === 'automatic' ? 'bg-indigo-600/10 border-indigo-500' : 'bg-slate-950/40 border-white/5'}`}>
                                        <div className="text-white font-semibold text-xs mb-1">Automatic Invoice Matching</div>
                                        <p className="text-[11px] text-slate-400">Incoming cash deposits will match up and close open customer invoices instantly.</p>
                                    </div>
                                    <div onClick={() => updateField('matchMethod', 'manual')} className={`p-4 rounded-xl border transition-all cursor-pointer ${formData.matchMethod === 'manual' ? 'bg-indigo-600/10 border-indigo-500' : 'bg-slate-950/40 border-white/5'}`}>
                                        <div className="text-white font-semibold text-xs mb-1">Manual Verification Queue</div>
                                        <p className="text-[11px] text-slate-400">Identifies matches but leaves them pending for manager approval.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        <button type="submit" disabled={isSubmitting} className="w-full mt-4 px-5 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2.5">
                            {isSubmitting ? 'Configuring...' : (currentStep === 3 ? 'Deploy Workspace Dashboard' : 'Confirm & Continue')}
                        </button>
                    </form>
                    <div className="flex flex-col items-end gap-2 mt-5">
                        {currentStep > 1 && (
                            <button type="button" onClick={handlePrevStep} className="text-xs text-slate-400 hover:text-white font-semibold transition-colors">← Back</button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}