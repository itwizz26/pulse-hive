'use client';

import React, { useEffect, useState } from 'react';
// import { apiCall } from '@/lib/api';
import { Payment } from '../payments/page';
import { Order } from '../orders/page';

// 1. Structural blueprint for the full ledger reconciliation metrics payload
export interface ReconciliationReport {
    totalPayments: number;
    totalOrders: number;
    discrepancy: number;
    unmatchedPayments: Payment[];
    unmatchedOrders: Partial<Order>[]; // Partial handles scaled or abbreviated order items safely
}

export default function ReconciliationPage() {
    // 2. Set strict object or null boundaries to handle loading lifecycles cleanly
    const [reconciliation, setReconciliation] = useState<ReconciliationReport | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // TODO: fetch reconciliation report from API
        setReconciliation({
        totalPayments: 0,
        totalOrders: 0,
        discrepancy: 0,
        unmatchedPayments: [],
        unmatchedOrders: [],
        });
        setLoading(false);
    }, []);

    // 3. Mandatory compiler guard checking to prevent hydration crashes against a null record
    if (loading || !reconciliation) return <p>Loading...</p>;

    return (
        <div>
        <h1>Payment Reconciliation</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '2rem' }}>
            <div className="card">
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Payments Received</div>
            <div style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#059669', marginTop: '0.5rem' }}>
                R {reconciliation.totalPayments.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
            </div>
            </div>
            <div className="card">
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Paid Orders</div>
            <div style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#2563eb', marginTop: '0.5rem' }}>
                R {reconciliation.totalOrders.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
            </div>
            </div>
            <div className="card">
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Discrepancy</div>
            <div style={{ fontSize: '1.875rem', fontWeight: 'bold', color: reconciliation.discrepancy === 0 ? '#10b981' : '#f59e0b', marginTop: '0.5rem' }}>
                {reconciliation.discrepancy === 0 ? '✓ Balanced' : `R ${reconciliation.discrepancy.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`}
            </div>
            </div>
        </div>

        <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div className="card">
            <h2 style={{ marginBottom: '1rem' }}>Unmatched Payments</h2>
            {reconciliation.unmatchedPayments.length === 0 ? (
                <p style={{ color: '#10b981', fontWeight: '600' }}>✓ All payments matched!</p>
            ) : (
                <table>
                <thead>
                    <tr>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {reconciliation.unmatchedPayments.map((p) => (
                    <tr key={p.id}>
                        <td>{p.customerName}</td>
                        <td>R {p.amount.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</td>
                        <td>{new Date(p.date).toLocaleDateString('en-ZA')}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
            )}
            </div>

            <div className="card">
            <h2 style={{ marginBottom: '1rem' }}>Pending Payment Orders</h2>
            {reconciliation.unmatchedOrders.length === 0 ? (
                <p style={{ color: '#10b981', fontWeight: '600' }}>✓ All orders paid!</p>
            ) : (
                <table>
                <thead>
                    <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {reconciliation.unmatchedOrders.map((o) => (
                    <tr key={o.id}>
                        <td>{o.reference}</td>
                        <td>{o.customerName}</td>
                        <td>R {o.totalAmount?.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
            )}
            </div>
        </div>
        </div>
    );
}