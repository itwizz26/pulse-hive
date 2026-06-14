'use client';

import React, { useEffect, useState } from 'react';
// import { apiCall } from '@/lib/api';

// Strict domain model matching reconciliation structural mappings
export interface Payment {
    id: string | number;
    customerName: string;
    amount: number;
    matched: boolean;
    date: string | Date;
}

export default function PaymentsPage() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // TODO: fetch payments from live production API stream
        // Hydrating mock metrics safely to preview status layouts
        setPayments([
            { id: "PAY-9041", customerName: "Sarah Jenkins", amount: 1250.00, matched: true, date: "2026-06-14T12:00:00Z" },
            { id: "PAY-9042", customerName: "Thabo Molefe", amount: 3400.00, matched: false, date: "2026-06-14T14:15:00Z" },
            { id: "PAY-9043", customerName: "Amina Desai", amount: 850.50, matched: true, date: "2026-06-13T09:30:00Z" },
        ]);
        setLoading(false);
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh] text-slate-500 text-xs font-mono tracking-widest animate-pulse">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping mr-3"></span>
                POLLING PAYMENT INBOUND RECORDS...
            </div>
        );
    }

    return (
        <div className="space-y-10">
            
            {/* Standard Corporate Header Block */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-6">
                <div>
                    <div className="text-[11px] font-bold uppercase text-indigo-400 tracking-widest mb-1.5">
                        Transaction Logs // Inbound Channels
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-white">
                        Payment Records
                    </h1>
                </div>
                <div className="flex items-center">
                    <div className="bg-white/[0.02] border border-white/[0.08] px-4 py-2 rounded-xl text-xs text-slate-300 flex items-center gap-2.5 font-mono font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
                        Active Ledger Stream
                    </div>
                </div>
            </div>

            {/* Core Data Presentation Layer */}
            {payments.length === 0 ? (
                <div className="ph-glass-panel p-12 text-center border-dashed border-white/[0.04]">
                    <div className="text-2xl mb-2">💸</div>
                    <p className="text-sm font-medium text-slate-400 font-mono">
                        No processing events mapped or logged to current stream.
                    </p>
                </div>
            ) : (
                <div className="ph-glass-panel p-6">
                    {/* Horizontal scroll support container preventing layout compression on mobile screens */}
                    <div className="overflow-x-auto rounded-xl border border-white/[0.04]">
                        <table className="ph-ledger-table">
                            <thead>
                                <tr>
                                    <th className="ph-ledger-th">Payment ID</th>
                                    <th className="ph-ledger-th">Customer</th>
                                    <th className="ph-ledger-th">Amount</th>
                                    <th className="ph-ledger-th">Status</th>
                                    <th className="ph-ledger-th text-right">Clearing Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map((payment) => (
                                    <tr key={payment.id} className="ph-ledger-tr">
                                        <td className="ph-ledger-td font-mono text-xs text-indigo-400 font-bold">
                                            {payment.id}
                                        </td>
                                        <td className="ph-ledger-td font-semibold text-white truncate max-w-[180px]">
                                            {payment.customerName}
                                        </td>
                                        <td className="ph-ledger-td font-mono text-slate-200 font-bold">
                                            R {payment.amount.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="ph-ledger-td">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider border ${
                                                payment.matched 
                                                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                                                    : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                                            }`}>
                                                <span className={`w-1 h-1 rounded-full mr-1.5 ${payment.matched ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                                                {payment.matched ? 'Matched' : 'Unmatched'}
                                            </span>
                                        </td>
                                        <td className="ph-ledger-td font-mono text-xs text-slate-400 text-right">
                                            {new Date(payment.date).toLocaleDateString('en-ZA')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}