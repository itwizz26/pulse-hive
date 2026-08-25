'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { User, Package, MapPin, LogOut, ArrowRight, ShoppingCart, ShieldCheck, Loader2, Award } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { GlowaVeeLogo } from '@/components/glowa-vee-logo';
import { apiClient } from '@/app/api/api-client';

interface UserProfile {
    email: string;
    displayName?: string;
    role: string;
}

export default function AccountPage() {
    const { cart, orders } = useCart();
    const router = useRouter();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('auth_token');
            if (!token) {
                router.push('/signin');
                return;
            }

            try {
                const data = await apiClient.get<UserProfile>('/auth/profile');
                setUser(data);
            } catch (err) {
                localStorage.removeItem('auth_token');
                router.push('/signin');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        router.push('/signin');
    };

    if (loading) {
        return (
            <div className="w-full min-h-screen bg-(--color-background) flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 size={24} className="animate-spin text-(--color-gold-dark)" />
                    <span className="text-xs font-bold uppercase tracking-wider text-(--color-text-muted)">Loading account...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-(--color-background) pb-12 box-border">
            {/* Header */}
            <header className="top-5 z-40 bg-(--color-surface)/95 backdrop-blur-md border-b border-(--color-border) p-6">
                <div className="flex justify-center items-center">
                    <GlowaVeeLogo />
                </div>
            </header>

            <main className="flex flex-col gap-6 px-6 pt-6 max-w-full mx-auto w-full box-border">
                {/* Page Title & Breadcrumb indicator */}
                <div className="flex flex-col gap-1 items-center text-center">
                    <div className="w-12 h-12 bg-(--color-surface) flex items-center justify-center text-(--color-gold-dark) mb-2 rounded-full border border-(--color-border)">
                        <User size={20} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-(--color-gold-dark)">
                        GlowaVee Elite Client Portal
                    </span>
                    <h1 className="text-2xl font-serif text-(--color-text)">
                        {user?.displayName ? `Welcome back, ${user.displayName}` : 'My Account Sanctuary'}
                    </h1>
                    <h2 className="text-xs font-medium text-(--color-gold-dark)">Username: {user?.email}</h2>
                    <p className="text-xs text-(--color-text-muted)">Manage your bespoke beauty profile, saved delivery locations, and order history.</p>
                </div>

                {/* Grid layout matching Contact Page style */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left Column: Account Summary / Status */}
                    <div className="border border-(--color-border-strong) p-6 shadow-xs space-y-4 md:col-span-1">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-(--color-text)">Account Standing</h2>
                        
                        <div className="space-y-3">
                            <div className="p-3 space-y-0.5">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-(--color-text-muted) block">Total Orders</span>
                                <span className="text-sm font-serif text-(--color-text) block">{orders.length} Curation(s)</span>
                            </div>
                            <div className="p-3 space-y-0.5">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-(--color-text-muted) block">Reward Standing</span>
                                <span className="text-sm font-serif text-(--color-text) block">Glow Tier 1</span>
                            </div>
                            <div className="p-3 space-y-0.5">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-(--color-text-muted) block">Concierge Access</span>
                                <span className="text-sm font-serif text-(--color-gold-dark) block">Priority 24/7</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Navigation & Settings */}
                    <div className="border border-(--color-border-strong) p-6 shadow-xs md:col-span-2 space-y-4">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-(--color-text)">Navigation & Settings</h2>
                        
                        <div className="space-y-3">
                            <Link 
                                href="/orders" 
                                className="flex items-center justify-between p-4 border border-(--color-border) transition-all hover:border-[#3d2c10] hover:shadow-xs group"
                            >
                                <div className="flex items-center gap-3.5">
                                    <div className="w-9 h-9 bg-(--color-surface) flex items-center justify-center text-(--color-gold-dark) border border-(--color-border)">
                                        <Package size={18} />
                                    </div>
                                    <div>
                                        <span className="text-xs sm:text-sm font-bold text-(--color-text) block group-hover:text-(--color-gold-dark) transition-colors">Order History</span>
                                        <span className="text-[10px] text-(--color-text-muted) block">Track active shipments and past purchases</span>
                                    </div>
                                </div>
                                <ArrowRight size={16} className="text-(--color-text-muted) transition-transform group-hover:translate-x-1" />
                            </Link>

                            <div className="flex items-center justify-between p-4 border border-(--color-border) transition-all hover:border-(--color-border-strong)">
                                <div className="flex items-center gap-3.5">
                                    <div className="w-9 h-9 bg-(--color-surface) flex items-center justify-center text-(--color-gold-dark) border border-(--color-border)">
                                        <MapPin size={18} />
                                    </div>
                                    <div>
                                        <span className="text-xs sm:text-sm font-bold text-(--color-text) block">Saved Delivery Addresses</span>
                                        <span className="text-[10px] text-(--color-text-muted) block">Manage your primary shipping destinations</span>
                                    </div>
                                </div>
                                <span className="text-[10px] font-bold text-(--color-gold-dark) uppercase bg-(--color-surface) px-2.5 py-1 border border-(--color-border)">Primary Active</span>
                            </div>

                            <Link 
                                href="/contact" 
                                className="flex items-center justify-between p-4 border border-(--color-border) transition-all hover:border-[#3d2c10] hover:shadow-xs group"
                            >
                                <div className="flex items-center gap-3.5">
                                    <div className="w-9 h-9 bg-(--color-surface) flex items-center justify-center text-(--color-gold-dark) border border-(--color-border)">
                                        <Award size={18} />
                                    </div>
                                    <div>
                                        <span className="text-xs sm:text-sm font-bold text-(--color-text) block group-hover:text-(--color-gold-dark) transition-colors">Skin Consultation & Support</span>
                                        <span className="text-[10px] text-(--color-text-muted) block">Connect directly with our beauty concierge team</span>
                                    </div>
                                </div>
                                <ArrowRight size={16} className="text-(--color-text-muted) transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>

                        {/* Logout Action styled like Contact Page submit button */}
                        <div className="pt-4 border-t border-(--color-border)">
                            <button 
                                type="button" 
                                onClick={handleLogout} 
                                className="w-full h-12 mt-2 inline-flex items-center justify-center gap-2 bg-linear-to-r from-[#3d2c10] to-[#f3c54b] text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-[#3d2c10]/10 transition hover:brightness-105"
                            >
                                Log out of account session <LogOut size={14} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Trust Badge */}
                <div className="flex items-center justify-center gap-1.5 pt-2 text-[10px] text-(--color-text-muted)">
                    <ShieldCheck size={14} className="text-(--color-gold-dark)" />
                    <span>Encrypted & secure client profile portal</span>
                </div>
            </main>
        </div>
    );
}