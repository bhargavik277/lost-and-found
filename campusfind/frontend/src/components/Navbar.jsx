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
        return 'nav-indicator px-2.5 lg:px-3 py-1.5 rounded-xl text-xs lg:text-sm font-semibold flex items-center gap-1.5 bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-sm shadow-amber-500/10 transition-all'
      }
      return 'nav-indicator px-2.5 lg:px-3 py-1.5 rounded-xl text-xs lg:text-sm font-semibold flex items-center gap-1.5 bg-indigo-500/15 text-indigo-300 border border-indigo-500/40 shadow-sm shadow-indigo-500/10 transition-all'
    }
    return 'px-2 lg:px-2.5 py-1.5 rounded-xl text-xs lg:text-sm font-medium flex items-center gap-1.5 text-slate-300 hover:text-white hover:bg-slate-800/80 border border-transparent hover:border-slate-700/60 transition-all'
  }

  return (
    <nav className="sticky top-0 z-50 bg-navy-900/85 backdrop-blur-md border-b border-slate-800/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to={user ? (isAdmin ? '/admin' : (isSecurity ? '/security' : '/dashboard')) : '/'} className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 group-hover:shadow-indigo-500/40 transition-all duration-300">
              <Compass className="w-5 h-5 text-white transition-transform group-hover:rotate-45 duration-500" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                CAMPUS<span className="text-indigo-400 font-extrabold">FIND</span>
              </span>
              <span className="hidden sm:block text-[10px] text-slate-400 tracking-wider uppercase font-medium">
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
                    <Shield className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span className="hidden xl:inline">Admin </span>
                    <span>Overview</span>
                  </Link>
                  <Link to="/admin/items" className={getLinkClass('/admin/items')}>
                    <Layers className="w-4 h-4 shrink-0" />
                    <span>Items</span>
                  </Link>
                  <Link to="/admin/claims" className={getLinkClass('/admin/claims')}>
                    <FileText className="w-4 h-4 shrink-0" />
                    <span>Claims</span>
                  </Link>
                  <Link to="/security" className={getLinkClass('/security', 'amber')}>
                    <Shield className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="hidden xl:inline">Security </span>
                    <span>Desk</span>
                  </Link>
                  <Link to="/admin/analytics" className={getLinkClass('/admin/analytics')}>
                    <BarChart3 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Analytics</span>
                  </Link>
                  <Link to="/admin/users" className={getLinkClass('/admin/users')}>
                    <User className="w-4 h-4 shrink-0" />
                    <span>Users</span>
                  </Link>
                </>
              ) : isSecurity ? (
                <>
                  <Link to="/security" className={getLinkClass('/security', 'amber')}>
                    <Shield className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Security Station</span>
                  </Link>
                  <Link to="/search" className={getLinkClass('/search')}>
                    <Search className="w-4 h-4 shrink-0" />
                    <span>Item Catalog</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/dashboard" className={getLinkClass('/dashboard')}>
                    <span>Dashboard</span>
                  </Link>
                  <Link to="/search" className={getLinkClass('/search')}>
                    <Search className="w-4 h-4 shrink-0" />
                    <span>Search</span>
                  </Link>
                  <Link to="/matches" className={getLinkClass('/matches')}>
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
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
              <Link to="/search" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
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
                      className="px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 hover:border-rose-500/50 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm shadow-rose-900/20 hover:scale-102"
                    >
                      <PlusCircle className="w-3.5 h-3.5" /> Report Lost
                    </Link>
                    <Link
                      to="/report-found"
                      className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 hover:border-emerald-500/50 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm shadow-emerald-900/20 hover:scale-102"
                    >
                      <PlusCircle className="w-3.5 h-3.5" /> Report Found
                    </Link>
                  </div>
                )}

                {/* Notifications Bell */}
                <Link
                  to="/notifications"
                  className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse shadow-sm shadow-red-500/50">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>

                {/* Profile Pill */}
                <Link
                  to="/profile"
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 bg-slate-800/80 hover:bg-slate-750 border border-slate-700/80 rounded-xl text-xs font-medium text-slate-200 transition-all hover:border-slate-600"
                >
                  <div className="w-6 h-6 rounded-lg bg-indigo-600/40 text-indigo-300 flex items-center justify-center font-bold text-xs">
                    {user.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="max-w-[100px] truncate">{user.name}</span>
                  {isAdmin && (
                    <span className="px-1.5 py-0.5 bg-indigo-500/20 text-indigo-300 text-[10px] font-semibold rounded">
                      ADMIN
                    </span>
                  )}
                  {isSecurity && (
                    <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-300 text-[10px] font-semibold rounded">
                      SECURITY
                    </span>
                  )}
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all hover:scale-102"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {user && (
              <Link to="/notifications" className="relative p-2 text-slate-400">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white cursor-pointer rounded-xl hover:bg-slate-800/80 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Backdrop & Menu */}
      {mobileMenuOpen && (
        <>
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 top-16 bg-navy-950/70 backdrop-blur-sm z-40 md:hidden animate-fade-in"
          />
          <div className="md:hidden relative z-50 bg-navy-900/95 backdrop-blur-xl border-b border-slate-800/90 shadow-2xl px-4 pt-3 pb-6 space-y-3 animate-slide-down">
            {user ? (
              <>
                <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white">{user.name}</div>
                    <div className="text-xs text-slate-400">{user.email}</div>
                  </div>
                  {isAdmin && (
                    <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 text-xs font-semibold rounded">
                      ADMIN
                    </span>
                  )}
                  {isSecurity && (
                    <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 text-xs font-semibold rounded">
                      SECURITY
                    </span>
                  )}
                </div>

                {isAdmin ? (
                  <div className="space-y-1">
                    <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                      <Shield className="w-4 h-4 text-indigo-400" /> Admin Overview
                    </Link>
                    <Link to="/admin/items" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                      <Layers className="w-4 h-4" /> Manage Items
                    </Link>
                    <Link to="/admin/claims" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                      <FileText className="w-4 h-4" /> Review Claims
                    </Link>
                    <Link to="/security" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-amber-400 hover:bg-slate-800 transition-colors">
                      <Shield className="w-4 h-4 text-amber-400" /> Security Desk
                    </Link>
                    <Link to="/admin/analytics" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                      <BarChart3 className="w-4 h-4 text-emerald-400" /> Analytics
                    </Link>
                    <Link to="/admin/users" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                      <User className="w-4 h-4" /> Users
                    </Link>
                  </div>
                ) : isSecurity ? (
                  <div className="space-y-1">
                    <Link to="/security" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-amber-400 hover:bg-slate-800 font-semibold transition-colors">
                      <Shield className="w-4 h-4 text-amber-400" /> Security Desk Station
                    </Link>
                    <Link to="/search" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                      <Search className="w-4 h-4" /> Browse Catalog
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-xl text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                      Dashboard
                    </Link>
                    <Link to="/search" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                      <Search className="w-4 h-4" /> Browse & Search
                    </Link>
                    <Link to="/matches" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                      <Sparkles className="w-4 h-4 text-amber-400" /> Smart Matches
                    </Link>
                    <Link to="/my-reports" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-xl text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                      My Reports
                    </Link>
                    <Link to="/claims" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-xl text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                      My Claims
                    </Link>
                    <div className="pt-2 flex gap-2">
                      <Link to="/report-lost" onClick={() => setMobileMenuOpen(false)} className="flex-1 text-center py-2 bg-rose-600/20 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-semibold">
                        Report Lost
                      </Link>
                      <Link to="/report-found" onClick={() => setMobileMenuOpen(false)} className="flex-1 text-center py-2 bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-semibold">
                        Report Found
                      </Link>
                    </div>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="text-sm text-slate-300 hover:text-white transition-colors">
                    Profile Settings
                  </Link>
                  <button onClick={handleLogout} className="text-sm text-rose-400 hover:text-rose-300 font-semibold cursor-pointer">
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block w-full py-2.5 text-center bg-slate-800 text-white rounded-xl text-sm font-semibold">
                  Sign In
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="block w-full py-2.5 text-center bg-indigo-600 text-white rounded-xl text-sm font-semibold">
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
