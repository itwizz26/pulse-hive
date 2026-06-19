export const PulseHiveLogo = () => (
    <div className="flex items-center gap-1.5 font-black text-xl tracking-tighter text-white">
        <div className="relative">
            {/* Pulsating Icon */}
            <div className="w-4 h-4 bg-indigo-500 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 w-4 h-4 bg-indigo-500 rounded-full animate-ping opacity-75"></div>
        </div>
        <span>
            PulseHive<span className="text-indigo-400">.</span>
        </span>
    </div>
);