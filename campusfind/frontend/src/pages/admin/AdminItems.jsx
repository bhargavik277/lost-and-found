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
      <Link to="/admin" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition-colors font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to Admin Overview
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Campus Item Inventory</h1>
          <p className="text-xs text-slate-600 mt-1">
            Browse, manage, update status, and permanently remove duplicate or incorrect reports across the database
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-2 text-xs">
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
<<<<<<< HEAD
            className="p-2 bg-slate-850 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 cursor-pointer hover:border-slate-600"
=======
            className="p-2 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 shadow-xs"
>>>>>>> 13ba826 (feat: complete premium SaaS frontend redesign)
          >
            <option value="">All Types</option>
            <option value="LOST">Lost</option>
            <option value="FOUND">Found</option>
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
<<<<<<< HEAD
            className="p-2 bg-slate-850 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 cursor-pointer hover:border-slate-600"
=======
            className="p-2 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 shadow-xs"
>>>>>>> 13ba826 (feat: complete premium SaaS frontend redesign)
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
<<<<<<< HEAD
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-between animate-slide-down">
=======
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between animate-fade-in">
>>>>>>> 13ba826 (feat: complete premium SaaS frontend redesign)
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
<<<<<<< HEAD
        <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-xs text-rose-300 flex items-center justify-between animate-slide-down">
=======
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center justify-between animate-fade-in">
>>>>>>> 13ba826 (feat: complete premium SaaS frontend redesign)
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
          <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
<<<<<<< HEAD
        <div className="card reveal p-0 overflow-hidden border-slate-700">
=======
        <div className="card p-0 overflow-hidden border-slate-200/90 bg-white shadow-sm">
>>>>>>> 13ba826 (feat: complete premium SaaS frontend redesign)
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
<<<<<<< HEAD
                    <tr key={item.id} className="hover:bg-slate-850/50 hover:shadow-[inset_3px_0_0_0_rgba(99,102,241,0.5)] transition-all duration-200">
=======
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
>>>>>>> 13ba826 (feat: complete premium SaaS frontend redesign)
                      <td className="px-4 py-3 font-semibold">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          item.report_type === 'LOST' 
                            ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {item.report_type}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900 max-w-[180px] truncate">{item.item_name}</td>
                      <td className="px-4 py-3">{item.category}</td>
                      <td className="px-4 py-3">{item.location}</td>
                      <td className="px-4 py-3">{item.date_reported}</td>
                      <td className="px-4 py-3">
                        {editingItem?.id === item.id ? (
                          <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            className="bg-white border border-brand-500 p-1 rounded text-slate-900 text-xs focus:ring-1 focus:ring-brand-500"
                          >
                            <option value="ACTIVE">ACTIVE</option>
                            <option value="MATCHED">MATCHED</option>
                            <option value="CLAIMED">CLAIMED</option>
                            <option value="RETURNED">RETURNED</option>
                            <option value="CLOSED">CLOSED</option>
                          </select>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-semibold">
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
<<<<<<< HEAD
                                className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-all hover:scale-110 active:scale-95"
=======
                                className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors cursor-pointer shadow-xs"
>>>>>>> 13ba826 (feat: complete premium SaaS frontend redesign)
                                title="Save Status"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setEditingItem(null)}
<<<<<<< HEAD
                                className="p-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-all hover:scale-110 active:scale-95"
=======
                                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
>>>>>>> 13ba826 (feat: complete premium SaaS frontend redesign)
                                title="Cancel"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => { setEditingItem(item); setNewStatus(item.status); }}
<<<<<<< HEAD
                              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] font-medium transition-all hover:scale-105 active:scale-95 cursor-pointer"
=======
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-medium transition-colors cursor-pointer"
>>>>>>> 13ba826 (feat: complete premium SaaS frontend redesign)
                            >
                              Edit Status
                            </button>
                          )}

                          {/* Admin Only Delete Button */}
                          <button
                            onClick={() => setDeletingItem(item)}
<<<<<<< HEAD
                            className="p-1.5 bg-rose-600/10 hover:bg-rose-600/25 text-rose-400 hover:text-rose-300 border border-rose-500/20 hover:border-rose-500/40 rounded-lg transition-all hover:scale-110 active:scale-95 cursor-pointer"
=======
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 border border-rose-200 rounded-lg transition-colors cursor-pointer"
>>>>>>> 13ba826 (feat: complete premium SaaS frontend redesign)
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
<<<<<<< HEAD
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/85 backdrop-blur-md modal-overlay">
          <div className="card w-full max-w-md bg-navy-900 border-slate-700 shadow-2xl p-6 relative space-y-5 modal-panel">
=======
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="card w-full max-w-md bg-white border-slate-200 shadow-2xl p-6 relative space-y-5">
>>>>>>> 13ba826 (feat: complete premium SaaS frontend redesign)
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
