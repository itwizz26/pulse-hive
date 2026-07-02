'use client';

import Link from 'next/link';
import { ArrowRight, Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { GlowaVeeLogo } from '@/components/glowa-vee-logo';

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity } = useCart();
    const subtotal = cart.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

    return (
        // Outer wrapper with horizontal spacing
        <div className="w-full py-0">
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
                    <div className="absolute top-2 right-2 z-10 flex items-center rounded-full border border-[#d4c8ae] bg-[#faf5e1] px-3 py-2 text-[#4a3b20] shadow-[0_10px_25px_rgba(34,30,22,0.08)]" aria-live="polite" aria-label={`${cart.length} items in cart`}>
                        <div className="relative flex items-center justify-center">
                            <ShoppingCart size={28} className="text-[#4a3b20]" aria-hidden />
                            <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center rounded-full bg-[#3d2c10] text-white text-xs font-bold">
                                {cart.length}
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {cart.length === 0 ? (
                <div className="w-full rounded-2xl border border-[#e5e0d3] bg-white p-12 text-center shadow-sm">
                    <p className="mt-3 text-[0.7rem] uppercase tracking-[0.25em] text-[#bda777]">Your Shopping Bag</p>
                    <p className="text-md font-medium text-[#2d2822]">Your bag is empty.</p>
                    <Link href="/" className="mt-8 inline-block rounded-full bg-[#8b6e29] px-8 py-3 text-[11px] font-bold uppercase tracking-[0.25em] text-white transition hover:bg-[#a68635]">
                        Explore Collection
                    </Link>
                </div>
            ) : (
                <div className="w-full space-y-6">
                    {/* Cart Items List - Added gap between items */}
                    <div className="flex w-full flex-col gap-4">
                        {cart.map((item: any) => (
                            <div key={item.id} className="flex w-full items-center justify-between rounded-2xl border border-[#e5e0d3] bg-white p-6 shadow-sm">
                                <div className="flex flex-col gap-1.5">
                                    <p className="text-sm font-semibold text-[#2d2822]">{item.name}</p>
                                    <p className="text-xs text-[#8b6e29]">R{item.price}</p>
                                </div>
                                
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-3 rounded-full border border-[#f3ede3] bg-[#fdfaf5] px-3 py-1.5">
                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-[#5c5448]"><Minus size={12} /></button>
                                        <span className="w-6 text-center text-xs font-medium">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-[#5c5448]"><Plus size={12} /></button>
                                    </div>
                                    <button onClick={() => removeFromCart(item.id)} className="text-[#d1c5a8] transition hover:text-[#8b6e29]">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary Section - Added spacing from items */}
                    <div className="mt-10 w-full rounded-2xl border border-[#e5e0d3] bg-white p-8 shadow-sm">
                        <div className="mb-6 flex items-center justify-between text-sm">
                            <span className="font-medium text-[#7a7266]">Subtotal</span>
                            <span className="font-semibold text-[#2d2822]">R{subtotal}</span>
                        </div>
                        <Link href="/checkout" className="block w-full rounded-xl bg-[#8b6e29] py-4 text-center text-[12px] font-bold uppercase tracking-[0.25em] text-white transition hover:bg-[#a68635] active:scale-[0.98]">
                            Continue to checkout
                        </Link>
                    </div>
                </div>
            )}
            <div className="h-18 sm:h-16" />
        </div>
    );
}