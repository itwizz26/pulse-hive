import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    variable: '--font-inter',
});

export const metadata = {
    title: 'PulseHive | Premium Admin',
    description: 'Your modern and efficient platform for managing orders and payments.',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" className={`${inter.variable} antialiased`}>
            <head>
                <link rel="icon" href="/pulsehive-logo.svg" sizes="any" />
            </head>
            <body className="bg-slate-50 text-slate-900 min-h-screen font-sans">
                <div className="flex flex-col min-h-screen">
                    {/* Glassmorphic Navigation Bar */}
                    <nav className="sticky top-0 z-50 w-full bg-white/75 backdrop-blur-md border-b border-slate-200/80 px-6 lg:px-12 py-4 flex items-center justify-between transition-all">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center p-2 bg-indigo-50 rounded-xl border border-indigo-100/50">
                                <img src="/pulsehive-logo.svg" alt="PulseHive logo" className="w-6 h-6 object-contain" />
                            </div>
                            <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
                                PulseHive<span className="text-indigo-600">.</span>
                            </h1>
                        </div>
                        
                        {/* Interactive Navigation Links */}
                        <ul className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/40">
                            <li>
                                <a href="/dashboard" className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-slate-900 transition-all hover:bg-white inline-block">
                                    Dashboard
                                </a>
                            </li>
                            <li>
                                <a href="/orders" className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-slate-900 transition-all hover:bg-white inline-block">
                                    Orders
                                </a>
                            </li>
                            <li>
                                <a href="/payments" className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-slate-900 transition-all hover:bg-white inline-block">
                                    Payments
                                </a>
                            </li>
                            <li>
                                <a href="/reconciliation" className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-slate-900 transition-all hover:bg-white inline-block">
                                    Reconciliation
                                </a>
                            </li>
                        </ul>

                        {/* Extra Action / User Slot to balance the header alignment */}
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                                DM
                            </div>
                        </div>
                    </nav>

                    {/* Dashboard Layout Container */}
                    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        {children}
                    </main>
                </div>
            </body>
        </html>
    );
}