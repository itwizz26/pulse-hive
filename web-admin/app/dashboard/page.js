'use client';

import { useEffect, useState } from 'react';
import { apiCall } from '@/lib/api';

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

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

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: '#94a3b8', fontSize: '1rem', fontWeight: '500', letterSpacing: '0.05em' }}>
                <span style={{ marginRight: '0.75rem' }}>⚡</span> LOADING SYSTEM DIAGNOSTICS...
            </div>
        );
    }

    const premiumGradientBg = 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)';

    return (
        <div style={{ padding: '2.5rem', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#f8fafc', background: '#090d16', minHeight: '100vh' }}>
            {/* Header Area */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '1.5rem' }}>
                <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: '#818cf8', letterSpacing: '0.2em', marginBottom: '0.5rem' }}>Executive Overview</div>
                    <h1 style={{ fontSize: '2.25rem', fontWeight: '800', letterSpacing: '-0.025em', margin: 0, color: '#ffffff', background: 'linear-gradient(to right, #ffffff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Enterprise Dashboard
                    </h1>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.85rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
                        System Online
                    </div>
                </div>
            </div>

            {/* Premium Metric Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                {/* Card 1: Revenue */}
                <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '1.75rem', backdropFilter: 'blur(12px)', boxShadow: '0 4px 30px rgba(0, 0, 0, 0.2)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Revenue</span>
                        <span style={{ padding: '0.25rem 0.5rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600' }}>+12.4%</span>
                    </div>
                    <div style={{ fontSize: '2.25rem', fontWeight: '700', letterSpacing: '-0.03em', color: '#ffffff', marginBottom: '0.5rem' }}>
                        R {stats.totalRevenue.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>vs. previous 30 days</div>
                </div>

                {/* Card 2: Orders */}
                <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '1.75rem', backdropFilter: 'blur(12px)', boxShadow: '0 4px 30px rgba(0, 0, 0, 0.2)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Orders</span>
                        <span style={{ padding: '0.25rem 0.5rem', background: 'rgba(99, 102, 241, 0.1)', color: '#818cf8', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600' }}>Direct</span>
                    </div>
                    <div style={{ fontSize: '2.25rem', fontWeight: '700', letterSpacing: '-0.03em', color: '#ffffff', marginBottom: '0.5rem' }}>
                        {stats.totalOrders}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Processed successfully</div>
                </div>

                {/* Card 3: Pending Payments */}
                <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '1.75rem', backdropFilter: 'blur(12px)', boxShadow: '0 4px 30px rgba(0, 0, 0, 0.2)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pending Payments</span>
                        <span style={{ padding: '0.25rem 0.5rem', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600' }}>Attention Req.</span>
                    </div>
                    <div style={{ fontSize: '2.25rem', fontWeight: '700', letterSpacing: '-0.03em', color: '#f59e0b', marginBottom: '0.5rem' }}>
                        {stats.pendingPayments}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Awaiting automatic matching</div>
                </div>

                {/* Card 4: Ready to Ship */}
                <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '1.75rem', backdropFilter: 'blur(12px)', boxShadow: '0 4px 30px rgba(0, 0, 0, 0.2)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ready to Ship</span>
                        <span style={{ padding: '0.25rem 0.5rem', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600' }}>Priority</span>
                    </div>
                    <div style={{ fontSize: '2.25rem', fontWeight: '700', letterSpacing: '-0.03em', color: '#3b82f6', marginBottom: '0.5rem' }}>
                        {stats.readyToShip}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Reconciliation verified</div>
                </div>
            </div>

            {/* Secondary Analytics Section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
                {/* Advanced Statistics */}
                <div style={{ background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.8) 100%)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '2rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.5rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ color: '#818cf8' }}>📊</span> Analytical Performance
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem', color: '#94a3b8' }}>
                                <span>Conversion Rate</span>
                                <span style={{ color: '#ffffff', fontWeight: '600' }}>{stats.conversionRate}%</span>
                            </div>
                            <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                                <div style={{ width: `${stats.conversionRate * 10}%`, height: '100%', background: 'linear-gradient(to right, #6366f1, #818cf8)', borderRadius: '10px' }}></div>
                            </div>
                        </div>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem', color: '#94a3b8' }}>
                                <span>Average Order Value</span>
                                <span style={{ color: '#ffffff', fontWeight: '600' }}>R {stats.averageOrderValue}</span>
                            </div>
                            <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                                <div style={{ width: '75%', height: '100%', background: 'linear-gradient(to right, #10b981, #34d399)', borderRadius: '10px' }}></div>
                            </div>
                        </div>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem', color: '#94a3b8' }}>
                                <span>Payment Matching Accuracy</span>
                                <span style={{ color: '#ffffff', fontWeight: '600' }}>98.2%</span>
                            </div>
                            <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                                <div style={{ width: '98.2%', height: '100%', background: 'linear-gradient(to right, #3b82f6, #60a5fa)', borderRadius: '10px' }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* System Activity */}
                <div style={{ background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.8) 100%)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '2rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.5rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ color: '#10b981' }}>⚡</span> Real-time Pulse Log
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '0.75rem' }}>
                            <span style={{ color: '#f8fafc' }}>Capitec Webhook Received</span>
                            <span style={{ color: '#64748b' }}>Just now</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '0.75rem' }}>
                            <span style={{ color: '#f8fafc' }}>Automatic Reconciliation Match #1094</span>
                            <span style={{ color: '#64748b' }}>5m ago</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '0.75rem' }}>
                            <span style={{ color: '#f8fafc' }}>New Order Generated (R 1,250.00)</span>
                            <span style={{ color: '#64748b' }}>12m ago</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                            <span style={{ color: '#f8fafc' }}>Database Index Health Check</span>
                            <span style={{ color: '#10b981', fontWeight: '600' }}>Optimal</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
