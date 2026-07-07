'use client';

import Link from 'next/link';
import { ArrowRight, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { GlowaVeeLogo } from '@/components/glowa-vee-logo';

export default function OrdersPage() {
    const { orders } = useCart();

    return (
        <div className="w-full pb-10">
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md p-6">
                <div className="flex justify-center items-center">
                    <GlowaVeeLogo />
                </div>
                
                <Link 
                    href="/orders" 
                    className="absolute top-4 right-4 flex items-center p-2 text-[#4a3b20] transition-transform hover:scale-105" 
                    aria-label={`${orders.length} items in cart`}
                >
                    <div className="relative">
                        <ShoppingCart size={24} />
                        <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center rounded-full bg-[#3d2c10] text-white text-[10px] font-bold">
                            {orders.length}
                        </span>
                    </div>
                </Link>
            </header>

            <main className="flex flex-col gap-2">
                <div className="w-full h-2" />

                {orders.length === 0 ? (
                    <div className="border border-[#e5e0d3] bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.06)] text-center">
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8b6e29]">No orders yet.</p>
                        <p className="text-sm text-[#4a3b20]">Complete a checkout and your orders will appear here instantly.</p>
                        <Link href="/" className="w-full h-9 mt-5 inline-flex items-center justify-center gap-2 bg-linear-to-r from-[#3d2c10] to-[#f3c54b] text-sm font-semibold text-white shadow-lg shadow-[#3d2c10]/10 transition hover:brightness-105">
                            Shop now <ArrowRight size={14} />
                        </Link>
                    </div>
                ) : (
                    <div className="mt-4 space-y-3">
                        {orders.map((order: any) => (
                            <div key={order.id} className="border border-[#e5e0d3] bg-white p-4 shadow-[0_12px_30px_rgba(0,0,0,0.06)]">
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
                                <div className="mt-3 border border-[#e5e0d3] bg-white p-3 text-sm text-[#040404]">
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
            </main>
        </div>
    );
}