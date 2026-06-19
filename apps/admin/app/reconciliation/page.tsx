'use client';

import React, { useState } from 'react';

// Simplified layout records for easy tracking
interface SimpleBankDeposit {
    id: string;
    paidBy: string;
    amount: number;
    bankRef: string;
    date: string;
}

interface SimpleCustomerOrder {
    id: string;
    customerName: string;
    amount: number;
    orderNum: string;
    items: string;
}

export default function PaymentMatcherPage() {
    // Mock data for payments sitting in the bank with bad/missing references
    const [unmatchedDeposits, setUnmatchedDeposits] = useState<SimpleBankDeposit[]>([
        { id: 'b1', paidBy: 'Thabo M.', amount: 450.00, bankRef: 'SKINCARE', date: '14 June' },
        { id: 'b2', paidBy: 'S Jenkins', amount: 1250.00, bankRef: 'ABCD-EFT', date: '14 June' },
    ]);

    // Mock data for orders waiting to be paid
    const [unpaidOrders, setUnpaidOrders] = useState<SimpleCustomerOrder[]>([
        { id: 'o1', customerName: 'Thabo Molefe', amount: 450.00, orderNum: 'PH-9042', items: 'Capsules x1' },
        { id: 'o2', customerName: 'Sarah Jenkins', amount: 1250.00, orderNum: 'PH-3312', items: 'Cream x2, Capsules x1' },
    ]);

    // Selection states for clicking and matching items
    const [selectedDeposit, setSelectedDeposit] = useState<SimpleBankDeposit | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<SimpleCustomerOrder | null>(null);

    // Click handler to connect the bank deposit to the order
    const handleLinkRecords = () => {
        if (!selectedDeposit || !selectedOrder) return;

        alert(`Success! Linked ${selectedDeposit.paidBy}'s payment of R${selectedDeposit.amount} to order ${selectedOrder.orderNum}`);
        
        // Remove them from the unmatched screen lists
        setUnmatchedDeposits(unmatchedDeposits.filter(d => d.id !== selectedDeposit.id));
        setUnpaidOrders(unpaidOrders.filter(o => o.id !== selectedOrder.id));
        
        // Reset selections
        setSelectedDeposit(null);
        setSelectedOrder(null);
    };

    return (
        <div className="space-y-10">
            
            {/* Header Block */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-6">
                <div>
                    <div className="text-[11px] font-bold uppercase text-indigo-400 tracking-widest mb-1.5">
                        Fix Unmatched Payments
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-white">
                        Payment Matcher
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">
                        Connect bank deposits with missing references to your customer orders.
                    </p>
                </div>
            </div>

            {/* Quick Match Tool Interaction Strip */}
            {selectedDeposit && selectedOrder && (
                <div className="bg-indigo-600/20 border border-indigo-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in zoom-in-95 duration-200">
                    <p className="text-sm font-medium text-slate-200">
                        Link <span className="text-white font-bold font-mono">R {selectedDeposit.amount}</span> from <span className="text-white font-bold">{selectedDeposit.paidBy}</span> to <span className="text-white font-bold">{selectedOrder.customerName}'s</span> order (<span className="text-indigo-400 font-mono font-bold">{selectedOrder.orderNum}</span>)?
                    </p>
                    <button 
                        onClick={handleLinkRecords}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md"
                    >
                        Confirm Match & Clear
                    </button>
                </div>
            )}

            {/* Split Screen Workspace Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Column 1: Money in the Bank */}
                <div className="ph-glass-panel p-6 space-y-4">
                    <h3 className="text-md font-bold text-white flex items-center gap-2">
                        <span>💰</span> 1. Money In Bank (Unmatched)
                    </h3>
                    <p className="text-xs text-slate-400">Payments that landed in your account but haven't been linked to an order yet.</p>

                    {unmatchedDeposits.length === 0 ? (
                        <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-6 text-center text-xs font-semibold text-emerald-400">
                            🎉 Awesome! No unmatched bank payments left.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {unmatchedDeposits.map((deposit) => (
                                <div 
                                    key={deposit.id}
                                    onClick={() => setSelectedDeposit(deposit)}
                                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                                        selectedDeposit?.id === deposit.id 
                                            ? 'bg-indigo-600/20 border-indigo-500' 
                                            : 'bg-slate-950/40 border-white/[0.04] hover:bg-white/[0.02]'
                                    }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm font-semibold text-white">{deposit.paidBy || 'Unknown Payer'}</p>
                                            <p className="text-[11px] text-slate-500 font-mono mt-1">Bank Reference: {deposit.bankRef}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-emerald-400 font-mono">R {deposit.amount.toFixed(2)}</p>
                                            <p className="text-[10px] text-slate-500 mt-1">{deposit.date}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Column 2: Customer Orders waiting for Payment */}
                <div className="ph-glass-panel p-6 space-y-4">
                    <h3 className="text-md font-bold text-white flex items-center gap-2">
                        <span>📦</span> 2. Unpaid Orders
                    </h3>
                    <p className="text-xs text-slate-400">Orders created by customers that are still waiting for a matching bank payment.</p>

                    {unpaidOrders.length === 0 ? (
                        <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-6 text-center text-xs font-semibold text-emerald-400">
                            🎉 Awesome! All active orders have been paid for.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {unpaidOrders.map((order) => (
                                <div 
                                    key={order.id}
                                    onClick={() => setSelectedOrder(order)}
                                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                                        selectedOrder?.id === order.id 
                                            ? 'bg-indigo-600/20 border-indigo-500' 
                                            : 'bg-slate-950/40 border-white/[0.04] hover:bg-white/[0.02]'
                                    }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm font-semibold text-white">{order.customerName}</p>
                                            <p className="text-[11px] text-slate-400 mt-1">{order.items}</p>
                                            <p className="text-[10px] text-indigo-400 font-mono mt-1 font-bold">{order.orderNum}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-slate-200 font-mono">R {order.amount.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}