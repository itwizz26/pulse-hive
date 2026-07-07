'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ShoppingCart, Search } from 'lucide-react';
import { GlowaVeeLogo } from '@/components/glowa-vee-logo';
import { ProductCard } from '@/components/product-card';
import { useCart } from '@/context/cart-context';

const mockProducts = [
    { id: '1', name: 'Insumpa/Skin Tags Collagen Cream', price: 420, badge: 'Best Seller', description: 'Soft-glow pigment with a satin finish.' },
    { id: '2', name: 'Golden Glow Serum', price: 560, badge: 'Editor Pick', description: 'Radiance serum for lit-from-within skin.' },
    { id: '3', name: 'Collagen Capsules', price: 340, badge: 'New', description: 'Defined lashes with a feather-soft curl.' },
    { id: '4', name: 'Collagen Day Cream', price: 480, badge: 'Signature', description: 'A warm, elegant fragrance for everyday luxury.' },
];

export default function CatalogPage() {
    const { cart } = useCart();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredProducts = useMemo(() => {
        return mockProducts.filter(p => 
            p.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

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

            {/* Catalog Main Body - Gap-2 keeps it tight */}
            <main className="flex flex-col gap-2">
                <div className="w-full h-2" />
                
                <div className="relative px-6">
                    <Search className="absolute right-0 top-1 text-[#3d2c10]" size={20} />
                    <input 
                        type="text" placeholder="Find the right glow ..."
                        className="w-full border text-white border-[#d4c8ae] bg-[#4a3b20] py-3 pl-12 pr-4 text-base focus:outline-none focus:ring-2 focus:ring-[#f3c54b] shadow-sm"
                        onChange={(e) => setSearchQuery(e.target.value)} value={searchQuery}
                    />
                </div>

                {/* Horizontal Snap Scroll Catalog */}
                <div className="flex w-full snap-x snap-mandatory overflow-x-auto pb-8 scrollbar-hide pt-2">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                            <div key={product.id} className="min-w-[85vw] sm:min-w-100 snap-center px-4 first:pl-6 last:pr-6">
                                <ProductCard product={product} />
                            </div>
                        ))
                    ) : (
                        <div className="w-full text-center py-20 text-[#3d2c10] italic">
                            No products match your search.
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
