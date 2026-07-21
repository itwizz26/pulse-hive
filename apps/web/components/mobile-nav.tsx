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
        /* Changed from fixed to absolute, anchored to the bottom of your app card container */
        <nav className="sticky bottom-0 left-0 right-0 z-50 flex w-full justify-center border-t border-(--color-border) bg-(--color-surface)/95 backdrop-blur-md shadow-[0_-8px_30px_rgba(34,30,22,0.06)] mt-auto">
            <div className="grid w-full grid-cols-5 items-center">
                {links.map(({ href, label, icon: Icon }) => {
                    const isActive = pathname === href;
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex flex-col gap-1 items-center justify-center py-3 text-[9px] font-bold uppercase tracking-[0.15em] transition-all ${
                                isActive 
                                    ? 'bg-(--color-gold)/15 text-(--color-gold-dark)' 
                                    : 'text-(--color-text-muted) hover:bg-(--color-background-soft) hover:text-(--color-text)'
                            }`}
                        >
                            <Icon size={18} strokeWidth={isActive ? 2.2 : 1.5} />
                            <span>{label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}