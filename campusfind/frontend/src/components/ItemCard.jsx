import React from 'react'
import { MapPin, Calendar, Clock, Tag, User, ShieldCheck, Eye, Sparkles } from 'lucide-react'

export default function ItemCard({ item, onClaim, onViewDetail, showReporter = true }) {
  const isLost = item.report_type === 'LOST'

  const statusColors = {
    ACTIVE: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    MATCHED: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    CLAIMED: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
    RETURNED: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    CLOSED: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
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
    <div className="card-hover interactive-lift flex flex-col justify-between group overflow-hidden relative border border-slate-700/80 hover:border-indigo-500/40 bg-navy-800/90 shadow-lg hover:shadow-indigo-500/10 transition-all duration-300">
      <div>
        {/* Optional Thumbnail Image Preview */}
        {item.image_url ? (
          <div className="relative w-full h-36 mb-3 rounded-xl overflow-hidden bg-slate-900 border border-slate-750">
            <img
              src={item.image_url}
              alt={item.item_name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent pointer-events-none"></div>
            <div className="absolute top-2 left-2 flex items-center gap-1.5">
              <span
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border backdrop-blur-sm shadow-sm ${
                  isLost
                    ? 'bg-rose-950/80 text-rose-300 border-rose-500/40'
                    : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                }`}
              >
                {isLost ? '🔴 Lost' : '🟢 Found'}
              </span>
            </div>
            <div className="absolute top-2 right-2">
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border backdrop-blur-sm shadow-sm ${
                  statusColors[item.status] || 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                {item.status}
              </span>
            </div>
          </div>
        ) : (
          /* Top Banner Tag when no image */
          <div className="flex items-center justify-between gap-2 mb-3">
            <span
              className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border transition-colors ${
                isLost
                  ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                  : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
              }`}
            >
              {isLost ? '🔴 Lost' : '🟢 Found'}
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                statusColors[item.status] || 'bg-slate-700 text-slate-300 border-slate-600'
              }`}
            >
              {item.status}
            </span>
          </div>
        )}

        {/* Main Content */}
        <div className="space-y-2.5">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <span>{categoryIcons[item.category] || '📦'}</span>
              <span className="font-medium text-slate-400">{item.category}</span>
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
      </div>

      {/* Actions */}
      <div className="pt-3.5 mt-3 border-t border-slate-700/60 flex items-center gap-2">
        {onViewDetail && (
          <button
            onClick={() => onViewDetail(item)}
            className="flex-1 py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 hover:border-slate-600 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" /> Details
          </button>
        )}
        {!isLost && onClaim && item.status !== 'RETURNED' && item.status !== 'CLAIMED' && (
          <button
            onClick={() => onClaim(item)}
            className="flex-1 py-1.5 px-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-1 cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Claim Item
          </button>
        )}
      </div>
    </div>
  )
}
