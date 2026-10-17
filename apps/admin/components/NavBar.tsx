'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { PulseHiveLogo } from '@/components/PulseHiveLogo';
import { useUser } from '@/lib/hooks/useUser';
import { clearSelectedTenantId } from '@/lib/api-client';

type IconName =
    | 'dashboard'
    | 'orders'
    | 'payments'
    | 'matcher'
    | 'team'
    | 'profile'
    | 'billing'
    | 'notifications'
    | 'support'
    | 'logout';

function MenuIcon({ name }: { name: IconName }) {
    const common = {
        width: 18,
        height: 18,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.8,
        strokeLinecap: 'round' as const,
        strokeLinejoin: 'round' as const,
        'aria-hidden': true as const,
    };

    switch (name) {
        case 'dashboard':
            return (
                <svg {...common}>
                    <rect x="3" y="3" width="8" height="8" rx="2" />
                    <rect x="13" y="3" width="8" height="5" rx="2" />
                    <rect x="13" y="10" width="8" height="11" rx="2" />
                    <rect x="3" y="13" width="8" height="8" rx="2" />
                </svg>
            );
        case 'orders':
            return (
                <svg {...common}>
                    <path d="M8 4h8l3 3v13H5V4h3" />
                    <path d="M9 4v4h6V4M8 12h8M8 16h6" />
                </svg>
            );
        case 'payments':
            return (
                <svg {...common}>
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="M3 10h18M7 15h4" />
                </svg>
            );
        case 'matcher':
            return (
                <svg {...common}>
                    <circle cx="10.5" cy="10.5" r="6.5" />
                    <path d="m16 16 4 4M7.5 10.5l2 2 4-4" />
                </svg>
            );
        case 'team':
            return (
                <svg {...common}>
                    <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="10" cy="7" r="4" />
                    <path d="M20 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
            );
        case 'profile':
            return (
                <svg {...common}>
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 21a8 8 0 0 1 16 0" />
                </svg>
            );
        case 'billing':
            return (
                <svg {...common}>
                    <rect x="4" y="3" width="16" height="18" rx="2" />
                    <path d="M8 8h8M8 12h8M8 16h4" />
                </svg>
            );
        case 'notifications':
            return (
                <svg {...common}>
                    <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
                    <path d="M10 21h4" />
                </svg>
            );
        case 'support':
            return (
                <svg {...common}>
                    <circle cx="12" cy="12" r="9" />
                    <path d="M9.6 9a2.5 2.5 0 1 1 4.5 1.5c-1.1 1-2.1 1.3-2.1 3" />
                    <path d="M12 17.5h.01" />
                </svg>
            );
        case 'logout':
            return (
                <svg {...common}>
                    <path d="M10 17l5-5-5-5M15 12H3" />
                    <path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" />
                </svg>
            );
    }
}

const publicLinks = [
    { name: 'About', path: '/about' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Contact', path: '/contact' },
];

const workspaceLinks: {
    name: string;
    path: string;
    icon: IconName;
    description: string;
}[] = [
    {
        name: 'Orders',
        path: '/orders',
        icon: 'orders',
        description: 'Track customer orders and fulfilment.',
    },
    {
        name: 'Money In',
        path: '/payments',
        icon: 'payments',
        description: 'Monitor incoming payments and transactions.',
    },
    {
        name: 'Payment Matcher',
        path: '/reconciliation',
        icon: 'matcher',
        description: 'Match payments against outstanding orders.',
    },
    {
        name: 'Team & Access',
        path: '/team',
        icon: 'team',
        description: 'Manage workspace members and invitations.',
    },
];

const accountLinks: {
    name: string;
    path: string;
    icon: IconName;
}[] = [
    { name: 'My Profile', path: '/profile', icon: 'profile' },
    { name: 'Billing & Subscription', path: '/billing', icon: 'billing' },
    { name: 'Notifications', path: '/notifications', icon: 'notifications' },
    {
        name: 'Support & Documentation',
        path: '/support',
        icon: 'support',
    },
];

function isActiveRoute(pathname: string, path: string) {
    return pathname === path || pathname.startsWith(`${path}/`);
}

export default function Navbar() {
    const pathname = usePathname() || '/';
    const router = useRouter();
    const isAuthPage = pathname.startsWith('/auth');

    const { user, isLoading } = useUser(true);
    const isLoggedIn = !!user;

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMenuPinned, setIsMenuPinned] = useState(false);
    const [isSigningOut, setIsSigningOut] = useState(false);

    const accountMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const routeTitles: Record<string, string> = {
            '/': 'Automated Reconciliation',
            '/about': 'About PulseHive',
            '/pricing': 'Pricing',
            '/contact': 'Contact',
            '/dashboard': 'Business Overview',
            '/orders': 'Customer Orders',
            '/payments': 'Money Coming In',
            '/reconciliation': 'Payment Matcher',
            '/profile': 'My Profile',
            '/billing': 'Billing & Subscription',
            '/notifications': 'Notifications',
            '/support': 'Support & Documentation',
            '/auth/workspaces': 'Choose Workspace',
            '/auth/onboarding': 'Workspace Onboarding',
        };

        document.title = `PulseHive // ${
            routeTitles[pathname] || 'Operational Console'
        }`;
    }, [pathname]);

    useEffect(() => {
        setIsMenuOpen(false);
        setIsMenuPinned(false);
        setIsSigningOut(false);
    }, [pathname]);

    useEffect(() => {
        function handlePointerDown(event: PointerEvent) {
            if (
                accountMenuRef.current &&
                !accountMenuRef.current.contains(event.target as Node)
            ) {
                setIsMenuOpen(false);
                setIsMenuPinned(false);
            }
        }

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                setIsMenuOpen(false);
                setIsMenuPinned(false);
            }
        }

        document.addEventListener('pointerdown', handlePointerDown);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('pointerdown', handlePointerDown);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    if (isAuthPage) return null;

    const linkClass = (path: string) =>
        `rounded-xl border px-3 py-2 text-sm font-semibold transition-colors ${
            isActiveRoute(pathname, path)
                ? 'border-white/10 bg-slate-800/80 text-white'
                : 'border-transparent text-slate-400 hover:bg-white/5 hover:text-white'
        }`;

    function handleSignOut() {
        if (isSigningOut) return;

        setIsSigningOut(true);
        setIsMenuOpen(false);
        setIsMenuPinned(false);

        // Local JWT authentication: logout must not depend on an API request.
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        clearSelectedTenantId();

        router.replace('/auth/login');
        router.refresh();
    }

    const flyoutLinkClass = (path: string) =>
        `flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
            isActiveRoute(pathname, path)
                ? 'bg-indigo-600/15 text-indigo-300'
                : 'text-slate-300 hover:bg-white/5 hover:text-white'
        }`;

    function handleAvatarClick() {
        const nextOpen = !isMenuOpen;

        setIsMenuOpen(nextOpen);
        setIsMenuPinned(nextOpen);
    }

    return (
        <nav className="sticky top-0 z-50 flex w-full items-center gap-3 border-b border-white/6 bg-slate-900/40 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
            <div className="relative z-10 shrink-0">
                <PulseHiveLogo />
            </div>

            <ul className="ml-auto hidden items-center gap-1 p-1 md:flex">
                {publicLinks.map((link) => (
                    <li key={link.path}>
                        <Link href={link.path} className={linkClass(link.path)}>
                            {link.name}
                        </Link>
                    </li>
                ))}

                {!isLoading && isLoggedIn && (
                    <li>
                        <Link
                            href="/dashboard"
                            className={linkClass('/dashboard')}
                        >
                            Dashboard
                        </Link>
                    </li>
                )}
            </ul>

            <div className="relative ml-auto shrink-0 md:ml-3">
                {isLoading ? (
                    <div
                        className="inline-flex h-9 w-22 items-center justify-center rounded-xl bg-indigo-600 px-5 py-2 text-sm font-bold text-white"
                        aria-label="Checking session"
                    >
                        Sign In
                    </div>
                ) : isLoggedIn ? (
                    <div
                        ref={accountMenuRef}
                        className="relative py-1"
                        onMouseEnter={() => setIsMenuOpen(true)}
                        onMouseLeave={() => {
                            if (!isMenuPinned) {
                                setIsMenuOpen(false);
                            }
                        }}
                    >
                        <button
                            type="button"
                            aria-label="Open account menu"
                            aria-expanded={isMenuOpen}
                            aria-haspopup="true"
                            onClick={handleAvatarClick}
                            className="h-9 w-9 rounded-full bg-indigo-600 text-xs font-bold text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        >
                            {user.initials || '--'}
                        </button>

                        {isMenuOpen && (
                            <div className="absolute right-0 top-full z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-white/8 bg-slate-900/95 p-2 shadow-2xl backdrop-blur-xl">
                                <div className="mb-1 border-b border-white/5 px-3 py-3">
                                    <p className="truncate text-sm font-bold text-white">
                                        {user.displayName || user.email || 'Account'}
                                    </p>
                                    <p className="mt-1 font-mono text-[10px] uppercase text-slate-500">
                                        {user.role || 'User'}
                                    </p>
                                </div>

                                <div className="py-1">
                                    <p className="px-3 pb-2 pt-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                        Workspace
                                    </p>

                                    {workspaceLinks.map((link) => (
                                        <Link
                                            key={link.path}
                                            href={link.path}
                                            onClick={() => {
                                                setIsMenuOpen(false);
                                                setIsMenuPinned(false);
                                            }}
                                            className={flyoutLinkClass(link.path)}
                                        >
                                            <span className="mt-0.5 shrink-0 text-indigo-400">
                                                <MenuIcon name={link.icon} />
                                            </span>
                                            <span className="min-w-0">
                                                <span className="block text-xs font-bold">
                                                    {link.name}
                                                </span>
                                                <span className="mt-1 block text-[11px] leading-relaxed text-slate-500">
                                                    {link.description}
                                                </span>
                                            </span>
                                        </Link>
                                    ))}
                                </div>

                                <div className="mt-1 border-t border-white/5 py-1">
                                    <p className="px-3 pb-2 pt-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                        Account
                                    </p>

                                    {accountLinks.map((link) => (
                                        <Link
                                            key={link.path}
                                            href={link.path}
                                            onClick={() => {
                                                setIsMenuOpen(false);
                                                setIsMenuPinned(false);
                                            }}
                                            className={flyoutLinkClass(link.path)}
                                        >
                                            <span className="mt-0.5 shrink-0 text-slate-400">
                                                <MenuIcon name={link.icon} />
                                            </span>
                                            <span className="min-w-0 pt-0.5 text-xs font-semibold">
                                                {link.name}
                                            </span>
                                        </Link>
                                    ))}
                                </div>

                                <div className="mt-1 border-t border-white/5 pt-1">
                                    <button
                                        type="button"
                                        disabled={isSigningOut}
                                        onClick={handleSignOut}
                                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-bold text-rose-400 transition-colors hover:bg-rose-500/10 hover:text-rose-300 disabled:opacity-50"
                                    >
                                        <MenuIcon name="logout" />
                                        {isSigningOut ? 'Signing out…' : 'Sign Out'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link
                        href="/auth/login"
                        className="inline-flex h-9 w-22 items-center justify-center rounded-xl bg-indigo-600 px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-indigo-500"
                    >
                        Sign In
                    </Link>
                )}
            </div>
        </nav>
    );
}
