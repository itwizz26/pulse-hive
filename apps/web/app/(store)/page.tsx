'use client';

import React from 'react';
import { Sparkles, ShoppingCart } from 'lucide-react';
import { GlowaVeeLogo } from '@/components/glowa-vee-logo';
import { ProductCard } from '@/components/product-card';
import { useCart } from '@/context/cart-context';

const mockProducts = [
    { id: '1', name: 'Insumpa/Skin Tag Collagen Cream', price: 420, image: '💋', badge: 'Best Seller', description: 'Soft-glow pigment with a satin finish.' },
    { id: '2', name: 'Golden Glow Serum', price: 560, image: '✨', badge: 'Editor Pick', description: 'Radiance serum for lit-from-within skin.' },
    { id: '3', name: 'Collagen Capsules', price: 340, image: '🖤', badge: 'New', description: 'Defined lashes with a feather-soft curl.' },
    { id: '4', name: 'Collagen Day Cream', price: 480, image: '🌿', badge: 'Signature', description: 'A warm, elegant fragrance for everyday luxury.' },
];

export default function CatalogPage() {
    const { cart } = useCart();

    return (
        <div className="my-8 p-5 sm:p-6 lg:p-7">
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

            <section className="my-7 p-5">
                <div className="grid grid-cols-1 gap-4 px-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
                    {mockProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </section>
            <div className="h-18 sm:h-16" />
        </div>
    );
}