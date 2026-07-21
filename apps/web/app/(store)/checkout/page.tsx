'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, CheckCircle2, UserPlus, ShoppingCart, Lock, ShieldCheck } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { GlowaVeeLogo } from '@/components/glowa-vee-logo';

export default function CheckoutPage() {
    const { cart, checkoutOrder } = useCart();
    const [customerName, setCustomerName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [completed, setCompleted] = useState(false);

    const subtotal = cart.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!customerName.trim() || !phoneNumber.trim() || !deliveryAddress.trim()) return;
        checkoutOrder(customerName, deliveryAddress, phoneNumber);
        setCompleted(true);
    };

    return (
        <div className="w-full min-h-screen bg-(--color-background) pb-12">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-(--color-surface)/95 backdrop-blur-md border-b border-(--color-border) p-6">
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

            <main className="flex flex-col gap-6 px-6 pt-6">
                {/* Page Title & Breadcrumb indicator */}
                <div className="flex flex-col gap-1 items-center text-center">
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-(--color-gold-dark) flex items-center gap-1.5">
                        <Lock size={12} /> Secure Checkout
                    </span>
                    <h1 className="text-2xl font-serif text-(--color-text)">Delivery Details</h1>
                </div>

                {cart.length === 0 && !completed ? (
                    <div className="w-full border border-(--color-border-strong) bg-white p-10 text-center shadow-xs flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-(--color-surface) flex items-center justify-center text-(--color-gold-dark) mb-4 border border-(--color-border)">
                            <ShoppingCart size={28} />
                        </div>
                        <h2 className="text-lg font-serif text-(--color-text) mb-1">Your bag is currently empty</h2>
                        <p className="text-xs text-(--color-text-muted) max-w-xs mb-6">Explore our luxury collagen and skincare collection to find your ideal glow.</p>
                        <Link href="/" className="w-full h-12 inline-flex items-center justify-center gap-2 bg-linear-to-r from-[#3d2c10] to-[#f3c54b] text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-[#3d2c10]/15 transition-all hover:brightness-105">
                            Shop collection <ArrowRight size={14} />
                        </Link>
                    </div>
                ) : completed ? (
                    <div className="w-full border border-(--color-border-strong) bg-white p-10 text-center shadow-xs flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-(--color-surface) flex items-center justify-center text-(--color-gold-dark) mb-4 rounded-full border border-(--color-border)">
                            <CheckCircle2 size={32} />
                        </div>
                        <h2 className="text-lg font-serif text-(--color-text) mb-1">Order confirmed</h2>
                        <p className="text-xs text-(--color-text-muted) max-w-xs mb-6">We've sent your order summary to WhatsApp.</p>
                        
                        <div className="w-full pt-6 border-t border-(--color-border)">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-(--color-text) mb-1">Save your details</h3>
                            <p className="text-[11px] text-(--color-text-muted) mb-4">Create a password to track orders faster next time.</p>
                            <Link href="/register" className="w-full h-12 inline-flex items-center justify-center gap-2 bg-linear-to-r from-[#3d2c10] to-[#f3c54b] text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-[#3d2c10]/15 transition-all hover:brightness-105">
                                Create Account <UserPlus size={14} />
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="w-full border border-(--color-border-strong) bg-white p-6 shadow-xs">
                        <div className="mb-5">
                            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-(--color-gold-dark) mb-1.5">
                                Shipping Information *
                            </p>
                            <p className="text-xs text-(--color-text-muted)">Please provide your details for delivery.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-(--color-text)">Full Name *</label>
                                <input
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    className="w-full border border-(--color-border) bg-white px-4 py-3 text-xs sm:text-sm outline-none transition focus:border-[#3d2c10]"
                                    placeholder="Enter your full name"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-(--color-text)">WhatsApp Number *</label>
                                <input
                                    type="tel"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    className="w-full border border-(--color-border) bg-white px-4 py-3 text-xs sm:text-sm outline-none transition focus:border-[#3d2c10]"
                                    placeholder="e.g. 082 123 4567"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-(--color-text)">Delivery Address *</label>
                                <textarea
                                    value={deliveryAddress}
                                    onChange={(e) => setDeliveryAddress(e.target.value)}
                                    className="h-24 w-full border border-(--color-border) bg-white px-4 py-3 text-xs sm:text-sm outline-none transition focus:border-[#3d2c10] resize-none"
                                    placeholder="Street address, suburb, city, postal code"
                                    required
                                />
                            </div>
                            
                            <button 
                                type="submit" 
                                className="w-full h-12 mt-2 inline-flex items-center justify-center gap-2 bg-linear-to-r from-[#3d2c10] to-[#f3c54b] text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-[#3d2c10]/10 transition hover:brightness-105"
                            >
                                Place order • R{subtotal.toFixed(2)} <ArrowRight size={16} />
                            </button>
                        </form>

                        {/* Trust Badge */}
                        <div className="flex items-center justify-center gap-1.5 mt-6 pt-6 border-t border-(--color-border) text-[10px] text-(--color-text-muted)">
                            <ShieldCheck size={14} className="text-(--color-gold-dark)" />
                            <span>Encrypted & secure checkout processing</span>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}