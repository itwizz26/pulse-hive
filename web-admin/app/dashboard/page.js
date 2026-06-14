'use client';

import { useEffect, useState } from 'react';
import { apiCall } from '@/lib/api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: fetch dashboard stats from API
    setStats({
      totalOrders: 0,
      totalRevenue: 0,
      pendingPayments: 0,
      readyToShip: 0,
    });
    setLoading(false);
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginTop: '2rem' }}>
        <div className="card">
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Orders</div>
          <div style={{ fontSize: '1.875rem', fontWeight: 'bold', marginTop: '0.5rem' }}>{stats.totalOrders}</div>
        </div>
        <div className="card">
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Revenue</div>
          <div style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#059669', marginTop: '0.5rem' }}>R {stats.totalRevenue}</div>
        </div>
        <div className="card">
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Pending Payments</div>
          <div style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#d97706', marginTop: '0.5rem' }}>{stats.pendingPayments}</div>
        </div>
        <div className="card">
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Ready to Ship</div>
          <div style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#2563eb', marginTop: '0.5rem' }}>{stats.readyToShip}</div>
        </div>
      </div>
    </div>
  );
}
