'use client';

import React, { useEffect, useState } from 'react';

interface DashboardStats {
    totalOrders: number;
    totalRevenue: number;
    pendingPayments: number;
    readyToShip: number;
    conversionRate: number;
    averageOrderValue: number;
}

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
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

    if (loading || !stats) {
        return (
            <div className="flex justify-center items-center h-[60vh] text-slate-500 text-xs font-mono tracking-widest animate-pulse">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping mr-3"></span>
                OPENING YOUR OVERVIEW...
            </div>
        );
    }

    return (
        <div className="space-y-10">
            
            {/* Professional Header Block */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-6">
                <div>
                    <div className="text-[11px] font-bold uppercase text-indigo-400 tracking-widest mb-1.5">
                        Operational Status Summary
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-white">
                        Business Overview
                    </h1>
                </div>
                <div className="flex items-center">
                    <div className="bg-white/[0.02] border border-white/[0.08] px-4 py-2 rounded-xl text-xs text-slate-300 flex items-center gap-2.5 font-sans font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        Live updates active
                    </div>
                </div>
            </div>

            {/* Main Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Total Sales */}
                <div className="ph-glass-panel p-6">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Sales Made</span>
                        <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-md text-[10px] font-bold">+12.4% this month</span>
                    </div>
                    <div className="text-3xl font-black tracking-tight text-white mb-2 font-mono">
                        R {stats.totalRevenue.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">Gross revenue recorded</div>
                </div>

                {/* Total Orders */}
                <div className="ph-glass-panel p-6">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Orders Booked</span>
                        <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-md text-[10px] font-bold">All Channels</span>
                    </div>
                    <div className="text-3xl font-black tracking-tight text-white mb-2 font-mono">
                        {stats.totalOrders}
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">Total customer checkout requests</div>
                </div>

                {/* Orders Awaiting Payment */}
                <div className="ph-glass-panel p-6">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Awaiting Payment</span>
                        <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-md text-[10px] font-bold">Needs Verification</span>
                    </div>
                    <div className="text-3xl font-black tracking-tight text-amber-400 mb-2 font-mono">
                        {stats.pendingPayments}
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">Orders missing bank deposit links</div>
                </div>

                {/* Ready to Ship */}
                <div className="ph-glass-panel p-6">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Ready to Pack & Ship</span>
                        <span className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-md text-[10px] font-bold">Confirmed Paid</span>
                    </div>
                    <div className="text-3xl font-black tracking-tight text-blue-400 mb-2 font-mono">
                        {stats.readyToShip}
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">Payments completely cleared</div>
                </div>
            </div>

            {/* Split Progress & Activity Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Professional Performance Metrics Card */}
                <div className="ph-glass-panel p-6">
                    <h3 className="text-md font-bold mb-6 text-white flex items-center gap-2">
                        <span className="text-indigo-400">📊</span> Performance Metrics
                    </h3>
                    <div className="flex flex-col gap-6">
                        <div>
                            <div className="flex justify-between text-xs font-semibold mb-2 text-slate-400">
                                <span>Sales Conversion Rate</span>
                                <span className="text-white font-mono">{stats.conversionRate}%</span>
                            </div>
                            <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden border border-white/[0.04]">
                                <div 
                                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" 
                                    style={{ width: `${stats.conversionRate * 10}%` }}
                                ></div>
                            </div>
                        </div>
                        
                        <div>
                            <div className="flex justify-between text-xs font-semibold mb-2 text-slate-400">
                                <span>Average Order Value</span>
                                <span className="text-white font-mono">R {stats.averageOrderValue.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden border border-white/[0.04]">
                                <div className="w-3/4 h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
                            </div>
                        </div>
                        
                        <div>
                            <div className="flex justify-between text-xs font-semibold mb-2 text-slate-400">
                                <span>Payment Auto-Matching Success</span>
                                <span className="text-emerald-400 font-mono font-bold">98.2%</span>
                            </div>
                            <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden border border-white/[0.04]">
                                <div className="w-[98.2%] h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Friendly Activity Timeline Stream */}
                <div className="ph-glass-panel p-6">
                    <h3 className="text-md font-bold mb-6 text-white flex items-center gap-2">
                        <span className="text-emerald-400">✨</span> Real-time Store Activity
                    </h3>
                    <div className="flex flex-col gap-1.5 text-xs">
                        <div className="flex justify-between items-center py-2.5 border-b border-white/[0.04] text-slate-300">
                            <span className="font-sans truncate max-w-[70%]">📬 New payment notification received via bank integration</span>
                            <span className="text-slate-500 text-[10px] font-mono">Just now</span>
                        </div>
                        <div className="flex justify-between items-center py-2.5 border-b border-white/[0.04] text-slate-300">
                            <span className="font-sans truncate max-w-[70%]">🤖 System auto-matched reference label to unpaid order #1094</span>
                            <span className="text-slate-500 text-[10px] font-mono">5m ago</span>
                        </div>
                        <div className="flex justify-between items-center py-2.5 border-b border-white/[0.04] text-slate-300">
                            <span className="font-sans truncate max-w-[70%]">🛍️ New order entry created manually (R 1,250.00)</span>
                            <span className="text-slate-500 text-[10px] font-mono">12m ago</span>
                        </div>
                        <div className="flex justify-between items-center py-2.5 pt-3.5 text-slate-400">
                            <span className="font-sans font-medium text-slate-300">🔌 Bank feed synchronization</span>
                            <span className="text-emerald-400 font-bold uppercase text-[10px] font-mono tracking-wide bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                                Connected & Active
                            </span>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    );
}