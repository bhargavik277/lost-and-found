import React from 'react'
import { useAuth } from '../store/AuthContext'
import { User, Mail, Hash, Shield, LogOut, Calendar } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Profile() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="max-w-xl mx-auto py-8 animate-fade-in pb-16">
      <div className="card bg-navy-800 border-slate-700 shadow-2xl p-8 space-y-6">
        {/* User Avatar & Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-slate-700">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/30 text-indigo-400 border border-indigo-500/40 flex items-center justify-center font-black text-2xl shadow-xl shadow-indigo-500/10">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">{user?.name}</h2>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isAdmin ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'}`}>
                {user?.role}
              </span>
            </div>
            <p className="text-xs text-slate-400">{user?.email}</p>
          </div>
        </div>

        {/* Profile Info Details */}
        <div className="space-y-3 text-xs">
          <div className="p-3.5 bg-slate-850 rounded-xl border border-slate-750 flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-400" /> Account Name
            </span>
            <span className="text-white font-semibold">{user?.name}</span>
          </div>

          <div className="p-3.5 bg-slate-850 rounded-xl border border-slate-750 flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-2">
              <Mail className="w-4 h-4 text-indigo-400" /> Campus Email
            </span>
            <span className="text-white font-semibold">{user?.email}</span>
          </div>

          {user?.student_id && (
            <div className="p-3.5 bg-slate-850 rounded-xl border border-slate-750 flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-2">
                <Hash className="w-4 h-4 text-indigo-400" /> Student ID
              </span>
              <span className="text-white font-semibold">{user.student_id}</span>
            </div>
          )}

          <div className="p-3.5 bg-slate-850 rounded-xl border border-slate-750 flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-400" /> Account Role
            </span>
            <span className="text-white font-semibold">{user?.role}</span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-700 flex justify-end">
          <button
            onClick={handleLogout}
            className="px-5 py-2.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Sign Out of Account
          </button>
        </div>
      </div>
    </div>
  )
}
