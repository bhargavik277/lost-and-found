import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { itemsAPI } from '../services/api'
import ItemCard from '../components/ItemCard'
import { Layers, PlusCircle, ArrowLeft, Sparkles, Filter } from 'lucide-react'

export default function MyReports() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL') // ALL, LOST, FOUND

  const fetchItems = async () => {
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
    fetchItems()
  }, [])

  const filteredItems = items.filter(item => {
    if (filter === 'LOST') return item.report_type === 'LOST'
    if (filter === 'FOUND') return item.report_type === 'FOUND'
    return true
  })

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">My Reported Items</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your personal lost and found submissions and track their recovery progress
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${filter === 'ALL' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              All ({items.length})
            </button>
            <button
              onClick={() => setFilter('LOST')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${filter === 'LOST' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Lost ({items.filter(i => i.report_type === 'LOST').length})
            </button>
            <button
              onClick={() => setFilter('FOUND')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${filter === 'FOUND' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Found ({items.filter(i => i.report_type === 'FOUND').length})
            </button>
          </div>

          <Link
            to="/report-lost"
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-500/20 flex items-center gap-1.5 transition-all"
          >
            <PlusCircle className="w-4 h-4" /> New Report
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="card py-16 flex justify-center">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              showReporter={false}
            />
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center space-y-4 bg-navy-800/60 border-dashed border-slate-700">
          <Layers className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No items found in this category</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You haven't submitted any reports matching this filter.
          </p>
        </div>
      )}
    </div>
  )
}
