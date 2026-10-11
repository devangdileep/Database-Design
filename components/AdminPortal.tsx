'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, FolderTree, Terminal, Plus, Check, X, Loader2, RefreshCw, Zap } from 'lucide-react';
import {
  Vendor,
  Category,
  fetchVendors,
  fetchCategories,
  updateVendorStatus,
  insertCategory,
  invalidateLocalCache,
} from '@/lib/supabase';

export const AdminPortal: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dbLatency, setDbLatency] = useState<number | null>(null);
  const [isCacheHit, setIsCacheHit] = useState(false);

  // New category inline input state
  const [newCatName, setNewCatName] = useState('');
  const [newCatParentId, setNewCatParentId] = useState<string>('');
  const [showAddCat, setShowAddCat] = useState(false);
  const [isAddingCat, setIsAddingCat] = useState(false);

  const loadData = async (forceRefresh = false) => {
    if (forceRefresh) {
      setIsRefreshing(true);
      invalidateLocalCache('vendors');
      invalidateLocalCache('categories');
    } else {
      setIsLoading(true);
    }

    const start = performance.now();
    const [vends, cats] = await Promise.all([
      fetchVendors(forceRefresh),
      fetchCategories(forceRefresh),
    ]);
    const duration = Math.round(performance.now() - start);
    setDbLatency(duration);

    const hit = !forceRefresh && duration < 30;
    setIsCacheHit(hit);

    setVendors(vends);
    setCategories(cats);
    setIsLoading(false);
    setIsRefreshing(false);

    const sourceTag = hit ? '[LOCAL CACHE]' : '[SUPABASE NETWORK]';
    setLogs((prev) => [
      `[${new Date().toLocaleTimeString()}] ${sourceTag} Loaded ${vends.length} vendors and ${cats.length} categories in ${duration}ms.`,
      ...prev,
    ]);
  };

  useEffect(() => {
    loadData(false);
  }, []);

  const handleVendorStatus = async (vendorId: string, status: 'Approved' | 'Rejected') => {
    const success = await updateVendorStatus(vendorId, status);
    if (success) {
      setVendors((prev) =>
        prev.map((v) => (v.vendor_id === vendorId ? { ...v, approval_status: status } : v))
      );
      const newLog = `[${new Date().toLocaleTimeString()}] [UPDATE] vendors SET approval_status = '${status}' WHERE vendor_id = '${vendorId}'.`;
      setLogs((prev) => [newLog, ...prev]);
    }
  };

  const handleAddCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    setIsAddingCat(true);
    const parentId = newCatParentId ? newCatParentId : null;
    const created = await insertCategory(newCatName.trim(), parentId);

    if (created) {
      setCategories((prev) => [...prev, created]);
      setLogs((prev) => [
        `[${new Date().toLocaleTimeString()}] [INSERT] categories ('${created.category_id}', '${created.category_name}', ${parentId ? `'${parentId}'` : 'NULL'}).`,
        ...prev,
      ]);
      setNewCatName('');
      setNewCatParentId('');
      setShowAddCat(false);
    }
    setIsAddingCat(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
        <span className="ml-3 text-slate-400 text-sm">Loading admin portal...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="font-heading font-bold text-xl text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-purple-400" /> Platform Admin Management Portal
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Oversee vendor store approvals, category taxonomy, and real-time database transactions with local caching.
          </p>
        </div>

        {/* Latency & Cache Status Indicators */}
        <div className="flex items-center gap-2 flex-wrap">
          <div
            className={`border text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-2 transition-all ${
              isCacheHit
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
            }`}
          >
            {isCacheHit ? (
              <Zap className="w-3.5 h-3.5 text-emerald-400 fill-current" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            )}
            <span>
              {isCacheHit ? `Local Cache: ${dbLatency}ms` : `DB Latency: ${dbLatency ?? 0}ms`}
            </span>
            <span className="text-slate-500 text-[10px]">|</span>
            <span className="text-[11px] text-slate-300">
              {isCacheHit ? 'Instant ⚡' : 'Network 🌐'}
            </span>
          </div>

          <button
            onClick={() => loadData(true)}
            disabled={isRefreshing}
            className="bg-slate-900 border border-white/10 hover:border-blue-500 text-slate-300 hover:text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all"
            title="Bypass local cache and re-sync from Supabase"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-400' : ''}`} />
            <span>{isRefreshing ? 'Syncing...' : 'Sync DB'}</span>
          </button>
        </div>
      </div>

      {/* Vendor Approval Table */}
      <div className="glass-card overflow-hidden border border-white/10">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="font-heading font-bold text-sm text-slate-200">Vendor Store Approval Workflow</h3>
          <span className="text-xs text-slate-400">{vendors.length} Total Registered Vendors</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#070d1a] text-slate-400 font-semibold uppercase border-b border-white/5">
              <tr>
                <th className="p-3">Vendor Name</th>
                <th className="p-3">Contact Email</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Approval Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {vendors.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-slate-500">No vendors found in database</td>
                </tr>
              ) : (
                vendors.map((v) => (
                  <tr key={v.vendor_id} className="hover:bg-white/5 transition-colors">
                    <td className="p-3 font-semibold text-slate-100">{v.vendor_name}</td>
                    <td className="p-3 text-slate-400">{v.email}</td>
                    <td className="p-3 font-mono text-slate-300">{v.phone || 'N/A'}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          v.approval_status === 'Approved'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : v.approval_status === 'Rejected'
                            ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                        }`}
                      >
                        {v.approval_status}
                      </span>
                    </td>
                    <td className="p-3 space-x-1">
                      {v.approval_status !== 'Approved' && (
                        <button
                          onClick={() => handleVendorStatus(v.vendor_id, 'Approved')}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white p-1 rounded transition-colors"
                          title="Approve Store"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {v.approval_status !== 'Rejected' && (
                        <button
                          onClick={() => handleVendorStatus(v.vendor_id, 'Rejected')}
                          className="bg-rose-600 hover:bg-rose-500 text-white p-1 rounded transition-colors"
                          title="Reject Store"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
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
              onClick={() => setShowAddCat(!showAddCat)}
              className="bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 text-xs px-2.5 py-1 rounded border border-blue-500/30 flex items-center gap-1 font-semibold"
            >
              <Plus className="w-3 h-3" /> Add Category
            </button>
          </div>

          {/* Add Category Inline Form */}
          {showAddCat && (
            <form onSubmit={handleAddCategorySubmit} className="bg-[#0b1220] p-3 rounded-xl border border-white/10 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="Category Name"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white"
                />
                <select
                  value={newCatParentId}
                  onChange={(e) => setNewCatParentId(e.target.value)}
                  className="bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white"
                >
                  <option value="">No Parent (Top Level)</option>
                  {categories
                    .filter((c) => c.parent_category_id === null)
                    .map((c) => (
                      <option key={c.category_id} value={c.category_id}>
                        {c.category_name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddCat(false)}
                  className="px-2 py-0.5 rounded text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAddingCat}
                  className="gradient-btn px-3 py-1 rounded text-xs font-semibold flex items-center gap-1"
                >
                  {isAddingCat && <Loader2 className="w-3 h-3 animate-spin" />}
                  Save
                </button>
              </div>
            </form>
          )}

          <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
            {categories.filter((c) => c.parent_category_id === null).map((p) => {
              const subs = categories.filter((c) => c.parent_category_id === p.category_id);
              return (
                <div key={p.category_id} className="bg-[#070d1a] border border-white/5 rounded-xl p-2 text-xs">
                  <div className="font-semibold text-slate-200 flex items-center justify-between">
                    <span>📂 {p.category_name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">ID: {p.category_id.slice(0, 8)}...</span>
                  </div>
                  {subs.length > 0 && (
                    <div className="ml-4 mt-1 pl-2 border-l border-slate-700 space-y-1">
                      {subs.map((s) => (
                        <div key={s.category_id} className="text-slate-400 hover:text-slate-200 flex justify-between">
                          <span>🏷️ {s.category_name}</span>
                          <span className="text-[9px] text-slate-600 font-mono">{s.category_id.slice(0, 8)}...</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Database Transaction / Audit Log Box */}
        <div className="glass-card p-4 space-y-3 border border-white/10">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <h3 className="font-heading font-bold text-sm text-slate-200 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" /> DB Transaction & Audit Log
            </h3>
            <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded">
              REAL-TIME
            </span>
          </div>

          <div className="bg-[#04070d] border border-blue-900/40 rounded-xl p-3 font-mono text-[11px] text-emerald-300 h-64 overflow-y-auto space-y-2">
            {logs.length === 0 ? (
              <div className="text-slate-500 italic">No events recorded yet. Perform actions to see queries.</div>
            ) : (
              logs.map((log, idx) => (
                <div key={idx} className="border-b border-white/5 pb-1 leading-snug">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
