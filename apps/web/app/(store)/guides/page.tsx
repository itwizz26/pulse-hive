'use client';

import Link from 'next/link';
import { BookOpen, ArrowRight, ShoppingCart } from 'lucide-react';
import { GlowaVeeLogo } from '@/components/glowa-vee-logo';
import { useCart } from '@/context/cart-context';

const GUIDES = [
    {
        title: 'Daily Glow Serum',
        steps: ['Cleanse face thoroughly.', 'Apply 2-3 drops to fingertips.', 'Gently massage into skin using upward motions.', 'Follow with moisturizer.'],
    },
    {
        title: 'Hydration Mist',
        steps: ['Shake well before use.', 'Hold 20cm away from face.', 'Close eyes and mist evenly.', 'Use throughout the day for a refreshing boost.'],
    },
    {
        title: 'Night Recovery Cream',
        steps: ['Apply as the last step of your evening routine.', 'Warm a pea-sized amount between palms.', 'Press gently into skin.', 'Allow to absorb fully before sleep.'],
    },
];

export default function GuidesPage() {
    const { cart } = useCart();

    return (
        <div className="w-full min-h-screen bg-(--color-background) pb-12">
            {/* Header */}
            <header className="top-5 z-40 bg-(--color-surface)/95 backdrop-blur-md border-b border-(--color-border) p-6">
                <div className="flex justify-center items-center">
                    <GlowaVeeLogo />
                </div>
            </header>

            <main className="flex flex-col gap-6 px-6 pt-6">
                {/* Page Title & Breadcrumb indicator */}
                <div className="flex flex-col gap-1 items-center text-center">
                    <div className="w-12 h-12 bg-(--color-surface) flex items-center justify-center text-(--color-gold-dark) mb-2 rounded-full border border-(--color-border)">
                        <BookOpen size={20} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-(--color-gold-dark)">
                        Skincare Routines
                    </span>
                    <h1 className="text-2xl font-serif text-(--color-text)">Product Guides</h1>
                    <p className="text-xs text-(--color-text-muted)">Master your routine with our simple application steps.</p>
                </div>

                {/* Guides List */}
                <div className="flex flex-col gap-3 items-center text-center">
                    {GUIDES.map((guide, index) => (
                        <div key={index} className="border border-(--color-border-strong) p-5 shadow-xs space-y-4">
                            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-(--color-text) pb-3 border-b border-(--color-border)">
                                {guide.title}
                            </h2>
                            <ol className="space-y-2.5">
                                {guide.steps.map((step, stepIndex) => (
                                    <li key={stepIndex} className="flex gap-3 text-xs sm:text-sm text-(--color-text-muted)">
                                        <span className="font-bold text-(--color-gold-dark)">{stepIndex + 1}.</span>
                                        <span className="text-(--color-text) font-medium">{step}</span>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    ))}
                </div>

                {/* Support Box */}
                <div className="border border-(--color-border-strong) p-6 shadow-xs text-center">
                    <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-(--color-text) mb-1">Need more help?</h3>
                    <p className="text-xs text-(--color-text-muted) mb-4">Message us on WhatsApp for personalised advice.</p>

                    {/* Explicit spacing */}
                    <div className="h-16" />
                    
                    <a 
                        href="https://wa.me/27681037459" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full h-12 inline-flex items-center justify-center gap-2 bg-linear-to-r from-[#3d2c10] to-[#f3c54b] text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-[#3d2c10]/15 transition-all hover:brightness-105"
                    >
                        Chat to us <ArrowRight size={14} />
                    </a>
                </div>
            </main>
        </div>
    );
}