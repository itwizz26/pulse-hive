'use client';

import React, { useEffect, useState } from 'react';

// Friendly layout record matching our business fields
export interface Order {
    id: string;
    reference: string; // The exact reference the customer needs to put on their EFT deposit
    customerName: string;
    contactNumber: string;
    itemsSummary: string;
    totalAmount: number;
    paymentStatus: 'PENDING' | 'PAID' | 'PARTIAL' | 'FLAGGED';
    createdAt: string;
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

    // Form states for adding a brand new customer order
    const [customerName, setCustomerName] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [itemsSummary, setItemsSummary] = useState('');
    const [totalAmount, setTotalAmount] = useState('');
    const [customRef, setCustomRef] = useState('');

    useEffect(() => {
        // Mock data matching active customer orders
        setOrders([
            {
                id: "ORD-2091",
                reference: "MATHEBULA-COLLAGEN",
                customerName: "D Mathebula",
                contactNumber: "+27821112222",
                itemsSummary: "Collagen Cream x2, Capsules x1",
                totalAmount: 1450.00,
                paymentStatus: "PAID",
                createdAt: "2026-06-14T10:30:00Z"
            },
            {
                id: "ORD-2092",
                reference: "INV-8831",
                customerName: "Naledi Dlamini",
                contactNumber: "+27713334444",
                itemsSummary: "Glow Serum x1",
                totalAmount: 480.00,
                paymentStatus: "PENDING",
                createdAt: "2026-06-14T15:22:00Z"
            },
            {
                id: "ORD-2093",
                reference: "SKINCARE-BOOST",
                customerName: "Chantel van der Merwe",
                contactNumber: "+27635556666",
                itemsSummary: "Collagen Capsules x3",
                totalAmount: 1350.00,
                paymentStatus: "FLAGGED",
                createdAt: "2026-06-13T08:12:00Z"
            }
        ]);
        setLoading(false);
    }, []);

    // Create a new order card on submission
    const triggerOrderCreation = (e: React.FormEvent) => {
        e.preventDefault();
        if (!customerName || !totalAmount) return;

        // Auto-generate a clean tracking key if the seller doesn't add a custom reference code
        const generatedRef = customRef.trim().toUpperCase() || `PH-${Math.floor(1000 + Math.random() * 9000)}`;

        const newOrder: Order = {
            id: `ORD-${Math.floor(2000 + Math.random() * 1000)}`,
            reference: generatedRef,
            customerName,
            contactNumber: contactNumber || 'N/A',
            itemsSummary: itemsSummary || 'Cosmetics Batch Item',
            totalAmount: parseFloat(totalAmount),
            paymentStatus: 'PENDING',
            createdAt: new Date().toISOString()
        };

        setOrders([newOrder, ...orders]);
        
        // Reset form variables & close the drawer slide-out
        setCustomerName('');
        setContactNumber('');
        setItemsSummary('');
        setTotalAmount('');
        setCustomRef('');
        setIsDrawerOpen(false);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh] text-slate-500 text-xs font-mono tracking-widest animate-pulse">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping mr-3"></span>
                LOADING CUSTOMER ORDERS...
            </div>
        );
    }

    return (
        <div className="space-y-10 relative">
            
            {/* Friendly Header Block */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-6">
                <div>
                    <div className="text-[11px] font-bold uppercase text-indigo-400 tracking-widest mb-1.5">
                        Track & Manage Deliveries
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-white">
                        Customer Orders
                    </h1>
                </div>
                <button 
                    onClick={() => setIsDrawerOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-950/50 flex items-center gap-2 self-start sm:self-auto group"
                >
                    <span className="text-sm transition-transform duration-150 group-hover:scale-110">+</span> 
                    Add New Order
                </button>
            </div>

            {/* Quick Summary Counter Ribbons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="ph-glass-panel p-4 flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">Total Orders Added</span>
                    <span className="font-mono text-lg font-bold text-white">{orders.length}</span>
                </div>
                <div className="ph-glass-panel p-4 flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">Waiting for Payment</span>
                    <span className="font-mono text-lg font-bold text-amber-400">
                        {orders.filter(o => o.paymentStatus === 'PENDING').length}
                    </span>
                </div>
                <div className="ph-glass-panel p-4 flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">Flagged (Unmatched/Wrong Amount)</span>
                    <span className="font-mono text-lg font-bold text-rose-400">
                        {orders.filter(o => o.paymentStatus === 'FLAGGED').length}
                    </span>
                </div>
            </div>

            {/* Main Orders List Table */}
            <div className="ph-glass-panel p-6">
                <div className="overflow-x-auto rounded-xl border border-white/[0.04]">
                    <table className="ph-ledger-table">
                        <thead>
                            <tr>
                                <th className="ph-ledger-th">Order ID</th>
                                <th className="ph-ledger-th">Bank Reference Code</th>
                                <th className="ph-ledger-th">Customer Details</th>
                                <th className="ph-ledger-th">Products Bought</th>
                                <th className="ph-ledger-th">Total Due</th>
                                <th className="ph-ledger-th text-right">Payment Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id} className="ph-ledger-tr">
                                    <td className="ph-ledger-td font-mono text-xs text-slate-500">{order.id}</td>
                                    <td className="ph-ledger-td font-mono text-xs font-bold text-indigo-400 tracking-wide">
                                        {order.reference}
                                    </td>
                                    <td className="ph-ledger-td font-semibold text-white">
                                        <div>{order.customerName}</div>
                                        <div className="text-[10px] text-slate-500 font-normal font-mono mt-0.5">{order.contactNumber}</div>
                                    </td>
                                    <td className="ph-ledger-td text-xs text-slate-400 max-w-[200px] truncate">
                                        {order.itemsSummary}
                                    </td>
                                    <td className="ph-ledger-td font-mono font-bold text-slate-200">
                                        R {order.totalAmount.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="ph-ledger-td text-right">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-sans font-bold uppercase border ${
                                            order.paymentStatus === 'PAID' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                                            order.paymentStatus === 'FLAGGED' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' :
                                            'bg-amber-500/10 border-amber-500/20 text-amber-400'
                                        }`}>
                                            {order.paymentStatus === 'PAID' ? '✓ Paid' : 
                                             order.paymentStatus === 'FLAGGED' ? '⚠️ Flagged' : '⏳ Waiting'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Slide-over Form Drawer */}
            {isDrawerOpen && (
                <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
                    
                    {/* Background overlay click-to-close handler */}
                    <div className="flex-1" onClick={() => setIsDrawerOpen(false)} />

                    <div className="w-full max-w-md bg-slate-900 border-l border-white/[0.08] p-8 space-y-6 shadow-2xl h-full flex flex-col justify-between animate-in slide-in-from-right duration-200">
                        <div className="space-y-6 overflow-y-auto pr-1">
                            <div>
                                <h3 className="text-xl font-black text-white">Add New Order Manually</h3>
                                <p className="text-xs text-slate-400 mt-1">Copy customer order info from your Instagram or WhatsApp DMs directly into the tracker.</p>
                            </div>

                            <form onSubmit={triggerOrderCreation} id="drawer-form" className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Customer Name *</label>
                                    <input 
                                        type="text" required value={customerName} onChange={(e) => setCustomerName(e.target.value)}
                                        placeholder="e.g. Tendai Khumalo"
                                        className="w-full bg-slate-950 border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Contact Number</label>
                                    <input 
                                        type="text" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)}
                                        placeholder="e.g. +27834567890"
                                        className="w-full bg-slate-950 border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Custom Payment Reference Code (Optional)</label>
                                    <input 
                                        type="text" value={customRef} onChange={(e) => setCustomRef(e.target.value)}
                                        placeholder="Leave blank to create a random order code"
                                        className="w-full bg-slate-950 border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-600 font-mono text-xs uppercase"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">What Products Did They Order?</label>
                                    <textarea 
                                        rows={3} value={itemsSummary} onChange={(e) => setItemsSummary(e.target.value)}
                                        placeholder="e.g. Collagen Cream x1, Glow Serum x1"
                                        className="w-full bg-slate-950 border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Total Money to Pay (ZAR) *</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-2.5 text-sm font-bold text-slate-500 font-mono">R</span>
                                        <input 
                                            type="number" step="0.01" required value={totalAmount} onChange={(e) => setTotalAmount(e.target.value)}
                                            placeholder="0.00"
                                            className="w-full bg-slate-950 border border-white/[0.08] rounded-xl pl-9 pr-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-indigo-500 transition-colors"
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Control Actions Pin */}
                        <div className="flex items-center gap-3 border-t border-white/[0.06] pt-4 bg-slate-900">
                            <button 
                                type="button" onClick={() => setIsDrawerOpen(false)}
                                className="flex-1 bg-white/5 hover:bg-white/10 text-slate-300 py-3 rounded-xl text-xs font-bold transition-all"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" form="drawer-form"
                                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-950/50"
                            >
                                Save Order
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}