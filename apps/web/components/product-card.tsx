'use client';
import { useCart } from '@/context/cart-context';
import { ShoppingBag } from 'lucide-react';

export function ProductCard({ product }: { product: any }) {
    const { addToCart } = useCart();

    return (
        <div className="group relative flex flex-col overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-300 hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
            
            {/* Product Image Area with Dynamic Image */}
            <div className="flex h-50 w-full items-center justify-center bg-linear-to-b from-[#040404] to-[#00001e] transition-colors group-hover:from-[#00001e] group-hover:to-[#f3c54b]">
                <img 
                    src={product.image}
                    alt={product.name} 
                    className="h-34 w-34 object-contain transition-transform duration-500 group-hover:scale-110"
                />
            </div>

            {/* Content */}
            <div className="flex-1 text-center pt-5">
                <h2 className="text-4xl text-[#040404]">{product.name}</h2>
                <p className="mt-2 leading-relaxed text-[#00001e]">
                    {product.description}
                </p>
            </div>

            {/* Footer with Gold Prominent Button */}
            <div className="m-8 w-full flex items-center justify-center gap-3 px-2">
                <span className="text-3xl font-bold text-[#00001e]">R{product.price}</span>
                
                <button
                    onClick={() => addToCart(product)}
                    className="flex items-center gap-1.5 border text-(--color-gold) px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest transition-all hover:bg-[#f3e2a8] hover:border-[#f3e2a8] active:scale-95"
                    aria-label="Add to bag"
                >
                    <ShoppingBag className="text-(--color-gold)" size={14} strokeWidth={2} />
                    Buy
                </button>
            </div>
            <div className="mt-2 px-1 flex justify-center items-center gap-2 text-xs text-(--color-text-muted)">
                <span className="font-medium">Size/Volume:</span>
                <span className="font-bold text-(--color-gold-dark) bg-(--color-surface) px-2 py-0.5 border border-(--color-border) rounded">{product.size}</span>
            </div>
        </div>
    );
}