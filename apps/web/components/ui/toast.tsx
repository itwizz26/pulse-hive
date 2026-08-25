'use client';

import { useEffect } from 'react';

export function Toast({
    message,
    onClose,
}: {
    message: string;
    onClose: () => void;
}) {
    useEffect(() => {
        const timer = setTimeout(onClose, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed inset-x-0 top-100 z-60 flex justify-center px-5 pointer-events-none">
            <div className="pointer-events-auto w-full max-w-md rounded-2xl border border-white/10 bg-(--color-gold-dark) px-6 py-6 text-center font-semibold text-white shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur-xl">
                {message}
            </div>
        </div>
    );
}