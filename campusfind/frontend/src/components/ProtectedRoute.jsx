import React from 'react'
import { Navigate, Link } from 'react-router-dom'
import { useAuth } from '../store/AuthContext'
import { ShieldAlert, ArrowLeft } from 'lucide-react'

export function ProtectedRoute({ children, requireAdmin = false, allowedRoles = null }) {
  const { user, loading, isAdmin } = useAuth()

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Check admin requirement
  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-[65vh] flex items-center justify-center px-4">
        <div className="card max-w-md w-full p-8 text-center bg-navy-800 border-slate-700 shadow-2xl space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-white">Access Denied</h2>
          <p className="text-xs text-slate-400">
            Administrative credentials are required to view this area. Your current role is <strong className="text-indigo-300">{user.role}</strong>.
          </p>
          <Link
            to={user.role === 'SECURITY' ? '/security' : '/dashboard'}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-500/20"
          >
            <ArrowLeft className="w-4 h-4" /> Return to My Portal
          </Link>
        </div>
      </div>
    )
  }

  // Check explicit allowed roles
  if (allowedRoles && Array.isArray(allowedRoles) && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-[65vh] flex items-center justify-center px-4">
        <div className="card max-w-md w-full p-8 text-center bg-navy-800 border-slate-700 shadow-2xl space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-white">Access Restricted</h2>
          <p className="text-xs text-slate-400">
            This station is reserved for <strong className="text-amber-300">{allowedRoles.join(' / ')}</strong> personnel only. Your current role is <strong className="text-slate-300">{user.role}</strong>.
          </p>
          <Link
            to={user.role === 'ADMIN' ? '/admin' : (user.role === 'SECURITY' ? '/security' : '/dashboard')}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-500/20"
          >
            <ArrowLeft className="w-4 h-4" /> Return to {user.role === 'STUDENT' ? 'Dashboard' : 'Portal'}
          </Link>
        </div>
      </div>
    )
  }

  return children
}
