'use client';

import React from 'react';

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-white">Orders Data Ledger</h1>
        <p className="text-xs text-slate-400 mt-1">Operational stream tracking pipeline records.</p>
      </div>

      {/* Applied the clean CSS layer selectors directly */}
      <div className="ph-glass-panel overflow-hidden">
        <table className="ph-ledger-table">
          <thead>
            <tr>
              <th className="ph-ledger-th">Order ID</th>
              <th className="ph-ledger-th">Customer Client</th>
              <th className="ph-ledger-th">Amount Balance</th>
            </tr>
          </thead>
          <tbody>
            <tr className="ph-ledger-tr">
              <td className="ph-ledger-td font-mono font-bold text-indigo-400">#PH-INV-091</td>
              <td className="ph-ledger-td font-medium text-white">Cosmetics Vendor Dev</td>
              <td className="ph-ledger-td font-mono">R 4,250.00</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}