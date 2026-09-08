import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { matchesAPI } from '../services/api'
import MatchCard from '../components/MatchCard'
import ClaimModal from '../components/ClaimModal'
import { Sparkles, ArrowLeft, Filter, AlertCircle, Info } from 'lucide-react'

export default function Matches() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL') // ALL, STRONG, MODERATE
  const [selectedClaimItem, setSelectedClaimItem] = useState(null)

  const fetchMatches = async () => {
    setLoading(true)
    try {
      const res = await matchesAPI.list()
      setMatches(res.data || [])
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMatches()
  }, [])

  const filteredMatches = matches.filter(m => {
    if (filter === 'STRONG') return m.match_score >= 70
    if (filter === 'MODERATE') return m.match_score >= 50 && m.match_score < 70
    return true
  })

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      {/* Header Banner */}
      <div className="card bg-gradient-to-r from-navy-800 via-indigo-950/30 to-navy-800 border-slate-700 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-2 border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5" /> TF-IDF AI Matching Radar
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Smart Match Radar</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Our multi-parameter engine correlates Category (30%), Location Zone (25%), Text Similarity (25%), and Date Proximity (20%) to identify potential recoveries for your lost items.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex bg-slate-850 p-1 rounded-xl border border-slate-750 text-xs">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${filter === 'ALL' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            All Leads ({matches.length})
          </button>
          <button
            onClick={() => setFilter('STRONG')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${filter === 'STRONG' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            High Match ≥70% ({matches.filter(m => m.match_score >= 70).length})
          </button>
          <button
            onClick={() => setFilter('MODERATE')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${filter === 'MODERATE' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Possible 50-70% ({matches.filter(m => m.match_score >= 50 && m.match_score < 70).length})
          </button>
        </div>
      </div>

      {/* Info Notice */}
      <div className="p-3.5 rounded-xl bg-slate-850 border border-slate-750 flex items-center gap-2.5 text-xs text-slate-300">
        <Info className="w-4 h-4 text-indigo-400 shrink-0" />
        <span>
          <strong>Important Security Protocol:</strong> A high match score does not automatically approve ownership. When you find your item, click <strong>"Claim This Item"</strong> to submit confidential verification details for admin approval.
        </span>
      </div>

      {/* Matches List */}
      {loading ? (
        <div className="card py-16 flex justify-center">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredMatches.length > 0 ? (
        <div className="space-y-4">
          {filteredMatches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              onClaim={(foundItem) => setSelectedClaimItem(foundItem)}
            />
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center space-y-3 bg-navy-800/60 border-dashed border-slate-700">
          <Sparkles className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No active matches found under this filter</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try switching filter to "All Leads" or report another lost item to activate new radar scans.
          </p>
        </div>
      )}

      {/* Claim Modal */}
      <ClaimModal
        item={selectedClaimItem}
        isOpen={!!selectedClaimItem}
        onClose={() => setSelectedClaimItem(null)}
        onSuccess={fetchMatches}
      />
    </div>
  )
}
