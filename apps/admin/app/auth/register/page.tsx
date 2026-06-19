'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PulseHiveLogo } from '@/components/PulseHiveLogo';

type OnboardingStep = 1 | 2 | 3;

interface RegistrationData {
    ownerName: string;
    businessName: string;
    businessType: string;
    currency: string;
    bankName: string;
    matchMethod: 'automatic' | 'manual';
}

export default function RegisterPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState<OnboardingStep>(1);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    
    const [formData, setFormData] = useState<RegistrationData>({
        ownerName: '',
        businessName: '',
        businessType: 'e-commerce',
        currency: 'ZAR',
        bankName: '',
        matchMethod: 'automatic'
    });

    const updateField = (key: keyof RegistrationData, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleNextStep = (e: React.FormEvent) => {
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

    const handleSubmit = () => {
        setIsSubmitting(true);
        
        // Simulating data save and workspace initialisation
        setTimeout(() => {
            setIsSubmitting(false);
            router.push('/dashboard');
        }, 2000);
    };

    return (
        <div className="fixed inset-0 min-h-screen w-full flex bg-slate-950 overflow-hidden font-sans">
            
            {/* LEFT SIDE: Information Canvas */}
            <div className="relative hidden lg:flex lg:w-1/2 bg-slate-900 flex-col justify-between p-16 border-r border-white/5">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px]"></div>

                {/* Logo integrated here */}
                <div className="relative z-10">
                    <PulseHiveLogo />
                </div>

                <div className="relative z-10 space-y-6 max-w-md mx-auto lg:mx-0">
                    <div className="text-[10px] font-mono tracking-widest text-indigo-400 uppercase font-bold">
                        Setup Status // Step 0{currentStep} of 03
                    </div>

                    {currentStep === 1 && (
                        <>
                            <h2 className="text-4xl font-black text-white tracking-tight leading-tight">
                                Define your business profile.
                            </h2>
                            <p className="text-base text-slate-400 leading-relaxed font-medium">
                                We initialise your localised workspace database and configure features around your specific core business type and operational focus.
                            </p>
                        </>
                    )}

                    {currentStep === 2 && (
                        <>
                            <h2 className="text-4xl font-black text-white tracking-tight leading-tight">
                                Financial connection setup.
                            </h2>
                            <p className="text-base text-slate-400 leading-relaxed font-medium">
                                Set your primary operating currency and transactional ledger connections. PulseHive works using secure, read-only data tracking.
                            </p>
                        </>
                    )}

                    {currentStep === 3 && (
                        <>
                            <h2 className="text-4xl font-black text-white tracking-tight leading-tight">
                                Match settings configuration.
                            </h2>
                            <p className="text-base text-slate-400 leading-relaxed font-medium">
                                Choose how the payment matching dashboard behaves by default. You control tracking rules, sensitivity settings, and how exceptions are handled.
                            </p>
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

            {/* RIGHT SIDE: Authentication Form */}
            <div className="w-full lg:w-1/2 min-h-screen flex flex-col pt-24 pb-16 px-6 sm:px-12 md:px-24 items-center overflow-y-auto bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
                
                <div className="w-full max-w-[440px] bg-slate-900/30 backdrop-blur-xl border border-white/[0.05] p-8 sm:p-10 rounded-3xl shadow-2xl">
                    
                    <div className="flex items-center justify-between border-b border-white/[0.06] pb-5 mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-white tracking-tight">
                                {currentStep === 1 && "Identity & Business Type"}
                                {currentStep === 2 && "Currency & Banking Details"}
                                {currentStep === 3 && "Reconciliation Settings"}
                            </h3>
                            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Please populate the target system operational matrix fields.</p>
                        </div>
                        {currentStep > 1 && (
                            <button
                                type="button"
                                onClick={handlePrevStep}
                                className="text-xs text-slate-400 hover:text-white font-semibold transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/5 bg-white/[0.01]"
                            >
                                ← Back
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleNextStep} className="space-y-5">
                        
                        {currentStep === 1 && (
                            <div className="space-y-4 animate-in fade-in duration-300">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Authorised Account Owner Name</label>
                                    <input 
                                        type="text" required
                                        value={formData.ownerName}
                                        onChange={(e) => updateField('ownerName', e.target.value)}
                                        placeholder="e.g., Sarah Jenkins"
                                        className="w-full px-4 py-2.5 bg-slate-950/60 border border-white/10 text-sm rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Registered Business Name</label>
                                    <input 
                                        type="text" required
                                        value={formData.businessName}
                                        onChange={(e) => updateField('businessName', e.target.value)}
                                        placeholder="e.g., Apex Logistics Ltd"
                                        className="w-full px-4 py-2.5 bg-slate-950/60 border border-white/10 text-sm rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Primary Business Type</label>
                                    <select 
                                        value={formData.businessType}
                                        onChange={(e) => updateField('businessType', e.target.value)}
                                        className="w-full px-4 py-2.5 bg-slate-950/60 border border-white/10 text-sm rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all appearance-none"
                                    >
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
                                    <select 
                                        value={formData.currency}
                                        onChange={(e) => updateField('currency', e.target.value)}
                                        className="w-full px-4 py-2.5 bg-slate-950/60 border border-white/10 text-sm rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                                    >
                                        <option value="ZAR">South African Rand (ZAR - R)</option>
                                        <option value="USD">United States Dollar (USD - $)</option>
                                        <option value="EUR">Euro (EUR - €)</option>
                                        <option value="GBP">British Pound (GBP - £)</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Primary Business Bank Account</label>
                                    <select 
                                        value={formData.bankName} required
                                        onChange={(e) => updateField('bankName', e.target.value)}
                                        className="w-full px-4 py-2.5 bg-slate-950/60 border border-white/10 text-sm rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                                    >
                                        <option value="">-- Select Your Business Bank --</option>
                                        <option value="FNB">First National Bank (FNB)</option>
                                        <option value="StandardBank">Standard Bank</option>
                                        <option value="Nedbank">Nedbank</option>
                                        <option value="Absa">ABSA Bank</option>
                                        <option value="Capitec">Capitec Business</option>
                                    </select>
                                </div>
                                <div className="p-3.5 rounded-xl border border-indigo-500/10 bg-indigo-500/[0.02] text-[11px] text-indigo-300/80 leading-relaxed">
                                    🛡️ <strong>Security Setup Note:</strong> Bank file tracking operations work through completely isolated data records.
                                </div>
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div className="space-y-4 animate-in fade-in duration-300">
                                <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">Payment Matching Strategy</label>
                                
                                <div className="grid grid-cols-1 gap-3">
                                    <div 
                                        onClick={() => updateField('matchMethod', 'automatic')}
                                        className={`p-4 rounded-xl border transition-all cursor-pointer select-none ${formData.matchMethod === 'automatic' ? 'bg-indigo-600/10 border-indigo-500 text-white shadow-lg' : 'bg-slate-950/40 border-white/5 text-slate-400 hover:border-white/10'}`}
                                    >
                                        <div className="flex items-center gap-2.5 font-semibold text-xs mb-1 text-white">
                                            <span className={formData.matchMethod === 'automatic' ? 'text-indigo-400' : 'text-slate-500'}>⚙️</span> 
                                            Automatic Invoice Matching
                                        </div>
                                        <p className="text-[11px] text-slate-400 leading-relaxed font-medium pl-6">
                                            Incoming cash deposits will match up and close open customer invoices instantly.
                                        </p>
                                    </div>

                                    <div 
                                        onClick={() => updateField('matchMethod', 'manual')}
                                        className={`p-4 rounded-xl border transition-all cursor-pointer select-none ${formData.matchMethod === 'manual' ? 'bg-indigo-600/10 border-indigo-500 text-white shadow-lg' : 'bg-slate-950/40 border-white/5 text-slate-400 hover:border-white/10'}`}
                                    >
                                        <div className="flex items-center gap-2.5 font-semibold text-xs mb-1 text-white">
                                            <span className={formData.matchMethod === 'manual' ? 'text-indigo-400' : 'text-slate-500'}>📋</span> 
                                            Manual Verification Queue
                                        </div>
                                        <p className="text-[11px] text-slate-400 leading-relaxed font-medium pl-6">
                                            Identifies matches but leaves them pending for manager approval.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full mt-4 px-5 py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 active:scale-[0.99] text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-950/50 transition-all flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    <span className="font-medium tracking-wide">Configuring...</span>
                                </>
                            ) : (
                                <>
                                    <span>{currentStep === 3 ? 'Deploy Workspace Dashboard' : 'Confirm & Continue'}</span>
                                    <span className="text-indigo-200">→</span>
                                </>
                            )}
                        </button>

                        <div className="pt-6 text-center">
                            <Link href="/" className="text-[10px] text-slate-500 hover:text-indigo-400 uppercase tracking-widest font-bold transition-colors">
                                ← Return to homepage
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}