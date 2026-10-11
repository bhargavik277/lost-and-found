import React from 'react'
<<<<<<< HEAD
import { MapPin, Calendar, Clock, Tag, User, ShieldCheck, Eye, Sparkles } from 'lucide-react'
=======
import { MapPin, Calendar, Clock, User, ShieldCheck } from 'lucide-react'
>>>>>>> 13ba826 (feat: complete premium SaaS frontend redesign)

export default function ItemCard({ item, onClaim, onViewDetail, showReporter = true }) {
  const isLost = item.report_type === 'LOST'

  const statusColors = {
<<<<<<< HEAD
    ACTIVE: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    MATCHED: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    CLAIMED: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
    RETURNED: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    CLOSED: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
=======
    ACTIVE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    MATCHED: 'bg-amber-50 text-amber-700 border-amber-200',
    CLAIMED: 'bg-purple-50 text-purple-700 border-purple-200',
    RETURNED: 'bg-blue-50 text-blue-700 border-blue-200',
    CLOSED: 'bg-slate-100 text-slate-600 border-slate-200',
>>>>>>> 13ba826 (feat: complete premium SaaS frontend redesign)
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
<<<<<<< HEAD
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
=======
    <div className="card-hover flex flex-col justify-between group overflow-hidden relative bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
      {/* Top Banner Tag */}
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
>>>>>>> 13ba826 (feat: complete premium SaaS frontend redesign)
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
<<<<<<< HEAD
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
=======
        </div>

        {showReporter && item.reporter && (
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium pt-1">
            <User className="w-3 h-3 text-slate-400" />
            <span className="truncate">Reported by {item.reporter.name}</span>
>>>>>>> 13ba826 (feat: complete premium SaaS frontend redesign)
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
<<<<<<< HEAD
      <div className="pt-3.5 mt-3 border-t border-slate-700/60 flex items-center gap-2">
        {onViewDetail && (
          <button
            onClick={() => onViewDetail(item)}
            className="flex-1 py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 hover:border-slate-600 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer"
=======
      <div className="pt-3.5 mt-3 border-t border-slate-100 flex items-center gap-2">
        {onViewDetail && (
          <button
            onClick={() => onViewDetail(item)}
            className="flex-1 py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded-xl text-xs font-semibold transition-colors"
>>>>>>> 13ba826 (feat: complete premium SaaS frontend redesign)
          >
            <Eye className="w-3.5 h-3.5" /> Details
          </button>
        )}
        {!isLost && onClaim && item.status !== 'RETURNED' && item.status !== 'CLAIMED' && (
          <button
            onClick={() => onClaim(item)}
<<<<<<< HEAD
            className="flex-1 py-1.5 px-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-1 cursor-pointer"
=======
            className="flex-1 py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow transition-all flex items-center justify-center gap-1 active:scale-95"
>>>>>>> 13ba826 (feat: complete premium SaaS frontend redesign)
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Claim Item
          </button>
        )}
      </div>
    </div>
  )
}
