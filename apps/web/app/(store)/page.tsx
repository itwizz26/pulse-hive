'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { Search, Sparkles, Users, Store } from 'lucide-react';
import { GlowaVeeLogo } from '@/components/glowa-vee-logo';
import { ProductCard } from '@/components/product-card';
import { useCart } from '@/context/cart-context';
import { WelcomeModal } from '@/components/welcome-modal';

const collagenProducts = [
    {
        id: '1',
        image: '/products/nightcream.png',
        name: 'Insumpa/Skin Tags Collagen Cream',
        price: 150,
        size: '50g',
        description:
            'Targeted collagen cream formulated for smooth, clear skin and skin tag care.',
    },
    {
        id: '2',
        image: '/products/capsules.png',
        name: 'Insumpa/Skin Tags Collagen Capsules',
        price: 300,
        size: '30 caps.',
        description:
            'Advanced internal collagen capsules to support overall skin clarity from within.',
    },
    {
        id: '3',
        image: '/products/serum.png',
        name: 'Collagen Serum',
        price: 60,
        size: '30ml',
        description:
            'Concentrated collagen serum for deep hydration and a youthful glow.',
    },
    {
        id: '4',
        image: '/products/daycream.png',
        name: 'Collagen Day Cream',
        price: 150,
        size: '50g',
        description:
            'Daily protective collagen moisturizer for sustained radiance and softness.',
    },
    {
        id: '5',
        image: '/products/malesma.png',
        name: 'Melasma Oil',
        price: 180,
        size: '50ml',
        description:
            'Specialized treatment oil designed to visibly address melasma and uneven tone.',
    },
    {
        id: '6',
        image: '/products/soap.png',
        name: 'Collagen Bar Soap',
        price: 60,
        size: '100g',
        description:
            'Nourishing cleansing bar infused with collagen for daily freshness.',
    },
    {
        id: '7',
        image: '/products/bodyglowgel.png',
        name: 'Collagen Skin Brightening Glow Body Gel',
        price: 220,
        size: '100ml',
        description:
            'Luxurious body oil formulated to brighten, firm, and enrich skin tone.',
    },
    {
        id: '8',
        image: '/products/bodylotion.png',
        name: 'Collagen Hydrating Body Lotion',
        price: 180,
        size: '100ml',
        description:
            'Deeply moisturizing body lotion that locks in hydration for silky-smooth skin.',
    },
    {
        id: '9',
        image: '/products/slimmingtea.png',
        name: 'Slimming Tea',
        price: 450,
        size: '1 pack',
        description:
            'Refreshing herbal tea blend designed to support a healthy lifestyle and wellness goals.',
    },
    {
        id: '10',
        image: '/products/bodygain.png',
        name: 'Body Gain Tablets',
        price: 250,
        size: '20 tablets',
        description:
            'Formulated tablets to help support healthy body mass and physical development.',
    },
    {
        id: '11',
        image: '/products/bodypowder.png',
        name: 'Body Gain Powder',
        price: 120,
        size: '100g',
        description:
            'Nutritious powder supplement created to support healthy weight gain and body goals.',
    },
    {
        id: '12',
        image: '/products/hipsbumgain.png',
        name: 'Hips and Bum Gain Tablets',
        price: 400,
        size: '20 tablets',
        description:
            'Targeted supplement designed to help tone, enhance, and support curves.',
    },
    {
        id: '13',
        image: '/products/innerthighs.png',
        name: 'Inner Dark Thighs Gel',
        price: 150,
        size: '100ml',
        description:
            'Specialized soothing gel formulated to help even out skin tone in sensitive areas.',
    },
    {
        id: '14',
        image: '/products/allglam.jpg',
        name: 'All Glam',
        price: 700,
        size: '5-Piece Collection',
        description:
            'A complete Glowa Vee skincare collection featuring Collagen Night Cream, Collagen Glowing Serum, Collagen Capsules, Collagen Day Cream Brightening, and Collagen Bar Soap.',
    },
    {
        id: '15',
        image: '/products/bodyhealth.jpg',
        name: 'Body Health',
        price: 700,
        size: '3-Piece Collection',
        description:
            'A complete body wellness collection featuring Hips & Bum Gain Tablets, Body Gain Tablets, and Body Gain Powder.',
    },
    {
        id: '16',
        image: '/products/combo.jpg',
        name: 'Skin Tag Removal Combo',
        price: 420,
        size: '50g night cream plus 30 Caps',
        description:
            'A specially selected combination of Glowa Vee products for your beauty and wellness routine featuring the Collagen Night Cream and Collagen Capsules.',
    },
    {
        id: '17',
        image: '/products/creamsserum.jpg',
        name: 'Collagen Creams & Serum',
        price: 330,
        size: '3-Piece Collection',
        description:
            'A skincare combination designed to complement your daily beauty routine. Inside the box: 1x 50g Night Cream, 1x 50g Day Cream plus 30ml Serum',
    },
    {
        id: '18',
        image: '/products/famous.jpg',
        name: 'Famous Box',
        price: 1000,
        size: '7-Piece COllection',
        description:
            'A premium Glowa Vee beauty and wellness product created to support your self-care routine. Inside the box: 1x 50g Night Cream, 1x 50g Day Cream, 1x 30ml Serum, 1x 100g Soap Bar, 1x 30 Capsules, 1x 100ml Hydrating Body Lotion and 1x 100ml Body Hydrating Gel',
    },
    {
        id: '19',
        image: '/products/hormone.jpg',
        name: 'Hormone Balance Tablets',
        price: 170,
        size: '30 Tablets',
        description:
            'A wellness product formulated to complement your personal health. Support hormone health and overall well-being.',
    },
    {
        id: '20',
        image: '/products/prebiotic.jpg',
        name: 'Prebiotic Tablets',
        price: 120,
        size: '20 tablets',
        description:
            'A prebiotic supplement designed to support digestive wellness. Supports digestion and gut health.',
    },
];

const resellerProducts = [
    {
        id: 'r1',
        image: '/products/starterpack.png',
        name: 'Reseller Starter Pack',
        price: 2600,
        size: '29 items',
        description:
            'Curated mix of top-selling items designed to kickstart your Glowa Vee reseller business. 5x Cream, 5x Capsules, 5x Serum, 5x Bar soaps, 5x Day Creams, 2x Body Hydrating Lotions, 2x Skin Brightening Glow Body Gels',
    },
];

const bannerSlides = [
    {
        title: 'Glow From Head to Toe',
        subtitle:
            'Discover our collection of skincare and wellness products designed to help you look and feel your best.',
        tag: 'Shop Our Collection',
        image:
            '/banners/banner1.jpg',
    },

    {
        title: 'Say Goodbye to Skin Tags',
        subtitle:
            'Target the appearance of unwanted skin tags and reveal smoother, clearer-looking skin.',
        tag: 'Skin Tag Care',
        image:
            '/banners/banner2.jpg',
    },

    {
        title: 'Restore Your Skin’s Natural Beauty',
        subtitle:
            'Give your skin the care it deserves and work towards a smoother, healthier-looking appearance.',
        tag: 'Skin Care',
        image:
            '/banners/banner3.jpg',
    },

    {
        title: 'Your Journey to a Healthier You',
        subtitle:
            'Support your weight-loss journey with products designed to help you feel confident in your body.',
        tag: 'Weight Management',
        image:
            '/banners/banner4.jpg',
    },
];

export default function CatalogPage() {
    const { cart } = useCart();

    const [searchQuery, setSearchQuery] = useState('');
    const [currentSlide, setCurrentSlide] = useState(0);
    const [activeTab, setActiveTab] = useState<
        'products' | 'resellers'
    >('products');

    /* =========================================================
       HERO SLIDER
       ========================================================= */

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide(
                (prev) => (prev + 1) % bannerSlides.length
            );
        }, 4500);

        return () => clearInterval(timer);
    }, []);

    /* =========================================================
       PRODUCT FILTERING
       ========================================================= */

    const filteredProducts = useMemo(() => {
        const targetList =
            activeTab === 'products'
                ? collagenProducts
                : resellerProducts;

        return targetList.filter((product) =>
            product.name
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, activeTab]);

    return (
        <>
            <WelcomeModal />
            
            <div className="w-full min-h-screen bg-(--color-background) text-(--color-text)">
                {/* =====================================================
                    HEADER
                    ===================================================== */}

                <header className="relative z-40 border-b border-(--color-border-strong) bg-(--color-surface-elevated)/95 backdrop-blur-md">
                    <div className="flex justify-center items-center p-6">
                        <GlowaVeeLogo />
                    </div>
                </header>

                {/* =====================================================
                    MAIN CONTENT
                    ===================================================== */}

                <main className="relative z-30 flex w-full min-w-0 max-w-full flex-col gap-6">
                    {/* =================================================
                        HERO BANNER
                        ================================================= */}

                    <div className="px-5 sm:px-6 pt-1">
                        <div className="relative w-full max-w-full mx-auto overflow-hidden shadow-[0_16px_45px_rgba(0,0,0,0.35)] border border-(--color-border-strong) min-h-80 sm:min-h-150 flex items-end bg-black">
                            {/* Background slides */}
                            {bannerSlides.map((slide, index) => (
                                <div
                                    key={index}
                                    className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                                        currentSlide === index
                                            ? 'opacity-100 scale-100 z-10'
                                            : 'opacity-0 scale-105 pointer-events-none z-0'
                                    }`}
                                >
                                    <Image
                                        src={slide.image}
                                        alt={slide.title}
                                        fill
                                        className="object-cover"
                                        priority={index === 0}
                                        loading={
                                            index === 0
                                                ? 'eager'
                                                : 'lazy'
                                        }
                                    />

                                    {/* Premium black/gold overlay */}
                                    <div className="absolute inset-0 bg-linear-to-t from-black via-black/55 to-black/10 z-10" />

                                    {/* Subtle gold glow */}
                                    <div className="absolute inset-0 bg-linear-to-tr from-(--color-gold-dark)/25 via-transparent to-transparent z-10" />
                                </div>
                            ))}

                            {/* Slide content */}
                            <div className="relative z-20 p-6 sm:p-7 flex flex-col justify-end items-center text-center w-full">
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/50 text-(--color-gold-light) text-xs font-semibold w-max mb-3 tracking-wide backdrop-blur-md border border-(--color-gold)/40">
                                    <Sparkles size={12} />
                                    {bannerSlides[currentSlide].tag}
                                </div>

                                <h2 className="text-xl sm:text-2xl font-serif tracking-tight mb-1 text-white drop-shadow-lg">
                                    {bannerSlides[currentSlide].title}
                                </h2>

                                <p className="text-xs sm:text-sm text-white/85 font-sans drop-shadow-md max-w-xl">
                                    {
                                        bannerSlides[currentSlide]
                                            .subtitle
                                    }
                                </p>
                            </div>

                            {/* Slider dots */}
                            <div className="absolute bottom-5 right-6 flex gap-1.5 z-40 pointer-events-auto">
                                {bannerSlides.map((_, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() =>
                                            setCurrentSlide(index)
                                        }
                                        className={`h-1.5 rounded-full transition-all duration-300 shadow-sm cursor-pointer ${
                                            currentSlide === index
                                                ? 'w-6 bg-(--color-gold-light)'
                                                : 'w-1.5 bg-white/50 hover:bg-(--color-gold-light)/80'
                                        }`}
                                        aria-label={`Go to slide ${
                                            index + 1
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* =================================================
                        PRODUCT / RESELLER TABS
                        ================================================= */}

                    <div className="px-5 sm:px-6">
                        <div className="flex rounded-lg bg-(--color-surface) p-1.5 border border-(--color-border-strong) max-w-md mx-auto shadow-[0_8px_25px_rgba(0,0,0,0.18)]">
                            <button
                                type="button"
                                onClick={() => {
                                    setActiveTab('products');
                                    setSearchQuery('');
                                }}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all cursor-pointer ${
                                    activeTab === 'products'
                                        ? 'bg-(--color-gold) text-black shadow-[0_4px_15px_rgba(212,175,55,0.2)]'
                                        : 'text-(--color-text-soft) hover:text-(--color-gold-light) hover:bg-white/5'
                                }`}
                            >
                                <Store size={16} />
                                Products
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setActiveTab('resellers');
                                    setSearchQuery('');
                                }}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all cursor-pointer ${
                                    activeTab === 'resellers'
                                        ? 'bg-(--color-gold) text-black shadow-[0_4px_15px_rgba(212,175,55,0.2)]'
                                        : 'text-(--color-text-soft) hover:text-(--color-gold-light) hover:bg-white/5'
                                }`}
                            >
                                <Users size={16} />
                                Resellers
                            </button>
                        </div>
                    </div>

                    {/* =================================================
                        SEARCH
                        ================================================= */}

                    <div className="px-5 sm:px-6">
                        <div className="relative w-full max-w-full mx-auto">
                            <Search
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-(--color-gold)"
                                size={20}
                            />

                            <input
                                type="text"
                                placeholder={
                                    activeTab === 'products'
                                        ? 'Find the right glow...'
                                        : 'Search reseller items...'
                                }
                                className="w-full text-(--color-text) bg-(--color-surface) border border-(--color-border-strong) placeholder:text-(--color-text-soft) focus:outline-none focus:ring-2 focus:ring-(--color-gold)/40 focus:border-(--color-gold)/50 transition-all shadow-[0_6px_20px_rgba(0,0,0,0.15)] px-4 py-2.5 rounded-md"
                                onChange={(e) =>
                                    setSearchQuery(e.target.value)
                                }
                                value={searchQuery}
                            />
                        </div>
                    </div>

                    {/* =================================================
                        CATALOGUE
                        ================================================= */}

                    <div className="px-5 sm:px-6 pb-12">
                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-full mx-auto">
                                {filteredProducts.map((product) => (
                                    <div
                                        key={product.id}
                                        className="flex flex-col h-full *:h-full"
                                    >
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
        </>
    );
}