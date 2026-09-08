import React, { useState, useEffect } from 'react'
import { itemsAPI } from '../services/api'
import ItemCard from '../components/ItemCard'
import ClaimModal from '../components/ClaimModal'
import { 
  Search as SearchIcon, 
  Filter, 
  MapPin, 
  Calendar, 
  Tag, 
  Sparkles, 
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

const CATEGORIES = [
  'All',
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
  'Classroom',
  'Laboratory',
  'Auditorium',
  'Canteen',
  'Corridor',
  'Parking',
  'Playground',
  'Sports Room',
]

export default function Search() {
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  // Filters
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedLocation, setSelectedLocation] = useState('All Locations')
  const [reportType, setReportType] = useState('ALL') // ALL, LOST, FOUND
  const [status, setStatus] = useState('ALL') // ALL, ACTIVE, MATCHED, RETURNED

  const [selectedClaimItem, setSelectedClaimItem] = useState(null)
  const [detailItem, setDetailItem] = useState(null)

  const fetchItems = async () => {
    setLoading(true)
    try {
      const params = {
        page,
        page_size: 12,
      }
      if (query.trim()) params.query = query.trim()
      if (selectedCategory !== 'All') params.category = selectedCategory
      if (selectedLocation !== 'All Locations') params.location = selectedLocation
      if (reportType !== 'ALL') params.report_type = reportType
      if (status !== 'ALL') params.status = status

      const res = await itemsAPI.list(params)
      setItems(res.data.items || [])
      setTotal(res.data.total || 0)
      setTotalPages(res.data.total_pages || 1)
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
    setSelectedCategory('All')
    setSelectedLocation('All Locations')
    setReportType('ALL')
    setStatus('ALL')
    setPage(1)
  }

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Campus Item Directory</h1>
          <p className="text-xs text-slate-400 mt-1">
            Search active lost and found reports across all campus departments and zones
          </p>
        </div>
        <div className="text-xs text-slate-400">
          Showing <span className="text-white font-bold">{items.length}</span> of <span className="text-white font-bold">{total}</span> items
        </div>
      </div>

      {/* Filter Control Box */}
      <div className="card bg-navy-800 border-slate-700/80 p-5 space-y-4">
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <SearchIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by keywords (e.g. laptop, wallet, calculator, blue bottle, library)..."
              className="w-full pl-10 pr-3.5 py-2.5 bg-slate-850 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-500/20 cursor-pointer"
          >
            Search
          </button>
        </form>

        {/* Filters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-700/60 text-xs">
          {/* Category Filter */}
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
              className="w-full p-2 bg-slate-850 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Location Filter */}
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Location</label>
            <select
              value={selectedLocation}
              onChange={(e) => { setSelectedLocation(e.target.value); setPage(1); }}
              className="w-full p-2 bg-slate-850 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
            >
              {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Type</label>
            <select
              value={reportType}
              onChange={(e) => { setReportType(e.target.value); setPage(1); }}
              className="w-full p-2 bg-slate-850 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Types</option>
              <option value="LOST">Lost Only</option>
              <option value="FOUND">Found Only</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
              className="w-full p-2 bg-slate-850 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
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
        <div className="card py-16 flex justify-center">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onClaim={(item) => setSelectedClaimItem(item)}
              onViewDetail={(item) => setDetailItem(item)}
            />
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center space-y-3 bg-navy-800/60 border-dashed border-slate-700">
          <SearchIcon className="w-8 h-8 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No items found matching your criteria</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search terms or resetting filters to view all campus reports.
          </p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-indigo-400 rounded-xl text-xs font-semibold"
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
            className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 rounded-xl transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-semibold text-slate-300">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 rounded-xl transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Item Details Modal */}
      {detailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-fade-in">
          <div className="card w-full max-w-md bg-navy-900 border-slate-700 shadow-2xl p-6 relative space-y-4">
            <button
              onClick={() => setDetailItem(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-xs font-bold ${detailItem.report_type === 'LOST' ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                {detailItem.report_type}
              </span>
              <span className="text-xs text-slate-400">{detailItem.category}</span>
            </div>
            <h3 className="text-lg font-bold text-white">{detailItem.item_name}</h3>
            {detailItem.description && (
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-850 p-3 rounded-xl border border-slate-750">
                {detailItem.description}
              </p>
            )}
            <div className="space-y-2 text-xs text-slate-400 pt-2 border-t border-slate-800">
              <div className="flex justify-between">
                <span>Location:</span>
                <span className="text-white font-semibold">{detailItem.location}</span>
              </div>
              <div className="flex justify-between">
                <span>Date Reported:</span>
                <span className="text-white">{detailItem.date_reported}</span>
              </div>
              {detailItem.time_reported && (
                <div className="flex justify-between">
                  <span>Time:</span>
                  <span className="text-white">{detailItem.time_reported}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Current Status:</span>
                <span className="text-indigo-400 font-semibold">{detailItem.status}</span>
              </div>
            </div>
            <div className="pt-3 border-t border-slate-800 flex gap-2">
              {detailItem.report_type === 'FOUND' && detailItem.status !== 'RETURNED' && detailItem.status !== 'CLAIMED' && (
                <button
                  onClick={() => {
                    const itemToClaim = detailItem
                    setDetailItem(null)
                    setSelectedClaimItem(itemToClaim)
                  }}
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold"
                >
                  Claim This Item
                </button>
              )}
              <button
                onClick={() => setDetailItem(null)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
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
