'use client';

import { useCart } from '@/context/cart-context';
import { ShoppingBag } from 'lucide-react';

export function ProductCard({ product }: { product: any }) {
    const { addToCart } = useCart();

    return (
        <div
            className="
                group relative flex flex-col overflow-hidden
                bg-(--color-surface)
                border border-(--color-border)
                rounded-xl
                shadow-[0_4px_20px_rgba(0,0,0,0.05)]
                transition-all duration-300
                hover:-translate-y-1
                hover:border-(--color-border-strong)
                hover:shadow-[0_12px_30px_rgba(0,0,0,0.10)]
            "
        >

            {/* Product Image */}
            <div
                className="
                    relative flex h-50 w-full
                    items-center justify-center
                    overflow-hidden
                    bg-linear-to-b
                    from-[#111111]
                    to-[#050505]
                    transition-all duration-500
                    group-hover:from-[#050505]
                    group-hover:to-[#2a1f0a]
                "
            >
                {/* Subtle gold glow */}
                <div
                    className="
                        absolute inset-0
                        opacity-0
                        group-hover:opacity-100
                        transition-opacity duration-500
                        bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.18),transparent_65%)]
                    "
                />

                <img
                    src={product.image}
                    alt={product.name}
                    className="
                        relative z-10
                        h-34 w-34
                        object-contain
                        transition-transform duration-500
                        group-hover:scale-110
                    "
                />
            </div>

            {/* Product Content */}
            <div className="flex-1 px-4 pt-5 text-center">

                <h2
                    className="
                        text-xl
                        sm:text-2xl
                        font-bold
                        leading-tight
                        text-(--color-text)
                    "
                >
                    {product.name}
                </h2>

                <p
                    className="
                        mt-2
                        text-xs
                        sm:text-sm
                        leading-relaxed
                        text-(--color-text-muted)
                    "
                >
                    {product.description}
                </p>

            </div>

            {/* Size / Volume */}
            <div className="mt-4 flex items-center justify-center gap-2 px-3">
                <span className="text-xs font-medium text-(--color-text-soft)">
                    Size/Volume:
                </span>

                <span
                    className="
                        rounded-full
                        border border-(--color-border-strong)
                        bg-(--color-background-soft)
                        px-2.5 py-0.5
                        text-xs
                        font-bold
                        text-(--color-gold-dark)
                    "
                >
                    {product.size}
                </span>
            </div>

            {/* Price + Buy */}
            <div className="flex items-center justify-center gap-6 px-4 py-5">
                {/* Price */}
                <div className="flex items-center justify-center">
                    <span className="text-2xl sm:text-3xl font-bold text-(--color-gold-dark)">
                        R{product.price}
                    </span>
                </div>

                {/* Buy */}
                <div className="flex items-center justify-center">
                    <button
                        type="button"
                        onClick={() => addToCart(product)}
                        className="
                            inline-flex
                            items-center
                            justify-center
                            gap-1.5
                            rounded-md
                            border border-(--color-gold)
                            bg-transparent
                            px-3 py-2
                            text-[11px]
                            font-bold
                            uppercase
                            tracking-widest
                            text-(--color-gold-dark)
                            transition-all duration-200
                            hover:bg-(--color-gold)
                            hover:text-white
                            hover:border-(--color-gold)
                            active:scale-95
                        "
                        aria-label={`Add ${product.name} to bag`}
                    >
                        <ShoppingBag
                            size={14}
                            strokeWidth={2}
                        />
                        Buy
                    </button>
                </div>
            </div>

            {/* Bottom Gold Accent */}
            <div
                className="
                    h-0.5
                    w-0
                    bg-linear-to-r
                    from-(--color-gold-dark)
                    via-(--color-gold-light)
                    to-(--color-gold-dark)
                    transition-all duration-500
                    group-hover:w-full
                "
            />

        </div>
    );
}