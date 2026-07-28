// 1. Updated /cart page to save full selection details to localStorage
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { ArrowRight, Minus, Plus, Trash2, ShoppingCart, Truck, ShieldCheck, Lock } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { GlowaVeeLogo } from '@/components/glowa-vee-logo';

const COURIER_OPTIONS = [
    { id: 'tcg-locker', name: 'Locker to Locker', time: '2-5 business days', price: 80, desc: 'Secure 24/7 self-service PUDO locker pickup' },
    { id: 'tcg-door', name: 'Door to Door', time: '1-3 business days', price: 180, desc: 'Direct delivery straight to your doorstep' },
];

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity } = useCart();
    const [selectedShipping, setSelectedShipping] = useState<any>(null);
    
    const subtotal = cart.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
    const totalToPay = selectedShipping ? subtotal + selectedShipping.price : subtotal;

    const handleSelectShipping = (option: any) => {
        setSelectedShipping(option);
        // Persist the chosen option, items summary, and totals so checkout reads it accurately
        localStorage.setItem('glowavee_selected_shipping', JSON.stringify(option));
        localStorage.setItem('glowavee_cart_summary', JSON.stringify({
            items: cart,
            subtotal,
            shippingFee: option.price,
            totalToPay: subtotal + option.price
        }));
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
                <div className="flex flex-col gap-1 items-center text-center">
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-(--color-gold-dark) flex items-center gap-1.5">
                        <Lock size={12} /> Secure Checkout
                    </span>
                    <h1 className="text-2xl font-serif text-(--color-text)">Your Shopping Bag</h1>
                </div>

                {cart.length === 0 ? (
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
                ) : (
                    <>
                        <div className="flex w-full flex-col gap-3">
                            {cart.map((item: any) => (
                                <div key={item.id} className="flex w-full items-center justify-between border border-(--color-border) bg-white p-4 sm:p-5 shadow-xs transition hover:border-(--color-gold)/50">
                                    <div className="flex flex-col gap-1 pr-4">
                                        <h2 className="text-xs sm:text-sm font-bold text-(--color-text) line-clamp-1">{item.name}</h2>
                                        <p className="text-[11px] text-(--color-gold-dark) font-semibold">R{Number(item.price).toFixed(2)} each</p>
                                    </div>
                                    <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                                        <div className="flex items-center gap-2.5 border border-(--color-border) bg-(--color-background) px-3 py-1.5 shadow-xs">
                                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-(--color-text-muted) hover:text-(--color-text) transition"><Minus size={12} /></button>
                                            <span className="w-5 text-center text-xs font-bold text-(--color-text)">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-(--color-text-muted) hover:text-(--color-text) transition"><Plus size={12} /></button>
                                        </div>
                                        <button onClick={() => removeFromCart(item.id)} className="text-(--color-text-muted)/60 transition hover:text-red-500 p-1" aria-label="Remove item">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="w-full border border-(--color-border-strong) bg-white p-6 shadow-xs">
                            <div className="mb-5 flex items-center justify-between">
                                <div>
                                    <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-(--color-gold-dark) flex items-center gap-2 mb-1.5">
                                        <Truck size={16} /> Select Delivery Method *
                                    </label>
                                    <p className="text-xs text-(--color-text-muted)">Choose your preferred delivery option to calculate final pricing.</p>
                                    <p>The Courier Guy</p>
                                </div>
                                <div className="relative w-16 h-8 shrink-0 overflow-hidden rounded-sm border border-(--color-border) bg-white flex items-center justify-center">
                                    <Image 
                                        src="/courier.jpg" 
                                        alt="The Courier Guy" 
                                        fill 
                                        className="object-contain p-0.5"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2.5">
                                {COURIER_OPTIONS.map((option) => {
                                    const isSelected = selectedShipping?.id === option.id;
                                    return (
                                        <button
                                            key={option.id}
                                            onClick={() => handleSelectShipping(option)}
                                            className={`w-full flex items-center justify-between p-4 border transition-all text-left ${
                                                isSelected 
                                                    ? 'border-(--color-border) bg-amber-950 text-white'
                                                    : 'border-[#3d2c10] bg-[#fdfaf5] hover:border-(--color-gold)/40'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                                                    isSelected ? 'border-[#3d2c10] bg-[#3d2c10]' : 'border-[#3d2c10]/40 bg-amber-950'
                                                }`}>
                                                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                                                </div>
                                                <div>
                                                    <span className="text-xs sm:text-sm font-bold text-(--color-text) block">{option.name}</span>
                                                    <span className="text-[10px] text-(--color-text-muted) block">{option.desc} ({option.time})</span>
                                                </div>
                                            </div>
                                            <span className="text-xs sm:text-sm font-bold text-(--color-gold-dark) shrink-0">R{option.price}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="space-y-2.5 pt-6 mt-6 border-t border-(--color-border)">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-(--color-text-muted)">Subtotal</span>
                                    <span className="font-semibold text-(--color-text)">R{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-(--color-text-muted)">Delivery</span>
                                    <span className="font-semibold text-(--color-text)">{selectedShipping ? `R${selectedShipping.price.toFixed(2)}` : 'Select method'}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm font-bold text-(--color-text) pt-2 border-t border-dashed border-(--color-border)">
                                    <span>Total to pay</span>
                                    <span className="text-base text-(--color-gold-dark)">R{totalToPay.toFixed(2)}</span>
                                </div>
                            </div>

                            {!selectedShipping ? (
                                <div className="w-full h-12 mt-6 flex items-center justify-center gap-2 bg-[#f3ede3] border border-(--color-border) text-xs font-bold uppercase tracking-wider text-[#a89d8e] cursor-not-allowed">
                                    Select delivery to checkout
                                </div>
                            ) : (
                                <Link 
                                    href="/checkout" 
                                    className="w-full h-12 mt-6 inline-flex items-center justify-center gap-2 bg-linear-to-r from-[#3d2c10] to-[#f3c54b] text-xs font-semibold text-white shadow-lg shadow-[#3d2c10]/10 transition hover:brightness-105"
                                >
                                    Continue to checkout <ArrowRight size={16} />
                                </Link>
                            )}

                            <div className="flex items-center justify-center gap-1.5 mt-4 text-[10px] text-(--color-text-muted)">
                                <ShieldCheck size={14} className="text-(--color-gold-dark)" />
                                <span>Encrypted & secure checkout processing</span>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
