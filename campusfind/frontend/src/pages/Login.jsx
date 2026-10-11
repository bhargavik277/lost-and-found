import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../store/AuthContext'
import { authAPI } from '../services/api'
import {
  Compass,
  Lock,
  Mail,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  User,
  Shield,
  Eye,
  EyeOff
} from 'lucide-react'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    if (loading) return
    setError('')
    setLoading(true)

    try {
      const res = await authAPI.login({ email, password })
      const { access_token, user } = res.data
      login(access_token, user)
      if (user.role === 'ADMIN') {
        navigate('/admin')
      } else if (user.role === 'SECURITY') {
        navigate('/security')
      } else {
        navigate('/dashboard')
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password. Please verify your credentials.')
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = (role) => {
    if (role === 'admin') {
      setEmail('admin@campusfind.edu')
      setPassword('admin123')
    } else if (role === 'security') {
      setEmail('security@campusfind.edu')
      setPassword('security123')
    } else {
      setEmail('stu001@campus.edu')
      setPassword('STU001')
    }
  }

  return (
    <div className="min-h-[82vh] flex items-center justify-center px-4 py-8 animate-fade-in">
      <div className="card w-full max-w-md bg-white border-slate-200/90 shadow-md p-7 sm:p-9 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center mx-auto shadow-xs">
            <Compass className="w-6 h-6 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Sign In to CampusFind</h2>
          <p className="text-xs text-slate-500">Access your lost & found reports and smart match radar</p>
        </div>

        {/* Quick Demo Fill Pills for Evaluators */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
          <div className="text-slate-600 font-bold flex items-center justify-between">
            <span>Instant Demo Accounts:</span>
            <span className="text-[10px] text-slate-400 font-normal">Click to auto-fill</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => fillDemo('student')}
              className="py-1.5 px-2 bg-white hover:bg-indigo-50 text-indigo-700 border border-slate-200 hover:border-indigo-200 rounded-lg font-bold transition-all flex items-center justify-center gap-1 text-[11px] shadow-xs cursor-pointer"
            >
              <User className="w-3 h-3 text-indigo-600" /> Student
            </button>
            <button
              type="button"
              onClick={() => fillDemo('admin')}
              className="py-1.5 px-2 bg-white hover:bg-purple-50 text-purple-700 border border-slate-200 hover:border-purple-200 rounded-lg font-bold transition-all flex items-center justify-center gap-1 text-[11px] shadow-xs cursor-pointer"
            >
              <ShieldCheck className="w-3 h-3 text-purple-600" /> Admin
            </button>
            <button
              type="button"
              onClick={() => fillDemo('security')}
              className="py-1.5 px-2 bg-white hover:bg-amber-50 text-amber-700 border border-slate-200 hover:border-amber-200 rounded-lg font-bold transition-all flex items-center justify-center gap-1 text-[11px] shadow-xs cursor-pointer"
            >
              <Shield className="w-3 h-3 text-amber-600" /> Security
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs text-rose-700 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Campus Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                name="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.id@campus.edu"
                className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 transition-all shadow-xs"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold text-slate-700">Password</label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 transition-all shadow-xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-sheen w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl text-sm shadow-sm shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
          New to CampusFind?{' '}
          <Link to="/register" className="text-indigo-600 hover:text-indigo-700 font-bold">
            Create Student Account
          </Link>
        </div>
      </div>
    </div>
  )
}
