import React, { useState } from 'react'
import { Sparkles, MapPin, Calendar, ShieldCheck, CheckCircle2, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react'

export default function MatchCard({ match, onClaim, onStatusUpdate }) {
  const [expanded, setExpanded] = useState(false)
  const lost = match.lost_item
  const found = match.found_item

  if (!lost || !found) return null

  const score = Math.round(match.match_score)
  const isStrong = score >= 80
  const isPossible = score >= 60 && score < 80
  const isWeak = score >= 40 && score < 80

  const getScoreColor = () => {
    if (isStrong) return 'text-emerald-700 border-emerald-200 bg-emerald-50'
    if (isPossible) return 'text-sky-700 border-sky-200 bg-sky-50'
    if (isWeak) return 'text-amber-700 border-amber-200 bg-amber-50'
    return 'text-slate-600 border-slate-200 bg-slate-50'
  }

  const getProgressColor = (val, max) => {
    const pct = max > 0 ? val / max : 0
    if (pct >= 0.8) return 'bg-emerald-600'
    if (pct >= 0.5) return 'bg-indigo-600'
    if (pct >= 0.3) return 'bg-amber-500'
    return 'bg-slate-400'
  }

  const getMatchLabel = () => {
    if (isStrong) return '🌟 Strong AI Match'
    if (isPossible) return '⚡ Possible Match'
    if (isWeak) return '🔍 Moderate Match'
    return '⚠️ Low Match'
  }

  return (
    <div className="card bg-white border-slate-200/90 hover:border-indigo-300 shadow-xs hover:shadow-sm transition-all duration-300 p-5 sm:p-6 space-y-4">
      {/* Top Match Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3.5">
          <div className={`px-3.5 py-2 rounded-2xl border flex items-center gap-2 font-extrabold text-lg shadow-xs ${getScoreColor()} ${isStrong ? 'halo-pulse' : ''}`}>
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span>{score}% Match</span>
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              {getMatchLabel()}
            </div>
            <div className="text-sm font-bold text-slate-900 line-clamp-1">
              '{lost.item_name}' ⇄ '{found.item_name}'
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {score >= 40 && found.status !== 'RETURNED' && found.status !== 'CLAIMED' && (
            <button
              onClick={() => onClaim(found)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <ShieldCheck className="w-4 h-4" /> Claim This Item
            </button>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>{expanded ? 'Hide Analysis' : 'Explain Match'}</span>
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Lost Item (Yours) */}
        <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-100 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider">
              Your Lost Report
            </span>
            <span className="text-xs font-semibold text-slate-600">{lost.category}</span>
          </div>
          <h4 className="text-sm font-bold text-slate-900">{lost.item_name}</h4>
          {lost.description && (
            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{lost.description}</p>
          )}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-rose-100/80">
            <span className="flex items-center gap-1 font-medium text-slate-700">
              <MapPin className="w-3.5 h-3.5 text-rose-500" /> {lost.location}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" /> Lost: {lost.date_reported}
            </span>
          </div>
        </div>

        {/* Found Item (Candidate) */}
        <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
              Found Candidate
            </span>
            <span className="text-xs font-semibold text-slate-600">{found.category}</span>
          </div>
          <h4 className="text-sm font-bold text-slate-900">{found.item_name}</h4>
          {found.description && (
            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{found.description}</p>
          )}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-emerald-100/80">
            <span className="flex items-center gap-1 font-medium text-slate-700">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" /> {found.location}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" /> Found: {found.date_reported}
            </span>
          </div>
        </div>
      </div>

      {/* 5-Component Explainability Breakdown */}
      <div className="pt-2">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
          {/* Item Name Semantic Sim */}
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex justify-between text-slate-500 mb-1 font-medium text-[11px]">
              <span>Item Identity</span>
              <span className="font-bold text-slate-900">{Math.round(match.name_score ?? 0)}/30</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full ${getProgressColor(match.name_score ?? 0, 30)} bar-grow`}
                style={{ width: `${Math.min(100, ((match.name_score ?? 0) / 30) * 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Category */}
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex justify-between text-slate-500 mb-1 font-medium text-[11px]">
              <span>Category</span>
              <span className="font-bold text-slate-900">{Math.round(match.category_score)}/20</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full ${getProgressColor(match.category_score, 20)} bar-grow`}
                style={{ width: `${Math.min(100, (match.category_score / 20) * 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Location */}
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex justify-between text-slate-500 mb-1 font-medium text-[11px]">
              <span>Location</span>
              <span className="font-bold text-slate-900">{Math.round(match.location_score)}/20</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full ${getProgressColor(match.location_score, 20)} bar-grow`}
                style={{ width: `${Math.min(100, (match.location_score / 20) * 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Description */}
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex justify-between text-slate-500 mb-1 font-medium text-[11px]">
              <span>Description</span>
              <span className="font-bold text-slate-900">{Math.round(match.description_score)}/20</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full ${getProgressColor(match.description_score, 20)} bar-grow`}
                style={{ width: `${Math.min(100, (match.description_score / 20) * 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Date Proximity */}
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex justify-between text-slate-500 mb-1 font-medium text-[11px]">
              <span>Date Proximity</span>
              <span className="font-bold text-slate-900">{Math.round(match.date_score)}/10</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full ${getProgressColor(match.date_score, 10)} bar-grow`}
                style={{ width: `${Math.min(100, (match.date_score / 10) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Detailed Explanation */}
        {expanded && (
          <div className="mt-3.5 p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 space-y-2 text-xs">
            <h5 className="font-bold text-indigo-900">Why was this match suggested?</h5>
            <ul className="space-y-1.5 text-slate-700">
              <li className="flex items-center gap-2">
                {(match.name_score ?? 0) >= 15 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                )}
                <span>
                  <strong>Item Semantic Identity (30%):</strong> '{lost.item_name}' ↔ '{found.item_name}' scored {Math.round(match.name_score ?? 0)}/30 pts.
                </span>
              </li>
              <li className="flex items-center gap-2">
                {match.category_score >= 18 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                )}
                <span>
                  <strong>Category alignment (20%):</strong> Both items classified under "{lost.category}".
                </span>
              </li>
              <li className="flex items-center gap-2">
                {match.location_score >= 16 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                )}
                <span>
                  <strong>Location zone (20%):</strong> Lost at "{lost.location}" vs found at "{found.location}".
                </span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>
                  <strong>Description & keywords (20%):</strong> Text alignment scored {Math.round(match.description_score)}/20 pts.
                </span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>
                  <strong>Date proximity & chronology (10%):</strong> Consistent reporting dates ({lost.date_reported} → {found.date_reported}).
                </span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
