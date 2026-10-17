type PulseHiveLogoProps = {
    showTagline?: boolean;
};

export const PulseHiveLogo = ({
    showTagline = true,
}: PulseHiveLogoProps) => (
    <div className="inline-flex flex-col items-start">
        <div className="flex items-center gap-1.5 font-black text-xl tracking-tighter text-white">
            <div className="relative">
                {/* Original pulsing icon */}
                <div className="h-4 w-4 animate-pulse rounded-full bg-indigo-500"></div>
                <div className="absolute inset-0 h-4 w-4 animate-ping rounded-full bg-indigo-500 opacity-75"></div>
            </div>

            <span>
                PulseHive<span className="text-indigo-400">.</span>
            </span>
        </div>

        {showTagline && (
            <p className="text-[10px] font-semibold tracking-wide text-slate-400">
                Move. Manage. Multiply.
            </p>
        )}
    </div>
);
