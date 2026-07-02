'use client';
import { useCart } from '@/context/cart-context';
import { Droplet } from 'lucide-react';

export function ProductCard({ product }: { product: any }) {
    const { addToCart } = useCart();

    return (
        <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#e5e0d3] bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-300 hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
            
            {/* Product Image Area */}
            <div className="mb-6 flex h-52 w-full items-center justify-center rounded-t-xl bg-linear-to-b from-[#040404] to-[#3d2c10] text-[#f3c54b] transition-colors group-hover:from-[#3d2c10] group-hover:to-[#f3c54b]">
                <Droplet size={64} strokeWidth={1} className="text-[#f3c54b]" />
            </div>

            {/* Content */}
            <div className="flex-1 text-center pt-5">
                <h2 className="text-lg font-bold text-[#040404]">{product.name}</h2>
                <p className="mt-2 text-[13px] leading-relaxed text-[#3d2c10]">
                    {product.description}
                </p>
            </div>

            {/* Footer with Gold Prominent Button */}
            <div className="mt-8 w-full flex flex-col items-center gap-5">
                <span className="text-xl font-bold text-[#040404]">R{product.price}</span>
                <button
                    onClick={() => addToCart(product)}
                    className="w-full rounded-xl bg-linear-to-r from-[#3d2c10] to-[#f3c54b] py-4 text-[12px] font-bold uppercase tracking-[0.25em] text-[#040404] shadow-lg transition-all duration-300 hover:brightness-105 active:scale-[0.98] ring-1 ring-[#3d2c10]/20"
                >
                    Add to Bag
                </button>
            </div>
        </div>
    );
}