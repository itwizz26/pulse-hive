'use client';

import { useEffect, useState } from 'react';
import { apiCall } from '@/lib/api';

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

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
                  <td>R {payment.amount}</td>
                  <td>{payment.matched ? 'Matched' : 'Unmatched'}</td>
                  <td>{new Date(payment.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
