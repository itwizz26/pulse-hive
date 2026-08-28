'use client';

import Image from 'next/image';

export function GlowaVeeLogo({ className = '' }: { className?: string }) {
    return (
        <div className={`flex flex-col w-full items-center justify-center py-8 bg-black ${className}`}>
            <div className="relative w-full h-50 aspect-3/1">
                <Image
                    src="/glowa.png"
                    alt="Glowa Vee Skin Boutique"
                    fill
                    className="object-contain"
                    priority
                />
            </div>
        </div>
    );
}