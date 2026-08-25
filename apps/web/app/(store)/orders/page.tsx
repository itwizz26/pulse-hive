'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PackageOpen, Clock, Loader2, CheckCircle2, PackageCheck, Truck, Sparkles, Package } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { GlowaVeeLogo } from '@/components/glowa-vee-logo';
import { apiClient } from '@/app/api/api-client';

const ORDER_STEPS = [
    { key: 'placed', label: 'Order Placed', icon: Clock },
    { key: 'processing', label: 'Curating & Packing', icon: PackageCheck },
    { key: 'dispatched', label: 'Dispatched', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle2 },
];

export default function OrdersPage() {
    const { orders } = useCart();
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyAuth = async () => {
            const token = localStorage.getItem('auth_token');
            if (!token) {
                router.push('/signin');
                return;
            }

            try {
                await apiClient.get('/auth/profile');
                setLoading(false);
            } catch (err) {
                localStorage.removeItem('auth_token');
                router.push('/signin');
            }
        };

        verifyAuth();
    }, [router]);

    // Helper to determine active step index based on simulated status or order properties
    const getActiveStepIndex = (order: any) => {
        const status = (order.status || 'placed').toLowerCase();
        if (status.includes('deliver')) return 3;
        if (status.includes('dispatch') || status.includes('shipped')) return 2;
        if (status.includes('process') || status.includes('pack')) return 1;
        return 0; // default placed
    };

    if (loading) {
        return (
            <div className="w-full min-h-screen bg-(--color-background) flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 size={24} className="animate-spin text-(--color-gold-dark)" />
                    <span className="text-xs font-bold uppercase tracking-wider text-(--color-text-muted)">Loading secure orders...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-(--color-background) pb-16 box-border">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-(--color-surface)/95 backdrop-blur-md border-b border-(--color-border) p-6 box-border flex items-center justify-center">
                <GlowaVeeLogo />
            </header>

            <main className="flex flex-col gap-6 px-6 pt-6 max-w-full mx-auto w-full box-border">
                {/* Page Title & Attractive Order Counter Badge */}
                <div className="flex flex-col gap-3 items-center text-center">
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-(--color-gold-dark) flex items-center gap-1.5">
                        Your Order Tracking
                    </span>
                    <h1 className="text-2xl font-serif text-(--color-text)">Purchase History & Status</h1>
                    
                    {/* Attractive Order Counter Display */}
                    <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-linear-to-r from-[#3d2c10] to-[#594018] text-white shadow-md shadow-[#3d2c10]/15 border border-(--color-border)">
                        <div className="w-6 h-6 bg-white/10 flex items-center justify-center text-[#f3c54b]">
                            <Package size={13} />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider">
                            {orders.length} {orders.length === 1 ? 'Active Curation' : 'Active Curations'} Recorded
                        </span>
                    </div>

                    <p className="text-xs text-(--color-text-muted) max-w-md">Monitor the real-time progression of your luxury skincare curations below.</p>
                </div>

                {orders.length === 0 ? (
                    <div className="w-full border border-(--color-border-strong) bg-white p-10 text-center shadow-xs flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-(--color-surface) flex items-center justify-center text-(--color-gold-dark) mb-4 border border-(--color-border)">
                            <PackageOpen size={28} />
                        </div>
                        <h2 className="text-lg font-serif text-(--color-text) mb-1">No orders yet</h2>
                        <p className="text-xs text-(--color-text-muted) max-w-xs mb-6">Complete a checkout and your order tracking history will appear here instantly.</p>
                        <button 
                            type="button"
                            onClick={() => router.push('/')}
                            className="w-full h-12 inline-flex items-center justify-center gap-2 bg-linear-to-r from-[#3d2c10] to-[#f3c54b] text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-[#3d2c10]/15 transition-all hover:brightness-105"
                        >
                            Shop collection
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {orders.map((order: any) => {
                            const activeStepIndex = getActiveStepIndex(order);

                            return (
                                <div key={order.id} className="border border-(--color-border-strong) bg-white p-6 shadow-xs space-y-6">
                                    {/* Premium Visual Status Flow */}
                                    <div className="pb-4 border-b border-(--color-border)">
                                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-(--color-gold-dark) mb-4 block">
                                            Progression Status
                                        </span>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                            {ORDER_STEPS.map((step, idx) => {
                                                const isCompleted = idx <= activeStepIndex;
                                                const isCurrent = idx === activeStepIndex;
                                                const StepIcon = step.icon;

                                                return (
                                                    <div 
                                                        key={step.key} 
                                                        className={`relative flex flex-col items-center p-3 border rounded-xs text-center transition-all ${
                                                            isCurrent 
                                                                ? 'border-[#3d2c10] bg-[#3d2c10]/5 shadow-xs' 
                                                                : isCompleted 
                                                                ? 'border-(--color-gold-dark)/60 bg-(--color-surface)' 
                                                                : 'border-(--color-border) bg-white opacity-50'
                                                        }`}
                                                    >
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 border ${
                                                            isCurrent || isCompleted 
                                                                ? 'bg-linear-to-r from-[#3d2c10] to-[#f3c54b] text-white border-transparent shadow-xs' 
                                                                : 'bg-white text-(--color-text-muted) border-(--color-border)'
                                                        }`}>
                                                            <StepIcon size={14} />
                                                        </div>
                                                        <span className="text-[11px] font-bold text-(--color-text) block leading-tight">{step.label}</span>
                                                        <span className="text-[9px] text-(--color-text-muted) mt-0.5">
                                                            {isCompleted ? (isCurrent ? 'In Progress' : 'Completed') : 'Pending'}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Order Meta Header */}
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-(--color-border)">
                                        <div>
                                            <span className="text-xs font-bold text-(--color-text) block font-mono">Order #{order.id}</span>
                                            <span className="text-[10px] text-(--color-text-muted) block">Recipient: {order.customerName}</span>
                                        </div>
                                        <div className="text-left sm:text-right">
                                            <span className="text-xs sm:text-sm font-bold text-(--color-gold-dark) block">
                                                R{Number(order.total).toFixed(2)}
                                            </span>
                                            <span className="text-[10px] text-(--color-text-muted) block">
                                                {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Ordered Items Summary */}
                                    <div className="border border-(--color-border) bg-(--color-background) p-4 space-y-2.5">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-(--color-text-muted) block">Curated Items</span>
                                        {order.items.map((item: any) => (
                                            <div key={item.id} className="flex items-center justify-between text-xs py-1.5 border-b border-(--color-border) last:border-b-0">
                                                <span className="text-(--color-text) font-medium">{item.name}</span>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-(--color-text-muted) font-semibold">x{item.quantity}</span>
                                                    <span className="text-(--color-gold-dark) font-bold">R{(item.price * item.quantity).toFixed(2)}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}