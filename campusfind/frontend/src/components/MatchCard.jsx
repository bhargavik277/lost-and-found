import React, { useState } from 'react'
import { Sparkles, MapPin, Calendar, Tag, ShieldCheck, CheckCircle2, XCircle, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react'

export default function MatchCard({ match, onClaim, onStatusUpdate }) {
  const [expanded, setExpanded] = useState(false)
  const lost = match.lost_item
  const found = match.found_item

  if (!lost || !found) return null

  const score = Math.round(match.match_score)
  const isStrong = score >= 70
  const isMedium = score >= 50 && score < 70

  const getScoreColor = () => {
    if (isStrong) return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10'
    if (isMedium) return 'text-amber-400 border-amber-500/40 bg-amber-500/10'
    return 'text-indigo-400 border-indigo-500/40 bg-indigo-500/10'
  }

  const getProgressColor = (val, max) => {
    const pct = val / max
    if (pct >= 0.8) return 'bg-emerald-500'
    if (pct >= 0.5) return 'bg-amber-500'
    return 'bg-indigo-500'
  }

  return (
    <div className="card border-slate-700/80 hover:border-indigo-500/40 transition-all duration-300">
      {/* Top Match Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-700/60">
        <div className="flex items-center gap-3">
          <div className={`px-3.5 py-2 rounded-2xl border flex items-center gap-2 font-black text-lg ${getScoreColor()}`}>
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span>{score}% Match</span>
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {isStrong ? '🌟 High Confidence Match' : isMedium ? '⚡ Possible Match' : '🔍 Potential Lead'}
            </div>
            <div className="text-sm font-bold text-white">
              '{lost.item_name}' ⇄ '{found.item_name}'
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {found.status !== 'RETURNED' && found.status !== 'CLAIMED' && (
            <button
              onClick={() => onClaim(found)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" /> Claim This Item
            </button>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs transition-colors flex items-center gap-1"
          >
            <span>{expanded ? 'Hide Analysis' : 'Explain Match'}</span>
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Lost Item (Yours) */}
        <div className="p-3.5 rounded-xl bg-slate-850 border border-slate-750 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider">
              Your Lost Report
            </span>
            <span className="text-xs text-slate-400">{lost.category}</span>
          </div>
          <h4 className="text-sm font-bold text-white">{lost.item_name}</h4>
          {lost.description && (
            <p className="text-xs text-slate-400 line-clamp-2">{lost.description}</p>
          )}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-750">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" /> {lost.location}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" /> {lost.date_reported}
            </span>
          </div>
        </div>

        {/* Found Item (Candidate) */}
        <div className="p-3.5 rounded-xl bg-slate-850 border border-slate-750 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
              Found Candidate
            </span>
            <span className="text-xs text-slate-400">{found.category}</span>
          </div>
          <h4 className="text-sm font-bold text-white">{found.item_name}</h4>
          {found.description && (
            <p className="text-xs text-slate-400 line-clamp-2">{found.description}</p>
          )}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-750">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" /> {found.location}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" /> {found.date_reported}
            </span>
          </div>
        </div>
      </div>

      {/* Explainability Breakdown (Expandable or default preview) */}
      <div className="pt-3 border-t border-slate-700/60">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {/* Category */}
          <div className="p-2.5 rounded-xl bg-slate-850 border border-slate-750">
            <div className="flex justify-between text-slate-400 mb-1">
              <span>Category</span>
              <span className="font-bold text-white">{Math.round(match.category_score)}/30</span>
            </div>
            <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full ${getProgressColor(match.category_score, 30)}`}
                style={{ width: `${(match.category_score / 30) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Location */}
          <div className="p-2.5 rounded-xl bg-slate-850 border border-slate-750">
            <div className="flex justify-between text-slate-400 mb-1">
              <span>Location</span>
              <span className="font-bold text-white">{Math.round(match.location_score)}/25</span>
            </div>
            <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full ${getProgressColor(match.location_score, 25)}`}
                style={{ width: `${(match.location_score / 25) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Description */}
          <div className="p-2.5 rounded-xl bg-slate-850 border border-slate-750">
            <div className="flex justify-between text-slate-400 mb-1">
              <span>Description</span>
              <span className="font-bold text-white">{Math.round(match.description_score)}/25</span>
            </div>
            <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full ${getProgressColor(match.description_score, 25)}`}
                style={{ width: `${(match.description_score / 25) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Date */}
          <div className="p-2.5 rounded-xl bg-slate-850 border border-slate-750">
            <div className="flex justify-between text-slate-400 mb-1">
              <span>Date Proximity</span>
              <span className="font-bold text-white">{Math.round(match.date_score)}/20</span>
            </div>
            <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full ${getProgressColor(match.date_score, 20)}`}
                style={{ width: `${(match.date_score / 20) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Detailed Explanation Pills */}
        {expanded && (
          <div className="mt-4 p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/20 space-y-2 text-xs">
            <h5 className="font-bold text-indigo-300">Why was this match suggested?</h5>
            <ul className="space-y-1.5 text-slate-300">
              <li className="flex items-center gap-2">
                {match.category_score >= 25 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-amber-400 shrink-0" />
                )}
                <span>
                  <strong>Category match:</strong> Both items categorized as "{lost.category}"
                </span>
              </li>
              <li className="flex items-center gap-2">
                {match.location_score >= 20 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                )}
                <span>
                  <strong>Location zone:</strong> Lost at "{lost.location}" vs found at "{found.location}"
                </span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>
                  <strong>TF-IDF text similarity:</strong> Keywords and naming patterns matched with {Math.round((match.description_score / 25) * 100)}% text alignment.
                </span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>
                  <strong>Date proximity:</strong> Reported within temporal range of each other.
                </span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
