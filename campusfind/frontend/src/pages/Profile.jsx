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
<<<<<<< HEAD
    <div className="max-w-xl mx-auto py-8 animate-fade-in pb-16">
      <div className="card reveal bg-navy-800 border-slate-700 shadow-2xl p-8 space-y-6">
        {/* User Avatar & Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-slate-700">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/30 text-indigo-400 border border-indigo-500/40 flex items-center justify-center font-black text-2xl shadow-xl shadow-indigo-500/10 animate-scale-up">
=======
    <div className="max-w-xl mx-auto py-6 animate-fade-in pb-16">
      <Link 
        to={isAdmin ? '/admin' : (isSecurity ? '/security' : '/dashboard')} 
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="card bg-white border-slate-200/90 shadow-md p-7 sm:p-9 space-y-6">
        {/* User Avatar & Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center font-black text-2xl shadow-xs">
>>>>>>> 13ba826 (feat: complete premium SaaS frontend redesign)
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
<<<<<<< HEAD
          <div className="p-3.5 bg-slate-850 rounded-xl border border-slate-750 flex items-center justify-between transition-all duration-300 hover:border-indigo-500/30 hover:bg-slate-850/80">
            <span className="text-slate-400 flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-400" /> Account Name
=======
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <span className="text-slate-600 font-medium flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-600" /> Account Name
>>>>>>> 13ba826 (feat: complete premium SaaS frontend redesign)
            </span>
            <span className="text-slate-900 font-bold">{user?.name}</span>
          </div>

<<<<<<< HEAD
          <div className="p-3.5 bg-slate-850 rounded-xl border border-slate-750 flex items-center justify-between transition-all duration-300 hover:border-indigo-500/30 hover:bg-slate-850/80">
            <span className="text-slate-400 flex items-center gap-2">
              <Mail className="w-4 h-4 text-indigo-400" /> Campus Email
=======
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <span className="text-slate-600 font-medium flex items-center gap-2">
              <Mail className="w-4 h-4 text-indigo-600" /> Campus Email
>>>>>>> 13ba826 (feat: complete premium SaaS frontend redesign)
            </span>
            <span className="text-slate-900 font-bold">{user?.email}</span>
          </div>

          {user?.student_id && (
<<<<<<< HEAD
            <div className="p-3.5 bg-slate-850 rounded-xl border border-slate-750 flex items-center justify-between transition-all duration-300 hover:border-indigo-500/30 hover:bg-slate-850/80">
              <span className="text-slate-400 flex items-center gap-2">
                <Hash className="w-4 h-4 text-indigo-400" /> Student ID
=======
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <span className="text-slate-600 font-medium flex items-center gap-2">
                <Hash className="w-4 h-4 text-indigo-600" /> Student ID
>>>>>>> 13ba826 (feat: complete premium SaaS frontend redesign)
              </span>
              <span className="text-slate-900 font-bold">{user.student_id}</span>
            </div>
          )}

<<<<<<< HEAD
          <div className="p-3.5 bg-slate-850 rounded-xl border border-slate-750 flex items-center justify-between transition-all duration-300 hover:border-indigo-500/30 hover:bg-slate-850/80">
            <span className="text-slate-400 flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-400" /> Account Role
=======
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <span className="text-slate-600 font-medium flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-600" /> Account Role
>>>>>>> 13ba826 (feat: complete premium SaaS frontend redesign)
            </span>
            <span className="text-slate-900 font-bold">{user?.role}</span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={handleLogout}
<<<<<<< HEAD
            className="px-5 py-2.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 hover:border-rose-500/50 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
=======
            className="px-5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer shadow-xs active:scale-95"
>>>>>>> 13ba826 (feat: complete premium SaaS frontend redesign)
          >
            <LogOut className="w-4 h-4" /> Sign Out of Account
          </button>
        </div>
      </div>
    </div>
  )
}
