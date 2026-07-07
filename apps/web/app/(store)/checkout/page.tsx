'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, CheckCircle2, UserPlus, ShoppingCart } from 'lucide-react';
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
        <div className="w-full pb-10">
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md p-6">
                <div className="flex justify-center items-center">
                    <GlowaVeeLogo />
                </div>
            </header>

            <main className="flex flex-col gap-2">
                <div className="w-full h-2" />

                {cart.length === 0 && !completed ? (
                    <div className="border border-[#e5e0d3] bg-white p-10 text-center shadow-sm">
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8b6e29]">Your bag is empty</p>
                        <Link href="/" className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#d4c8ae] px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-[#5c5448] transition hover:bg-[#f8f5f0]">
                            Explore products <ArrowRight size={14} />
                        </Link>
                    </div>
                ) : completed ? (
                    <div className="border border-[#e5e0d3] bg-white p-10 text-center shadow-sm">
                        <CheckCircle2 className="w-full mx-auto text-[#8b6e29]" size={48} />
                        <h1 className="mt-4 text-2xl font-medium text-[#2d2822]">Order confirmed</h1>
                        <p className="mt-2 text-sm text-[#7a7266]">We've sent your order summary to WhatsApp.</p>
                        
                        <div className="mt-8 border-t border-[#f3ede3] pt-8">
                            <h2 className="mt-2 font-medium text-[#2d2822]">Save your details</h2>
                            <p className="text-xs text-[#7a7266] mb-4">Create a password to track orders faster next time.</p>
                            <Link href="/register" className="w-full h-9 mt-5 inline-flex items-center justify-center gap-2 bg-linear-to-r from-[#3d2c10] to-[#f3c54b] text-sm font-semibold text-white shadow-lg shadow-[#3d2c10]/10 transition hover:brightness-105">
                                Create Account <UserPlus size={14} />
                            </Link>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="border border-[#e5e0d3] bg-white p-10 text-center shadow-sm">
                            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#bda777]">Secure Checkout</p>
                            <h1 className="mt-2 text-2xl font-medium text-[#2d2822]">Delivery Details</h1>
                            <p className="mt-2 text-sm text-[#7a7266]">Please provide your details for delivery.</p>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    className="w-full rounded-xl border border-[#e5e0d3] bg-[#fdfaf5] px-4 py-3 text-sm outline-none focus:border-[#8b6e29]"
                                    placeholder="Full Name"
                                    required
                                />
                                <input
                                    type="tel"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    className="w-full rounded-xl border border-[#e5e0d3] bg-[#fdfaf5] px-4 py-3 text-sm outline-none focus:border-[#8b6e29]"
                                    placeholder="WhatsApp Number"
                                    required
                                />
                                <textarea
                                    value={deliveryAddress}
                                    onChange={(e) => setDeliveryAddress(e.target.value)}
                                    className="h-24 w-full rounded-xl border border-[#e5e0d3] bg-[#fdfaf5] px-4 py-3 text-sm outline-none focus:border-[#8b6e29]"
                                    placeholder="Delivery Address"
                                    required
                                />
                                
                                <button type="submit" className="w-full rounded-xl bg-[#8b6e29] py-4 text-[12px] font-bold uppercase tracking-[0.25em] text-white transition-all hover:bg-[#a68635]">
                                    Place order • R{subtotal}
                                </button>
                            </form>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}