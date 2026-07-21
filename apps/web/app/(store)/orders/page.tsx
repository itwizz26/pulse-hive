'use client';

import Link from 'next/link';
import { ArrowRight, ShoppingCart, PackageOpen, Clock } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { GlowaVeeLogo } from '@/components/glowa-vee-logo';

export default function OrdersPage() {
    const { orders, cart } = useCart();

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
                        <Clock size={12} /> Purchase History
                    </span>
                    <h1 className="text-2xl font-serif text-(--color-text)">Your Orders</h1>
                </div>

                {orders.length === 0 ? (
                    <div className="w-full border border-(--color-border-strong) bg-white p-10 text-center shadow-xs flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-(--color-surface) flex items-center justify-center text-(--color-gold-dark) mb-4 border border-(--color-border)">
                            <PackageOpen size={28} />
                        </div>
                        <h2 className="text-lg font-serif text-(--color-text) mb-1">No orders yet</h2>
                        <p className="text-xs text-(--color-text-muted) max-w-xs mb-6">Complete a checkout and your order tracking history will appear here instantly.</p>
                        <Link href="/" className="w-full h-12 inline-flex items-center justify-center gap-2 bg-linear-to-r from-[#3d2c10] to-[#f3c54b] text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-[#3d2c10]/15 transition-all hover:brightness-105">
                            Shop collection <ArrowRight size={14} />
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {orders.map((order: any) => (
                            <div key={order.id} className="border border-(--color-border-strong) bg-white p-5 shadow-xs space-y-4">
                                <div className="flex items-center justify-between gap-3 pb-3 border-b border-(--color-border)">
                                    <div>
                                        <span className="text-xs font-bold text-(--color-text) block">{order.id}</span>
                                        <span className="text-[10px] text-(--color-text-muted) block">{order.customerName}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs sm:text-sm font-bold text-(--color-gold-dark) block">
                                            R{Number(order.total).toFixed(2)}
                                        </span>
                                        <span className="text-[10px] text-(--color-text-muted) block">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="border border-(--color-border) bg-(--color-background) p-3 space-y-2">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-(--color-text-muted) block">Ordered Items</span>
                                    {order.items.map((item: any) => (
                                        <div key={item.id} className="flex items-center justify-between text-xs py-1 border-b border-(--color-border) last:border-b-0">
                                            <span className="text-(--color-text) font-medium">{item.name}</span>
                                            <span className="text-(--color-text-muted) font-semibold">x{item.quantity}</span>
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