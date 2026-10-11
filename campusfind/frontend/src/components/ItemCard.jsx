import React from 'react'
import { MapPin, Calendar, Clock, Tag, User, ShieldCheck } from 'lucide-react'

export default function ItemCard({ item, onClaim, onViewDetail, showReporter = true }) {
  const isLost = item.report_type === 'LOST'

  const statusColors = {
    ACTIVE: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    MATCHED: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    CLAIMED: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    RETURNED: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    CLOSED: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
  }

  const categoryIcons = {
    Electronics: '💻',
    'Personal Items': '🎒',
    'Study Materials': '📚',
    Clothing: '👕',
    Documents: '📄',
    Other: '📦',
  }

  return (
    <div className="card-hover flex flex-col justify-between group overflow-hidden relative">
      {/* Top Banner Tag */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span
          className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border ${
            isLost
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
              : 'bg-teal-500/20 text-teal-300 border-teal-500/30'
          }`}
        >
          {isLost ? '🔴 Lost' : '🟢 Found'}
        </span>
        <span
          className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
            statusColors[item.status] || 'bg-slate-700 text-slate-300'
          }`}
        >
          {item.status}
        </span>
      </div>

      {/* Main Content */}
      <div className="space-y-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <span>{categoryIcons[item.category] || '📦'}</span>
            <span>{item.category}</span>
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
            {item.item_name}
          </h3>
        </div>

        {item.description && (
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        )}

        {/* Location & Date Details */}
        <div className="pt-2 border-t border-slate-700/60 space-y-1.5 text-xs text-slate-300">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="truncate">{item.location}</span>
          </div>
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              {item.date_reported}
            </span>
            {item.time_reported && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                {item.time_reported}
              </span>
            )}
          </div>
        </div>

        {showReporter && item.reporter && (
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <User className="w-3 h-3 text-slate-400" />
            <span>Reported by {item.reporter.name}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="pt-4 mt-3 border-t border-slate-700/60 flex items-center gap-2">
        {onViewDetail && (
          <button
            onClick={() => onViewDetail(item)}
            className="flex-1 py-1.5 px-3 bg-slate-700/80 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-medium transition-colors"
          >
            View Details
          </button>
        )}
        {!isLost && onClaim && item.status !== 'RETURNED' && item.status !== 'CLAIMED' && (
          <button
            onClick={() => onClaim(item)}
            className="flex-1 py-1.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all flex items-center justify-center gap-1"
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Claim Item
          </button>
        )}
      </div>
    </div>
  )
}
