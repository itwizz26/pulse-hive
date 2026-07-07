'use client';

import { useEffect } from 'react';

export function Toast({ message, onClose }: { message: string, onClose: () => void }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        // The container handles the centering
        <div className="fixed inset-x-0 top-100 z-60 flex justify-center px-4 pointer-events-none p-10">
            {/* The actual toast card */}
            <div className="pointer-events-auto border border-white/10 bg-black/80 px-6 py-4 text-center font-semibold text-white shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur-xl">
                {message}
            </div>
        </div>
    );
}