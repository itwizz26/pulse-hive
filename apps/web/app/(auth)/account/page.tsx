'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { User, Package, MapPin, LogOut, ArrowRight, ShoppingCart, ShieldCheck, Loader2, Award, Sparkles, Heart } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { GlowaVeeLogo } from '@/components/glowa-vee-logo';
import { apiClient } from '@/lib/api-client';

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
        <div className="w-full min-h-screen bg-(--color-background) pb-16 box-border">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-(--color-surface)/95 backdrop-blur-md border-b border-(--color-border) p-6 box-border">
                <div className="flex justify-center items-center">
                    <GlowaVeeLogo />
                </div>
                
                <Link 
                    href="/cart" 
                    className="absolute top-6 right-6 text-(--color-gold-dark) transition-transform hover:scale-105" 
                    aria-label={`${cart.length} items in cart`}
                >
                    <div className="relative">
                        <ShoppingCart size={32} />
                        <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center rounded-full bg-(--color-gold-dark) text-white text-[10px] font-bold">
                            {cart.length}
                        </span>
                    </div>
                </Link>
            </header>

            <main className="flex flex-col gap-6 px-6 pt-6 max-w-5xl mx-auto w-full box-border">
                {/* Page Title & Breadcrumb indicator */}
                <div className="flex flex-col gap-1 items-center text-center">
                    <div className="w-12 h-12 bg-linear-to-br from-[#3d2c10] to-[#f3c54b] flex items-center justify-center text-white mb-2 rounded-full shadow-md shadow-[#3d2c10]/15 border border-(--color-border)">
                        <User size={20} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-(--color-gold-dark)">
                        GlowaVee Elite Client Portal
                    </span>
                    <h1 className="text-2xl font-serif text-(--color-text)">
                        {user?.displayName ? `Welcome back, ${user.displayName}` : 'My Account Sanctuary'}
                    </h1>
                    <p className="text-xs text-(--color-text-muted)">Manage your bespoke beauty profile, saved delivery locations, and order history.</p>
                </div>

                {/* Account Details & Status Banner */}
                <div className="w-full border border-(--color-border-strong) bg-white shadow-xs overflow-hidden box-border">
                    <div className="bg-linear-to-r from-[#3d2c10] to-[#594018] p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-[#f3c54b]">
                                <Sparkles size={14} />
                                <span className="text-[10px] uppercase font-bold tracking-widest">VIP Membership Status</span>
                            </div>
                            <h2 className="text-lg font-serif">{user?.email}</h2>
                        </div>
                        <div className="px-3.5 py-1.5 bg-white/10 backdrop-blur-xs border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                            {user?.role || 'Valued Member'}
                        </div>
                    </div>

                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-4 border-b border-(--color-border)">
                            <div className="p-4 border border-(--color-border) bg-(--color-background) rounded-xs space-y-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-(--color-text-muted) block">Total Orders</span>
                                <span className="text-base font-serif text-(--color-text) block">{orders.length} Curation(s)</span>
                            </div>
                            <div className="p-4 border border-(--color-border) bg-(--color-background) rounded-xs space-y-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-(--color-text-muted) block">Reward Standing</span>
                                <span className="text-base font-serif text-(--color-text) block">Glow Tier 1</span>
                            </div>
                            <div className="p-4 border border-(--color-border) bg-(--color-background) rounded-xs space-y-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-(--color-text-muted) block">Concierge Access</span>
                                <span className="text-base font-serif text-(--color-gold-dark) block">Priority 24/7</span>
                            </div>
                        </div>

                        {/* Quick Links / Sections */}
                        <div className="space-y-3 pt-2">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-(--color-text)">Navigation & Settings</h3>
                            
                            <Link 
                                href="/orders" 
                                className="flex items-center justify-between p-4 border border-(--color-border) bg-white transition-all hover:border-[#3d2c10] hover:shadow-xs group"
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

                            <div className="flex items-center justify-between p-4 border border-(--color-border) bg-white transition-all hover:border-(--color-border-strong)">
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
                                className="flex items-center justify-between p-4 border border-(--color-border) bg-white transition-all hover:border-[#3d2c10] hover:shadow-xs group"
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

                        {/* Logout Action */}
                        <div className="pt-4 border-t border-(--color-border)">
                            <button 
                                type="button" 
                                onClick={handleLogout} 
                                className="w-full h-12 inline-flex items-center justify-center gap-2 border border-rose-200 bg-rose-50/50 text-xs font-bold uppercase tracking-wider text-rose-700 transition hover:bg-rose-100/60"
                            >
                                <LogOut size={14} /> Log out of account session
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