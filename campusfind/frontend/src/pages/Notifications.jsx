import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { notificationsAPI } from '../services/api'
import { Bell, CheckCheck, ArrowLeft, Sparkles, Shield, AlertCircle, ArrowRight } from 'lucide-react'

export default function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchNotifs = async () => {
    setLoading(true)
    try {
      const res = await notificationsAPI.list()
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
      await notificationsAPI.markRead(id)
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n))
    } catch {
      // ignore
    }
  }

  const markAllRead = async () => {
    try {
      await notificationsAPI.markAllRead()
      setNotifications(notifications.map(n => ({ ...n, is_read: true })))
    } catch {
      // ignore
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'MATCH_FOUND':
        return <Sparkles className="w-5 h-5 text-amber-400" />
      case 'CLAIM_APPROVED':
        return <Shield className="w-5 h-5 text-emerald-400" />
      case 'CLAIM_REJECTED':
        return <AlertCircle className="w-5 h-5 text-rose-400" />
      case 'CLAIM_SUBMITTED':
        return <Shield className="w-5 h-5 text-indigo-400" />
      default:
        return <Bell className="w-5 h-5 text-indigo-400" />
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-16">
      <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Notification Center</h1>
          <p className="text-xs text-slate-400 mt-1">Real-time alerts for match updates and claim reviews</p>
        </div>

        {notifications.some(n => !n.is_read) && (
          <button
            onClick={markAllRead}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <CheckCheck className="w-4 h-4 text-emerald-400" /> Mark All as Read
          </button>
        )}
      </div>

      {loading ? (
        <div className="card py-16 flex justify-center">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => !notif.is_read && markRead(notif.id)}
              className={`p-4 rounded-2xl border transition-all duration-200 flex items-start gap-3.5 ${
                notif.is_read
                  ? 'bg-navy-800/60 border-slate-750 text-slate-400'
                  : 'bg-indigo-950/20 border-indigo-500/30 text-white shadow-lg shadow-indigo-500/5 cursor-pointer hover:border-indigo-500/50'
              }`}
            >
              <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 shrink-0 mt-0.5">
                {getTypeIcon(notif.type)}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                    {notif.type.replace('_', ' ')}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {new Date(notif.created_at).toLocaleDateString()} {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-slate-200">{notif.message}</p>

                {notif.type === 'MATCH_FOUND' && (
                  <div className="pt-2">
                    <Link
                      to="/matches"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
                    >
                      View in Smart Match Radar <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
                {notif.type.startsWith('CLAIM') && (
                  <div className="pt-2">
                    <Link
                      to="/claims"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
                    >
                      View Claim Status <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>

              {!notif.is_read && (
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 mt-2 shrink-0 animate-pulse"></div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center space-y-3 bg-navy-800/60 border-dashed border-slate-700">
          <Bell className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No notifications yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You will receive instant alerts when a potential match or claim update occurs.
          </p>
        </div>
      )}
    </div>
  )
}
