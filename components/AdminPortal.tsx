'use client';

import React, { useState } from 'react';
import { UserCheck, ShieldCheck, FolderTree, Terminal, Plus, Check, X } from 'lucide-react';
import { INITIAL_VENDORS, INITIAL_CATEGORIES, Vendor, Category } from '@/lib/supabase';

export const AdminPortal: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>(INITIAL_VENDORS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [logs, setLogs] = useState<string[]>([
    "[2026-07-26 21:30:12] [TRIGGER FIRED] inventory_stock_check: Stock for Product #PRD-108 reached 2 units. Notification sent to Vendor #VND-10.",
    "[2026-07-26 21:15:00] [TRIGGER FIRED] order_status_update: Order #ORD-9801 set to 'Shipped'. Tracking #SP-88392-US generated.",
    "[2026-07-26 20:45:22] [COMMIT] atomic_checkout_commit: Transaction #TXN-9022 committed successfully. Row locks released."
  ]);

  const handleVendorStatus = (vendorId: string, status: 'Approved' | 'Rejected') => {
    setVendors((prev) =>
      prev.map((v) => (v.id === vendorId ? { ...v, status } : v))
    );
    const newLog = `[${new Date().toISOString().replace('T', ' ').slice(0, 19)}] [TRIGGER FIRED] vendor_approval_update: Vendor #${vendorId} set to '${status}'.`;
    setLogs((prev) => [newLog, ...prev]);
  };

  const handleAddCategory = () => {
    const name = prompt("Enter new category name:");
    if (name && name.trim()) {
      const newCat: Category = {
        id: `cat-${categories.length + 1}`,
        name: name.trim(),
        parentId: null
      };
      setCategories((prev) => [...prev, newCat]);
      setLogs((prev) => [`[${new Date().toISOString().replace('T', ' ').slice(0, 19)}] [COMMIT] DDL EXECUTE: INSERT INTO categories ('${newCat.id}', '${name}');`, ...prev]);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="font-heading font-bold text-xl text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-purple-400" /> Platform Admin Management Portal
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Oversee vendor store approvals, category taxonomy, and real-time database trigger executions.
          </p>
        </div>
        <div className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          DB Query Latency: 38ms | Active Locks: 0
        </div>
      </div>

      {/* Vendor Approval Table */}
      <div className="glass-card overflow-hidden border border-white/10">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="font-heading font-bold text-sm text-slate-200">Vendor Store Approval Workflow</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#070d1a] text-slate-400 font-semibold uppercase border-b border-white/5">
              <tr>
                <th className="p-3">Store Name</th>
                <th className="p-3">Contact Email</th>
                <th className="p-3">License ID</th>
                <th className="p-3">Rating</th>
                <th className="p-3">Approval Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {vendors.map((v) => (
                <tr key={v.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-3 font-semibold text-slate-100">{v.storeName}</td>
                  <td className="p-3 text-slate-400">{v.email}</td>
                  <td className="p-3 font-mono text-purple-400">{v.licenseId}</td>
                  <td className="p-3 font-semibold text-amber-400">★ {v.rating}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        v.status === 'Approved'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : v.status === 'Rejected'
                          ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      {v.status}
                    </span>
                  </td>
                  <td className="p-3 space-x-1">
                    {v.status !== 'Approved' && (
                      <button
                        onClick={() => handleVendorStatus(v.id, 'Approved')}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white p-1 rounded transition-colors"
                        title="Approve Store"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {v.status !== 'Rejected' && (
                      <button
                        onClick={() => handleVendorStatus(v.id, 'Rejected')}
                        className="bg-rose-600 hover:bg-rose-500 text-white p-1 rounded transition-colors"
                        title="Reject Store"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grid: Category Manager & Real-Time Trigger Logs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Category Hierarchy Manager */}
        <div className="glass-card p-4 space-y-3 border border-white/10">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <h3 className="font-heading font-bold text-sm text-slate-200 flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-blue-400" /> Category Taxonomy Tree
            </h3>
            <button
              onClick={handleAddCategory}
              className="bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 text-xs px-2.5 py-1 rounded border border-blue-500/30 flex items-center gap-1 font-semibold"
            >
              <Plus className="w-3 h-3" /> Add Category
            </button>
          </div>

          <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
            {categories.filter((c) => c.parentId === null).map((p) => {
              const subs = categories.filter((c) => c.parentId === p.id);
              return (
                <div key={p.id} className="bg-[#070d1a] border border-white/5 rounded-xl p-2 text-xs">
                  <div className="font-semibold text-slate-200 flex items-center justify-between">
                    <span>📂 {p.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">ID: {p.id}</span>
                  </div>
                  {subs.length > 0 && (
                    <div className="ml-4 mt-1 pl-2 border-l border-slate-700 space-y-1">
                      {subs.map((s) => (
                        <div key={s.id} className="text-slate-400 hover:text-slate-200">
                          🏷️ {s.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Database Trigger Log Box */}
        <div className="glass-card p-4 space-y-3 border border-white/10">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <h3 className="font-heading font-bold text-sm text-slate-200 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" /> DB Trigger Execution Log
            </h3>
            <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded">
              REAL-TIME
            </span>
          </div>

          <div className="bg-[#04070d] border border-blue-900/40 rounded-xl p-3 font-mono text-[11px] text-emerald-300 h-64 overflow-y-auto space-y-2">
            {logs.map((log, idx) => (
              <div key={idx} className="border-b border-white/5 pb-1 leading-snug">
                {log}
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
