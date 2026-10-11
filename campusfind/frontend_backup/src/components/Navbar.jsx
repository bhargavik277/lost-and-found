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
<<<<<<< HEAD
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
=======
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
>>>>>>> 13ba826 (feat: complete premium SaaS frontend redesign)
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
<<<<<<< HEAD
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
=======
                  <Link 
                    to="/admin" 
                    className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      isActive('/admin') 
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/80' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Shield className="w-4 h-4 text-indigo-600" /> Admin Overview
                  </Link>
                  <Link 
                    to="/admin/items" 
                    className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      isActive('/admin/items') 
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/80' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Layers className="w-4 h-4 text-slate-500" /> Manage Items
                  </Link>
                  <Link 
                    to="/admin/claims" 
                    className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      isActive('/admin/claims') 
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/80' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <FileText className="w-4 h-4 text-slate-500" /> Review Claims
                  </Link>
                  <Link 
                    to="/security" 
                    className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      isActive('/security') 
                        ? 'bg-amber-50 text-amber-700 border border-amber-200/80' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Shield className="w-4 h-4 text-amber-600" /> Security Desk
                  </Link>
                  <Link 
                    to="/admin/analytics" 
                    className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      isActive('/admin/analytics') 
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/80' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <BarChart3 className="w-4 h-4 text-emerald-600" /> Analytics
                  </Link>
                  <Link 
                    to="/admin/users" 
                    className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      isActive('/admin/users') 
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/80' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <User className="w-4 h-4 text-slate-500" /> Users
>>>>>>> 13ba826 (feat: complete premium SaaS frontend redesign)
                  </Link>
                </>
              ) : isSecurity ? (
                <>
<<<<<<< HEAD
                  <Link to="/security" className={getLinkClass('/security', 'amber')}>
                    <Shield className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Security Station</span>
                  </Link>
                  <Link to="/search" className={getLinkClass('/search')}>
                    <Search className="w-4 h-4 shrink-0" />
                    <span>Item Catalog</span>
=======
                  <Link 
                    to="/security" 
                    className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      isActive('/security') 
                        ? 'bg-amber-50 text-amber-700 border border-amber-200/80' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Shield className="w-4 h-4 text-amber-600" /> Security Desk Station
                  </Link>
                  <Link 
                    to="/search" 
                    className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      isActive('/search') 
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/80' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Search className="w-4 h-4 text-slate-500" /> Item Catalog
>>>>>>> 13ba826 (feat: complete premium SaaS frontend redesign)
                  </Link>
                </>
              ) : (
                <>
<<<<<<< HEAD
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
=======
                  <Link 
                    to="/dashboard" 
                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive('/dashboard') 
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/80' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/search" 
                    className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      isActive('/search') 
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/80' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Search className="w-4 h-4 text-slate-500" /> Browse & Search
                  </Link>
                  <Link 
                    to="/matches" 
                    className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      isActive('/matches') 
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/80' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-amber-500" /> Matches
                  </Link>
                  <Link 
                    to="/my-reports" 
                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive('/my-reports') 
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/80' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    My Reports
                  </Link>
                  <Link 
                    to="/claims" 
                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive('/claims') 
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/80' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    Claims
>>>>>>> 13ba826 (feat: complete premium SaaS frontend redesign)
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
<<<<<<< HEAD
                      className="px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 hover:border-rose-500/50 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm shadow-rose-900/20 hover:scale-102"
=======
                      className="px-3.5 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
>>>>>>> 13ba826 (feat: complete premium SaaS frontend redesign)
                    >
                      <PlusCircle className="w-3.5 h-3.5" /> Report Lost
                    </Link>
                    <Link
                      to="/report-found"
<<<<<<< HEAD
                      className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 hover:border-emerald-500/50 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm shadow-emerald-900/20 hover:scale-102"
=======
                      className="px-3.5 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
>>>>>>> 13ba826 (feat: complete premium SaaS frontend redesign)
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
<<<<<<< HEAD
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse shadow-sm shadow-red-500/50">
=======
                    <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse shadow-xs">
>>>>>>> 13ba826 (feat: complete premium SaaS frontend redesign)
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>

                {/* Profile Pill */}
                <Link
                  to="/profile"
<<<<<<< HEAD
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 bg-slate-800/80 hover:bg-slate-750 border border-slate-700/80 rounded-xl text-xs font-medium text-slate-200 transition-all hover:border-slate-600"
=======
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition-colors shadow-xs"
>>>>>>> 13ba826 (feat: complete premium SaaS frontend redesign)
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
<<<<<<< HEAD
                  className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors"
=======
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
>>>>>>> 13ba826 (feat: complete premium SaaS frontend redesign)
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
<<<<<<< HEAD
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all hover:scale-102"
=======
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-sm shadow-indigo-600/20 transition-all active:scale-95"
>>>>>>> 13ba826 (feat: complete premium SaaS frontend redesign)
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
<<<<<<< HEAD
              className="p-2 text-slate-400 hover:text-white cursor-pointer rounded-xl hover:bg-slate-800/80 transition-colors"
              aria-label="Toggle mobile menu"
=======
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer"
              aria-label="Toggle Menu"
>>>>>>> 13ba826 (feat: complete premium SaaS frontend redesign)
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Backdrop & Menu */}
      {mobileMenuOpen && (
<<<<<<< HEAD
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
=======
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-md animate-slide-up">
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
                  <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100">
                    Admin Overview
                  </Link>
                  <Link to="/admin/items" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100">
                    Manage Items
                  </Link>
                  <Link to="/admin/claims" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100">
                    Review Claims
                  </Link>
                  <Link to="/security" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-xl text-sm font-semibold text-amber-700 hover:bg-amber-50">
                    Security Desk Station
                  </Link>
                  <Link to="/admin/analytics" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100">
                    Analytics
                  </Link>
                  <Link to="/admin/users" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100">
                    Users
                  </Link>
                </div>
              ) : isSecurity ? (
                <div className="space-y-1">
                  <Link to="/security" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-xl text-sm font-bold text-amber-700 bg-amber-50">
                    Security Desk Station
                  </Link>
                  <Link to="/search" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100">
                    Browse Item Catalog
                  </Link>
                </div>
              ) : (
                <div className="space-y-1">
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100">
                    Dashboard
                  </Link>
                  <Link to="/search" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100">
                    Browse & Search
                  </Link>
                  <Link to="/matches" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100">
                    Smart Matches
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
>>>>>>> 13ba826 (feat: complete premium SaaS frontend redesign)
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

<<<<<<< HEAD
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
=======
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-slate-700 hover:text-indigo-600">
                  Profile Settings
                </Link>
                <button onClick={handleLogout} className="text-sm text-rose-600 font-bold hover:underline">
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
>>>>>>> 13ba826 (feat: complete premium SaaS frontend redesign)
      )}
    </nav>
  )
}
