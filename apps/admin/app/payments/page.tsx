'use client';

import React, { useEffect, useState } from 'react';

export interface BankDeposit {
    id: string;
    whoPaid: string;
    amountPaid: number;
    matchedToOrder: boolean;
    dateReceived: string;
}

export default function MoneyComingInPage() {
    const [deposits, setDeposits] = useState<BankDeposit[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        setDeposits([
            { id: "DEP-1", whoPaid: "Sarah Jenkins", amountPaid: 1250.00, matchedToOrder: true, dateReceived: "14 June" },
            { id: "DEP-2", whoPaid: "Thabo Molefe", amountPaid: 3400.00, matchedToOrder: false, dateReceived: "14 June" },
            { id: "DEP-3", whoPaid: "Amina Desai", amountPaid: 850.50, matchedToOrder: true, dateReceived: "13 June" },
        ]);
        setLoading(false);
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh] text-slate-500 text-xs font-mono tracking-widest animate-pulse">
                LOADING BANK STATEMENT STREAM...
            </div>
        );
    }

    return (
        <div className="space-y-10">
            
            {/* Header Block */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-6">
                <div>
                    <div className="text-[11px] font-bold uppercase text-indigo-400 tracking-widest mb-1.5">
                        Bank Activity Stream
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-white">
                        Money Coming In
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">A direct look at the money clearing into your bank accounts.</p>
                </div>
            </div>

            {/* Table Panel */}
            {deposits.length === 0 ? (
                <div className="ph-glass-panel p-12 text-center border-dashed border-white/[0.04]">
                    <p className="text-sm text-slate-400 font-mono">No bank payments spotted today yet.</p>
                </div>
            ) : (
                <div className="ph-glass-panel p-6">
                    <div className="overflow-x-auto rounded-xl border border-white/[0.04]">
                        <table className="ph-ledger-table">
                            <thead>
                                <tr>
                                    <th className="ph-ledger-th">Who Paid</th>
                                    <th className="ph-ledger-th">Amount</th>
                                    <th className="ph-ledger-th">Status</th>
                                    <th className="ph-ledger-th text-right">Date Received</th>
                                </tr>
                            </thead>
                            <tbody>
                                {deposits.map((deposit) => (
                                    <tr key={deposit.id} className="ph-ledger-tr">
                                        <td className="ph-ledger-td font-semibold text-white">
                                            {deposit.whoPaid}
                                        </td>
                                        <td className="ph-ledger-td font-mono text-slate-200 font-bold">
                                            R {deposit.amountPaid.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="ph-ledger-td">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                                                deposit.matchedToOrder 
                                                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                                                    : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                                            }`}>
                                                {deposit.matchedToOrder ? '✓ Linked to Order' : '⚠️ Missing Order'}
                                            </span>
                                        </td>
                                        <td className="ph-ledger-td font-mono text-xs text-slate-400 text-right">
                                            {deposit.dateReceived}
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