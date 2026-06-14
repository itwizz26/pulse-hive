'use client';

import React, { useEffect, useState } from 'react';
// import { apiCall } from '@/lib/api';

// 1. Define strict domain model for incoming payment events
export interface Payment {
    id: string | number;
    customerName: string;
    amount: number;
    matched: boolean;
    date: string | Date;
}

export default function PaymentsPage() {
    // 2. Bound the state vector engine cleanly
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // TODO: fetch payments from API
        setPayments([]);
        setLoading(false);
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <div>
        <h1>Payment Records</h1>
        {payments.length === 0 ? (
            <p>No payments logged yet.</p>
        ) : (
            <div className="card">
            <table>
                <thead>
                <tr>
                    <th>Payment ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                </tr>
                </thead>
                <tbody>
                {payments.map((payment) => (
                    <tr key={payment.id}>
                    <td>{payment.id}</td>
                    <td>{payment.customerName}</td>
                    <td>R {payment.amount.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</td>
                    <td>
                        <span className={`status-badge ${payment.matched ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {payment.matched ? 'Matched' : 'Unmatched'}
                        </span>
                    </td>
                    <td>{new Date(payment.date).toLocaleDateString('en-ZA')}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        )}
        </div>
    );
}