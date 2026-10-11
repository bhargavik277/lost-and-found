import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { adminAPI } from '../../services/api'
import CountUp from '../../components/CountUp'
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
  const [fetchError, setFetchError] = useState(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminAPI.analytics()
        setData(res.data)
        setFetchError(null)
      } catch (err) {
        console.error('[AdminDashboard] Failed to load analytics:', err?.response?.status, err?.message)
        setFetchError(
          err?.response?.status === 401
            ? 'Session expired. Please log in again.'
            : 'Failed to load analytics data. The server may be unavailable.'
        )
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const kpis = data?.kpis || {}

  return (
    <>
<<<<<<< HEAD
    {fetchError && (
      <div className="flex items-center gap-3 px-4 py-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
        <AlertTriangle className="w-4 h-4 shrink-0" />
        <span>{fetchError}</span>
      </div>
    )}
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
        <div className="card reveal delay-1 p-5 border-slate-700/60 bg-navy-800 interactive-lift">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Items in DB</span>
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-white count-emphasis"><CountUp value={kpis.total_items || 0} /></span>
            <div className="text-[11px] text-slate-400 mt-1">
              {kpis.total_lost || 0} Lost • {kpis.total_found || 0} Found
            </div>
          </div>
        </div>

        <div className="card reveal delay-2 p-5 border-slate-700/60 bg-navy-800 interactive-lift">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Items Returned</span>
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 count-emphasis"><CountUp value={kpis.total_returned || 0} /></span>
            <div className="text-[11px] text-emerald-400/80 mt-1">
              {kpis.recovery_rate || 0}% recovery rate
            </div>
          </div>
        </div>

        <div className="card reveal delay-3 p-5 border-slate-700/60 bg-navy-800 interactive-lift">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Avg. Recovery Time</span>
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-purple-400 count-emphasis">
              {kpis.avg_days_to_recovery || 0} <span className="text-sm font-normal text-slate-400">days</span>
            </span>
            <div className="text-[11px] text-slate-400 mt-1">from reported to handover</div>
          </div>
        </div>

        <div className="card reveal delay-4 p-5 border-slate-700/60 bg-navy-800 interactive-lift">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Pending Claims</span>
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-amber-400 count-emphasis"><CountUp value={kpis.pending_claims || 0} /></span>
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
              <div key={i} className={`p-3.5 bg-slate-850 rounded-xl border border-slate-750 text-xs space-y-1 reveal delay-${(i % 5) + 1} transition-all duration-300 hover:border-indigo-500/30 hover:-translate-y-0.5`}>
                <div className="text-slate-400 font-medium">#{i + 1} {h.location}</div>
                <div className="text-base font-bold text-white">{h.count} lost reports</div>
                <div className="text-[11px] text-indigo-400">Top: {h.top_category}</div>
              </div>
            ))}
          </div>
=======
      {fetchError && (
        <div className="flex items-center gap-3 px-4 py-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{fetchError}</span>
>>>>>>> 13ba826 (feat: complete premium SaaS frontend redesign)
        </div>
      )}
      <div className="space-y-8 animate-fade-in pb-16">
        {/* Header Banner */}
        <div className="card bg-white border-slate-200/90 shadow-sm p-7 sm:p-9 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold mb-3 border border-purple-200">
              <Shield className="w-3.5 h-3.5 text-purple-600" /> Campus Administrator Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Administrative Control Center
            </h1>
            <p className="text-slate-600 text-sm mt-1 max-w-xl leading-relaxed">
              Monitor real-time campus reports, review pending ownership claims, and inspect dataset analytics.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/admin/claims"
              className="px-4.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 active:scale-95"
            >
              <FileText className="w-4 h-4" /> Review Claims ({kpis.pending_claims || 0})
            </Link>
            <Link
              to="/admin/analytics"
              className="px-4.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 active:scale-95"
            >
              <BarChart3 className="w-4 h-4" /> View Full Analytics
            </Link>
          </div>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="card p-5 border-slate-200/90 bg-white hover:border-indigo-200 shadow-xs transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Items in DB</span>
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{kpis.total_items || 0}</span>
              <div className="text-[11px] text-slate-500 mt-1 font-medium">
                {kpis.total_lost || 0} Lost • {kpis.total_found || 0} Found
              </div>
            </div>
          </div>

          <div className="card p-5 border-slate-200/90 bg-white hover:border-emerald-200 shadow-xs transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Items Returned</span>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600">{kpis.total_returned || 0}</span>
              <div className="text-[11px] text-emerald-700 mt-1 font-semibold">
                {kpis.recovery_rate || 0}% recovery rate
              </div>
            </div>
          </div>

          <div className="card p-5 border-slate-200/90 bg-white hover:border-purple-200 shadow-xs transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg. Recovery Time</span>
              <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-purple-600">
                {kpis.avg_days_to_recovery || 0} <span className="text-sm font-semibold text-slate-500">days</span>
              </span>
              <div className="text-[11px] text-slate-500 mt-1 font-medium">from reported to handover</div>
            </div>
          </div>

          <div className="card p-5 border-slate-200/90 bg-white hover:border-amber-200 shadow-xs transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Claims</span>
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-600">{kpis.pending_claims || 0}</span>
              <div className="text-[11px] text-slate-500 mt-1 font-medium">awaiting review</div>
            </div>
          </div>
        </div>

        {/* Quick Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/admin/claims" className="card-hover p-6 space-y-3 bg-white">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Review Claims</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Verify student ownership proofs, inspect serial numbers & descriptions, approve or reject claims.
            </p>
            <div className="text-xs font-bold text-indigo-600 flex items-center gap-1 pt-2">
              Open Claims Queue <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link to="/admin/items" className="card-hover p-6 space-y-3 bg-white">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Item Inventory</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              View all operational database records, update statuses (Active, Matched, Returned, Closed).
            </p>
            <div className="text-xs font-bold text-emerald-600 flex items-center gap-1 pt-2">
              Manage Items <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link to="/admin/analytics" className="card-hover p-6 space-y-3 bg-white">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Dataset & System Analytics</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Explore 9+ statistical charts: Categories, Locations, Hotspots, Search Methods, Recovery Distributions.
            </p>
            <div className="text-xs font-bold text-purple-600 flex items-center gap-1 pt-2">
              View Analytics Dashboard <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        </div>

        {/* Hotspots Quick Preview */}
        {data?.hotspots && (
          <div className="card bg-white border-slate-200/90 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-rose-600" />
                <h3 className="text-base font-bold text-slate-900">Top Lost Item Hotspots (Dataset)</h3>
              </div>
              <Link to="/admin/analytics" className="text-xs text-indigo-600 hover:text-indigo-700 font-bold">
                Full Analytics
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {data.hotspots.map((h, i) => (
                <div key={i} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="text-slate-500 font-semibold">#{i + 1} {h.location}</div>
                  <div className="text-base font-extrabold text-slate-900">{h.count} lost reports</div>
                  <div className="text-[11px] text-indigo-600 font-medium">Top: {h.top_category}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
