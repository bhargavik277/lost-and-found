import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { claimsAPI } from '../services/api'
import { 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft, 
  AlertCircle, 
  FileText, 
  Building2, 
  KeyRound, 
  RefreshCw 
} from 'lucide-react'

export default function Claims() {
  const [claims, setClaims] = useState([])
  const [loading, setLoading] = useState(true)
  const [regeneratingId, setRegeneratingId] = useState(null)
  const [regenMsg, setRegenMsg] = useState(null)

  const fetchClaims = async () => {
    setLoading(true)
    try {
      const res = await claimsAPI.myClaims()
      setClaims(res.data || [])
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  const handleRegenerateOtp = async (claimId) => {
    setRegeneratingId(claimId)
    setRegenMsg(null)
    try {
      const res = await claimsAPI.regenerateOtp(claimId)
      setRegenMsg({ type: 'success', text: 'New 6-digit Collection OTP generated successfully!' })
      setClaims((prev) =>
        prev.map((c) =>
          c.id === claimId
            ? { ...c, otp_plain: res.data.otp, otp_expires_at: res.data.expires_at, is_otp_used: false }
            : c
        )
      )
    } catch (err) {
      setRegenMsg({
        type: 'error',
        text: err.response?.data?.detail || 'Failed to regenerate OTP. Please try again.',
      })
    } finally {
      setRegeneratingId(null)
    }
  }

  useEffect(() => {
    fetchClaims()
  }, [])

  const statusBadges = {
    PENDING: {
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: <Clock className="w-3.5 h-3.5 text-amber-600" />,
      label: 'Under Admin Review',
    },
    APPROVED: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
      label: 'Claim Approved! Ready for Pickup',
    },
    REJECTED: {
      bg: 'bg-rose-50 text-rose-700 border-rose-200',
      icon: <XCircle className="w-3.5 h-3.5 text-rose-600" />,
      label: 'Claim Not Approved',
    },
  }

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      <Link 
        to="/dashboard" 
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">My Ownership Claims</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track verification status for items you have claimed from campus found reports
          </p>
        </div>
      </div>

      {regenMsg && (
        <div className={`p-3.5 rounded-xl border text-xs flex items-center justify-between gap-2 animate-slide-down ${
          regenMsg.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
            : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          <div className="flex items-center gap-2">
            {regenMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" /> : <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />}
            <span className="font-semibold">{regenMsg.text}</span>
          </div>
          <button onClick={() => setRegenMsg(null)} className="text-[11px] font-bold underline cursor-pointer hover:opacity-80">
            Dismiss
          </button>
        </div>
      )}

      {loading ? (
        <div className="card py-16 flex justify-center bg-white">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : claims.length > 0 ? (
        <div className="space-y-4">
          {claims.map((claim, idx) => {
            const badge = statusBadges[claim.status] || statusBadges.PENDING
            const item = claim.item
            return (
<<<<<<< HEAD
              <div key={claim.id} className={`card p-6 border-slate-700 space-y-4 reveal delay-${(idx % 8) + 1} transition-all duration-300 hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/5`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-700/60">
=======
              <div key={claim.id} className="card bg-white border-slate-200/90 shadow-xs p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-100">
>>>>>>> 13ba826 (feat: complete premium SaaS frontend redesign)
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Claim for Found Item</span>
                    <h3 className="text-base font-bold text-slate-900">{item?.item_name || 'Item'}</h3>
                  </div>
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border ${badge.bg}`}>
                    {badge.icon}
                    <span>{badge.label}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-0.5">
                    <span className="text-slate-500 font-medium text-[11px]">Item Location & Category</span>
                    <div className="text-slate-900 font-bold">{item?.location} • {item?.category}</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-0.5">
                    <span className="text-slate-500 font-medium text-[11px]">Submitted On</span>
                    <div className="text-slate-900 font-semibold">
                      {new Date(claim.created_at).toLocaleDateString()} at {new Date(claim.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>

                {claim.admin_note && (
                  <div className="p-3.5 bg-indigo-50 border border-indigo-100 rounded-xl text-xs space-y-1">
                    <div className="font-bold text-indigo-900">Admin Response Note:</div>
                    <p className="text-slate-700 leading-relaxed">{claim.admin_note}</p>
                  </div>
                )}

                {claim.status === 'APPROVED' && (
                  !claim.is_otp_used ? (
<<<<<<< HEAD
                    <div className="p-4 bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/40 rounded-2xl text-xs text-emerald-200 space-y-3 shadow-lg halo-pulse">
                      <div className="flex items-center justify-between gap-2">
=======
                    <div className="p-5 bg-gradient-to-br from-emerald-50/80 via-white to-amber-50/50 border border-emerald-200 rounded-2xl text-xs space-y-4 shadow-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
>>>>>>> 13ba826 (feat: complete premium SaaS frontend redesign)
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                          <span className="font-bold text-sm text-emerald-900">Claim Approved — Ready for Pickup!</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRegenerateOtp(claim.id)}
                          disabled={regeneratingId === claim.id}
                          className="px-3 py-1.5 bg-white hover:bg-amber-50 text-amber-700 border border-amber-300 rounded-lg font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-xs"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${regeneratingId === claim.id ? 'animate-spin' : ''}`} />
                          {regeneratingId === claim.id ? 'Regenerating...' : 'Regenerate OTP'}
                        </button>
                      </div>

                      <div className="p-5 bg-white rounded-xl border border-amber-200 text-center space-y-2 shadow-xs">
                        <div className="text-[11px] uppercase tracking-wider text-slate-500 font-bold flex items-center justify-center gap-1.5">
                          <KeyRound className="w-4 h-4 text-amber-600" /> Your Collection OTP
                        </div>
<<<<<<< HEAD
                        <div className="text-2xl font-mono font-bold tracking-[0.25em] text-amber-400 count-emphasis">
=======
                        <div className="text-3xl font-mono font-black tracking-[0.25em] text-slate-900 bg-amber-50 py-2 rounded-lg border border-amber-100 inline-block px-6">
>>>>>>> 13ba826 (feat: complete premium SaaS frontend redesign)
                          {claim.otp_plain || 'Available at Desk'}
                        </div>
                        <div className="text-xs text-slate-600 font-medium">
                          Present this 6-digit code along with your Student ID at the Main Security Desk
                        </div>
                        {claim.otp_expires_at && (
                          <div className="text-[11px] text-slate-500">
                            Valid until: <span className="font-semibold text-slate-700">{new Date(claim.otp_expires_at).toLocaleString()}</span>
                          </div>
                        )}
                      </div>

                      <div className="text-xs text-slate-700 flex items-center gap-2 pt-1 font-medium">
                        <Building2 className="w-4 h-4 text-indigo-600 shrink-0" />
                        <span><strong>Collection Station:</strong> Main Campus Security Desk (Administration Building, Room 102)</span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2.5 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <strong>Item Handover Complete:</strong> You verified ownership and collected this item from the Main Security Desk. Status is <strong>RETURNED</strong>.
                      </div>
                    </div>
                  )
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="card p-12 text-center space-y-3 bg-white border-dashed border-slate-300">
          <ShieldCheck className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No ownership claims submitted yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            When you locate a found item in Search or Match Radar, click "Claim This Item" to start the verification process.
          </p>
<<<<<<< HEAD
          <Link to="/search" className="inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-all hover:scale-105 active:scale-95">
=======
          <Link to="/search" className="inline-block px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs">
>>>>>>> 13ba826 (feat: complete premium SaaS frontend redesign)
            Browse Found Items
          </Link>
        </div>
      )}
    </div>
  )
}
