import React, { useState } from 'react'
import { Shield, X, AlertCircle, CheckCircle2, Lock } from 'lucide-react'
import { claimsAPI } from '../services/api'
import useModalExit from '../hooks/useModalExit'

export default function ClaimModal({ item, isOpen, onClose, onSuccess }) {
  const [proofDescription, setProofDescription] = useState('')
  const [distinctiveFeatures, setDistinctiveFeatures] = useState('')
  const [approximateTime, setApproximateTime] = useState('')
  const [additionalInfo, setAdditionalInfo] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const { closing, handleClose } = useModalExit(onClose)

  if (!isOpen || !item) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (loading) return
    if (!proofDescription.trim()) {
      setError('Please provide a proof description to verify ownership.')
      return
    }

    setLoading(true)
    setError('')

    try {
      await claimsAPI.submit({
        item_id: item.id,
        proof_description: proofDescription,
        distinctive_features: distinctiveFeatures || null,
        approximate_time: approximateTime || null,
        additional_info: additionalInfo || null,
      })
      setSuccessMessage('Claim submitted successfully! Campus administrators have been notified.')
      setTimeout(() => {
        setSuccessMessage('')
        if (onSuccess) onSuccess()
        handleClose()
      }, 1600)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit claim. You may already have a pending claim for this item.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs modal-overlay ${closing ? 'is-closing' : ''}`}>
      <div className={`card w-full max-w-lg bg-white border-slate-200 shadow-xl relative max-h-[90vh] overflow-y-auto p-6 sm:p-7 space-y-4 modal-panel ${closing ? 'is-closing' : ''}`}>
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center shadow-xs">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Claim Ownership</h3>
            <p className="text-xs text-slate-500">
              Claiming: <span className="text-indigo-600 font-bold">{item.item_name}</span> found at <span className="text-slate-700 font-semibold">{item.location}</span>
            </p>
          </div>
        </div>

        {/* Privacy Alert */}
        <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-100 flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
          <Lock className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <span>
            <strong>Confidential Verification:</strong> The details you provide here are private and only accessible to Campus Administrators to verify true ownership before item handover.
          </span>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs text-rose-700 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-800 font-bold animate-slide-up">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Proof of Ownership / Item Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={proofDescription}
              onChange={(e) => setProofDescription(e.target.value)}
              placeholder="Describe specific details only the true owner would know (e.g., brand model, contents inside, color of case, wallpaper, passwords, receipts)..."
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 transition-all shadow-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Distinctive Identifiers / Scratches / Stickers (Optional)
            </label>
            <input
              type="text"
              value={distinctiveFeatures}
              onChange={(e) => setDistinctiveFeatures(e.target.value)}
              placeholder="e.g. Serial #12345, yellow smiley sticker, cracked bottom left edge"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 transition-all shadow-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Approximate Time / Date Misplaced (Optional)
            </label>
            <input
              type="text"
              value={approximateTime}
              onChange={(e) => setApproximateTime(e.target.value)}
              placeholder="e.g. Yesterday afternoon around 2:30 PM after CS Lecture"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 transition-all shadow-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Additional Notes for Reviewer (Optional)
            </label>
            <input
              type="text"
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              placeholder="e.g. Can meet security desk between 10am - 4pm"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 transition-all shadow-xs"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !!successMessage}
              className="btn-sheen px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                'Submit Claim Request'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
