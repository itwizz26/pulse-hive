'use client';

import Link from 'next/link';
import { ArrowLeft, XCircle } from 'lucide-react';
import { GlowaVeeLogo } from '@/components/glowa-vee-logo';

export default function CheckoutErrorPage() {
    return (
        <div className="w-full min-h-screen bg-(--color-background) pb-16">
            <header className="sticky top-0 z-40 bg-(--color-surface)/95 backdrop-blur-md border-b border-(--color-border) p-6 flex items-center justify-center">
                <GlowaVeeLogo />
            </header>

            <main className="px-6 pt-12 flex justify-center">
                <div className="w-full max-w-md border border-red-200 bg-white p-10 text-center shadow-xs">
                    <div className="w-16 h-16 mx-auto bg-red-50 flex items-center justify-center text-red-600 rounded-full border border-red-200 mb-5">
                        <XCircle size={32} />
                    </div>

                    <h1 className="text-2xl font-serif text-(--color-text) mb-2">
                        Payment Unsuccessful
                    </h1>

                    <p className="text-sm text-(--color-text-muted) mb-8">
                        We were unable to complete your payment.
                        Please try again.
                    </p>

                    <Link
                        href="/checkout"
                        className="w-full h-12 inline-flex items-center justify-center gap-2 bg-linear-to-r from-[#3d2c10] to-[#f3c54b] text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:brightness-105"
                    >
                        <ArrowLeft size={14} />
                        Try Again
                    </Link>
                </div>
            </main>
        </div>
    );
}