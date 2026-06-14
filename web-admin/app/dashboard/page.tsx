'use client';

import React, { useEffect, useState } from 'react';
// import { apiCall } from '@/lib/api'; // Commented out to match your setup context

// 1. Define the structural metric signature for full system tracking
interface DashboardStats {
    totalOrders: number;
    totalRevenue: number;
    pendingPayments: number;
    readyToShip: number;
    conversionRate: number;
    averageOrderValue: number;
}

export default function DashboardPage() {
    // 2. Set strict typing bounds on the state engines
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // TODO: fetch dashboard stats from API
        setStats({
            totalOrders: 142,
            totalRevenue: 128450,
            pendingPayments: 18,
            readyToShip: 24,
            conversionRate: 3.4,
            averageOrderValue: 904.57,
        });
        setLoading(false);
    }, []);

    // 3. Early return guards ensure that the 'stats' variable is guaranteed to be hydrated below
    if (loading || !stats) {
        return (
            <div className="flex justify-center items-center h-[60vh] text-slate-400 text-base font-medium tracking-widest animate-pulse">
                <span className="mr-3">⚡</span> LOADING SYSTEM DIAGNOSTICS...
            </div>
        );
    }

    return (
        <div className="p-10 min-h-screen">
            {/* Header Area */}
            <div className="flex justify-between items-center mb-12 border-b border-black/5 pb-6">
                <div>
                    <div className="text-xs font-bold uppercase text-indigo-600 tracking-widest mb-2">
                        Executive Overview
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight m-0 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500">
                        Enterprise Dashboard
                    </h1>
                </div>
                <div className="flex gap-3">
                    <div className="bg-black/5 border border-black/10 px-4 py-2 rounded-lg text-sm text-slate-600 flex items-center gap-2 font-medium">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                        System Online
                    </div>
                </div>
            </div>

            {/* Premium Metric Grid */}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6 mb-12">
                {/* Card 1: Revenue */}
                <div className="pulse-card">
                    <div className="flex justify-between items-center mb-5">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Revenue</span>
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md text-xs font-bold">+12.4%</span>
                    </div>
                    <div className="text-4xl font-bold tracking-tight text-slate-900 mb-2">
                        R {stats.totalRevenue.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-xs text-slate-400">vs. previous 30 days</div>
                </div>

                {/* Card 2: Orders */}
                <div className="pulse-card">
                    <div className="flex justify-between items-center mb-5">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Orders</span>
                        <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-md text-xs font-bold">Direct</span>
                    </div>
                    <div className="text-4xl font-bold tracking-tight text-slate-900 mb-2">
                        {stats.totalOrders}
                    </div>
                    <div className="text-xs text-slate-400">Processed successfully</div>
                </div>

                {/* Card 3: Pending Payments */}
                <div className="pulse-card">
                    <div className="flex justify-between items-center mb-5">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Payments</span>
                        <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-md text-xs font-bold">Attention Req.</span>
                    </div>
                    <div className="text-4xl font-bold tracking-tight text-amber-600 mb-2">
                        {stats.pendingPayments}
                    </div>
                    <div className="text-xs text-slate-400">Awaiting automatic matching</div>
                </div>

                {/* Card 4: Ready to Ship */}
                <div className="pulse-card">
                    <div className="flex justify-between items-center mb-5">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ready to Ship</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-bold">Priority</span>
                    </div>
                    <div className="text-4xl font-bold tracking-tight text-blue-600 mb-2">
                        {stats.readyToShip}
                    </div>
                    <div className="text-xs text-slate-400">Reconciliation verified</div>
                </div>
            </div>

            {/* Secondary Analytics Section */}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-8">
                {/* Advanced Statistics */}
                <div className="pulse-card !mb-0">
                    <h3 className="text-lg font-bold mb-6 text-slate-900 flex items-center gap-2">
                        <span className="text-indigo-600">📊</span> Analytical Performance
                    </h3>
                    <div className="flex flex-col gap-5">
                        <div>
                            <div className="flex justify-between text-sm mb-2 text-slate-500">
                                <span>Conversion Rate</span>
                                <span className="text-slate-900 font-semibold">{stats.conversionRate}%</span>
                            </div>
                            <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full" 
                                    style={{ width: `${stats.conversionRate * 10}%` }}
                                ></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-2 text-slate-500">
                                <span>Average Order Value</span>
                                <span className="text-slate-900 font-semibold">R {stats.averageOrderValue.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                <div className="w-3/4 h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-2 text-slate-500">
                                <span>Payment Matching Accuracy</span>
                                <span className="text-slate-900 font-semibold">98.2%</span>
                            </div>
                            <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                <div className="w-[98.2%] h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* System Activity */}
                <div className="pulse-card !mb-0">
                    <h3 className="text-lg font-bold mb-6 text-slate-900 flex items-center gap-2">
                        <span className="text-emerald-500">⚡</span> Real-time Pulse Log
                    </h3>
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between text-sm border-b border-slate-100 pb-3">
                            <span className="text-slate-800 font-medium">Capitec Webhook Received</span>
                            <span className="text-slate-400">Just now</span>
                        </div>
                        <div className="flex justify-between text-sm border-b border-slate-100 pb-3">
                            <span className="text-slate-800 font-medium">Automatic Reconciliation Match #1094</span>
                            <span className="text-slate-400">5m ago</span>
                        </div>
                        <div className="flex justify-between text-sm border-b border-slate-100 pb-3">
                            <span className="text-slate-800 font-medium">New Order Generated (R 1,250.00)</span>
                            <span className="text-slate-400">12m ago</span>
                        </div>
                        <div className="flex justify-between text-sm pt-1">
                            <span className="text-slate-800 font-medium">Database Index Health Check</span>
                            <span className="text-emerald-600 font-semibold">Optimal</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
