'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function BackButton() {
    const router = useRouter();

    return (
        <button 
        onClick={() => router.back()}
        className="px-5 py-2.5 bg-white hover:bg-slate-50 active:scale-[0.98] text-slate-700 border border-slate-200 text-sm font-semibold rounded-lg shadow-sm transition-all inline-flex items-center justify-center"
        >
        Go Back
        </button>
    );
}