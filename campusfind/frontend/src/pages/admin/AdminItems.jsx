import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { adminAPI } from '../../services/api'
import { 
  Layers, 
  ArrowLeft, 
  Search, 
  Filter, 
  Edit, 
  Check, 
  X, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  AlertCircle,
  MapPin,
  Calendar,
  Tag
} from 'lucide-react'

export default function AdminItems() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [reportType, setReportType] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [editingItem, setEditingItem] = useState(null)
  const [newStatus, setNewStatus] = useState('')
  
  // Deletion states
  const [deletingItem, setDeletingItem] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const fetchItems = async () => {
    setLoading(true)
    try {
      const params = { page, page_size: 50 }
      if (reportType) params.report_type = reportType
      if (status) params.status = status
      const res = await adminAPI.items(params)
      setItems(res.data || [])
    } catch (err) {
      setErrorMessage(err.response?.data?.detail || 'Failed to load inventory items.')
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
    } catch (err) {
      setErrorMessage(err.response?.data?.detail || 'Failed to update item status.')
    }
  }

  const handleDeleteItem = async () => {
    if (!deletingItem) return
    setDeleteLoading(true)
    setErrorMessage('')

    try {
      await adminAPI.deleteItem(deletingItem.id)
      setItems((prev) => prev.filter((i) => i.id !== deletingItem.id))
      setSuccessMessage('Item deleted successfully.')
      setDeletingItem(null)
      setTimeout(() => setSuccessMessage(''), 4000)
    } catch (err) {
      setErrorMessage(err.response?.data?.detail || 'Failed to delete item.')
    } finally {
      setDeleteLoading(false)
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
            Browse, manage, update status, and permanently remove duplicate or incorrect reports across the database
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

      {/* Feedback Alerts */}
      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage('')} className="p-1 hover:text-white text-emerald-400">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-xs text-rose-300 flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage('')} className="p-1 hover:text-white text-rose-400">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

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
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {items.length > 0 ? (
                  items.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-850/50 transition-colors">
                      <td className="px-4 py-3 font-semibold">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.report_type === 'LOST' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'}`}>
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
                        <div className="flex items-center justify-end gap-1.5">
                          {editingItem?.id === item.id ? (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(item)}
                                className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
                                title="Save Status"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setEditingItem(null)}
                                className="p-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
                                title="Cancel"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => { setEditingItem(item); setNewStatus(item.status); }}
                              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] font-medium transition-colors"
                            >
                              Edit Status
                            </button>
                          )}

                          {/* Admin Only Delete Button */}
                          <button
                            onClick={() => setDeletingItem(item)}
                            className="p-1.5 bg-rose-600/10 hover:bg-rose-600/25 text-rose-400 hover:text-rose-300 border border-rose-500/20 hover:border-rose-500/40 rounded-lg transition-colors cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/85 backdrop-blur-sm animate-fade-in">
          <div className="card w-full max-w-md bg-navy-900 border-slate-700 shadow-2xl p-6 relative space-y-5">
            {/* Close */}
            <button
              onClick={() => setDeletingItem(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Delete this item?</h3>
                <p className="text-xs text-slate-400">Permanent Record Deletion</p>
              </div>
            </div>

            {/* Warning description */}
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete this lost/found report? This action cannot be undone.
            </p>

            {/* Summary details */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Item Name:</span>
                <span className="text-white font-bold">{deletingItem.item_name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Report Type:</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${deletingItem.report_type === 'LOST' ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                  {deletingItem.report_type}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Location:</span>
                <span className="text-slate-200">{deletingItem.location}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Date Reported:</span>
                <span className="text-slate-200">{deletingItem.date_reported}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingItem(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteLoading}
                onClick={handleDeleteItem}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-500/25 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
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
