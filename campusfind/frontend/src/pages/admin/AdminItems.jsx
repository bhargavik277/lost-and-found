import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { adminAPI } from '../../services/api'
import {
  Layers,
  ArrowLeft,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Trash2,
  Edit3,
  Check,
  X,
  AlertTriangle
} from 'lucide-react'

export default function AdminItems() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [reportType, setReportType] = useState('')
  const [status, setStatus] = useState('')
  const [editingItem, setEditingItem] = useState(null)
  const [newStatus, setNewStatus] = useState('')
  const [deletingItem, setDeletingItem] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const fetchItems = async () => {
    setLoading(true)
    try {
      const params = {}
      if (reportType) params.report_type = reportType
      if (status) params.status = status
      const res = await adminAPI.items(params)
      setItems(res.data.items || [])
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [reportType, status])

  const handleUpdateStatus = async (item) => {
    try {
      await adminAPI.updateItemStatus(item.id, newStatus)
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: newStatus } : i))
      setEditingItem(null)
      setSuccessMessage(`Item "${item.item_name}" status updated to ${newStatus}`)
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch {
      setErrorMessage('Failed to update item status. Please try again.')
      setTimeout(() => setErrorMessage(''), 3000)
    }
  }

  const handleDeleteItem = async () => {
    if (!deletingItem) return
    setDeleteLoading(true)
    try {
      await adminAPI.deleteItem(deletingItem.id)
      setItems(prev => prev.filter(i => i.id !== deletingItem.id))
      setSuccessMessage(`Item "${deletingItem.item_name}" deleted permanently.`)
      setDeletingItem(null)
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch {
      setErrorMessage('Failed to delete item. It may be linked to active claims.')
      setTimeout(() => setErrorMessage(''), 3000)
    } finally {
      setDeleteLoading(false)
    }
  }

  const statusColors = {
    ACTIVE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    MATCHED: 'bg-amber-50 text-amber-700 border-amber-200',
    CLAIMED: 'bg-purple-50 text-purple-700 border-purple-200',
    RETURNED: 'bg-blue-50 text-blue-700 border-blue-200',
    CLOSED: 'bg-slate-100 text-slate-600 border-slate-200',
  }

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      <Link
        to="/admin"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Database Inventory Control</h1>
          <p className="text-xs text-slate-500 mt-1">
            Global management of all registered lost and found items in the campus repository
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-2 text-xs">
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="p-2 bg-white border border-slate-300 rounded-xl text-slate-800 text-xs focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/15 shadow-xs cursor-pointer"
          >
            <option value="">All Types</option>
            <option value="LOST">Lost</option>
            <option value="FOUND">Found</option>
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="p-2 bg-white border border-slate-300 rounded-xl text-slate-800 text-xs focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/15 shadow-xs cursor-pointer"
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

      {/* Feedback Alerts */}
      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage('')} className="p-1 hover:text-emerald-950 text-emerald-600 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage('')} className="p-1 hover:text-rose-950 text-rose-600 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {loading ? (
        <div className="card py-16 flex justify-center bg-white border-slate-200/90 shadow-sm">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="card p-0 overflow-hidden border-slate-200/90 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3.5">Type</th>
                  <th className="px-4 py-3.5">Item Name</th>
                  <th className="px-4 py-3.5">Category</th>
                  <th className="px-4 py-3.5">Location</th>
                  <th className="px-4 py-3.5">Date Reported</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {items.length > 0 ? (
                  items.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-semibold">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          item.report_type === 'LOST'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {item.report_type}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-bold text-slate-900">
                        {item.item_name}
                      </td>
                      <td className="px-4 py-3">{item.category}</td>
                      <td className="px-4 py-3">{item.location}</td>
                      <td className="px-4 py-3">{item.date_reported}</td>
                      <td className="px-4 py-3">
                        {editingItem?.id === item.id ? (
                          <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            className="bg-white border border-slate-300 rounded-lg px-2 py-1 text-slate-800 text-xs focus:outline-none focus:border-indigo-600 shadow-xs"
                          >
                            <option value="ACTIVE">ACTIVE</option>
                            <option value="MATCHED">MATCHED</option>
                            <option value="CLAIMED">CLAIMED</option>
                            <option value="RETURNED">RETURNED</option>
                            <option value="CLOSED">CLOSED</option>
                          </select>
                        ) : (
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${statusColors[item.status] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                            {item.status}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {editingItem?.id === item.id ? (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(item)}
                                className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors cursor-pointer shadow-xs"
                                title="Save Status"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setEditingItem(null)}
                                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                                title="Cancel"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => { setEditingItem(item); setNewStatus(item.status); }}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-medium transition-colors cursor-pointer"
                            >
                              Edit Status
                            </button>
                          )}

                          {/* Admin Only Delete Button */}
                          <button
                            onClick={() => setDeletingItem(item)}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 border border-rose-200 rounded-lg transition-colors cursor-pointer"
                            title="Delete Item Report"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                      No items found under the selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm modal-overlay">
          <div className="card w-full max-w-md bg-white border-slate-200 shadow-2xl p-6 relative space-y-5 modal-panel">
            {/* Close */}
            <button
              onClick={() => setDeletingItem(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Delete this item?</h3>
                <p className="text-xs text-slate-500">Permanent Record Deletion</p>
              </div>
            </div>

            {/* Warning description */}
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to permanently delete this lost/found report? This action cannot be undone.
            </p>

            {/* Summary details */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Item Name:</span>
                <span className="text-slate-900 font-bold">{deletingItem.item_name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Report Type:</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  deletingItem.report_type === 'LOST'
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}>
                  {deletingItem.report_type}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Location:</span>
                <span className="text-slate-800">{deletingItem.location}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Date Reported:</span>
                <span className="text-slate-800">{deletingItem.date_reported}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingItem(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteLoading}
                onClick={handleDeleteItem}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
