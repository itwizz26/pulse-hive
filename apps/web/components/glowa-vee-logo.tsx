'use client';

export function GlowaVeeLogo({ className = '' }: { className?: string }) {
    return (
        <div className={`flex flex-col w-full items-center justify-center py-4 ${className}`}>
            <span className="whitespace-nowrap leading-none text-5xl sm:text-8xl font-black uppercase tracking-wide sm:tracking-wider bg-[linear-gradient(90deg,#040404_0%,#3d2c10_45%,#f3c54b_100%)] bg-clip-text text-transparent">
                Glowa Vee
            </span>
            <p className="mt-2 text-[1rem] sm:text-[1.7rem] font-semibold tracking-wider text-[#000000] whitespace-nowrap">
                Collagen Skin Repair Supplements
            </p>
            
            <div className="h-4" />
        </div>
    );
}