import React, { useState } from 'react'
import { Shield, X, AlertCircle, CheckCircle2, Lock } from 'lucide-react'
import { claimsAPI } from '../services/api'

export default function ClaimModal({ item, isOpen, onClose, onSuccess }) {
  const [proofDescription, setProofDescription] = useState('')
  const [distinctiveFeatures, setDistinctiveFeatures] = useState('')
  const [approximateTime, setApproximateTime] = useState('')
  const [additionalInfo, setAdditionalInfo] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  if (!isOpen || !item) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
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
      setSuccessMessage('Claim submitted successfully! Campus admins have been notified.')
      setTimeout(() => {
        setSuccessMessage('')
        if (onSuccess) onSuccess()
        onClose()
      }, 1800)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit claim. You may already have a pending claim for this item.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-fade-in">
      <div className="card w-full max-w-lg bg-navy-900 border-slate-700 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Claim Ownership</h3>
            <p className="text-xs text-slate-400">
              Claiming: <span className="text-indigo-300 font-semibold">{item.item_name}</span> found at <span className="text-slate-300">{item.location}</span>
            </p>
          </div>
        </div>

        {/* Privacy Alert */}
        <div className="p-3 mb-4 rounded-xl bg-indigo-950/40 border border-indigo-500/20 flex items-start gap-2.5 text-xs text-slate-300">
          <Lock className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <span>
            <strong>Confidential Verification:</strong> The details you provide here are private and only accessible to Campus Administrators to verify true ownership before item handover.
          </span>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-rose-950/40 border border-rose-500/30 flex items-center gap-2 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 mb-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-300">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Proof of Ownership / Item Description <span className="text-rose-400">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={proofDescription}
              onChange={(e) => setProofDescription(e.target.value)}
              placeholder="Describe specific details only the true owner would know (e.g., brand model, contents inside, color of case, wallpaper, passwords, receipts)..."
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Distinctive Identifiers / Scratches / Stickers (Optional)
            </label>
            <input
              type="text"
              value={distinctiveFeatures}
              onChange={(e) => setDistinctiveFeatures(e.target.value)}
              placeholder="e.g. Serial #12345, yellow smiley sticker, cracked bottom left edge"
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Approximate Time / Date Misplaced (Optional)
            </label>
            <input
              type="text"
              value={approximateTime}
              onChange={(e) => setApproximateTime(e.target.value)}
              placeholder="e.g. Yesterday afternoon around 2:30 PM after CS Lecture"
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Additional Notes for Reviewer (Optional)
            </label>
            <input
              type="text"
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              placeholder="e.g. Can meet security desk between 10am - 4pm"
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {loading ? 'Submitting...' : 'Submit Claim Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
