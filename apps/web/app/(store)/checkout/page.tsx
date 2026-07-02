'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useCart } from '@/context/cart-context';

export default function CheckoutPage() {
    const { cart, checkoutOrder } = useCart();
    const [customerName, setCustomerName] = useState('');
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [completed, setCompleted] = useState(false);

    const subtotal = cart.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (!customerName.trim() || !deliveryAddress.trim()) return;
        checkoutOrder(customerName, deliveryAddress);
        setCompleted(true);
    };

    if (cart.length === 0 && !completed) {
        return (
            <div className="mx-auto max-w-lg p-5">
                <div className="rounded-2xl border border-[#e5e0d3] bg-white p-10 text-center shadow-sm">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8b6e29]">Your bag is empty</p>
                    <Link href="/" className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#d4c8ae] px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-[#5c5448] transition hover:bg-[#f8f5f0]">
                        Explore products <ArrowRight size={14} />
                    </Link>
                </div>
            </div>
        );
    }

    if (completed) {
        return (
            <div className="mx-auto max-w-lg p-5">
                <div className="rounded-2xl border border-[#e5e0d3] bg-white p-10 text-center shadow-sm">
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#bda777]">Success</p>
                    <h1 className="mt-4 text-2xl font-medium text-[#2d2822]">Order confirmed</h1>
                    <p className="mt-2 text-sm text-[#7a7266]">Your premium bundle is being prepared.</p>
                    <Link href="/orders" className="mt-8 block w-full rounded-xl bg-[#8b6e29] py-4 text-[12px] font-bold uppercase tracking-[0.25em] text-white hover:bg-[#a68635]">
                        View orders
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-lg p-5 pb-28">
            {/* Header */}
            <div className="mb-8 text-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#bda777]">Checkout</p>
                <h1 className="mt-2 text-2xl font-medium text-[#2d2822]">Secure your order</h1>
            </div>

            {/* Cart Summary */}
            <div className="mb-6 rounded-2xl border border-[#e5e0d3] bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between text-sm text-[#2d2822]">
                    <span className="font-medium">Subtotal</span>
                    <span className="font-semibold">R{subtotal}</span>
                </div>
                <div className="space-y-3 border-t border-[#f3ede3] pt-4 text-sm text-[#7a7266]">
                    {cart.map((item: any) => (
                        <div key={item.id} className="flex justify-between">
                            <span>{item.name} <span className="text-[10px]">x{item.quantity}</span></span>
                            <span className="font-medium text-[#2d2822]">R{item.price * item.quantity}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full rounded-xl border border-[#e5e0d3] bg-[#fdfaf5] px-4 py-3 text-sm text-[#2d2822] placeholder-[#d1c5a8] outline-none focus:border-[#8b6e29]"
                    placeholder="Full Name"
                />
                <textarea
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="h-24 w-full rounded-xl border border-[#e5e0d3] bg-[#fdfaf5] px-4 py-3 text-sm text-[#2d2822] placeholder-[#d1c5a8] outline-none focus:border-[#8b6e29]"
                    placeholder="Delivery Address"
                />
                <button type="submit" className="w-full rounded-xl bg-[#8b6e29] py-4 text-[12px] font-bold uppercase tracking-[0.25em] text-white transition-all hover:bg-[#a68635] active:scale-[0.98]">
                    Place order
                </button>
            </form>
        </div>
    );
}