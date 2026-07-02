'use client';

import Link from 'next/link';
import { ArrowRight, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { GlowaVeeLogo } from '@/components/glowa-vee-logo';

export default function OrdersPage() {
    const { orders } = useCart();

    return (
        <div className="mt-0 mb-8 w-full p-5 sm:p-6 lg:p-7">
            <section className="glass-panel relative p-5 sm:p-6 lg:p-7 mb-7 rounded-b-2xl overflow-hidden">
                {/* Grid with 3 columns: 1fr (spacer), 1fr (content), 1fr (the bag indicator) */}
                <div className="grid grid-cols-[auto_1fr_auto] items-center">
                    
                    {/* Spacer to balance the right-hand element */}
                    <div className="w-10"></div>

                    {/* Centered Content */}
                    <div className="flex flex-col items-center justify-center w-full">
                        <GlowaVeeLogo />
                    </div>

                    {/* Right-hand element */}
                    <div className="absolute top-2 right-2 z-10 flex items-center rounded-full border border-[#d4c8ae] bg-[#faf5e1] px-3 py-2 text-[#4a3b20] shadow-[0_10px_25px_rgba(34,30,22,0.08)]" aria-live="polite" aria-label={`${orders.length} items in cart`}>
                        <div className="relative flex items-center justify-center">
                            <ShoppingCart size={28} className="text-[#4a3b20]" aria-hidden />
                            <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center rounded-full bg-[#3d2c10] text-white text-xs font-bold">
                                {orders.length}
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {orders.length === 0 ? (
                <div className="rounded-3xl border border-[#e5e0d3] bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.06)] text-center">
                    <p className="text-lg font-semibold text-[#040404]">No orders yet.</p>
                    <p className="mt-2 text-sm text-[#4a3b20]">Complete a checkout and your orders will appear here instantly.</p>
                    <Link href="/" className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#3d2c10] to-[#f3c54b] px-4 py-2 text-sm font-semibold text-black shadow-lg shadow-[#3d2c10]/10 transition hover:brightness-105">
                        Shop now <ArrowRight size={14} />
                    </Link>
                </div>
            ) : (
                <div className="mt-4 space-y-3">
                    {orders.map((order: any) => (
                        <div key={order.id} className="rounded-3xl border border-[#e5e0d3] bg-white p-4 shadow-[0_12px_30px_rgba(0,0,0,0.06)]">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-sm font-semibold text-[#040404]">{order.id}</p>
                                    <p className="mt-1 text-xs text-[#4a3b20]">{order.customerName}</p>
                                </div>
                                <div className="rounded-full border border-[#e5e0d3] bg-[#f8f5f0] px-3 py-1 text-xs font-semibold text-[#040404]">
                                    R{order.total}
                                </div>
                            </div>
                            <p className="mt-3 text-xs uppercase tracking-[0.24em] text-[#7a7266]">{new Date(order.createdAt).toLocaleDateString()}</p>
                            <div className="mt-3 rounded-2xl border border-[#e5e0d3] bg-[#f8f5f0] p-3 text-sm text-[#040404]">
                                {order.items.map((item: any) => (
                                    <div key={item.id} className="flex items-center justify-between py-1">
                                        <span>{item.name}</span>
                                        <span>x{item.quantity}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}