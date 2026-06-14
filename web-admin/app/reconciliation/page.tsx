'use client';

import React, { useEffect, useState } from 'react';
// import { apiCall } from '@/lib/api';

// Temporary inline structures for dependencies to ensure zero compilation breaks
interface Payment {
    id: string;
    customerName: string;
    amount: number;
    date: string;
}

interface Order {
    id: string;
    reference: string;
    customerName: string;
    totalAmount: number;
}

export interface ReconciliationReport {
    totalPayments: number;
    totalOrders: number;
    discrepancy: number;
    unmatchedPayments: Payment[];
    unmatchedOrders: Partial<Order>[];
}

export default function ReconciliationPage() {
    const [reconciliation, setReconciliation] = useState<ReconciliationReport | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // Mock data provided to test conditional balancing states
        setReconciliation({
            totalPayments: 84500.00,
            totalOrders: 84500.00,
            discrepancy: 0,
            unmatchedPayments: [],
            unmatchedOrders: [],
        });
        setLoading(false);
    }, []);

    if (loading || !reconciliation) {
        return (
            <div className="flex justify-center items-center h-[60vh] text-slate-500 text-xs font-mono tracking-widest animate-pulse">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping mr-3"></span>
                COMPILING RECONCILIATION MATRIX...
            </div>
        );
    }

    return (
        <div className="space-y-10">
            
            {/* Page Header Block matching Dashboard specification */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-6">
                <div>
                    <div className="text-[11px] font-bold uppercase text-indigo-400 tracking-widest mb-1.5">
                        Ledger Verification // Core Engine
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-white">
                        Payment Reconciliation
                    </h1>
                </div>
                <div className="flex items-center">
                    <div className="bg-white/[0.02] border border-white/[0.08] px-4 py-2 rounded-xl text-xs text-slate-300 flex items-center gap-2.5 font-mono font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        Status: Live Synced
                    </div>
                </div>
            </div>

            {/* Mobile-Responsive Metrics Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Total Payments */}
                <div className="ph-glass-panel p-6">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Payments Received</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    </div>
                    <div className="text-3xl font-black tracking-tight text-white mb-2 font-mono">
                        R {reconciliation.totalPayments.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">Inbound clearing channels</div>
                </div>

                {/* Total Paid Orders */}
                <div className="ph-glass-panel p-6">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Paid Orders</span>
                        <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                    </div>
                    <div className="text-3xl font-black tracking-tight text-white mb-2 font-mono">
                        R {reconciliation.totalOrders.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">Pipeline distribution value</div>
                </div>

                {/* Discrepancy Tracking Card */}
                <div className="ph-glass-panel p-6">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Discrepancy Variance</span>
                        <span className={`w-2 h-2 rounded-full ${reconciliation.discrepancy === 0 ? 'bg-emerald-400' : 'bg-amber-400 animate-ping'}`}></span>
                    </div>
                    <div className={`text-3xl font-black tracking-tight mb-2 font-mono ${reconciliation.discrepancy === 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {reconciliation.discrepancy === 0 ? '✓ Balanced' : `R ${reconciliation.discrepancy.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`}
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">
                        {reconciliation.discrepancy === 0 ? 'Audit matrix perfectly cleared' : 'Requires dynamic log matching'}
                    </div>
                </div>
            </div>

            {/* Split Ledger Table Real Estate */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Panel Left: Unmatched Payments */}
                <div className="ph-glass-panel p-6">
                    <h3 className="text-md font-bold mb-4 text-white flex items-center gap-2">
                        <span className="text-rose-400">⚠️</span> Unmatched Payments Stream
                    </h3>
                    
                    {reconciliation.unmatchedPayments.length === 0 ? (
                        <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4 text-center">
                            <p className="text-xs font-semibold text-emerald-400 font-mono">✓ CLEAR: All transactional captures matched to live orders.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto rounded-xl border border-white/[0.04]">
                            <table className="ph-ledger-table">
                                <thead>
                                    <tr>
                                        <th className="ph-ledger-th">Customer</th>
                                        <th className="ph-ledger-th">Amount</th>
                                        <th className="ph-ledger-th text-right">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reconciliation.unmatchedPayments.map((p) => (
                                        <tr key={p.id} className="ph-ledger-tr">
                                            <td className="ph-ledger-td font-semibold text-white truncate max-w-[140px]">{p.customerName}</td>
                                            <td className="ph-ledger-td font-mono text-emerald-400 font-bold">R {p.amount.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</td>
                                            <td className="ph-ledger-td font-mono text-xs text-slate-400 text-right">{new Date(p.date).toLocaleDateString('en-ZA')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Panel Right: Pending Payment Orders */}
                <div className="ph-glass-panel p-6">
                    <h3 className="text-md font-bold mb-4 text-white flex items-center gap-2">
                        <span className="text-amber-400">🕒</span> Pending Payment Orders
                    </h3>
                    
                    {reconciliation.unmatchedOrders.length === 0 ? (
                        <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4 text-center">
                            <p className="text-xs font-semibold text-emerald-400 font-mono">✓ CLEAR: Zero pending collections in current dispatch stack.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto rounded-xl border border-white/[0.04]">
                            <table className="ph-ledger-table">
                                <thead>
                                    <tr>
                                        <th className="ph-ledger-th">Order Ref</th>
                                        <th className="ph-ledger-th">Customer</th>
                                        <th className="ph-ledger-th text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reconciliation.unmatchedOrders.map((o) => (
                                        <tr key={o.id} className="ph-ledger-tr">
                                            <td className="ph-ledger-td font-mono text-xs text-indigo-400 font-bold">{o.reference}</td>
                                            <td className="ph-ledger-td font-semibold text-white truncate max-w-[140px]">{o.customerName}</td>
                                            <td className="ph-ledger-td font-mono text-slate-300 font-bold text-right">R {o.totalAmount?.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}