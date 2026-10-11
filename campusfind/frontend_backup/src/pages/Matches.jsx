import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { matchesAPI } from '../services/api'
import MatchCard from '../components/MatchCard'
import ClaimModal from '../components/ClaimModal'
import { Sparkles, ArrowLeft, Info, ShieldCheck } from 'lucide-react'

export default function Matches() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL') // ALL, STRONG, POSSIBLE
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
    if (filter === 'STRONG') return m.match_score >= 80
    if (filter === 'POSSIBLE') return m.match_score >= 60 && m.match_score < 80
    return true
  })

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      <Link 
        to="/dashboard" 
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      {/* Header Banner */}
<<<<<<< HEAD
      <div className="card reveal bg-gradient-to-r from-navy-800 via-indigo-950/30 to-navy-800 border-slate-700 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
=======
      <div className="card bg-white border-slate-200/90 shadow-sm p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-5">
>>>>>>> 13ba826 (feat: complete premium SaaS frontend redesign)
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold mb-2.5 border border-amber-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Semantic Item Matching Radar
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Smart Match Radar</h1>
          <p className="text-xs text-slate-600 mt-1 max-w-xl leading-relaxed">
            Our multi-parameter engine correlates Item Identity (30%), Category (20%), Location Zone (20%), Description (20%), and Chronological Proximity (10%) to identify potential recoveries.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs font-bold w-fit">
          <button
            onClick={() => setFilter('ALL')}
<<<<<<< HEAD
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all duration-200 cursor-pointer ${filter === 'ALL' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-750'}`}
=======
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              filter === 'ALL' 
                ? 'bg-white text-indigo-700 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
>>>>>>> 13ba826 (feat: complete premium SaaS frontend redesign)
          >
            All Leads ({matches.length})
          </button>
          <button
            onClick={() => setFilter('STRONG')}
<<<<<<< HEAD
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all duration-200 cursor-pointer ${filter === 'STRONG' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-750'}`}
=======
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              filter === 'STRONG' 
                ? 'bg-white text-emerald-700 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
>>>>>>> 13ba826 (feat: complete premium SaaS frontend redesign)
          >
            Strong Match ≥80% ({matches.filter(m => m.match_score >= 80).length})
          </button>
          <button
            onClick={() => setFilter('POSSIBLE')}
<<<<<<< HEAD
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all duration-200 cursor-pointer ${filter === 'POSSIBLE' ? 'bg-sky-600 text-white shadow-md shadow-sky-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-750'}`}
=======
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              filter === 'POSSIBLE' 
                ? 'bg-white text-sky-700 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
>>>>>>> 13ba826 (feat: complete premium SaaS frontend redesign)
          >
            Possible 60–79% ({matches.filter(m => m.match_score >= 60 && m.match_score < 80).length})
          </button>
        </div>
      </div>

      {/* Info Notice */}
<<<<<<< HEAD
      <div className="p-3.5 rounded-xl bg-slate-850 border border-slate-750 flex items-center gap-2.5 text-xs text-slate-300 reveal delay-1">
        <Info className="w-4 h-4 text-indigo-400 shrink-0" />
=======
      <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-center gap-3 text-xs text-slate-700">
        <Info className="w-4 h-4 text-indigo-600 shrink-0" />
>>>>>>> 13ba826 (feat: complete premium SaaS frontend redesign)
        <span>
          <strong>Security Verification Protocol:</strong> A high match score indicates property compatibility. To claim an item, click <strong>"Claim This Item"</strong> to submit confidential ownership evidence for administrator review.
        </span>
      </div>

      {/* Matches List */}
      {loading ? (
        <div className="card py-16 flex justify-center bg-white">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredMatches.length > 0 ? (
        <div className="space-y-4">
          {filteredMatches.map((match, idx) => (
            <div key={match.id} className={`reveal delay-${(idx % 8) + 1}`}>
              <MatchCard
                match={match}
                onClaim={(foundItem) => setSelectedClaimItem(foundItem)}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center space-y-3 bg-white border-dashed border-slate-300">
          <Sparkles className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No active matches found under this filter</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            Try switching filter to "All Leads" or report another lost item to activate new radar scans across the campus database.
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
