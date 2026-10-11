import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { notificationsAPI } from '../services/api'
import {
  Bell,
  CheckCheck,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Info,
  ArrowRight
} from 'lucide-react'

export default function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchNotifs = async () => {
    setLoading(true)
    try {
      const res = await notificationsAPI.getAll()
      setNotifications(res.data || [])
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifs()
  }, [])

  const markRead = async (id) => {
    try {
      await notificationsAPI.markAsRead(id)
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, is_read: true } : n))
      )
    } catch {
      // ignore
    }
  }

  const markAllRead = async () => {
    try {
      await notificationsAPI.markAllAsRead()
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
    } catch {
      // ignore
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'MATCH_FOUND':
        return <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
      case 'CLAIM_SUBMITTED':
      case 'CLAIM_APPROVED':
        return <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
      case 'CLAIM_REJECTED':
        return <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
      default:
        return <Info className="w-5 h-5 text-indigo-600 shrink-0" />
    }
  }

  return (
    <div className="space-y-6 animate-fade-in pb-16 max-w-4xl mx-auto">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Notification Center</h1>
          <p className="text-xs text-slate-500 mt-1">Real-time alerts for match discoveries and claim approvals</p>
        </div>

        {notifications.some(n => !n.is_read) && (
          <button
            onClick={markAllRead}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <CheckCheck className="w-4 h-4 text-emerald-600" /> Mark All as Read
          </button>
        )}
      </div>

      {loading ? (
        <div className="card py-16 flex justify-center bg-white">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notif, idx) => (
            <div
              key={notif.id}
              onClick={() => !notif.is_read && markRead(notif.id)}
              className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex items-start gap-3.5 reveal delay-${(idx % 8) + 1} ${
                notif.is_read
                  ? 'bg-white border-slate-200 text-slate-600 shadow-xs'
                  : 'bg-indigo-50/70 border-indigo-200 text-slate-900 shadow-xs cursor-pointer hover:border-indigo-300'
              }`}
            >
              <div className="p-2 rounded-xl bg-white border border-slate-200 shrink-0 mt-0.5 shadow-xs">
                {getTypeIcon(notif.type)}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">
                    {notif.type.replace(/_/g, ' ')}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {new Date(notif.created_at).toLocaleDateString()} {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-slate-800">{notif.message}</p>

                {notif.type === 'MATCH_FOUND' && (
                  <div className="pt-2">
                    <Link
                      to="/matches"
                      className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700"
                    >
                      View in Smart Match Radar <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
                {notif.type.startsWith('CLAIM') && (
                  <div className="pt-2">
                    <Link
                      to="/claims"
                      className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700"
                    >
                      View Claim Details <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>

              {!notif.is_read && (
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 mt-2 shrink-0 animate-pulse ring-4 ring-indigo-600/15"></div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center space-y-3 bg-white border-dashed border-slate-300">
          <Bell className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No notifications yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            You will receive instant alerts when a potential match or claim update occurs.
          </p>
        </div>
      )}
    </div>
  )
}
