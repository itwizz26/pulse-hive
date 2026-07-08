import './globals.css';
import { MobileNav } from '@/components/mobile-nav';
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
                <meta name="theme-color" content="#3d2c10" />
                <link rel="apple-touch-icon" href="/icon-192.png" />
                <link rel="icon" href="/logo.svg" type="image/svg+xml" />
            </head>
            <body className="min-h-screen overflow-x-hidden bg-[#f4f4f3] text-[#121212]">
                <div className="relative flex items-center justify-center overflow-hidden">
                    <div className="relative flex w-full justify-center">
                        <div className="glass-card relative flex w-full max-w-160 min-h-[calc(100vh-2rem)] overflow-hidden shadow-[0_24px_70px_rgba(42,35,24,0.08)]">
                            <CartProvider>
                                <main className="w-full px-5 py-6">{children}</main>
                                <MobileNav />
                            </CartProvider>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    );
}