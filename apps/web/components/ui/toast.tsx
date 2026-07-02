'use client';

import { useEffect } from 'react';

export function Toast({ message, onClose }: { message: string, onClose: () => void }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 2200);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed bottom-24 left-4 right-4 z-60 rounded-2xl border border-white/10 bg-black/80 px-4 py-3 text-center text-xs font-semibold text-white shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            {message}
        </div>
    );
}