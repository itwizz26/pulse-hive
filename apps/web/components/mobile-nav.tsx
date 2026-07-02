'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, Package } from 'lucide-react';

const links = [
    { href: '/', label: 'Store', icon: Home },
    { href: '/cart', label: 'Cart', icon: ShoppingBag },
    { href: '/orders', label: 'Orders', icon: Package },
];

export function MobileNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 flex w-full justify-center border-t border-[#d4c8ae] bg-[#fffdf8] px-4 py-3 shadow-[0_-12px_40px_rgba(34,30,22,0.12)]">
            <div className="flex w-full max-w-155 h-12 items-center justify-between rounded-full border border-[#e6dac1] bg-[#fff9ee] px-4 py-3 shadow-[0_10px_40px_rgba(34,30,22,0.08)]">
                {links.map(({ href, label, icon: Icon }) => {
                    const isActive = pathname === href;
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex flex-col h-12 items-center gap-2 rounded-full text-[10px] font-bold uppercase tracking-[0.24em] transition ${
                                isActive ? 'bg-[#f3e2a8] text-[#3d2c10]' : 'text-[#5c5348] hover:text-[#1d1a14]'
                            }`}
                        >
                            <Icon size={16} />
                            <span>{label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}