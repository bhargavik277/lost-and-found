import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { adminAPI } from '../../services/api'
import { 
  Shield, 
  BarChart3, 
  Layers, 
  FileText, 
  Users, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  MapPin
} from 'lucide-react'

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminAPI.analytics()
        setData(res.data)
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const kpis = data?.kpis || {}

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Header Banner */}
      <div className="card bg-gradient-to-r from-navy-800 via-indigo-950/40 to-navy-800 border-slate-700 p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold mb-3 border border-purple-500/30">
            <Shield className="w-3.5 h-3.5" /> Campus Administrator Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Administrative Control Center
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-xl">
            Monitor real-time campus reports, review pending ownership claims, and inspect dataset analytics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/admin/claims"
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4" /> Review Claims ({kpis.pending_claims || 0})
          </Link>
          <Link
            to="/admin/analytics"
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-1.5"
          >
            <BarChart3 className="w-4 h-4" /> View Full Analytics
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="card p-5 border-slate-700/60 bg-navy-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Items in DB</span>
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-white">{kpis.total_items || 0}</span>
            <div className="text-[11px] text-slate-400 mt-1">
              {kpis.total_lost || 0} Lost • {kpis.total_found || 0} Found
            </div>
          </div>
        </div>

        <div className="card p-5 border-slate-700/60 bg-navy-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Items Returned</span>
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-emerald-400">{kpis.total_returned || 0}</span>
            <div className="text-[11px] text-emerald-400/80 mt-1">
              {kpis.recovery_rate || 0}% recovery rate
            </div>
          </div>
        </div>

        <div className="card p-5 border-slate-700/60 bg-navy-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Avg. Recovery Time</span>
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-purple-400">
              {kpis.avg_days_to_recovery || 0} <span className="text-sm font-normal text-slate-400">days</span>
            </span>
            <div className="text-[11px] text-slate-400 mt-1">from reported to handover</div>
          </div>
        </div>

        <div className="card p-5 border-slate-700/60 bg-navy-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Pending Claims</span>
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-amber-400">{kpis.pending_claims || 0}</span>
            <div className="text-[11px] text-slate-400 mt-1">awaiting review</div>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/admin/claims" className="card-hover p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Review Claims</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Verify student ownership proofs, inspect serial numbers & descriptions, approve or reject claims.
          </p>
          <div className="text-xs font-semibold text-indigo-400 flex items-center gap-1 pt-2">
            Open Claims Queue <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        <Link to="/admin/items" className="card-hover p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Item Inventory</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            View all 150+ operational database records, update statuses (Active, Matched, Returned, Closed).
          </p>
          <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1 pt-2">
            Manage Items <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        <Link to="/admin/analytics" className="card-hover p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
            <BarChart3 className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Dataset & System Analytics</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Explore 9+ statistical charts: Categories, Locations, Hotspots, Search Methods, Recovery Distributions.
          </p>
          <div className="text-xs font-semibold text-purple-400 flex items-center gap-1 pt-2">
            View Analytics Dashboard <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>
      </div>

      {/* Hotspots Quick Preview */}
      {data?.hotspots && (
        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-rose-400" />
              <h3 className="text-base font-bold text-white">Top Lost Item Hotspots (Dataset)</h3>
            </div>
            <Link to="/admin/analytics" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold">
              Full Analytics
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {data.hotspots.map((h, i) => (
              <div key={i} className="p-3.5 bg-slate-850 rounded-xl border border-slate-750 text-xs space-y-1">
                <div className="text-slate-400 font-medium">#{i + 1} {h.location}</div>
                <div className="text-base font-bold text-white">{h.count} lost reports</div>
                <div className="text-[11px] text-indigo-400">Top: {h.top_category}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
