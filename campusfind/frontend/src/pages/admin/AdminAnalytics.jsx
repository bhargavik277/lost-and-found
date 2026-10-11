import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { adminAPI } from '../../services/api'
import { 
  BarChart3, 
  PieChart as PieIcon, 
  MapPin, 
  Clock, 
  TrendingUp, 
  ArrowLeft, 
  Layers, 
  AlertCircle, 
  Sparkles,
  HelpCircle,
  Search,
  CheckCircle2
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#3b82f6', '#14b8a6']

export default function AdminAnalytics() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await adminAPI.analytics()
        setData(res.data)
      } catch (err) {
        setError('Failed to fetch analytics from backend API.')
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="card p-8 text-center text-rose-300">
        <AlertCircle className="w-8 h-8 mx-auto mb-2 text-rose-400" />
        <p>{error || 'No analytics data available.'}</p>
      </div>
    )
  }

  const { kpis, by_category, by_location, by_status, hotspots, search_methods, difficulties, preferred_features, system_usefulness, recovery_distribution } = data

  const typeData = [
    { name: 'Lost Items', value: kpis.total_lost, color: '#f43f5e' },
    { name: 'Found Items', value: kpis.total_found, color: '#10b981' },
    { name: 'Returned to Owner', value: kpis.total_returned, color: '#6366f1' },
  ]

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <Link to="/admin" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Admin Overview
      </Link>

      {/* Analytics Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2 border border-emerald-500/30">
            <BarChart3 className="w-3.5 h-3.5" /> Phase 10 Dataset-Driven Analytics
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Campus Lost & Found Intelligence
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time aggregate data synthesized from campus operations and survey research
          </p>
        </div>
      </div>

      {/* KPI Highlight Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card p-5 bg-navy-800 border-slate-700">
          <span className="text-xs font-semibold text-slate-400">Total Reports</span>
          <div className="text-2xl sm:text-3xl font-black text-white mt-2">{kpis.total_items}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">{kpis.total_lost} Lost • {kpis.total_found} Found</span>
        </div>

        <div className="card p-5 bg-navy-800 border-slate-700">
          <span className="text-xs font-semibold text-slate-400">Recovery Rate</span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-2">{kpis.recovery_rate}%</div>
          <span className="text-[11px] text-emerald-400/80 mt-1 block">{kpis.total_returned} items returned</span>
        </div>

        <div className="card p-5 bg-navy-800 border-slate-700">
          <span className="text-xs font-semibold text-slate-400">Avg. Days to Recovery</span>
          <div className="text-2xl sm:text-3xl font-black text-purple-400 mt-2">
            {kpis.avg_days_to_recovery} <span className="text-sm font-normal text-slate-400">days</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">for recovered property</span>
        </div>

        <div className="card p-5 bg-navy-800 border-slate-700">
          <span className="text-xs font-semibold text-slate-400">Pending Actions</span>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 mt-2">{kpis.pending_claims}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">claims under review</span>
        </div>
      </div>

      {/* Row 1: Items by Category & Items by Location */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Items by Category */}
        <div className="card p-6 border-slate-700 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" /> 1. Items by Category
            </h3>
            <span className="text-xs text-slate-400">{by_category.length} Categories</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={by_category} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="category" stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} angle={-25} textAnchor="end" />
                <YAxis stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', borderRadius: '12px', fontSize: '12px' }}
                  itemStyle={{ color: '#818cf8' }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Items by Location */}
        <div className="card p-6 border-slate-700 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" /> 2. Items by Location
            </h3>
            <span className="text-xs text-slate-400">{by_location.length} Campus Zones</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={by_location} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="location" stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} angle={-25} textAnchor="end" />
                <YAxis stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', borderRadius: '12px', fontSize: '12px' }}
                  itemStyle={{ color: '#34d399' }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Lost vs Found vs Returned & Recovery Time Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 3. Lost vs Found vs Returned */}
        <div className="card p-6 border-slate-700 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-purple-400" /> 3. Lost vs Found vs Returned Breakdown
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', borderRadius: '12px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4 & 5. Days to Recovery Distribution */}
        <div className="card p-6 border-slate-700 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" /> 4 & 5. Days to Recovery Distribution
            </h3>
            <span className="text-xs text-amber-400 font-bold">Avg: {kpis.avg_days_to_recovery} Days</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={recovery_distribution} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                <XAxis dataKey="range" stroke="#64748b" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', borderRadius: '12px', fontSize: '12px' }}
                  itemStyle={{ color: '#fbbf24' }}
                />
                <Bar dataKey="count" fill="#f59e0b" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: 9. Lost Item Hotspots */}
      <div className="card p-6 border-slate-700 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <MapPin className="w-4 h-4 text-rose-400" /> 9. Lost Item Campus Hotspots
        </h3>
        <p className="text-xs text-slate-400">
          Locations with the highest frequency of lost item reports and the most commonly misplaced items.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-2">
          {hotspots.map((spot, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-850 border border-slate-750 space-y-2 relative overflow-hidden">
              <div className="w-2 h-full bg-rose-500 absolute left-0 top-0"></div>
              <div className="pl-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Rank #{idx + 1}</span>
                <h4 className="text-sm font-bold text-white truncate">{spot.location}</h4>
                <div className="mt-2 text-xl font-black text-rose-400">{spot.count} <span className="text-xs font-medium text-slate-400">lost items</span></div>
                <div className="text-[11px] text-indigo-300 mt-1">Common: {spot.top_category}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 4: Survey Insights (6. Search Methods, 7. Main Difficulties, 8. Preferred Features) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 6. Search Methods Used */}
        <div className="card p-6 border-slate-700 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Search className="w-4 h-4 text-indigo-400" /> 6. Search Methods Used
          </h3>
          <div className="space-y-3">
            {search_methods.map((item, idx) => (
              <div key={idx} className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span className="truncate max-w-[200px]">{item.method}</span>
                  <span className="font-bold text-white">{item.count}</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-500 h-full rounded-full"
                    style={{ width: `${(item.count / kpis.total_lost) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 7. Main Difficulties Experienced */}
        <div className="card p-6 border-slate-700 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400" /> 7. Main Difficulties
          </h3>
          <div className="space-y-3">
            {difficulties.map((item, idx) => (
              <div key={idx} className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span className="truncate max-w-[200px]">{item.difficulty}</span>
                  <span className="font-bold text-white">{item.count}</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-rose-500 h-full rounded-full"
                    style={{ width: `${(item.count / kpis.total_lost) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 8. Preferred Features */}
        <div className="card p-6 border-slate-700 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" /> 8. Preferred Features
          </h3>
          <div className="space-y-3">
            {preferred_features.map((item, idx) => (
              <div key={idx} className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span className="truncate max-w-[200px]">{item.feature}</span>
                  <span className="font-bold text-white">{item.count}</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full"
                    style={{ width: `${(item.count / kpis.total_lost) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
