'use client';

import Link from 'next/link';
import { Sparkles, ArrowRight, ShieldCheck, HeartHandshake, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { GlowaVeeLogo } from '@/components/glowa-vee-logo';

export default function AboutPage() {
    const { cart } = useCart();

    return (
        <div className="w-full min-h-screen bg-(--color-background) pb-12 box-border">
            <header className="top-5 z-40 bg-(--color-surface)/95 backdrop-blur-md border-b border-(--color-border) p-6">
                <div className="flex justify-center items-center">
                    <GlowaVeeLogo />
                </div>
                
                <Link 
                    href="/cart" 
                    className="absolute top-5 right-5 transition-transform hover:scale-105" 
                    aria-label={`${cart.length} items in cart`}
                >
                    <div className="relative">
                        <ShoppingCart size={40} className="text-(--color-gold)" />
                        <span className="absolute -top-1 -right-1 w-6 h-6 flex items-center justify-center rounded-full bg-(--color-gold) text-white text-[0.875rem] font-bold">
                            {cart.length}
                        </span>
                    </div>
                </Link>
            </header>

            <main className="flex flex-col gap-6 px-6 pt-6 max-w-full mx-auto w-full box-border">
                <div className="flex flex-col gap-1 items-center text-center">
                    <div className="w-12 h-12 bg-(--color-surface) flex items-center justify-center text-(--color-gold-dark) mb-2 rounded-full border border-(--color-border)">
                        <Sparkles size={20} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-(--color-gold-dark)">
                        Our Heritage
                    </span>
                    <h1 className="text-2xl font-serif text-(--color-text)">About GlowaVee</h1>
                    <p className="text-xs text-(--color-text-muted)">Crafting luxury beauty and wellness essentials for the modern routine.</p>
                </div>

                <div className="w-full border border-(--color-border-strong) bg-white p-6 shadow-xs space-y-6 box-border">
                    <div className="space-y-3">
                        <h2 className="text-base font-serif text-(--color-text)">Pure Quality, Elevated Confidence</h2>
                        <p className="text-xs text-(--color-text-muted) leading-relaxed">
                            At GlowaVee, we believe that self-care is an art form. Founded on the principles of purity, elegance, and uncompromised efficacy, our curation brings together premium formulations designed to honor your natural radiance.
                        </p>
                        <p className="text-xs text-(--color-text-muted) leading-relaxed">
                            Every item in our collection undergoes rigorous vetting to ensure it meets our exacting standards for sustainability, luxury, and performance.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-(--color-border)">
                        <div className="p-4 border border-(--color-border) bg-(--color-background) space-y-2">
                            <div className="flex items-center gap-2 text-(--color-gold-dark)">
                                <ShieldCheck size={18} />
                                <span className="text-xs font-bold uppercase tracking-wider text-(--color-text)">Premium Standards</span>
                            </div>
                            <p className="text-[11px] text-(--color-text-muted)">Sourced from trusted artisan laboratories committed to clean beauty.</p>
                        </div>

                        <div className="p-4 border border-(--color-border) bg-(--color-background) space-y-2">
                            <div className="flex items-center gap-2 text-(--color-gold-dark)">
                                <HeartHandshake size={18} />
                                <span className="text-xs font-bold uppercase tracking-wider text-(--color-text)">Client Focused</span>
                            </div>
                            <p className="text-[11px] text-(--color-text-muted)">Dedicated support and tailored routines curated for your unique skin profile.</p>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-(--color-border) text-center">
                        <Link 
                            href="/" 
                            className="w-full h-12 inline-flex items-center justify-center gap-2 bg-linear-to-r from-[#3d2c10] to-[#f3c54b] text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-[#3d2c10]/10 transition hover:brightness-105"
                        >
                            Explore Collection <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}