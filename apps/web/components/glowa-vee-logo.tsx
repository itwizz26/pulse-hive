'use client';

import Image from 'next/image';

export function GlowaVeeLogo({ className = '' }: { className?: string }) {
    return (
        <div className={`flex flex-col w-full items-center justify-center py-8 bg-[#00001e] ${className}`}>
            <div className="relative w-full h-70 aspect-3/1">
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