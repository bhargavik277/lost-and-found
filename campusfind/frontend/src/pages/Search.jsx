import React, { useState, useEffect } from 'react'
import { itemsAPI } from '../services/api'
import ItemCard from '../components/ItemCard'
import ClaimModal from '../components/ClaimModal'
import {
  Search as SearchIcon,
  Filter,
  ChevronLeft,
  ChevronRight,
  X,
  Compass,
  Sparkles,
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react'

const CATEGORIES = [
  'All Categories',
  'Electronics',
  'Personal Items',
  'Study Materials',
  'Clothing',
  'Documents',
  'Other',
]

const LOCATIONS = [
  'All Locations',
  'Library',
  'Computer Lab',
  'Cafeteria',
  'Sports Complex',
  'Main Auditorium',
  'Science Block',
  'Engineering Building',
  'Student Center',
  'Campus Grounds',
  'Other',
]

export default function Search() {
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [selectedLocation, setSelectedLocation] = useState('All Locations')
  const [reportType, setReportType] = useState('ALL') // ALL, LOST, FOUND
  const [status, setStatus] = useState('ALL') // ALL, ACTIVE, MATCHED, CLAIMED, RETURNED
  const [page, setPage] = useState(1)
  const [pageSize] = useState(12)
  const [selectedClaimItem, setSelectedClaimItem] = useState(null)
  const [detailItem, setDetailItem] = useState(null)

  const fetchItems = async () => {
    setLoading(true)
    try {
      const params = {
        page,
        page_size: pageSize,
      }
      if (query.trim()) params.query = query.trim()
      if (selectedCategory !== 'All Categories') params.category = selectedCategory
      if (selectedLocation !== 'All Locations') params.location = selectedLocation
      if (reportType !== 'ALL') params.report_type = reportType
      if (status !== 'ALL') params.status = status

      const res = await itemsAPI.list(params)
      setItems(res.data.items || [])
      setTotal(res.data.total || 0)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [page, selectedCategory, selectedLocation, reportType, status])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setPage(1)
    fetchItems()
  }

  const clearFilters = () => {
    setQuery('')
    setSelectedCategory('All Categories')
    setSelectedLocation('All Locations')
    setReportType('ALL')
    setStatus('ALL')
    setPage(1)
  }

  const totalPages = Math.ceil(total / pageSize) || 1

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Public Item Catalog</h1>
          <p className="text-xs text-slate-500 mt-1">Browse, search, and verify lost & found items across all campus zones</p>
        </div>
        <div className="text-xs font-semibold text-slate-500 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200/80 shadow-xs w-fit">
          Showing <span className="text-indigo-600 font-bold">{items.length}</span> of <span className="text-slate-900 font-bold">{total}</span> items
        </div>
      </div>

      {/* Filter Control Box */}
      <div className="card bg-white border-slate-200/90 shadow-sm p-5 space-y-4">
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2.5">
          <div className="relative flex-1">
            <SearchIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by keywords (e.g. laptop, wallet, calculator, blue bottle, library)..."
              className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 transition-all shadow-xs"
            />
            {query && (
              <button
                type="button"
                onClick={() => { setQuery(''); setPage(1); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="btn-sheen px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs shadow-indigo-600/20 cursor-pointer active:scale-95"
          >
            Search
          </button>
        </form>

        {/* Filters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
          {/* Category Filter */}
          <div>
            <label className="block text-slate-600 font-bold mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
              className="w-full p-2 bg-white border border-slate-300 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/15 cursor-pointer shadow-xs"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Location Filter */}
          <div>
            <label className="block text-slate-600 font-bold mb-1">Location Zone</label>
            <select
              value={selectedLocation}
              onChange={(e) => { setSelectedLocation(e.target.value); setPage(1); }}
              className="w-full p-2 bg-white border border-slate-300 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/15 cursor-pointer shadow-xs"
            >
              {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-slate-600 font-bold mb-1">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => { setReportType(e.target.value); setPage(1); }}
              className="w-full p-2 bg-white border border-slate-300 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/15 cursor-pointer shadow-xs"
            >
              <option value="ALL">All Types</option>
              <option value="LOST">Lost Only</option>
              <option value="FOUND">Found Only</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-slate-600 font-bold mb-1">Item Status</label>
            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
              className="w-full p-2 bg-white border border-slate-300 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/15 cursor-pointer shadow-xs"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="MATCHED">Matched</option>
              <option value="CLAIMED">Claimed</option>
              <option value="RETURNED">Returned</option>
            </select>
          </div>
        </div>
      </div>

      {/* Items Grid */}
      {loading ? (
        <div className="card py-16 flex justify-center bg-white">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {items.map((item, idx) => (
            <div key={item.id} className={`reveal delay-${(idx % 8) + 1}`}>
              <ItemCard
                item={item}
                onClaim={(item) => setSelectedClaimItem(item)}
                onViewDetail={(item) => setDetailItem(item)}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center space-y-3 bg-white border-dashed border-slate-300">
          <SearchIcon className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No items found matching your criteria</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            Try adjusting your search terms, changing the location zone, or clearing filters to view all campus reports.
          </p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-indigo-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-6">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 bg-white border border-slate-300 hover:bg-slate-50 disabled:opacity-40 text-slate-700 rounded-xl transition-colors shadow-xs cursor-pointer"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-slate-700 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 bg-white border border-slate-300 hover:bg-slate-50 disabled:opacity-40 text-slate-700 rounded-xl transition-colors shadow-xs cursor-pointer"
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Item Details Modal */}
      {detailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs modal-overlay">
          <div className="card w-full max-w-md bg-white border-slate-200 shadow-xl p-6 sm:p-7 relative space-y-4 modal-panel">
            <button
              onClick={() => setDetailItem(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold ${
                detailItem.report_type === 'LOST'
                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}>
                {detailItem.report_type === 'LOST' ? '🔴 Lost Report' : '🟢 Found Item'}
              </span>
              <span className="text-xs font-semibold text-slate-500">{detailItem.category}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">{detailItem.item_name}</h3>

            {detailItem.description && (
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
                {detailItem.description}
              </div>
            )}

            <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Campus Location:</span>
                <span className="text-slate-900 font-semibold">{detailItem.location}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Date Reported:</span>
                <span className="text-slate-900 font-medium">{detailItem.date_reported}</span>
              </div>
              {detailItem.time_reported && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Approximate Time:</span>
                  <span className="text-slate-900 font-medium">{detailItem.time_reported}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Current Status:</span>
                <span className="text-indigo-700 font-bold">{detailItem.status}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex gap-2">
              {detailItem.report_type === 'FOUND' && detailItem.status !== 'RETURNED' && detailItem.status !== 'CLAIMED' && (
                <button
                  onClick={() => {
                    const itemToClaim = detailItem
                    setDetailItem(null)
                    setSelectedClaimItem(itemToClaim)
                  }}
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 inline mr-1" /> Claim This Item
                </button>
              )}
              <button
                onClick={() => setDetailItem(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Claim Modal */}
      <ClaimModal
        item={selectedClaimItem}
        isOpen={!!selectedClaimItem}
        onClose={() => setSelectedClaimItem(null)}
        onSuccess={fetchItems}
      />
    </div>
  )
}
