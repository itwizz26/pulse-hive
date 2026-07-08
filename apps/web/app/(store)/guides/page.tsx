'use client';

import { useState } from 'react';
import { BookOpen, ArrowRight } from 'lucide-react';
import { ShoppingCart } from 'lucide-react';
import { GlowaVeeLogo } from '@/components/glowa-vee-logo';
import { useCart } from '@/context/cart-context';
import Link from 'next/link';

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
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="w-full pb-10">
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md p-6">
                <div className="flex justify-center items-center">
                    <GlowaVeeLogo />
                </div>
                
                <Link 
                    href="/cart" 
                    className="absolute top-4 right-4 flex items-center p-2 text-[#4a3b20] transition-transform hover:scale-105" 
                    aria-label={`${cart.length} items in cart`}
                >
                    <div className="relative">
                        <ShoppingCart size={24} />
                        <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center rounded-full bg-[#3d2c10] text-white text-[10px] font-bold">
                            {cart.length}
                        </span>
                    </div>
                </Link>
            </header>

            {/* Catalog Main Body - Gap-2 keeps it tight */}
            <main className="flex flex-col gap-2">
                <div className="w-full h-2" />
                    <div className="mb-8 text-center">
                        <div className="flex justify-center mb-4">
                            <div className="p-3 bg-[#f3e2a8] rounded-full text-[#3d2c10]">
                                <BookOpen size={24} />
                            </div>
                        </div>
                        <h1 className="text-2xl font-medium text-[#2d2822]">Product Guides</h1>
                        <p className="text-sm text-[#7a7266] mt-2">Master your routine with our simple application steps.</p>
                    </div>

                    <div className="space-y-4">
                        {GUIDES.map((guide, index) => (
                            <div key={index} className="border border-[#e5e0d3] bg-white p-6 shadow-sm">
                                <h2 className="text-sm font-bold uppercase tracking-widest text-[#3d2c10] mb-4 border-b border-[#f3ede3] pb-2">
                                    {guide.title}
                                </h2>
                                <ol className="space-y-3">
                                    {guide.steps.map((step, stepIndex) => (
                                        <li key={stepIndex} className="flex gap-3 text-sm text-[#5c5448]">
                                            <span className="font-bold text-[#8b6e29]">{stepIndex + 1}.</span>
                                            {step}
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 p-6 bg-[#fdfaf5] border border-[#f3ede3] text-center">
                        <h3 className="text-sm font-medium text-[#2d2822]">Need more help?</h3>
                        <p className="text-xs text-[#7a7266] mt-2 mb-4">Message us on WhatsApp for personalized advice.</p>
                        <a href="https://wa.me/27681037459" className="inline-flex items-center gap-2 text-sm font-bold text-[#8b6e29] uppercase tracking-widest hover:underline">
                            Chat to us <ArrowRight size={14} />
                        </a>
                    </div>
                </main>
        </div>
    );
}
