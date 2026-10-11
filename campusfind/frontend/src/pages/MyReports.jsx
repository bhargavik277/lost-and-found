import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { itemsAPI } from '../services/api'
import ItemCard from '../components/ItemCard'
import { ArrowLeft, PlusCircle, AlertCircle, FileText, CheckCircle2 } from 'lucide-react'

export default function MyReports() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL') // ALL, LOST, FOUND

  const fetchMyItems = async () => {
    setLoading(true)
    try {
      const res = await itemsAPI.myItems()
      setItems(res.data || [])
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMyItems()
  }, [])

  const filteredItems = items.filter(item => {
    if (filter === 'LOST') return item.report_type === 'LOST'
    if (filter === 'FOUND') return item.report_type === 'FOUND'
    return true
  })

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">My Reported Items</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your personal lost and found submissions and track their recovery progress
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filter === 'ALL' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({items.length})
            </button>
            <button
              onClick={() => setFilter('LOST')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filter === 'LOST' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Lost ({items.filter(i => i.report_type === 'LOST').length})
            </button>
            <button
              onClick={() => setFilter('FOUND')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filter === 'FOUND' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Found ({items.filter(i => i.report_type === 'FOUND').length})
            </button>
          </div>

          <Link
            to="/report-lost"
            className="btn-sheen px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" /> New Report
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="card py-16 flex justify-center bg-white">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, idx) => (
            <div key={item.id} className={`reveal delay-${(idx % 8) + 1}`}>
              <ItemCard
                item={item}
                showReporter={false}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center space-y-3 bg-white border-dashed border-slate-300">
          <FileText className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No reports found under this filter</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            Report a lost or found item to begin automated matching and campus recovery tracking.
          </p>
        </div>
      )}
    </div>
  )
}
