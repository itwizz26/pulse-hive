'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle2, UserPlus, Lock, ShieldCheck, LogIn, Sparkles, MapPin, Home } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { GlowaVeeLogo } from '@/components/glowa-vee-logo';

export default function CheckoutPage() {
    const { checkoutOrder } = useCart();
    const [cartData, setCartData] = useState<any[]>([]);
    const [shippingOption, setShippingOption] = useState<any>(null);
    const [subtotal, setSubtotal] = useState(0);
    const [shippingFee, setShippingFee] = useState(0);
    const [totalToPay, setTotalToPay] = useState(0);

    const [customerName, setCustomerName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    
    // Locker specific state
    const [lockerName, setLockerName] = useState('');

    // Door to Door specific state (paired layout fields)
    const [street, setStreet] = useState('');
    const [suburb, setSuburb] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');

    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        const storedShipping = localStorage.getItem('glowavee_selected_shipping');
        const storedSummary = localStorage.getItem('glowavee_cart_summary');

        if (storedShipping) {
            try {
                setShippingOption(JSON.parse(storedShipping));
            } catch (e) {
                console.error("Failed to parse shipping option", e);
            }
        }

        if (storedSummary) {
            try {
                const parsed = JSON.parse(storedSummary);
                setCartData(parsed.items || []);
                setSubtotal(parsed.subtotal || 0);
                setShippingFee(parsed.shippingFee || 0);
                setTotalToPay(parsed.totalToPay || 0);
            } catch (e) {
                console.error("Failed to parse cart summary", e);
            }
        }
    }, []);

    const isLocker = shippingOption?.id === 'tcg-locker';

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!customerName.trim() || !phoneNumber.trim()) return;

        let finalDeliveryString = '';
        if (isLocker) {
            if (!lockerName.trim()) return;
            finalDeliveryString = `PUDO Locker: ${lockerName.trim()}`;
        } else {
            if (!street.trim() || !suburb.trim() || !city.trim() || !postalCode.trim()) return;
            finalDeliveryString = `${street.trim()}, ${suburb.trim()}, ${city.trim()}, ${postalCode.trim()}`;
        }

        checkoutOrder(customerName, finalDeliveryString, phoneNumber, {
            method: shippingOption?.name || 'Standard Delivery',
            fee: shippingFee,
            total: totalToPay,
            items: cartData
        });
        
        setCompleted(true);
    };

    return (
        <div className="w-full min-h-screen bg-(--color-background) pb-16 box-border">
            <header className="sticky top-0 z-40 bg-(--color-surface)/95 backdrop-blur-md border-b border-(--color-border) p-6 box-border flex items-center justify-center">
                <GlowaVeeLogo />
            </header>

            <main className="flex flex-col gap-6 px-6 pt-6 max-w-5xl mx-auto w-full box-border">
                <div className="flex flex-col gap-1 items-center text-center">
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-(--color-gold-dark) flex items-center gap-1.5">
                        <Lock size={12} /> Secure Checkout
                    </span>
                    <h1 className="text-2xl font-serif text-(--color-text)">Delivery Details</h1>
                </div>

                {cartData.length === 0 && !completed ? (
                    <div className="w-full border border-(--color-border-strong) bg-white p-10 text-center shadow-xs flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-(--color-surface) flex items-center justify-center text-(--color-gold-dark) mb-4 border border-(--color-border)">
                            <Sparkles size={28} />
                        </div>
                        <h2 className="text-lg font-serif text-(--color-text) mb-1">Your bag is currently empty</h2>
                        <p className="text-xs text-(--color-text-muted) max-w-xs mb-6">Explore our luxury collagen and skincare collection to find your ideal glow.</p>
                        <Link href="/cart" className="w-full h-12 inline-flex items-center justify-center gap-2 bg-linear-to-r from-[#3d2c10] to-[#f3c54b] text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-[#3d2c10]/15 transition-all hover:brightness-105">
                            Return to Cart <ArrowRight size={14} />
                        </Link>
                    </div>
                ) : completed ? (
                    <div className="w-full border border-(--color-border-strong) bg-white p-10 text-center shadow-xs flex flex-col items-center justify-center space-y-6">
                        <div className="w-16 h-16 bg-(--color-surface) flex items-center justify-center text-(--color-gold-dark) rounded-full border border-(--color-border) shadow-inner">
                            <CheckCircle2 size={32} />
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-xl font-serif text-(--color-text)">Order Successfully Confirmed</h2>
                            <p className="text-xs text-(--color-text-muted) max-w-sm mx-auto">Your skincare curation has been secured via {shippingOption?.name}. Track its progress live from your account.</p>
                        </div>
                        
                        <div className="w-full max-w-md pt-6 border-t border-(--color-border) space-y-3">
                            <div className="space-y-1">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-(--color-text)">Access Your Client Portal</h3>
                                <p className="text-[11px] text-(--color-text-muted)">Sign in to track real-time shipping status or create your account below.</p>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                <Link 
                                    href="/signin" 
                                    className="w-full h-11 inline-flex items-center justify-center gap-2 border border-(--color-border-strong) bg-white text-xs font-bold uppercase tracking-wider text-(--color-text) shadow-xs transition hover:bg-(--color-surface)"
                                >
                                    <LogIn size={14} className="text-(--color-gold-dark)" /> Sign In
                                </Link>
                                <Link 
                                    href="/signup" 
                                    className="w-full h-11 inline-flex items-center justify-center gap-2 bg-linear-to-r from-[#3d2c10] to-[#f3c54b] text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-[#3d2c10]/15 transition-all hover:brightness-105"
                                >
                                    Create Account <UserPlus size={14} />
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="w-full border border-(--color-border-strong) bg-white p-6 shadow-xs">
                        <div className="mb-5 flex items-center justify-between border-b border-(--color-border) pb-4">
                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-(--color-gold-dark) mb-0.5">
                                    Shipping Information *
                                </p>
                                <p className="text-xs text-(--color-text-muted)">
                                    Method: <span className="font-bold text-(--color-text)">{shippingOption ? shippingOption.name : 'Standard Delivery'}</span>
                                </p>
                            </div>
                            <Link href="/cart" className="text-[11px] font-bold text-(--color-gold-dark) uppercase tracking-wider hover:underline">
                                Change
                            </Link>
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

                            {isLocker ? (
                                /* Locker to Locker: Single Text Input */
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] font-bold uppercase tracking-wider text-(--color-text) flex items-center gap-1.5">
                                            <MapPin size={12} className="text-(--color-gold-dark)" />
                                            PUDO Locker Name / Location *
                                        </label>
                                        <a 
                                            href="https://www.thecourierguy.co.za/pudo" 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="text-[10px] font-medium text-(--color-gold-dark) hover:underline"
                                        >
                                            Find Locker ↗
                                        </a>
                                    </div>
                                    <input
                                        type="text"
                                        value={lockerName}
                                        onChange={(e) => setLockerName(e.target.value)}
                                        className="w-full border border-(--color-border) bg-white px-4 py-3 text-xs sm:text-sm outline-none transition focus:border-[#3d2c10]"
                                        placeholder="e.g. Engen 1-Stop Carousel"
                                        required
                                    />
                                    <p className="text-[10px] text-(--color-text-muted)">
                                        Please enter the name or terminal ID of your chosen PUDO locker location.
                                    </p>
                                </div>
                            ) : (
                                /* Door to Door: Paired Layout (Street + Suburb on line 1, City + Code on line 2) */
                                <div className="space-y-3 pt-1">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-(--color-text) flex items-center gap-1.5">
                                        <Home size={12} className="text-(--color-gold-dark)" />
                                        Delivery Address Details *
                                    </label>
                                    
                                    {/* Line 1: Street Name & Suburb side-by-side */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <input
                                                type="text"
                                                value={street}
                                                onChange={(e) => setStreet(e.target.value)}
                                                className="w-full border border-(--color-border) bg-white px-4 py-3 text-xs sm:text-sm outline-none transition focus:border-[#3d2c10]"
                                                placeholder="Street Address (e.g. 15 Rose Ave) *"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <input
                                                type="text"
                                                value={suburb}
                                                onChange={(e) => setSuburb(e.target.value)}
                                                className="w-full border border-(--color-border) bg-white px-4 py-3 text-xs sm:text-sm outline-none transition focus:border-[#3d2c10]"
                                                placeholder="Suburb / District *"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Line 2: City & Postal Code side-by-side */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <input
                                                type="text"
                                                value={city}
                                                onChange={(e) => setCity(e.target.value)}
                                                className="w-full border border-(--color-border) bg-white px-4 py-3 text-xs sm:text-sm outline-none transition focus:border-[#3d2c10]"
                                                placeholder="City / Town *"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <input
                                                type="text"
                                                value={postalCode}
                                                onChange={(e) => setPostalCode(e.target.value)}
                                                className="w-full border border-(--color-border) bg-white px-4 py-3 text-xs sm:text-sm outline-none transition focus:border-[#3d2c10]"
                                                placeholder="Postal Code *"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            <button 
                                type="submit" 
                                className="w-full h-12 mt-2 inline-flex items-center justify-center gap-2 bg-linear-to-r from-[#3d2c10] to-[#f3c54b] text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-[#3d2c10]/10 transition hover:brightness-105"
                            >
                                Place order • R{totalToPay.toFixed(2)} <ArrowRight size={16} />
                            </button>

                            <div className="pt-2 text-center">
                                <Link 
                                    href="/cart" 
                                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-(--color-text-muted) transition-colors hover:text-(--color-gold-dark)"
                                >
                                    <ArrowLeft size={14} /> Back to Cart
                                </Link>
                            </div>
                        </form>

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