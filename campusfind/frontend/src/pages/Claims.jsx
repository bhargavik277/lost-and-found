import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { claimsAPI } from '../services/api'
import { ShieldCheck, Clock, CheckCircle2, XCircle, ArrowLeft, AlertCircle, FileText } from 'lucide-react'

export default function Claims() {
  const [claims, setClaims] = useState([])
  const [loading, setLoading] = useState(true)

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

  useEffect(() => {
    fetchClaims()
  }, [])

  const statusBadges = {
    PENDING: {
      bg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      icon: <Clock className="w-3.5 h-3.5 text-amber-400" />,
      label: 'Under Admin Review',
    },
    APPROVED: {
      bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />,
      label: 'Claim Approved! Ready for Pickup',
    },
    REJECTED: {
      bg: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      icon: <XCircle className="w-3.5 h-3.5 text-rose-400" />,
      label: 'Claim Not Approved',
    },
  }

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">My Ownership Claims</h1>
          <p className="text-xs text-slate-400 mt-1">
            Track verification status for items you have claimed from found reports
          </p>
        </div>
      </div>

      {loading ? (
        <div className="card py-16 flex justify-center">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : claims.length > 0 ? (
        <div className="space-y-4">
          {claims.map((claim) => {
            const badge = statusBadges[claim.status] || statusBadges.PENDING
            const item = claim.item
            return (
              <div key={claim.id} className="card p-6 border-slate-700 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-700/60">
                  <div>
                    <span className="text-xs text-slate-400">Claim for Found Item</span>
                    <h3 className="text-base font-bold text-white">{item?.item_name || 'Item'}</h3>
                  </div>
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border ${badge.bg}`}>
                    {badge.icon}
                    <span>{badge.label}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-slate-850 rounded-xl border border-slate-750 space-y-1">
                    <span className="text-slate-400">Item Location & Category</span>
                    <div className="text-white font-semibold">{item?.location} • {item?.category}</div>
                  </div>
                  <div className="p-3 bg-slate-850 rounded-xl border border-slate-750 space-y-1">
                    <span className="text-slate-400">Submitted On</span>
                    <div className="text-white font-semibold">
                      {new Date(claim.created_at).toLocaleDateString()} at {new Date(claim.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>

                {claim.admin_note && (
                  <div className="p-3.5 bg-indigo-950/30 border border-indigo-500/30 rounded-xl text-xs space-y-1">
                    <div className="font-bold text-indigo-300">Admin Response Note:</div>
                    <p className="text-slate-300">{claim.admin_note}</p>
                  </div>
                )}

                {claim.status === 'APPROVED' && (
                  <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-xs text-emerald-200 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong>Collection Instructions:</strong> Please visit the Main Campus Security Desk with your Student ID to pick up your item during working hours (9 AM - 5 PM).
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="card p-12 text-center space-y-3 bg-navy-800/60 border-dashed border-slate-700">
          <ShieldCheck className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No ownership claims submitted yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            When you locate a found item in Search or Match Radar, click "Claim This Item" to start the verification process.
          </p>
          <Link to="/search" className="inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold">
            Browse Found Items
          </Link>
        </div>
      )}
    </div>
  )
}
