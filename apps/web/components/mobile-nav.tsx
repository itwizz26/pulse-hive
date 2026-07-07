'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, Package, BookOpen, User } from 'lucide-react';

const links = [
    { href: '/', label: 'Store', icon: Home },
    { href: '/cart', label: 'Cart', icon: ShoppingBag },
    { href: '/orders', label: 'Orders', icon: Package },
    { href: '/guides', label: 'Guides', icon: BookOpen },
    { href: '/account', label: 'Account', icon: User },
];

export function MobileNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 flex w-full justify-center border-t border-[#d4c8ae] bg-[#fffdf8] shadow-[0_-12px_40px_rgba(34,30,22,0.12)]">
            <div className="grid w-full max-w-lg grid-cols-5 items-center bg-[#fff9ee]">
                {links.map(({ href, label, icon: Icon }) => {
                    const isActive = pathname === href;
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex flex-col gap-1 items-center justify-center py-2 text-[9px] font-bold uppercase tracking-[0.15em] transition ${
                                isActive 
                                    ? 'bg-[#f3e2a8] text-[#3d2c10]' 
                                    : 'text-[#5c5348] hover:bg-[#fcf8ef] hover:text-[#1d1a14]'
                            }`}
                        >
                            <Icon size={18} />
                            <span>{label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}