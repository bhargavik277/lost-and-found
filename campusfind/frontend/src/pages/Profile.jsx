import React from 'react'
import { useAuth } from '../store/AuthContext'
import { User, Mail, Hash, Shield, LogOut, ArrowLeft } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'

export default function Profile() {
  const { user, logout, isAdmin, isSecurity } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="max-w-xl mx-auto py-6 animate-fade-in pb-16">
      <Link
        to={isAdmin ? '/admin' : (isSecurity ? '/security' : '/dashboard')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="card reveal bg-white border-slate-200/90 shadow-md p-7 sm:p-9 space-y-6">
        {/* User Avatar & Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center font-black text-2xl shadow-xs">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                isAdmin
                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                  : (isSecurity
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-indigo-50 text-indigo-700 border border-indigo-200')
              }`}>
                {user?.role}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
          </div>
        </div>

        {/* Profile Info Details */}
        <div className="space-y-3 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <span className="text-slate-600 font-medium flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-600" /> Account Name
            </span>
            <span className="text-slate-900 font-bold">{user?.name}</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <span className="text-slate-600 font-medium flex items-center gap-2">
              <Mail className="w-4 h-4 text-indigo-600" /> Campus Email
            </span>
            <span className="text-slate-900 font-bold">{user?.email}</span>
          </div>

          {user?.student_id && (
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <span className="text-slate-600 font-medium flex items-center gap-2">
                <Hash className="w-4 h-4 text-indigo-600" /> Student ID
              </span>
              <span className="text-slate-900 font-bold">{user.student_id}</span>
            </div>
          )}

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <span className="text-slate-600 font-medium flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-600" /> Account Role
            </span>
            <span className="text-slate-900 font-bold">{user?.role}</span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={handleLogout}
            className="px-5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer shadow-xs active:scale-95"
          >
            <LogOut className="w-4 h-4" /> Sign Out of Account
          </button>
        </div>
      </div>
    </div>
  )
}
