'use client';

import React, { useEffect, useState } from 'react';
// import { apiCall } from '@/lib/api'; // Ready for integration

// 1. Define a strict type union for predictable tracking statuses
export type OrderStatus = 'pending' | 'completed' | 'cancelled' | 'processing';

// 2. Map out the full core layout data model for system orders
export interface Order {
    id: string | number;
    reference: string;
    customerName: string;
    totalAmount: number;
    status: OrderStatus;
    date: string | Date;
}

export default function OrdersPage() {
    // 3. Initialize the state explicitly as an array of the Order interface
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // TODO: fetch orders from API
        // const fetchOrders = async () => {
        //   try {
        //     const data = await apiCall<Order[]>('/orders');
        //     setOrders(data);
        //   } catch (error) {
        //     console.error('Failed to stream telemetry:', error);
        //   } finally {
        //     setLoading(false);
        //   }
        // };
        
        setOrders([]);
        setLoading(false);
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <div>
        <h1>Orders</h1>
        {orders.length === 0 ? (
            <p>No orders yet.</p>
        ) : (
            <div className="card">
            <table>
                <thead>
                <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                </tr>
                </thead>
                <tbody>
                {orders.map((order) => (
                    <tr key={order.id}>
                    <td>{order.reference}</td>
                    <td>{order.customerName}</td>
                    <td>R {order.totalAmount.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</td>
                    <td>
                        <span className={`status-badge status-${order.status}`}>
                        {order.status}
                        </span>
                    </td>
                    <td>{new Date(order.date).toLocaleDateString('en-ZA')}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        )}
        </div>
    );
}