import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { adminAPI } from '../../services/api'
import CountUp from '../../components/CountUp'
import { useScrollReveal } from '../../hooks/useScrollReveal'
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
  Search
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
  Cell
} from 'recharts'

export default function AdminAnalytics() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useScrollReveal([data, loading])

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
        <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="card p-8 text-center text-rose-700 bg-rose-50 border-rose-200">
        <AlertCircle className="w-8 h-8 mx-auto mb-2 text-rose-600" />
        <p>{error || 'No analytics data available.'}</p>
      </div>
    )
  }

  const { kpis, by_category, by_location, hotspots, search_methods, difficulties, preferred_features, recovery_distribution } = data

  const typeData = [
    { name: 'Lost Items', value: kpis.total_lost, color: '#f43f5e' },
    { name: 'Found Items', value: kpis.total_found, color: '#10b981' },
    { name: 'Returned to Owner', value: kpis.total_returned, color: '#4f46e5' },
  ]

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <Link to="/admin" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition-colors font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to Admin Overview
      </Link>

      {/* Analytics Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-2 border border-emerald-200">
            <BarChart3 className="w-3.5 h-3.5" /> Phase 10 Dataset-Driven Analytics
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Campus Lost & Found Intelligence
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Real-time aggregate data synthesized from campus operations and survey research
          </p>
        </div>
      </div>

      {/* KPI Highlight Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card reveal delay-1 p-5 bg-white border-slate-200/90 shadow-sm interactive-lift">
          <span className="text-xs font-semibold text-slate-500">Total Reports</span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 count-emphasis">
            <CountUp end={kpis.total_items} />
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">{kpis.total_lost} Lost • {kpis.total_found} Found</span>
        </div>

        <div className="card reveal delay-2 p-5 bg-white border-slate-200/90 shadow-sm interactive-lift">
          <span className="text-xs font-semibold text-slate-500">Recovery Rate</span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 mt-2 count-emphasis">
            <CountUp end={kpis.recovery_rate} suffix="%" />
          </div>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 block">{kpis.total_returned} items returned</span>
        </div>

        <div className="card reveal delay-3 p-5 bg-white border-slate-200/90 shadow-sm interactive-lift">
          <span className="text-xs font-semibold text-slate-500">Avg. Days to Recovery</span>
          <div className="text-2xl sm:text-3xl font-black text-purple-600 mt-2 count-emphasis">
            <CountUp end={kpis.avg_days_to_recovery} decimals={1} /> <span className="text-sm font-normal text-slate-500">days</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">for recovered property</span>
        </div>

        <div className="card reveal delay-4 p-5 bg-white border-slate-200/90 shadow-sm interactive-lift">
          <span className="text-xs font-semibold text-slate-500">Pending Actions</span>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 mt-2 count-emphasis">
            <CountUp end={kpis.pending_claims} />
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">claims under review</span>
        </div>
      </div>

      {/* Row 1: Items by Category & Items by Location */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Items by Category */}
        <div className="card reveal delay-1 p-6 border-slate-200/90 bg-white shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-600" /> 1. Items by Category
            </h3>
            <span className="text-xs text-slate-500">{by_category?.length || 0} Categories</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={by_category || []} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="category" stroke="#94a3b8" tick={{ fontSize: 11, fill: '#64748b' }} angle={-25} textAnchor="end" />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#4f46e5' }}
                />
                <Bar dataKey="count" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Items by Location */}
        <div className="card reveal delay-2 p-6 border-slate-200/90 bg-white shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" /> 2. Items by Location
            </h3>
            <span className="text-xs text-slate-500">{by_location?.length || 0} Campus Zones</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={by_location || []} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="location" stroke="#94a3b8" tick={{ fontSize: 11, fill: '#64748b' }} angle={-25} textAnchor="end" />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#059669' }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Lost vs Found vs Returned & Recovery Time Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 3. Lost vs Found vs Returned */}
        <div className="card reveal delay-1 p-6 border-slate-200/90 bg-white shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-purple-600" /> 3. Lost vs Found vs Returned Breakdown
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
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4 & 5. Days to Recovery Distribution */}
        <div className="card reveal delay-2 p-6 border-slate-200/90 bg-white shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" /> 4 & 5. Days to Recovery Distribution
            </h3>
            <span className="text-xs text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Avg: {kpis.avg_days_to_recovery} Days
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={recovery_distribution || []} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                <XAxis dataKey="range" stroke="#94a3b8" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#d97706' }}
                />
                <Bar dataKey="count" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: 9. Lost Item Hotspots */}
      <div className="card reveal p-6 border-slate-200/90 bg-white shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-rose-600" /> 9. Lost Item Campus Hotspots
        </h3>
        <p className="text-xs text-slate-600">
          Locations with the highest frequency of lost item reports and the most commonly misplaced items.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-2">
          {hotspots?.map((spot, idx) => (
            <div key={idx} className={`p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 relative overflow-hidden reveal delay-${(idx % 5) + 1} transition-all duration-300 hover:-translate-y-1 hover:border-rose-300`}>
              <div className="w-1.5 h-full bg-rose-500 absolute left-0 top-0"></div>
              <div className="pl-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Rank #{idx + 1}</span>
                <h4 className="text-sm font-bold text-slate-900 truncate">{spot.location}</h4>
                <div className="mt-2 text-xl font-black text-rose-600">{spot.count} <span className="text-xs font-medium text-slate-500">lost items</span></div>
                <div className="text-[11px] text-brand-700 mt-1 font-medium">Common: {spot.top_category}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 4: Survey Insights (6. Search Methods, 7. Main Difficulties, 8. Preferred Features) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 6. Search Methods Used */}
        <div className="card reveal delay-1 p-6 border-slate-200/90 bg-white shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Search className="w-4 h-4 text-brand-600" /> 6. Search Methods Used
          </h3>
          <div className="space-y-3">
            {search_methods?.map((item, idx) => (
              <div key={idx} className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span className="truncate max-w-[200px]">{item.method}</span>
                  <span className="font-bold text-slate-900">{item.count}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-brand-600 h-full rounded-full bar-grow"
                    style={{ width: `${(item.count / (kpis.total_lost || 1)) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 7. Main Difficulties Experienced */}
        <div className="card reveal delay-2 p-6 border-slate-200/90 bg-white shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600" /> 7. Main Difficulties
          </h3>
          <div className="space-y-3">
            {difficulties?.map((item, idx) => (
              <div key={idx} className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span className="truncate max-w-[200px]">{item.difficulty}</span>
                  <span className="font-bold text-slate-900">{item.count}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-rose-500 h-full rounded-full bar-grow"
                    style={{ width: `${(item.count / (kpis.total_lost || 1)) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 8. Preferred Features */}
        <div className="card reveal delay-3 p-6 border-slate-200/90 bg-white shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" /> 8. Preferred Features
          </h3>
          <div className="space-y-3">
            {preferred_features?.map((item, idx) => (
              <div key={idx} className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span className="truncate max-w-[200px]">{item.feature}</span>
                  <span className="font-bold text-slate-900">{item.count}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full bar-grow"
                    style={{ width: `${(item.count / (kpis.total_lost || 1)) * 100}%` }}
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
