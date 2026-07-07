'use client';

export function GlowaVeeLogo({ className = '' }: { className?: string }) {
    return (
        <div className={`flex flex-col w-full items-center justify-center py-4 ${className}`}>
            <span className="whitespace-nowrap leading-none text-6xl sm:text-7xl font-black uppercase tracking-wide sm:tracking-wider bg-[linear-gradient(90deg,#040404_0%,#3d2c10_45%,#f3c54b_100%)] bg-clip-text text-transparent">
                Glowa Vee
            </span>
            <p className="mt-2 text-[1.3rem] sm:text-[1.7rem] font-semibold tracking-wider text-[#000000] whitespace-nowrap">
                Collagen Skin Repair Supplements
            </p>
            
            {/* Added explicit my-6 for more breathing room */}
            <div className="w-full h-2" />
            <div className="w-48 h-1 bg-black rounded-full" />
            <div className="w-full h-3" />
            
            <div className="bg-[#1e3a8a] w-80 text-center px-8 p-2 rounded-xl shadow-sm">
                <span className="text-white font-bold tracking-widest text-5xl sm:text-4xl">
                    068 103 7459
                </span>
            </div>
            
            {/* Added a spacer div at the bottom to force space */}
            <div className="h-4" />
        </div>
    );
}