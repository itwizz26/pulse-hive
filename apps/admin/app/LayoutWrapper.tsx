'use client';

import Navbar from '@/components/NavBar';
import { usePathname } from 'next/navigation';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLandingPage = pathname === '/';

    return (
        <>
            <Navbar />
            <main
                className={`flex-1 w-full ${
                    isLandingPage
                        ? 'p-0 overflow-hidden bg-slate-950'
                        : 'px-4 sm:px-6 lg:px-8 py-8'
                }`}
            >
                {children}
            </main>
        </>
    );
}
