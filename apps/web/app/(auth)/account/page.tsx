'use client';

import Link from 'next/link';
import { User, Package, MapPin, LogOut, ArrowRight, ShoppingCart, ShieldCheck } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { GlowaVeeLogo } from '@/components/glowa-vee-logo';

export default function AccountPage() {
    const { cart, orders } = useCart();

    return (
        <div className="w-full min-h-screen bg-(--color-background) pb-12 box-border">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-(--color-surface)/95 backdrop-blur-md border-b border-(--color-border) p-6 box-border">
                <div className="flex justify-center items-center">
                    <GlowaVeeLogo />
                </div>
                
                <Link 
                    href="/cart" 
                    className="absolute top-6 right-2 text-(--color-gold-dark) transition-transform hover:scale-105" 
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
                    <div className="w-12 h-12 bg-(--color-surface) flex items-center justify-center text-(--color-gold-dark) mb-2 rounded-full border border-(--color-border)">
                        <User size={20} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-(--color-gold-dark)">
                        Client Portal
                    </span>
                    <h1 className="text-2xl font-serif text-(--color-text)">My Account</h1>
                    <p className="text-xs text-(--color-text-muted)">Manage your profile, preferences, and view order history.</p>
                </div>

                {/* Account Details Summary Card */}
                <div className="w-full border border-(--color-border-strong) bg-white p-6 shadow-xs space-y-4 box-border">
                    <div className="flex items-center justify-between pb-4 border-b border-(--color-border)">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-(--color-text-muted) block">Signed in as</span>
                            <span className="text-xs sm:text-sm font-bold text-(--color-text)">client@glowavee.com</span>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 bg-(--color-surface) text-(--color-gold-dark) border border-(--color-border)">
                            Member
                        </span>
                    </div>

                    {/* Quick Links / Sections */}
                    <div className="space-y-2.5 pt-2">
                        <Link 
                            href="/orders" 
                            className="flex items-center justify-between p-3.5 border border-(--color-border) bg-(--color-background) transition-colors hover:border-[#3d2c10]"
                        >
                            <div className="flex items-center gap-3">
                                <Package size={18} className="text-(--color-gold-dark)" />
                                <div>
                                    <span className="text-xs sm:text-sm font-bold text-(--color-text) block">Order History</span>
                                    <span className="text-[10px] text-(--color-text-muted) block">{orders.length} active or past orders</span>
                                </div>
                            </div>
                            <ArrowRight size={16} className="text-(--color-text-muted)" />
                        </Link>

                        <div className="flex items-center justify-between p-3.5 border border-(--color-border) bg-(--color-background)">
                            <div className="flex items-center gap-3">
                                <MapPin size={18} className="text-(--color-gold-dark)" />
                                <div>
                                    <span className="text-xs sm:text-sm font-bold text-(--color-text) block">Saved Addresses</span>
                                    <span className="text-[10px] text-(--color-text-muted) block">Manage your delivery locations</span>
                                </div>
                            </div>
                            <span className="text-[10px] font-semibold text-(--color-text-muted) uppercase">Default</span>
                        </div>
                    </div>

                    {/* Logout Button */}
                    <button 
                        type="button" 
                        onClick={() => {}} 
                        className="w-full h-12 mt-4 inline-flex items-center justify-center gap-2 border border-(--color-border-strong) bg-white text-xs font-bold uppercase tracking-wider text-(--color-text) shadow-xs transition hover:bg-(--color-surface)"
                    >
                        <LogOut size={14} /> Log out of account
                    </button>
                </div>

                {/* Trust Badge */}
                <div className="flex items-center justify-center gap-1.5 pt-2 text-[10px] text-(--color-text-muted)">
                    <ShieldCheck size={14} className="text-(--color-gold-dark)" />
                    <span>Protected client profile session</span>
                </div>
            </main>
        </div>
    );
}