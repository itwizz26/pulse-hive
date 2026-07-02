'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Toast } from '@/components/ui/toast';

const CartContext = createContext<any>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [toast, setToast] = useState<string | null>(null);

    useEffect(() => {
        const storedOrders = window.localStorage.getItem('pulsehive-orders');
        if (storedOrders) {
            setOrders(JSON.parse(storedOrders));
        }
    }, []);

    useEffect(() => {
        window.localStorage.setItem('pulsehive-orders', JSON.stringify(orders));
    }, [orders]);

    const addToCart = (product: any) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
        setToast(`${product.name} added to cart.`);
    };

    const removeFromCart = (productId: string) => {
        setCart((prev) => prev.filter((item) => item.id !== productId));
    };

    const updateQuantity = (productId: string, quantity: number) => {
        setCart((prev) =>
            prev.flatMap((item) => {
                if (item.id !== productId) return [item];
                if (quantity <= 0) return [];
                return [{ ...item, quantity }];
            })
        );
    };

    const clearCart = () => setCart([]);

    const checkoutOrder = (customerName: string, deliveryAddress: string) => {
        if (!cart.length) {
            setToast('Your cart is empty.');
            return null;
        }

        const newOrder = {
            id: `ORD-${Date.now()}`,
            customerName,
            deliveryAddress,
            createdAt: new Date().toISOString(),
            items: cart,
            total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        };

        setOrders((prev) => [newOrder, ...prev]);
        clearCart();
        setToast(`Order confirmed • ${newOrder.id}`);
        return newOrder;
    };

    const value = useMemo(
        () => ({ cart, orders, addToCart, removeFromCart, updateQuantity, clearCart, checkoutOrder }),
        [cart, orders]
    );

    return (
        <CartContext.Provider value={value}>
            {children}
            {toast && <Toast message={toast} onClose={() => setToast(null)} />}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);