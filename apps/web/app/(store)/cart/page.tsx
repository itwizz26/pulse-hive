'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, Minus, Plus, Trash2, ShoppingCart, Truck } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { GlowaVeeLogo } from '@/components/glowa-vee-logo';

const COURIER_OPTIONS = [
    { id: 'paxi-7-9', name: 'PAXI R60', time: '7-9 days', price: 60 },
    { id: 'paxi-3-5', name: 'PAXI R110', time: '3-5 days', price: 110 },
    { id: 'tcg-locker', name: 'The Courier Guy Locker R80', time: '2-3 days', price: 80 },
    { id: 'tcg-door', name: 'The Courier Guy Door R180', time: '2-3 days', price: 180 },
];

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity } = useCart();
    const [selectedShipping, setSelectedShipping] = useState<any>(null);
    
    const subtotal = cart.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
    const totalToPay = selectedShipping ? subtotal + selectedShipping.price : subtotal;

    return (
        <div className="w-full pb-10">
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md p-6">
                <div className="flex justify-center items-center">
                    <GlowaVeeLogo />
                </div>
                
                <Link 
                    href="/cart" 
                    className="absolute top-4 right-4 flex items-center p-2 text-[#4a3b20] transition-transform hover:scale-105" 
                    aria-label={`${cart.length} items in cart`}
                >
                    <div className="relative">
                        <ShoppingCart size={24} />
                        <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center rounded-full bg-[#3d2c10] text-white text-[10px] font-bold">
                            {cart.length}
                        </span>
                    </div>
                </Link>
            </header>

            <main className="flex flex-col gap-2">
                <div className="w-full h-2" />
                
                {cart.length === 0 ? (
                    <div className="w-full border border-[#e5e0d3] bg-white p-12 text-center shadow-sm">
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8b6e29]">Your Shopping Bag</p>
                        <p className="text-sm text-[#4a3b20]">Your bag is empty.</p>
                        <Link href="/" className="w-full h-9 mt-5 inline-flex items-center justify-center gap-2 bg-linear-to-r from-[#3d2c10] to-[#f3c54b] text-sm font-semibold text-white shadow-lg shadow-[#3d2c10]/10 transition hover:brightness-105">
                            Shop now <ArrowRight size={14} />
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="flex w-full flex-col">
                            {cart.map((item: any) => (
                                <div key={item.id} className="flex w-full items-center justify-between border border-[#e5e0d3] bg-white p-6 shadow-sm">
                                    <div className="flex flex-col gap-1.5">
                                        <p className="text-sm font-semibold text-[#2d2822]">{item.name}</p>
                                        <p className="text-xs text-[#8b6e29]">R{(item.price * item.quantity).toFixed(2)}</p>
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

                        <div className="mt-10 w-full border border-[#e5e0d3] bg-white p-8 shadow-sm">
                            <div className="mb-8">
                                <label className="text-xs font-bold uppercase tracking-widest text-[#8b6e29] flex items-center gap-2 mb-4">
                                    <Truck size={16} /> Select Delivery Method *
                                </label>
                                <div className="space-y-2">
                                    {COURIER_OPTIONS.map((option) => (
                                        <button
                                            key={option.id}
                                            onClick={() => setSelectedShipping(option)}
                                            className={`w-full flex items-center p-4 border transition-all ${
                                                selectedShipping?.id === option.id 
                                                ? 'border-[#3d2c10] bg-[#fdfaf5]' 
                                                : 'border-[#e5e0d3] bg-white'
                                            }`}
                                        >
                                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center mr-4 ${
                                                selectedShipping?.id === option.id ? 'border-[#3d2c10]' : 'border-[#d1c5a8]'
                                            }`}>
                                                {selectedShipping?.id === option.id && <div className="w-2 h-2 rounded-full bg-[#3d2c10]" />}
                                            </div>
                                            <div className="text-sm font-semibold text-[#2d2822] text-left">
                                                {option.name} <span className="text-[10px] text-[#7a7266] uppercase block">({option.time})</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3 pt-6 border-t border-[#f3ede3]">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium text-[#7a7266]">Subtotal</span>
                                    <span>R{subtotal.toFixed(2)}</span>
                                </div>
                                {selectedShipping && (
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium text-[#7a7266]">Shipping</span>
                                        <span>R{selectedShipping.price.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex items-center justify-between text-sm font-bold text-[#2d2822]">
                                    <span>Total to pay</span>
                                    <span>R{totalToPay.toFixed(2)}</span>
                                </div>
                            </div>

                            {!selectedShipping ? (
                                <div className="w-full h-12 mt-8 flex items-center justify-center gap-2 bg-[#f3ede3] text-sm font-bold uppercase text-[#a89d8e] cursor-not-allowed">
                                    Select delivery to continue
                                </div>
                            ) : (
                                <Link href="/checkout" className="w-full h-12 mt-8 inline-flex items-center justify-center gap-2 bg-linear-to-r from-[#3d2c10] to-[#f3c54b] text-sm font-semibold text-white shadow-lg shadow-[#3d2c10]/10 transition hover:brightness-105">
                                    Continue to checkout <ArrowRight size={16} />
                                </Link>
                            )}
                        </div>
                    </>
                )}
            
                <div className="h-18 sm:h-16" />
            </main>
        </div>
    );
}