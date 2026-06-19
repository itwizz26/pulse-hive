'use client';

import Navbar from '@/components/NavBar';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </>
    );
}