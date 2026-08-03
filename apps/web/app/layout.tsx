import './globals.css';
import { NavBar } from '@/components/nav-bar';
import { CartProvider } from '@/context/cart-context';
import { Barlow_Condensed, Saira_Condensed } from 'next/font/google';

const barlow = Barlow_Condensed({
    weight: '900',
    subsets: ['latin'],
    variable: '--font-barlow',
});

const saira = Saira_Condensed({
    weight: '900',
    subsets: ['latin'],
    variable: '--font-saira',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={`${barlow.variable} ${saira.variable}`}>
            <head>
                <link rel="manifest" href="/manifest.json" />
                <meta name="theme-color" content="#2a1f0a" />
                <link rel="apple-touch-icon" href="/icon-192.png" />
                <link rel="icon" href="/logo.png" type="image/png" />
            </head>
            <body className="min-h-screen overflow-x-hidden bg-(--color-background) text-(--color-text)">
                {/* Outer centering wrapper */}
                <div className="relative flex justify-center w-full min-h-screen py-0 sm:py-4">
                    {/* App Container: Uses box-border and px-4/px-6 safeguards to ensure child content stays within safe bounds */}
                    <div className="relative flex flex-col w-full max-w-lg sm:max-w-11/12 min-h-screen sm:min-h-[calc(100vh-2rem)] bg-(--color-surface-elevated) backdrop-blur-xl border-x sm:border border-(--color-border) shadow-[0_24px_70px_rgba(42,35,24,0.06)] box-border">
                        <CartProvider>
                            <main className="flex-1 w-full box-border pb-28">{children}</main>
                            <NavBar />
                        </CartProvider>
                    </div>
                </div>
            </body>
        </html>
    );
}