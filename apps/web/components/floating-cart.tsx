'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/cart-context';

export function FloatingCart() {
    const { cart } = useCart();

    return (
        <Link
            href="/cart"
            aria-label={`${cart.length} items in cart`}
            className="
                fixed
                top-4
                right-4
                sm:top-4
                sm:right-20
                z-99999
                flex
                items-center
                justify-center
                w-10
                h-10
                sm:w-10
                sm:h-10
                rounded-full
                bg-white/95
                backdrop-blur-md
                border
                border-(--color-border-strong)
                shadow-lg
                transition-all
                duration-200
                hover:scale-105
                hover:shadow-xl
                active:scale-95
            "
        >
            <div className="relative flex items-center justify-center">
                <ShoppingCart
                    size={26}
                    className="sm:w-7 sm:h-7 text-(--color-gold-dark)"
                    strokeWidth={2}
                />

                <span
                    className="
                        absolute
                        -top-2
                        -right-2
                        min-w-6
                        h-6
                        px-1
                        flex
                        items-center
                        justify-center
                        rounded-full
                        bg-(--color-gold-dark)
                        text-white
                        text-xs
                        font-bold
                        leading-none
                        border-2
                        border-(--color-surface)
                    "
                >
                    {cart.length}
                </span>
            </div>
        </Link>
    );
}