import './globals.css';

import { NavBar } from '@/components/nav-bar';
import { CartProvider } from '@/context/cart-context';
import { Barlow_Condensed, Saira_Condensed } from 'next/font/google';
import { Footer } from '@/components/footer';
import { FloatingCart } from '@/components/floating-cart';

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

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang="en"
            className={`${barlow.variable} ${saira.variable}`}
        >
            <head>
                <link
                    rel="manifest"
                    href="/manifest.json"
                />

                <meta
                    name="theme-color"
                    content="#2a1f0a"
                />

                <link
                    rel="apple-touch-icon"
                    href="/icon-192.png"
                />

                <link
                    rel="icon"
                    href="/favicon.png"
                    type="image/png"
                />

                <title>
                    Glowa Vee Boutique - Find the right glow!
                </title>
            </head>

            <body className="min-h-screen bg-(--color-background) text-(--color-text)">
                <CartProvider>

                    {/* Main application area */}
                    <div className="relative flex justify-center w-full min-h-screen py-0 sm:py-4">

                        {/* App Container */}
                        <div
                            className="
                                relative
                                flex
                                flex-col
                                w-full
                                max-w-lg
                                sm:max-w-11/12
                                min-h-screen
                                sm:min-h-[calc(100vh-2rem)]
                                min-w-0
                                box-border
                                overflow-x-hidden
                                bg-(--color-surface-elevated)
                                backdrop-blur-xl
                                border-x
                                sm:border
                                border-(--color-border)
                                shadow-[0_24px_70px_rgba(42,35,24,0.06)]
                                py-4
                                sm:py-6
                            "
                        >
                            <main className="flex-1 w-full min-w-0 max-w-full box-border pb-6 sm:pb-8 overflow-x-hidden">
                                {children}
                            </main>

                            <div className="pt-8 pb-24">
                                <Footer />
                            </div>
                        </div>
                    </div>

                    {/* Fixed elements MUST live outside the App Container */}
                    <NavBar />

                    <FloatingCart />

                </CartProvider>
            </body>
        </html>
    );
}