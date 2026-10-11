import React from 'react'
import { MapPin, Calendar, Clock, User, ShieldCheck, Eye } from 'lucide-react'

export default function ItemCard({ item, onClaim, onViewDetail, showReporter = true }) {
  const isLost = item.report_type === 'LOST'

  const statusColors = {
    ACTIVE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    MATCHED: 'bg-amber-50 text-amber-700 border-amber-200',
    CLAIMED: 'bg-purple-50 text-purple-700 border-purple-200',
    RETURNED: 'bg-blue-50 text-blue-700 border-blue-200',
    CLOSED: 'bg-slate-100 text-slate-600 border-slate-200',
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
    <div className="card-hover flex flex-col justify-between group overflow-hidden relative bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
      <div>
        {/* Optional Thumbnail Image Preview */}
        {item.image_url ? (
          <div className="relative w-full h-36 mb-3 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
            <img
              src={item.image_url}
              alt={item.item_name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none"></div>
            <div className="absolute top-2 left-2 flex items-center gap-1.5">
              <span
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border backdrop-blur-sm shadow-xs ${
                  isLost
                    ? 'bg-rose-50/95 text-rose-700 border-rose-200'
                    : 'bg-emerald-50/95 text-emerald-700 border-emerald-200'
                }`}
              >
                {isLost ? '🔴 Lost' : '🟢 Found'}
              </span>
            </div>
            <div className="absolute top-2 right-2">
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border backdrop-blur-sm shadow-xs ${
                  statusColors[item.status] || 'bg-slate-100 text-slate-700 border-slate-200'
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
              className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold uppercase tracking-wider border ${
                isLost
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}
            >
              {isLost ? '🔴 Lost' : '🟢 Found'}
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                statusColors[item.status] || 'bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              {item.status}
            </span>
          </div>
        )}

        {/* Main Content */}
        <div className="space-y-2.5">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1">
              <span>{categoryIcons[item.category] || '📦'}</span>
              <span>{item.category}</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
              {item.item_name}
            </h3>
          </div>

          {item.description && (
            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          )}

          {/* Location & Date Details */}
          <div className="pt-2.5 border-t border-slate-100 space-y-1.5 text-xs text-slate-700">
            <div className="flex items-center gap-1.5 font-medium">
              <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span className="truncate">{item.location}</span>
            </div>
            <div className="flex items-center justify-between text-slate-500 text-[11px]">
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
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium pt-1">
              <User className="w-3 h-3 text-slate-400" />
              <span className="truncate">Reported by {item.reporter.name}</span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="pt-3.5 mt-3 border-t border-slate-100 flex items-center gap-2">
        {onViewDetail && (
          <button
            onClick={() => onViewDetail(item)}
            className="flex-1 py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" /> Details
          </button>
        )}
        {!isLost && onClaim && item.status !== 'RETURNED' && item.status !== 'CLAIMED' && (
          <button
            onClick={() => onClaim(item)}
            className="flex-1 py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95"
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Claim Item
          </button>
        )}
      </div>
    </div>
  )
}
