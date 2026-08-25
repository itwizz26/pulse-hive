'use client';

import Link from 'next/link';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { GlowaVeeLogo } from '@/components/glowa-vee-logo';

export default function CheckoutSuccessPage() {
    return (
        <div className="w-full min-h-screen bg-(--color-background) pb-16">
            <header className="sticky top-0 z-40 bg-(--color-surface)/95 backdrop-blur-md border-b border-(--color-border) p-6 flex items-center justify-center">
                <GlowaVeeLogo />
            </header>

            <main className="px-6 pt-12 flex justify-center">
                <div className="w-full max-w-md border border-(--color-border-strong) bg-white p-10 text-center shadow-xs">
                    <div className="w-16 h-16 mx-auto bg-(--color-surface) flex items-center justify-center text-(--color-gold-dark) rounded-full border border-(--color-border) mb-5">
                        <CheckCircle2 size={32} />
                    </div>

                    <h1 className="text-2xl font-serif text-(--color-text) mb-2">
                        Payment Successful
                    </h1>

                    <p className="text-sm text-(--color-text-muted) mb-8">
                        Thank you for your order. Your payment
                        has been successfully processed.
                    </p>

                    <Link
                        href="/"
                        className="w-full h-12 inline-flex items-center justify-center gap-2 bg-linear-to-r from-[#3d2c10] to-[#f3c54b] text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:brightness-105"
                    >
                        Continue Shopping
                        <ArrowRight size={14} />
                    </Link>
                </div>
            </main>
        </div>
    );
}