// @ts-expect-error - Suppress CSS side-effect ambient typing mismatch
import './globals.css';
import React from 'react';
import { Inter } from 'next/font/google';
import Navbar from '@/components/NavBar';

const inter = Inter({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    variable: '--font-inter',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={`${inter.variable} antialiased`}>
            <body className="ph-workspace-canvas">
                
                {/* Embedded Ambient Canvas Styling Layers */}
                <div className="ph-glow-orb-indigo top-0 left-1/4"></div>
                <div className="ph-glow-orb-emerald bottom-10 right-1/4"></div>
                <div className="ph-telemetry-grid"></div>

                <div className="flex flex-col min-h-screen relative z-10">
                    {/* Dynamic Title and Navigation Component */}
                    <Navbar />

                    <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-8">
                        {children}
                    </main>
                </div>
            </body>
        </html>
    );
}