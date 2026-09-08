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
  MessageSquare
} from 'lucide-react'

export default function AdminClaims() {
  const [claims, setClaims] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedClaim, setSelectedClaim] = useState(null)
  const [reviewNote, setReviewNote] = useState('')
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL') // ALL, PENDING, APPROVED, REJECTED

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
            Review confidential ownership proofs and approve item handovers
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${statusFilter === 'ALL' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            All ({claims.length})
          </button>
          <button
            onClick={() => setStatusFilter('PENDING')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${statusFilter === 'PENDING' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Pending ({claims.filter(c => c.status === 'PENDING').length})
          </button>
          <button
            onClick={() => setStatusFilter('APPROVED')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${statusFilter === 'APPROVED' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Approved ({claims.filter(c => c.status === 'APPROVED').length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="card py-16 flex justify-center">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredClaims.length > 0 ? (
        <div className="space-y-4">
          {filteredClaims.map((claim) => (
            <div key={claim.id} className="card p-6 border-slate-700 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-700">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-white">
                      {claim.item?.item_name || 'Item'}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      claim.status === 'PENDING' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      claim.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}>
                      {claim.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Found at: <span className="text-slate-200">{claim.item?.location}</span> • Category: <span className="text-slate-200">{claim.item?.category}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setSelectedClaim(claim); setReviewNote(claim.admin_note || ''); }}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" /> Inspect Proof & Review
                  </button>
                </div>
              </div>

              {/* Claimant + Confidential Proof Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-850 rounded-xl border border-slate-750 space-y-1">
                  <span className="text-slate-400 flex items-center gap-1"><User className="w-3.5 h-3.5 text-indigo-400" /> Claimant</span>
                  <div className="text-white font-semibold">{claim.claimant?.name || 'Student'}</div>
                  <div className="text-[11px] text-slate-400">{claim.claimant?.email} • ID: {claim.claimant?.student_id || 'N/A'}</div>
                </div>

                <div className="p-3 bg-slate-850 rounded-xl border border-slate-750 space-y-1 sm:col-span-2">
                  <span className="text-slate-400 flex items-center gap-1"><Lock className="w-3.5 h-3.5 text-amber-400" /> Private Proof Details</span>
                  <p className="text-slate-200 line-clamp-2">{claim.proof_description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center space-y-3 bg-navy-800/60 border-dashed border-slate-700">
          <ShieldCheck className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No claims under this status</h3>
          <p className="text-xs text-slate-400">All submitted claims have been processed or queue is empty.</p>
        </div>
      )}

      {/* Review Modal */}
      {selectedClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-fade-in">
          <div className="card w-full max-w-xl bg-navy-900 border-slate-700 shadow-2xl p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto space-y-6">
            <button
              onClick={() => setSelectedClaim(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2 border border-indigo-500/30">
                <Lock className="w-3.5 h-3.5" /> Confidential Claim Verification
              </div>
              <h2 className="text-xl font-bold text-white">
                Claim Review: {selectedClaim.item?.item_name}
              </h2>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-xs text-rose-300">
                {error}
              </div>
            )}

            {/* Proof Answers Breakdown */}
            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-slate-850 rounded-xl border border-slate-750 space-y-1">
                <span className="text-slate-400 font-semibold">Claimant Information:</span>
                <div className="text-white text-sm font-bold">{selectedClaim.claimant?.name}</div>
                <div className="text-slate-400">{selectedClaim.claimant?.email} (ID: {selectedClaim.claimant?.student_id})</div>
              </div>

              <div className="p-3.5 bg-slate-850 rounded-xl border border-slate-750 space-y-1.5">
                <span className="text-indigo-300 font-bold">Proof of Ownership / Distinctive Description:</span>
                <p className="text-white leading-relaxed text-sm bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  {selectedClaim.proof_description}
                </p>
              </div>

              {selectedClaim.distinctive_features && (
                <div className="p-3.5 bg-slate-850 rounded-xl border border-slate-750 space-y-1">
                  <span className="text-indigo-300 font-bold">Distinctive Identifiers (Serial / Stickers):</span>
                  <p className="text-white">{selectedClaim.distinctive_features}</p>
                </div>
              )}

              {selectedClaim.approximate_time && (
                <div className="p-3.5 bg-slate-850 rounded-xl border border-slate-750 space-y-1">
                  <span className="text-indigo-300 font-bold">Approximate Time Misplaced:</span>
                  <p className="text-white">{selectedClaim.approximate_time}</p>
                </div>
              )}

              {selectedClaim.additional_info && (
                <div className="p-3.5 bg-slate-850 rounded-xl border border-slate-750 space-y-1">
                  <span className="text-indigo-300 font-bold">Additional Notes:</span>
                  <p className="text-white">{selectedClaim.additional_info}</p>
                </div>
              )}
            </div>

            {/* Admin Note Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Admin Review Decision Note (Sent to Student)
              </label>
              <textarea
                rows={2}
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
                placeholder="e.g. Serial numbers verified. Please collect from Main Library desk."
                className="w-full px-3.5 py-2.5 bg-slate-850 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-700 flex flex-wrap gap-3 justify-end">
              <button
                type="button"
                onClick={() => setSelectedClaim(null)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={processing}
                onClick={() => handleReview('REJECTED')}
                className="px-4 py-2.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <XCircle className="w-4 h-4" /> Reject Claim
              </button>
              <button
                type="button"
                disabled={processing}
                onClick={() => handleReview('APPROVED')}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" /> Approve & Mark Returned
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
