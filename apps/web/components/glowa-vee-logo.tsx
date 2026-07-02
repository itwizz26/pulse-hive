'use client';

export function GlowaVeeLogo({ className = '' }: { className?: string }) {
    return (
        <div className={`flex flex-col w-full items-center justify-center ${className}`}>
            <span className="whitespace-nowrap leading-none text-[1.9rem] sm:text-[2.5rem] font-black uppercase tracking-wide sm:tracking-wider bg-[linear-gradient(90deg,#040404_0%,#3d2c10_45%,#f3c54b_100%)] bg-clip-text text-transparent">
                Glowa Vee
            </span>
            <p className="mt-2 text-[0.75rem] sm:text-[0.8rem] font-semibold tracking-wider text-[#000000] whitespace-nowrap">
                Collagen Skin Repair Supplements
            </p>
        </div>
    );
}
