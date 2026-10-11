import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../store/AuthContext'
import { notificationsAPI } from '../services/api'
import {
  Compass,
  Search,
  PlusCircle,
  Sparkles,
  Bell,
  User,
  LogOut,
  Shield,
  BarChart3,
  FileText,
  Menu,
  X,
  Layers
} from 'lucide-react'

export default function Navbar() {
  const { user, logout, isAdmin, isSecurity } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [unreadCount, setUnreadCount] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const fetchUnread = async () => {
    if (!user) return
    try {
      const res = await notificationsAPI.unreadCount()
      setUnreadCount(res.data.count || 0)
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    fetchUnread()
    const interval = setInterval(fetchUnread, 15000)
    return () => clearInterval(interval)
  }, [user])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  const getLinkClass = (path, accent = 'indigo') => {
    const active = isActive(path)
    if (active) {
      if (accent === 'amber') {
        return 'nav-indicator px-2.5 lg:px-3 py-1.5 rounded-xl text-xs lg:text-sm font-semibold flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200/80 shadow-xs transition-all'
      }
      return 'nav-indicator px-2.5 lg:px-3 py-1.5 rounded-xl text-xs lg:text-sm font-semibold flex items-center gap-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-xs transition-all'
    }
    return 'px-2 lg:px-2.5 py-1.5 rounded-xl text-xs lg:text-sm font-medium flex items-center gap-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent transition-all'
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link
            to={user ? (isAdmin ? '/admin' : (isSecurity ? '/security' : '/dashboard')) : '/'}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center shadow-sm shadow-indigo-600/30 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                CAMPUS<span className="text-indigo-600">FIND</span>
              </span>
              <span className="hidden sm:block text-[10px] text-slate-500 tracking-wider uppercase font-semibold">
                Lost. Found. Reconnected.
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          {user ? (
            <div className="hidden md:flex items-center gap-1">
              {isAdmin ? (
                <>
                  <Link to="/admin" className={getLinkClass('/admin')}>
                    <Shield className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>Admin Overview</span>
                  </Link>
                  <Link to="/admin/items" className={getLinkClass('/admin/items')}>
                    <Layers className="w-4 h-4 text-slate-500 shrink-0" />
                    <span>Manage Items</span>
                  </Link>
                  <Link to="/admin/claims" className={getLinkClass('/admin/claims')}>
                    <FileText className="w-4 h-4 text-slate-500 shrink-0" />
                    <span>Review Claims</span>
                  </Link>
                  <Link to="/security" className={getLinkClass('/security', 'amber')}>
                    <Shield className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Security Desk</span>
                  </Link>
                  <Link to="/admin/analytics" className={getLinkClass('/admin/analytics')}>
                    <BarChart3 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Analytics</span>
                  </Link>
                  <Link to="/admin/users" className={getLinkClass('/admin/users')}>
                    <User className="w-4 h-4 text-slate-500 shrink-0" />
                    <span>Users</span>
                  </Link>
                </>
              ) : isSecurity ? (
                <>
                  <Link to="/security" className={getLinkClass('/security', 'amber')}>
                    <Shield className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Security Desk Station</span>
                  </Link>
                  <Link to="/search" className={getLinkClass('/search')}>
                    <Search className="w-4 h-4 text-slate-500 shrink-0" />
                    <span>Item Catalog</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/dashboard" className={getLinkClass('/dashboard')}>
                    <span>Dashboard</span>
                  </Link>
                  <Link to="/search" className={getLinkClass('/search')}>
                    <Search className="w-4 h-4 text-slate-500 shrink-0" />
                    <span>Browse & Search</span>
                  </Link>
                  <Link to="/matches" className={getLinkClass('/matches')}>
                    <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Matches</span>
                  </Link>
                  <Link to="/my-reports" className={getLinkClass('/my-reports')}>
                    <span>My Reports</span>
                  </Link>
                  <Link to="/claims" className={getLinkClass('/claims')}>
                    <span>Claims</span>
                  </Link>
                </>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-4">
              <Link
                to="/search"
                className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
              >
                Public Catalog
              </Link>
            </div>
          )}

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-2.5">
            {user ? (
              <>
                {!isAdmin && !isSecurity && (
                  <div className="flex items-center gap-2">
                    <Link
                      to="/report-lost"
                      className="px-3.5 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
                    >
                      <PlusCircle className="w-3.5 h-3.5" /> Report Lost
                    </Link>
                    <Link
                      to="/report-found"
                      className="px-3.5 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
                    >
                      <PlusCircle className="w-3.5 h-3.5" /> Report Found
                    </Link>
                  </div>
                )}

                {/* Notifications Bell */}
                <Link
                  to="/notifications"
                  className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse shadow-xs">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>

                {/* Profile Pill */}
                <Link
                  to="/profile"
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition-colors shadow-xs"
                >
                  <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                    {user.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="max-w-[110px] truncate">{user.name}</span>
                  {isAdmin && (
                    <span className="px-1.5 py-0.5 bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold rounded">
                      ADMIN
                    </span>
                  )}
                  {isSecurity && (
                    <span className="px-1.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold rounded">
                      SECURITY
                    </span>
                  )}
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-sm shadow-indigo-600/20 transition-all active:scale-95"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {user && (
              <Link to="/notifications" className="relative p-2 text-slate-500 hover:text-slate-800">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-rose-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <>
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 top-16 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden"
          />
          <div className="md:hidden relative z-50 bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-md animate-slide-up">
            {user ? (
              <>
                <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900">{user.name}</div>
                    <div className="text-xs text-slate-500">{user.email}</div>
                  </div>
                  {isAdmin && (
                    <span className="px-2 py-0.5 bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold rounded">
                      ADMIN
                    </span>
                  )}
                  {isSecurity && (
                    <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold rounded">
                      SECURITY
                    </span>
                  )}
                </div>

                {isAdmin ? (
                  <div className="space-y-1">
                    <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100">
                      <Shield className="w-4 h-4 text-indigo-600" /> Admin Overview
                    </Link>
                    <Link to="/admin/items" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100">
                      <Layers className="w-4 h-4 text-slate-500" /> Manage Items
                    </Link>
                    <Link to="/admin/claims" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100">
                      <FileText className="w-4 h-4 text-slate-500" /> Review Claims
                    </Link>
                    <Link to="/security" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-amber-700 hover:bg-amber-50">
                      <Shield className="w-4 h-4 text-amber-600" /> Security Desk Station
                    </Link>
                    <Link to="/admin/analytics" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100">
                      <BarChart3 className="w-4 h-4 text-emerald-600" /> Analytics
                    </Link>
                    <Link to="/admin/users" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100">
                      <User className="w-4 h-4 text-slate-500" /> Users
                    </Link>
                  </div>
                ) : isSecurity ? (
                  <div className="space-y-1">
                    <Link to="/security" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold text-amber-700 bg-amber-50">
                      <Shield className="w-4 h-4 text-amber-600" /> Security Desk Station
                    </Link>
                    <Link to="/search" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100">
                      <Search className="w-4 h-4 text-slate-500" /> Browse Item Catalog
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100">
                      Dashboard
                    </Link>
                    <Link to="/search" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100">
                      <Search className="w-4 h-4 text-slate-500" /> Browse & Search
                    </Link>
                    <Link to="/matches" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100">
                      <Sparkles className="w-4 h-4 text-amber-500" /> Smart Matches
                    </Link>
                    <Link to="/my-reports" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100">
                      My Reports
                    </Link>
                    <Link to="/claims" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100">
                      My Claims
                    </Link>
                    <div className="pt-2 flex gap-2">
                      <Link to="/report-lost" onClick={() => setMobileMenuOpen(false)} className="flex-1 text-center py-2 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold">
                        Report Lost
                      </Link>
                      <Link to="/report-found" onClick={() => setMobileMenuOpen(false)} className="flex-1 text-center py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold">
                        Report Found
                      </Link>
                    </div>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-slate-700 hover:text-indigo-600">
                    Profile Settings
                  </Link>
                  <button onClick={handleLogout} className="text-sm text-rose-600 font-bold hover:underline cursor-pointer">
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-2 pt-1">
                <Link to="/search" onClick={() => setMobileMenuOpen(false)} className="block w-full py-2.5 text-center text-slate-700 hover:bg-slate-100 rounded-xl text-sm font-semibold">
                  Browse Public Catalog
                </Link>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block w-full py-2.5 text-center bg-slate-100 text-slate-800 rounded-xl text-sm font-bold">
                  Sign In
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="block w-full py-2.5 text-center bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-sm">
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </nav>
  )
}
