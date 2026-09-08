import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { adminAPI } from '../../services/api'
import { Layers, ArrowLeft, Search, Filter, Edit, Check, X } from 'lucide-react'

export default function AdminItems() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [reportType, setReportType] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [editingItem, setEditingItem] = useState(null)
  const [newStatus, setNewStatus] = useState('')

  const fetchItems = async () => {
    setLoading(true)
    try {
      const params = { page, page_size: 50 }
      if (reportType) params.report_type = reportType
      if (status) params.status = status
      const res = await adminAPI.items(params)
      setItems(res.data || [])
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [page, reportType, status])

  const handleUpdateStatus = async (item) => {
    if (!newStatus) return
    try {
      await adminAPI.updateItem(item.id, { status: newStatus })
      setEditingItem(null)
      fetchItems()
    } catch {
      // ignore
    }
  }

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      <Link to="/admin" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Admin Overview
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Campus Item Inventory</h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse and manage all registered lost and found records across the database
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-2 text-xs">
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="p-2 bg-slate-850 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Types</option>
            <option value="LOST">Lost</option>
            <option value="FOUND">Found</option>
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="p-2 bg-slate-850 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="MATCHED">Matched</option>
            <option value="CLAIMED">Claimed</option>
            <option value="RETURNED">Returned</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="card py-16 flex justify-center">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="card p-0 overflow-hidden border-slate-700">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-850 text-slate-400 uppercase font-semibold border-b border-slate-700">
                <tr>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Item Name</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Date Reported</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="px-4 py-3 font-semibold">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${item.report_type === 'LOST' ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                        {item.report_type}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold text-white max-w-[180px] truncate">{item.item_name}</td>
                    <td className="px-4 py-3">{item.category}</td>
                    <td className="px-4 py-3">{item.location}</td>
                    <td className="px-4 py-3">{item.date_reported}</td>
                    <td className="px-4 py-3">
                      {editingItem?.id === item.id ? (
                        <select
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value)}
                          className="bg-slate-800 border border-indigo-500 p-1 rounded text-white text-xs"
                        >
                          <option value="ACTIVE">ACTIVE</option>
                          <option value="MATCHED">MATCHED</option>
                          <option value="CLAIMED">CLAIMED</option>
                          <option value="RETURNED">RETURNED</option>
                          <option value="CLOSED">CLOSED</option>
                        </select>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 text-[10px] font-semibold">
                          {item.status}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {editingItem?.id === item.id ? (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleUpdateStatus(item)}
                            className="p-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingItem(null)}
                            className="p-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => { setEditingItem(item); setNewStatus(item.status); }}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px]"
                        >
                          Edit Status
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
