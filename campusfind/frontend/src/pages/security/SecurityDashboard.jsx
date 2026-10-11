import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { securityAPI, notificationsAPI } from '../../services/api'
import { 
  Shield, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  KeyRound, 
  User, 
  MapPin, 
  Calendar, 
  Tag, 
  Bell, 
  X, 
  Check, 
  RefreshCw,
  PackageCheck,
  Building2,
  Lock,
  ArrowRight,
  AlertTriangle
} from 'lucide-react'

export default function SecurityDashboard() {
  const [pending, setPending] = useState([])
  const [completed, setCompleted] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('pending') // 'pending', 'completed', 'notifications'

  // Modal State
  const [selectedClaim, setSelectedClaim] = useState(null)
  const [otpInput, setOtpInput] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [verifyResult, setVerifyResult] = useState(null) // { success: bool, message: str, ... }
  const [verifyError, setVerifyError] = useState('')

  const fetchData = async () => {
    try {
      const [pendRes, compRes, notifRes] = await Promise.all([
        securityAPI.pendingCollections(),
        securityAPI.completedCollections(),
        notificationsAPI.list(),
      ])
      setPending(pendRes.data || [])
      setCompleted(compRes.data || [])
      setNotifications(notifRes.data || [])
    } catch (err) {
      console.error('Error loading Security Desk data:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 20000)
    return () => clearInterval(interval)
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchData()
  }

  const openVerifyModal = (claim) => {
    setSelectedClaim(claim)
    setOtpInput('')
    setVerifyResult(null)
    setVerifyError('')
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    if (!selectedClaim || !otpInput.trim()) return

    setVerifying(true)
    setVerifyError('')
    setVerifyResult(null)

    try {
      const res = await securityAPI.verifyOtp(selectedClaim.id, otpInput.trim())
      setVerifyResult(res.data)
      // Refresh background data
      fetchData()
    } catch (err) {
      const detail = err.response?.data?.detail || 'Verification failed. Please try again.'
      setVerifyError(detail)
    } finally {
      setVerifying(false)
    }
  }

  const handleMarkAllNotificationsRead = async () => {
    try {
      await notificationsAPI.markAllRead()
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
    } catch (err) {
      console.error('Failed to mark all read:', err)
    }
  }

  const unreadNotifs = notifications.filter((n) => !n.is_read)

  // Filter collections
  const filterList = (list) => {
    if (!searchQuery.trim()) return list
    const q = searchQuery.toLowerCase()
    return list.filter(
      (c) =>
        c.item_name?.toLowerCase().includes(q) ||
        c.claimant_name?.toLowerCase().includes(q) ||
        c.student_id?.toLowerCase().includes(q) ||
        c.location?.toLowerCase().includes(q) ||
        c.category?.toLowerCase().includes(q)
    )
  }

  const filteredPending = filterList(pending)
  const filteredCompleted = filterList(completed)

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      {/* ── Top Station Header ── */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-navy-800 via-slate-850 to-navy-800 border border-amber-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-amber-500/5 blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/10">
              <Shield className="w-7 h-7 text-amber-400" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Official Handover Station
                </span>
                <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> Live Station Active
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Main Campus Security Desk</h1>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                Administration Building, Room 102 • Item Handover & OTP Collection Verification
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-amber-400' : ''}`} />
              <span>Refresh</span>
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className="relative px-3.5 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5 text-amber-400" />
              <span>Alerts</span>
              {unreadNotifs.length > 0 && (
                <span className="px-1.5 py-0.2 bg-amber-500 text-navy-950 font-bold text-[10px] rounded-full">
                  {unreadNotifs.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── KPI Overview Metric Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Pending Collections */}
        <div 
          onClick={() => setActiveTab('pending')}
          className={`card p-5 border transition-all cursor-pointer ${
            activeTab === 'pending'
              ? 'bg-amber-950/20 border-amber-500/50 shadow-lg shadow-amber-500/10'
              : 'bg-navy-800/80 border-slate-700 hover:border-slate-600'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Pending Collections</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mt-2">{pending.length}</div>
          <div className="text-[11px] text-amber-400 mt-1 font-medium flex items-center gap-1">
            <KeyRound className="w-3 h-3" /> Waiting for student OTP verification
          </div>
        </div>

        {/* Completed Collections */}
        <div 
          onClick={() => setActiveTab('completed')}
          className={`card p-5 border transition-all cursor-pointer ${
            activeTab === 'completed'
              ? 'bg-emerald-950/20 border-emerald-500/50 shadow-lg shadow-emerald-500/10'
              : 'bg-navy-800/80 border-slate-700 hover:border-slate-600'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Handed Over / Returned</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <PackageCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mt-2">{completed.length}</div>
          <div className="text-[11px] text-emerald-400 mt-1 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Successfully collected items
          </div>
        </div>

        {/* Security Alerts */}
        <div 
          onClick={() => setActiveTab('notifications')}
          className={`card p-5 border transition-all cursor-pointer ${
            activeTab === 'notifications'
              ? 'bg-indigo-950/20 border-indigo-500/50 shadow-lg shadow-indigo-500/10'
              : 'bg-navy-800/80 border-slate-700 hover:border-slate-600'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Security Notifications</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mt-2">{unreadNotifs.length} Unread</div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <span>{notifications.length} total station notifications</span>
          </div>
        </div>
      </div>

      {/* ── Search & Tab Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Navigation Tabs */}
        <div className="flex bg-slate-800/90 p-1 rounded-xl border border-slate-700 text-xs shrink-0">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-lg font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'pending'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Handover ({pending.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-4 py-2 rounded-lg font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'completed'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Collection History ({completed.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-4 py-2 rounded-lg font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'notifications'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Desk Alerts ({unreadNotifs.length})</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student, item, location..."
            className="w-full pl-9 pr-3.5 py-2 bg-slate-850 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* ── Main Content Area ── */}
      {loading ? (
        <div className="card py-16 flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-400">Loading collection records...</p>
        </div>
      ) : activeTab === 'pending' ? (
        /* ── PENDING COLLECTIONS ── */
        filteredPending.length > 0 ? (
          <div className="space-y-4">
            {filteredPending.map((c) => (
              <div
                key={c.id}
                className="card p-5 sm:p-6 bg-navy-800/90 border-slate-700 hover:border-amber-500/50 transition-all duration-200 space-y-4 shadow-xl"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-700/60">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-base font-bold text-white">{c.item_name}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Ready for Handover
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                        {c.category}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" /> Found at: <strong className="text-slate-200">{c.location}</strong>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" /> Approved on:{' '}
                        <strong className="text-slate-200">
                          {c.approved_at ? new Date(c.approved_at).toLocaleDateString() : 'Recent'}
                        </strong>
                      </span>
                    </div>
                  </div>

                  {/* Primary Handover Action */}
                  <button
                    onClick={() => openVerifyModal(c)}
                    className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold rounded-xl text-xs shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>Verify OTP & Complete Collection</span>
                  </button>
                </div>

                {/* Claimant & Handover Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-slate-850 rounded-xl border border-slate-750 space-y-1">
                    <span className="text-slate-400 flex items-center gap-1.5 font-semibold">
                      <User className="w-3.5 h-3.5 text-indigo-400" /> Authorized Claimant
                    </span>
                    <div className="text-white font-bold">{c.claimant_name}</div>
                    <div className="text-[11px] text-slate-400">
                      Student ID: <span className="text-slate-300 font-mono font-semibold">{c.student_id || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-850 rounded-xl border border-slate-750 space-y-1">
                    <span className="text-slate-400 flex items-center gap-1.5 font-semibold">
                      <Building2 className="w-3.5 h-3.5 text-amber-400" /> Pickup Location
                    </span>
                    <div className="text-white font-bold">Main Security Desk</div>
                    <div className="text-[11px] text-slate-400">Administration Building Room 102</div>
                  </div>

                  <div className="p-3 bg-slate-850 rounded-xl border border-slate-750 space-y-1">
                    <span className="text-slate-400 flex items-center gap-1.5 font-semibold">
                      <Lock className="w-3.5 h-3.5 text-emerald-400" /> Verification Requirement
                    </span>
                    <div className="text-slate-200 font-medium">6-Digit Code + Student ID</div>
                    <div className="text-[11px] text-slate-400">Student presents OTP from their dashboard</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-12 text-center space-y-3 bg-navy-800/60 border-dashed border-slate-700">
            <PackageCheck className="w-12 h-12 text-slate-500 mx-auto" />
            <h3 className="text-base font-bold text-white">No Pending Collections</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              All approved claims have been collected or there are no pending collection handovers at this moment.
            </p>
          </div>
        )
      ) : activeTab === 'completed' ? (
        /* ── COMPLETED COLLECTIONS ── */
        filteredCompleted.length > 0 ? (
          <div className="space-y-4">
            {filteredCompleted.map((c) => (
              <div
                key={c.id}
                className="card p-5 bg-navy-800/90 border-slate-700 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-white">{c.item_name}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> RETURNED / Handed Over
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-2">
                      <span>Category: <strong className="text-slate-300">{c.category}</strong></span>
                      <span>•</span>
                      <span>Found at: <strong className="text-slate-300">{c.location}</strong></span>
                    </div>
                  </div>

                  <div className="text-left sm:text-right text-xs text-slate-400">
                    <div>Collected by <strong className="text-white">{c.claimant_name}</strong></div>
                    <div className="text-[11px] text-slate-500">ID: {c.student_id || 'N/A'} • {c.claimant_email}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-12 text-center space-y-3 bg-navy-800/60 border-dashed border-slate-700">
            <CheckCircle2 className="w-12 h-12 text-slate-500 mx-auto" />
            <h3 className="text-base font-bold text-white">No Handover History Yet</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Completed collection handovers verified via OTP will appear here for audit and record keeping.
            </p>
          </div>
        )
      ) : (
        /* ── DESK NOTIFICATIONS ── */
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-2">
            <div className="text-xs text-slate-400">
              Real-time alerts for newly approved claims ready for Security Desk handover.
            </div>
            {unreadNotifs.length > 0 && (
              <button
                onClick={handleMarkAllNotificationsRead}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
              >
                Mark all as read
              </button>
            )}
          </div>

          {notifications.length > 0 ? (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`card p-4 border transition-all flex items-start justify-between gap-3 ${
                  n.is_read
                    ? 'bg-navy-800/60 border-slate-750 text-slate-300'
                    : 'bg-indigo-950/30 border-indigo-500/40 text-white shadow-md'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    n.is_read ? 'bg-slate-800 text-slate-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    <Bell className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs leading-relaxed">{n.message}</p>
                    <span className="text-[10px] text-slate-400">
                      {new Date(n.created_at).toLocaleDateString()} at {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="card p-12 text-center space-y-3 bg-navy-800/60 border-dashed border-slate-700">
              <Bell className="w-12 h-12 text-slate-500 mx-auto" />
              <h3 className="text-base font-bold text-white">No Alerts</h3>
              <p className="text-xs text-slate-400">No security notifications recorded.</p>
            </div>
          )}
        </div>
      )}

      {/* ── OTP VERIFICATION MODAL ── */}
      {selectedClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/85 backdrop-blur-md animate-fade-in">
          <div className="card w-full max-w-lg bg-navy-900 border-slate-700 shadow-2xl relative p-6 sm:p-8 space-y-6">
            {/* Close Button */}
            <button
              onClick={() => setSelectedClaim(null)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
                <KeyRound className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-white">Collection Verification</h2>
              <p className="text-xs text-slate-400">Verify student's 6-digit Collection OTP to complete handover</p>
            </div>

            {/* Item & Claimant Summary Box */}
            <div className="p-4 bg-slate-850 rounded-xl border border-slate-750 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Item:</span>
                <span className="text-white font-bold">{selectedClaim.item_name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Student:</span>
                <span className="text-white font-bold">{selectedClaim.claimant_name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Student ID:</span>
                <span className="text-indigo-300 font-mono font-bold">{selectedClaim.student_id || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Found Location:</span>
                <span className="text-slate-200">{selectedClaim.location}</span>
              </div>
            </div>

            {/* Error Message */}
            {verifyError && (
              <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 flex items-start gap-2 text-xs text-rose-300 animate-fade-in">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <div className="space-y-0.5">
                  <div className="font-bold">Verification Failed</div>
                  <div>{verifyError}</div>
                </div>
              </div>
            )}

            {/* Success View */}
            {verifyResult ? (
              <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-3 animate-fade-in">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-emerald-300">✓ Collection Verified</h3>
                  <p className="text-xs text-slate-300">
                    Item <strong>{verifyResult.item_name}</strong> handed over to{' '}
                    <strong>{verifyResult.claimant_name}</strong>.
                  </p>
                  <div className="text-[11px] text-emerald-400 font-semibold pt-1">
                    Status: RETURNED • Recovery Timeline Recorded
                  </div>
                </div>
                <button
                  onClick={() => setSelectedClaim(null)}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  Done
                </button>
              </div>
            ) : (
              /* Verification Form */
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 text-center">
                    Enter 6-Digit Collection OTP
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    autoFocus
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value.replace(/\s+/g, ''))}
                    placeholder="220506"
                    className="w-full py-3 bg-slate-850 border border-slate-700 rounded-xl text-center text-xl tracking-[0.3em] font-mono font-bold text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                  />
                  <p className="text-[11px] text-slate-400 text-center mt-1.5">
                    Ask the student to show the 6-digit code on their CampusFind claims screen
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedClaim(null)}
                    className="flex-1 py-3 bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={verifying || !otpInput.trim()}
                    className="flex-1 py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {verifying ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <span>Verify OTP</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
