import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { adminAPI } from '../../services/api'
import { 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ArrowLeft, 
  AlertCircle, 
  User, 
  Lock, 
  X,
  Sparkles,
  MapPin,
  Calendar,
  Tag,
  Hash,
  Copy,
  Check,
  Info,
  Layers,
  ArrowRight,
  HelpCircle,
  ImageIcon
} from 'lucide-react'

export default function AdminClaims() {
  const [claims, setClaims] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedClaim, setSelectedClaim] = useState(null)
  const [reviewNote, setReviewNote] = useState('')
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL') // ALL, PENDING, APPROVED, REJECTED
  const [copiedId, setCopiedId] = useState(null)

  const fetchClaims = async () => {
    setLoading(true)
    try {
      const res = await adminAPI.claims()
      setClaims(res.data || [])
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClaims()
  }, [])

  const handleReview = async (status) => {
    if (!selectedClaim) return
    setProcessing(true)
    setError('')

    try {
      await adminAPI.reviewClaim(selectedClaim.id, {
        status,
        admin_note: reviewNote || null,
      })
      setSelectedClaim(null)
      setReviewNote('')
      fetchClaims()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update claim review.')
    } finally {
      setProcessing(false)
    }
  }

  const copyToClipboard = (text, idKey) => {
    if (!text) return
    navigator.clipboard.writeText(text)
    setCopiedId(idKey)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const getMatchLabel = (score) => {
    if (score >= 80) return { text: 'Strong Match', color: 'emerald', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' }
    if (score >= 60) return { text: 'Possible Match', color: 'sky', bg: 'bg-sky-500/20 text-sky-300 border-sky-500/30' }
    if (score >= 40) return { text: 'Weak Match', color: 'amber', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/30' }
    return { text: 'Low Match', color: 'slate', bg: 'bg-slate-700/40 text-slate-300 border-slate-600/40' }
  }

  const getProgressColor = (val, max) => {
    const pct = max > 0 ? val / max : 0
    if (pct >= 0.8) return 'bg-emerald-500'
    if (pct >= 0.5) return 'bg-sky-500'
    if (pct >= 0.3) return 'bg-amber-500'
    return 'bg-slate-500'
  }

  const quickNotes = [
    "Serial numbers and proof description verified. Item ready for pickup at Main Campus Desk.",
    "Claimant identity and distinctive stickers match records. Approved for return.",
    "Distinctive features provided do not align with item details. Claim rejected.",
    "Insufficient proof of ownership provided. Please visit security desk with further evidence."
  ]

  const filteredClaims = claims.filter(c => {
    if (statusFilter === 'ALL') return true
    return c.status === statusFilter
  })

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      <Link to="/admin" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Admin Overview
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Claims Verification Queue</h1>
          <p className="text-xs text-slate-400 mt-1">
            Review complete correlation between Lost Reports, Found Reports, AI Matches, and Student Claims
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${statusFilter === 'ALL' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            All ({claims.length})
          </button>
          <button
            onClick={() => setStatusFilter('PENDING')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${statusFilter === 'PENDING' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Pending ({claims.filter(c => c.status === 'PENDING').length})
          </button>
          <button
            onClick={() => setStatusFilter('APPROVED')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${statusFilter === 'APPROVED' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Approved ({claims.filter(c => c.status === 'APPROVED').length})
          </button>
          <button
            onClick={() => setStatusFilter('REJECTED')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${statusFilter === 'REJECTED' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Rejected ({claims.filter(c => c.status === 'REJECTED').length})
          </button>
        </div>
      </div>

      {/* Claims List Queue */}
      {loading ? (
        <div className="card py-16 flex justify-center">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredClaims.length > 0 ? (
        <div className="space-y-4">
          {filteredClaims.map((claim) => {
            const match = claim.match
            const lostItem = claim.lost_item
            const foundItem = claim.item
            const matchScore = match ? Math.round(match.match_score) : null
            const matchBadge = matchScore !== null ? getMatchLabel(matchScore) : null

            return (
              <div key={claim.id} className="card p-6 border-slate-700 space-y-4 hover:border-indigo-500/50 transition-all duration-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-700/60">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-base font-bold text-white">
                        {foundItem?.item_name || 'Found Item'}
                      </span>
                      {claim.status === 'PENDING' ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> PENDING REVIEW
                        </span>
                      ) : claim.status === 'APPROVED' ? (
                        claim.is_otp_used ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> APPROVED • Collected & Returned
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-400" /> APPROVED • Collection: Pending at Main Security Desk
                          </span>
                        )
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                          <XCircle className="w-3 h-3" /> REJECTED
                        </span>
                      )}
                      {matchBadge && (
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border flex items-center gap-1 ${matchBadge.bg}`}>
                          <Sparkles className="w-3 h-3" /> {matchScore}% Match ({matchBadge.text})
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span>Found at: <strong className="text-slate-200">{foundItem?.location || 'Unknown'}</strong></span>
                      <span>•</span>
                      <span>Category: <strong className="text-slate-200">{foundItem?.category || 'General'}</strong></span>
                      <span>•</span>
                      <span>Date: <strong className="text-slate-200">{foundItem?.date_reported || 'N/A'}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => { setSelectedClaim(claim); setReviewNote(claim.admin_note || ''); }}
                      className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <FileText className="w-4 h-4" /> Review & Verify Claim
                    </button>
                  </div>
                </div>

                {/* Relationship Overview Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  {/* Claimant */}
                  <div className="p-3 bg-slate-850 rounded-xl border border-slate-750 space-y-1">
                    <span className="text-slate-400 flex items-center gap-1.5 font-semibold">
                      <User className="w-3.5 h-3.5 text-indigo-400" /> Claimant Student
                    </span>
                    <div className="text-white font-bold">{claim.claimant?.name || 'Student'}</div>
                    <div className="text-[11px] text-slate-400">
                      ID: <span className="text-slate-300 font-mono">{claim.claimant?.student_id || 'N/A'}</span> • {claim.claimant?.email}
                    </div>
                  </div>

                  {/* Matched Lost Report */}
                  <div className="p-3 bg-slate-850 rounded-xl border border-slate-750 space-y-1">
                    <span className="text-slate-400 flex items-center gap-1.5 font-semibold">
                      <Layers className="w-3.5 h-3.5 text-rose-400" /> Matched Lost Report
                    </span>
                    {lostItem ? (
                      <div>
                        <div className="text-white font-bold line-clamp-1">{lostItem.item_name}</div>
                        <div className="text-[11px] text-slate-400">
                          Lost at {lostItem.location} on {lostItem.date_reported}
                        </div>
                      </div>
                    ) : (
                      <div className="text-slate-400 italic">Direct claim (No prior lost report)</div>
                    )}
                  </div>

                  {/* Private Evidence Preview */}
                  <div className="p-3 bg-slate-850 rounded-xl border border-slate-750 space-y-1">
                    <span className="text-slate-400 flex items-center gap-1.5 font-semibold">
                      <Lock className="w-3.5 h-3.5 text-amber-400" /> Submitted Proof Preview
                    </span>
                    <p className="text-slate-200 line-clamp-2 italic font-mono text-[11px]">
                      "{claim.proof_description}"
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="card p-12 text-center space-y-3 bg-navy-800/60 border-dashed border-slate-700">
          <ShieldCheck className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No claims under this status</h3>
          <p className="text-xs text-slate-400">All submitted claims have been processed or queue is empty.</p>
        </div>
      )}

      {/* Comprehensive 5-Section Admin Review Modal */}
      {selectedClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-navy-950/85 backdrop-blur-md animate-fade-in">
          <div className="card w-full max-w-4xl bg-navy-900 border-slate-700 shadow-2xl relative max-h-[92vh] overflow-y-auto space-y-6 p-5 sm:p-8">
            {/* Close Button */}
            <button
              onClick={() => setSelectedClaim(null)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Title & Header */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2 border border-indigo-500/30">
                <Lock className="w-3.5 h-3.5" /> Administrative Ownership Verification
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Claim Verification: {selectedClaim.item?.item_name || 'Item'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Submitted on {new Date(selectedClaim.created_at).toLocaleDateString()} at {new Date(selectedClaim.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* ── VISUAL RELATIONSHIP PIPELINE ── */}
            <div className="p-4 rounded-2xl bg-slate-850/80 border border-slate-750 space-y-3">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-400" /> Verification Relationship Pipeline
              </div>
              <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
                {/* Step 1: Lost Report */}
                <div className="w-full md:w-1/3 p-3 bg-slate-900 rounded-xl border border-rose-500/30 space-y-1">
                  <div className="text-[10px] font-bold text-rose-400 uppercase">1. Lost Report</div>
                  <div className="text-white font-bold truncate">
                    {selectedClaim.lost_item?.item_name || 'No Prior Lost Report'}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    By: <span className="text-slate-200">{selectedClaim.claimant?.name}</span>
                  </div>
                </div>

                <div className="flex items-center text-slate-500 rotate-90 md:rotate-0">
                  <ArrowRight className="w-4 h-4" />
                </div>

                {/* Step 2: AI Match */}
                <div className="w-full md:w-1/3 p-3 bg-slate-900 rounded-xl border border-indigo-500/30 space-y-1">
                  <div className="text-[10px] font-bold text-indigo-400 uppercase">2. AI Match Radar</div>
                  <div className="text-white font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    {selectedClaim.match ? `${Math.round(selectedClaim.match.match_score)}% Correlation` : 'Direct Submission'}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {selectedClaim.match ? getMatchLabel(selectedClaim.match.match_score).text : 'No matching scan'}
                  </div>
                </div>

                <div className="flex items-center text-slate-500 rotate-90 md:rotate-0">
                  <ArrowRight className="w-4 h-4" />
                </div>

                {/* Step 3: Found Report */}
                <div className="w-full md:w-1/3 p-3 bg-slate-900 rounded-xl border border-emerald-500/30 space-y-1">
                  <div className="text-[10px] font-bold text-emerald-400 uppercase">3. Found Item Report</div>
                  <div className="text-white font-bold truncate">
                    {selectedClaim.item?.item_name || 'Found Item'}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    At: <span className="text-slate-200">{selectedClaim.item?.location}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ════════════════════════════════════════════════════════════════
                SECTION 1 — ITEM BEING CLAIMED (FOUND ITEM)
            ════════════════════════════════════════════════════════════════ */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-850/60 border border-slate-750 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-750 pb-2.5">
                <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs flex items-center justify-center font-black">1</span>
                  SECTION 1 — ITEM BEING CLAIMED (FOUND ITEM REPORT)
                </h3>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Status: {selectedClaim.item?.status || 'ACTIVE'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* Image if available */}
                {selectedClaim.item?.image_url ? (
                  <div className="relative rounded-xl overflow-hidden border border-slate-700 aspect-video md:aspect-auto max-h-40 bg-slate-900">
                    <img 
                      src={selectedClaim.item.image_url} 
                      alt={selectedClaim.item.item_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 flex flex-col items-center justify-center text-slate-500 gap-1 text-center">
                    <ImageIcon className="w-6 h-6" />
                    <span className="text-[10px]">No image uploaded</span>
                  </div>
                )}

                {/* Details Grid */}
                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-400 text-[11px] block">Found Item Name</span>
                    <span className="text-white font-bold text-sm">{selectedClaim.item?.item_name}</span>
                  </div>

                  <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-400 text-[11px] block">Category</span>
                    <span className="text-white font-semibold">{selectedClaim.item?.category}</span>
                  </div>

                  <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-400 text-[11px] block">Found Location</span>
                    <span className="text-white font-semibold flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      {selectedClaim.item?.location}
                    </span>
                  </div>

                  <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-400 text-[11px] block">Found Date & Time</span>
                    <span className="text-white font-semibold flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {selectedClaim.item?.date_reported} {selectedClaim.item?.time_reported ? `at ${selectedClaim.item.time_reported}` : ''}
                    </span>
                  </div>

                  <div className="sm:col-span-2 p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-400 text-[11px] block">Found Item Description</span>
                    <p className="text-slate-200 mt-0.5 leading-relaxed">
                      {selectedClaim.item?.description || 'No detailed description provided.'}
                    </p>
                  </div>

                  <div className="sm:col-span-2 p-2 bg-slate-900/60 rounded-xl border border-slate-800/80 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Hash className="w-3.5 h-3.5 text-slate-500" /> Item ID: <code className="text-slate-300 font-mono">{selectedClaim.item?.id}</code>
                    </span>
                    <button
                      onClick={() => copyToClipboard(selectedClaim.item?.id, 'found-id')}
                      className="p-1 hover:text-white text-slate-400 rounded transition-colors"
                      title="Copy ID"
                    >
                      {copiedId === 'found-id' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ════════════════════════════════════════════════════════════════
                SECTION 2 — MATCH INFORMATION (AI RADAR ANALYSIS)
            ════════════════════════════════════════════════════════════════ */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-850/60 border border-slate-750 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-750 pb-2.5">
                <h3 className="text-sm font-bold text-indigo-400 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs flex items-center justify-center font-black">2</span>
                  SECTION 2 — AI MATCH INFORMATION & SIMILARITY RADAR
                </h3>
                {selectedClaim.match && (
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${getMatchLabel(selectedClaim.match.match_score).bg}`}>
                    {getMatchLabel(selectedClaim.match.match_score).text}
                  </span>
                )}
              </div>

              {selectedClaim.match ? (
                <div className="space-y-4">
                  {/* Overall Score Banner */}
                  <div className="p-3.5 bg-indigo-950/30 border border-indigo-500/30 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
                      <div>
                        <div className="text-sm font-bold text-white">
                          Overall Semantic Match: {Math.round(selectedClaim.match.match_score)}%
                        </div>
                        <div className="text-[11px] text-indigo-300">
                          Classification: {getMatchLabel(selectedClaim.match.match_score).text}
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-[11px] text-slate-400 font-mono">
                      Match ID: {selectedClaim.match.id?.slice(0, 8)}...
                    </div>
                  </div>

                  {/* 5-Score Breakdown Progress Bars */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
                    {/* Item Identity */}
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <div className="flex justify-between text-slate-400 mb-1">
                        <span className="text-[11px]">Item Identity</span>
                        <span className="font-bold text-white">{Math.round(selectedClaim.match.name_score ?? 0)}/30</span>
                      </div>
                      <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getProgressColor(selectedClaim.match.name_score ?? 0, 30)}`}
                          style={{ width: `${((selectedClaim.match.name_score ?? 0) / 30) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Category */}
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <div className="flex justify-between text-slate-400 mb-1">
                        <span className="text-[11px]">Category</span>
                        <span className="font-bold text-white">{Math.round(selectedClaim.match.category_score)}/20</span>
                      </div>
                      <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getProgressColor(selectedClaim.match.category_score, 20)}`}
                          style={{ width: `${(selectedClaim.match.category_score / 20) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <div className="flex justify-between text-slate-400 mb-1">
                        <span className="text-[11px]">Location</span>
                        <span className="font-bold text-white">{Math.round(selectedClaim.match.location_score)}/20</span>
                      </div>
                      <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getProgressColor(selectedClaim.match.location_score, 20)}`}
                          style={{ width: `${(selectedClaim.match.location_score / 20) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <div className="flex justify-between text-slate-400 mb-1">
                        <span className="text-[11px]">Description</span>
                        <span className="font-bold text-white">{Math.round(selectedClaim.match.description_score)}/20</span>
                      </div>
                      <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getProgressColor(selectedClaim.match.description_score, 20)}`}
                          style={{ width: `${(selectedClaim.match.description_score / 20) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Date Proximity */}
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <div className="flex justify-between text-slate-400 mb-1">
                        <span className="text-[11px]">Date Proximity</span>
                        <span className="font-bold text-white">{Math.round(selectedClaim.match.date_score)}/10</span>
                      </div>
                      <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getProgressColor(selectedClaim.match.date_score, 10)}`}
                          style={{ width: `${(selectedClaim.match.date_score / 10) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-center gap-2.5">
                  <Info className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>
                    <strong>Direct Claim:</strong> The student initiated this claim directly (via Search or Found Directory) rather than from an automated radar match alert.
                  </span>
                </div>
              )}

              {/* Matching Engine Protocol Disclaimer */}
              <div className="p-3 bg-amber-950/25 border border-amber-500/25 rounded-xl flex items-start gap-2.5 text-xs text-amber-200/90">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong>Verification Protocol:</strong> The AI matching engine only correlates report parameters to identify a candidate relationship. It does <u>NOT</u> prove legal ownership. Claim approval must be made by evaluating the claimant's confidential evidence below.
                </div>
              </div>
            </div>

            {/* ════════════════════════════════════════════════════════════════
                SECTION 3 — CLAIMANT'S ORIGINAL LOST REPORT
            ════════════════════════════════════════════════════════════════ */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-850/60 border border-slate-750 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-750 pb-2.5">
                <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-300 text-xs flex items-center justify-center font-black">3</span>
                  SECTION 3 — CLAIMANT'S LOST REPORT & STUDENT IDENTITY
                </h3>
                <span className="text-xs text-slate-400">
                  Student: <strong className="text-white">{selectedClaim.claimant?.name}</strong>
                </span>
              </div>

              {/* Student Identity Card */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[11px] block">Claimant Full Name</span>
                  <span className="text-white font-bold text-sm">{selectedClaim.claimant?.name}</span>
                </div>
                <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[11px] block">Student ID</span>
                  <span className="text-white font-mono font-bold text-sm">{selectedClaim.claimant?.student_id || 'N/A'}</span>
                </div>
                <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[11px] block">Contact Email</span>
                  <span className="text-slate-200 font-mono truncate block">{selectedClaim.claimant?.email}</span>
                </div>
              </div>

              {/* Lost Item Details */}
              {selectedClaim.lost_item ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-1">
                  {selectedClaim.lost_item.image_url ? (
                    <div className="relative rounded-xl overflow-hidden border border-slate-700 aspect-video md:aspect-auto max-h-40 bg-slate-900">
                      <img 
                        src={selectedClaim.lost_item.image_url} 
                        alt={selectedClaim.lost_item.item_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 flex flex-col items-center justify-center text-slate-500 gap-1 text-center">
                      <ImageIcon className="w-6 h-6" />
                      <span className="text-[10px]">No lost-item image</span>
                    </div>
                  )}

                  <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-slate-400 text-[11px] block">Lost Item Name</span>
                      <span className="text-white font-bold">{selectedClaim.lost_item.item_name}</span>
                    </div>

                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-slate-400 text-[11px] block">Lost Category</span>
                      <span className="text-white font-semibold">{selectedClaim.lost_item.category}</span>
                    </div>

                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-slate-400 text-[11px] block">Lost Location</span>
                      <span className="text-white font-semibold flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-rose-400" />
                        {selectedClaim.lost_item.location}
                      </span>
                    </div>

                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-slate-400 text-[11px] block">Lost Date & Time</span>
                      <span className="text-white font-semibold flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {selectedClaim.lost_item.date_reported} {selectedClaim.lost_item.time_reported ? `at ${selectedClaim.lost_item.time_reported}` : ''}
                      </span>
                    </div>

                    <div className="sm:col-span-2 p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-slate-400 text-[11px] block">Lost Item Description</span>
                      <p className="text-slate-200 mt-0.5 leading-relaxed">
                        {selectedClaim.lost_item.description || 'No description in lost report.'}
                      </p>
                    </div>

                    <div className="sm:col-span-2 p-2 bg-slate-900/60 rounded-xl border border-slate-800/80 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Hash className="w-3.5 h-3.5 text-slate-500" /> Lost Report ID: <code className="text-slate-300 font-mono">{selectedClaim.lost_item.id}</code>
                      </span>
                      <button
                        onClick={() => copyToClipboard(selectedClaim.lost_item.id, 'lost-id')}
                        className="p-1 hover:text-white text-slate-400 rounded transition-colors"
                        title="Copy ID"
                      >
                        {copiedId === 'lost-id' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 text-xs text-slate-400">
                  <div className="font-semibold text-slate-300">No Preceding Lost Item Report on File</div>
                  <p className="mt-1 text-slate-400">
                    The student has submitted this claim directly for the found item without creating a prior Lost report. Verify ownership using Section 4 evidence.
                  </p>
                </div>
              )}
            </div>

            {/* ════════════════════════════════════════════════════════════════
                SECTION 4 — CLAIMANT'S CONFIDENTIAL OWNERSHIP EVIDENCE
            ════════════════════════════════════════════════════════════════ */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-850/60 border border-slate-750 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-750 pb-2.5">
                <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 text-xs flex items-center justify-center font-black">4</span>
                  SECTION 4 — CLAIMANT'S CONFIDENTIAL OWNERSHIP EVIDENCE
                </h3>
                <span className="flex items-center gap-1 text-[11px] text-amber-400/90 font-semibold">
                  <Lock className="w-3.5 h-3.5" /> Confidential Admin Access
                </span>
              </div>

              <div className="space-y-3 text-xs">
                {/* Proof Description */}
                <div className="p-3.5 bg-slate-900 rounded-xl border border-amber-500/30 space-y-1.5">
                  <span className="text-amber-300 font-bold flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-amber-400" /> Proof of Ownership / Distinctive Description:
                  </span>
                  <p className="text-white leading-relaxed text-sm bg-slate-950 p-3 rounded-lg border border-slate-800 font-medium">
                    {selectedClaim.proof_description}
                  </p>
                </div>

                {/* Distinctive Identifiers */}
                {selectedClaim.distinctive_features && (
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-indigo-300 font-bold flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-indigo-400" /> Distinctive Identifiers (Serial #, Stickers, Marks):
                    </span>
                    <p className="text-slate-100 font-mono bg-slate-950 p-2 rounded border border-slate-800">
                      {selectedClaim.distinctive_features}
                    </p>
                  </div>
                )}

                {/* Approximate Time Misplaced */}
                {selectedClaim.approximate_time && (
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-indigo-300 font-bold flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" /> Approximate Time / Date Misplaced:
                    </span>
                    <p className="text-slate-100 bg-slate-950 p-2 rounded border border-slate-800">
                      {selectedClaim.approximate_time}
                    </p>
                  </div>
                )}

                {/* Additional Notes */}
                {selectedClaim.additional_info && (
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-indigo-300 font-bold flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-indigo-400" /> Additional Notes for Reviewer:
                    </span>
                    <p className="text-slate-100 bg-slate-950 p-2 rounded border border-slate-800">
                      {selectedClaim.additional_info}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* ════════════════════════════════════════════════════════════════
                SECTION 5 — ADMIN DECISION & ACTIONS
            ════════════════════════════════════════════════════════════════ */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-850/80 border border-slate-750 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-750 pb-2.5">
                <h3 className="text-sm font-bold text-sky-400 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-300 text-xs flex items-center justify-center font-black">5</span>
                  SECTION 5 — ADMIN DECISION & ACTIONS
                </h3>
                {selectedClaim.reviewed_at && (
                  <span className="text-[11px] text-slate-400">
                    Last reviewed on {new Date(selectedClaim.reviewed_at).toLocaleDateString()}
                  </span>
                )}
              </div>

              {/* Quick Note Presets */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Quick Response Templates:
                </label>
                <div className="flex flex-wrap gap-2">
                  {quickNotes.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setReviewNote(preset)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] border border-slate-700 transition-colors cursor-pointer text-left"
                    >
                      {preset.slice(0, 45)}...
                    </button>
                  ))}
                </div>
              </div>

              {/* Admin Note Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Admin Review Decision Note (Sent to Student Claimant):
                </label>
                <textarea
                  rows={3}
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  placeholder="e.g. Serial numbers and description verified. Please bring your student ID to the Main Security Desk to pick up your item."
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 leading-relaxed"
                />
              </div>

              {/* Action Controls */}
              <div className="pt-3 border-t border-slate-750 flex flex-wrap gap-3 justify-end items-center">
                <button
                  type="button"
                  onClick={() => setSelectedClaim(null)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  disabled={processing}
                  onClick={() => handleReview('REJECTED')}
                  className="px-4 py-2.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <XCircle className="w-4 h-4" /> Reject Claim
                </button>
                <button
                  type="button"
                  disabled={processing}
                  onClick={() => handleReview('APPROVED')}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" /> Approve & Mark Returned
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
