import './globals.css';
import { Inter } from 'next/font/google';

// Use Next.js optimized font loader instead of standard HTML links
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
        <html lang="en" className={inter.variable}>
            <head>
                {/* Next.js automatically places favicon and metadata here */}
                <link rel="icon" href="/favicon.ico" sizes="any" />
            </head>
            <body>
                <div className="layout">
                    <nav className="navbar">
                        <div className="logo-container">
                            <img src="/pulsehive-logo.svg" alt="PulseHive logo" className="logo-img" />
                            <h1 className="logo">PulseHive</h1>
                        </div>
                        <ul className="nav-links">
                            <li><a href="/dashboard">Dashboard</a></li>
                            <li><a href="/orders">Orders</a></li>
                            <li><a href="/payments">Payments</a></li>
                            <li><a href="/reconciliation">Reconciliation</a></li>
                        </ul>
                    </nav>
                    <main className="container">
                        {children}
                    </main>
                </div>
            </body>
        </html>
    );
}