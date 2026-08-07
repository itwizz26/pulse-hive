'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Search, Sparkles } from 'lucide-react';
import { GlowaVeeLogo } from '@/components/glowa-vee-logo';
import { ProductCard } from '@/components/product-card';
import { useCart } from '@/context/cart-context';

const collagenProducts = [
    { 
        id: '1', 
        image: '/products/nightcream.png', 
        name: 'Insumpa/Skin Tags Collagen Cream', 
        price: 150, 
        size: '50ml', 
        description: 'Targeted collagen cream formulated for smooth, clear skin and skin tag care.' 
    },
    { 
        id: '2', 
        image: '/products/capsules.png', 
        name: 'Insumpa/Skin Tags Collagen Capsules', 
        price: 300, 
        size: '30 caps.', 
        description: 'Advanced internal collagen capsules to support overall skin clarity from within.' 
    },
    { 
        id: '3', 
        image: '/products/serum.png', 
        name: 'Collagen Serum', 
        price: 60, 
        size: '30ml', 
        description: 'Concentrated collagen serum for deep hydration and a youthful glow.' 
    },
    { 
        id: '4', 
        image: '/products/daycream.png', 
        name: 'Collagen Day Cream', 
        price: 150, 
        size: '50ml', 
        description: 'Daily protective collagen moisturizer for sustained radiance and softness.' 
    },
    { 
        id: '5', 
        image: '/products/malesma.png', 
        name: 'Melasma Oil', 
        price: 180, 
        size: '50ml', 
        description: 'Specialized treatment oil designed to visibly address melasma and uneven tone.' 
    },
    { 
        id: '6', 
        image: '/products/soap.png', 
        name: 'Collagen Bar Soap', 
        price: 60, 
        size: '100g', 
        description: 'Nourishing cleansing bar infused with collagen for daily freshness.' 
    },
    { 
        id: '7', 
        image: '/products/bodyglowgel.png',
        name: 'Collagen Skin Brightening Glow Body Gel', 
        price: 220, 
        size: '100ml', 
        description: 'Luxurious body oil formulated to brighten, firm, and enrich skin tone.'
    },
    { 
        id: '8', 
        image: '/products/bodylotion.png', 
        name: 'Collagen Hydrating Body Lotion', 
        price: 180, 
        size: '100ml', 
        description: 'Deeply moisturizing body lotion that locks in hydration for silky-smooth skin.' 
    }
];

const bannerSlides = [
    {
        title: "Discover Your Ultimate Radiance",
        subtitle: "Luxury formulations designed to nourish and elevate your natural skin tone.",
        tag: "New Collection",
        image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80"
    },
    {
        title: "Flawless Skin, Naturally",
        subtitle: "Experience advanced collagen treatments built for everyday luxury.",
        tag: "Best Sellers",
        image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=80"
    },
    {
        title: "The Golden Standard of Glow",
        subtitle: "Unlock luminous skin with our signature editor-approved selection.",
        tag: "Limited Offer",
        image: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=1200&q=80"
    }
];

export default function CatalogPage() {
    const { cart } = useCart();
    const [searchQuery, setSearchQuery] = useState('');
    const [currentSlide, setCurrentSlide] = useState(0);

    // Auto-advance hero banner slider every 4.5 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
        }, 4500);
        return () => clearInterval(timer);
    }, []);

    const filteredProducts = useMemo(() => {
        return collagenProducts.filter(p => 
            p.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    return (
        <div className="w-full min-h-screen bg-(--color-background)">
            {/* Header: Fixed Z-Index and layout */}
            <header className="top-5 z-40 bg-(--color-surface)/95 backdrop-blur-md border-b border-(--color-border) p-6">
                <div className="flex justify-center items-center">
                    <GlowaVeeLogo />
                </div>
                
                <Link 
                    href="/cart" 
                    className="absolute top-5 right-5 transition-transform hover:scale-105" 
                    aria-label={`${cart.length} items in cart`}
                >
                    <div className="relative">
                        <ShoppingCart size={40} className="text-(--color-gold)" />
                        <span className="absolute -top-1 -right-1 w-6 h-6 flex items-center justify-center rounded-full bg-(--color-gold) text-white text-[0.875rem] font-bold">
                            {cart.length}
                        </span>
                    </div>
                </Link>
            </header>

            {/* Main Content: z-30 ensures it stays behind the header but clears other elements */}
            <main className="relative z-30 flex flex-col gap-6">
                
                {/* Moving Hero Banner with Images */}
                <div className="px-6">
                    <div className="relative w-full max-w-full mx-auto overflow-hidden shadow-lg border border-(--color-border-strong) min-h-80 sm:min-h-96 flex items-end">
                        
                        {/* Background Image Slides with Smooth Transition */}
                        {bannerSlides.map((slide, index) => (
                            <div
                                key={index}
                                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                                    currentSlide === index ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 pointer-events-none z-0'
                                }`}
                            >
                                <Image
                                    src={slide.image}
                                    alt={slide.title}
                                    fill
                                    className="object-cover"
                                    priority={index === 0}
                                    loading={index === 0 ? "eager" : "lazy"}
                                />
                                {/* Bottom-focused dark gradient overlay to ensure text contrast */}
                                <div className="absolute inset-0 bg-linear-to-t from-(--color-gold-dark)/95 via-(--color-gold-dark)/60 to-transparent z-10" />
                            </div>
                        ))}

                        {/* Slide Content - Positioned at Bottom Center spanning full width */}
                        <div className="relative z-20 p-5 sm:p-6 flex flex-col justify-end items-center text-center w-full">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-(--color-gold)/30 text-(--color-gold-light) text-xs font-semibold w-max mb-2 tracking-wide backdrop-blur-md border border-(--color-gold)/40">
                                <Sparkles size={12} />
                                {bannerSlides[currentSlide].tag}
                            </div>
                            <h2 className="text-xl sm:text-2xl font-serif tracking-tight mb-1 text-white drop-shadow-sm">
                                {bannerSlides[currentSlide].title}
                            </h2>
                            <p className="text-xs sm:text-sm text-[#f0ebd9] font-sans drop-shadow-sm">
                                {bannerSlides[currentSlide].subtitle}
                            </p>
                        </div>

                        {/* Slider Pagination Dots */}
                        <div className="absolute bottom-5 right-6 flex gap-1.5 z-40 pointer-events-auto">
                            {bannerSlides.map((_, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => setCurrentSlide(index)}
                                    className={`h-1.5 rounded-full transition-all duration-300 shadow-sm cursor-pointer ${
                                        currentSlide === index ? 'w-6 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/80'
                                    }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="px-5 sm:px-6">
                    <div className="relative w-full max-w-full mx-auto">
                        <Search className="absolute right-2 text-(--color-text-soft)" size={20} />
                        <input 
                            type="text" 
                            placeholder="Find the right glow..."
                            className="w-full text-(--color-text) bg-white border border-(--color-border-strong) focus:outline-none focus:ring-2 focus:ring-(--color-gold) transition-all shadow-sm"
                            onChange={(e) => setSearchQuery(e.target.value)} 
                            value={searchQuery}
                        />
                    </div>
                </div>

                {/* Catalog Tiled Grid */}
                <div className="px-5 sm:px-6 pb-12">
                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-full mx-auto">
                            {filteredProducts.map((product) => (
                                <div key={product.id} className="flex flex-col h-full *:h-full">
                                    <ProductCard 
                                        product={product}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="w-full text-center py-20 text-(--color-text-muted) italic">
                            No products match your search.
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}