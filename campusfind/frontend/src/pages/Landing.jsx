import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  PlusCircle,
  Search,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  KeyRound,
  MapPin,
  CheckCircle2,
  Clock,
  X,
  Layers,
  Building2,
  FileText
} from 'lucide-react'
import { itemsAPI } from '../services/api'
import ItemCard from '../components/ItemCard'

export default function Landing() {
  const [recentItems, setRecentItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [previewItem, setPreviewItem] = useState(null)

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await itemsAPI.list({ page_size: 6 })
        setRecentItems(res.data.items || [])
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    fetchRecent()
  }, [])

  return (
    <div className="space-y-20 pb-16 animate-fade-in">
      {/* Hero Section */}
      <section className="relative pt-8 sm:pt-14 pb-12 sm:pb-16 text-center max-w-5xl mx-auto px-4">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-100/70 via-indigo-50/50 to-purple-100/60 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Feature badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-bold mb-6 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Smart College Lost & Found Management System</span>
        </div>

        {/* Primary Headline */}
        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] max-w-4xl mx-auto">
          Lost Something on Campus?{' '}
          <span className="gradient-text">
            Let's Help You Find It.
          </span>
        </h1>

        {/* Supporting Text */}
        <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          CampusFind connects students, administrators, and the Main Security Desk to report lost belongings, discover found items, and reconnect rightful owners with verified security.
        </p>

        {/* Primary CTAs */}
        <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-xl mx-auto">
          <Link
            to="/report-lost"
            className="w-full sm:w-auto px-6 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl shadow-sm shadow-rose-600/25 hover:shadow-md transition-all flex items-center justify-center gap-2 text-sm active:scale-95"
          >
            <PlusCircle className="w-4 h-4" /> I Lost Something
          </Link>
          <Link
            to="/report-found"
            className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-sm shadow-emerald-600/25 hover:shadow-md transition-all flex items-center justify-center gap-2 text-sm active:scale-95"
          >
            <PlusCircle className="w-4 h-4" /> I Found Something
          </Link>
          <Link
            to="/search"
            className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-300/80 font-bold rounded-2xl shadow-xs hover:border-slate-400 transition-all flex items-center justify-center gap-2 text-sm"
          >
            <Search className="w-4 h-4 text-indigo-600" /> Browse Catalog
          </Link>
        </div>

        {/* Highlights Bar */}
        <div className="mt-14 pt-8 border-t border-slate-200/90 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-white rounded-xl border border-slate-200/70 shadow-xs">
            <div className="text-sm font-bold text-slate-900 flex items-center justify-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" /> Intelligent Matching
            </div>
            <div className="text-xs text-slate-500 mt-0.5">Automated similarity radar</div>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200/70 shadow-xs">
            <div className="text-sm font-bold text-slate-900 flex items-center justify-center gap-1.5">
              <MapPin className="w-4 h-4 text-indigo-600" /> Zone-Based Discovery
            </div>
            <div className="text-xs text-slate-500 mt-0.5">Campus location tracking</div>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200/70 shadow-xs">
            <div className="text-sm font-bold text-slate-900 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Private Proof of Claim
            </div>
            <div className="text-xs text-slate-500 mt-0.5">Confidential ownership check</div>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200/70 shadow-xs">
            <div className="text-sm font-bold text-slate-900 flex items-center justify-center gap-1.5">
              <KeyRound className="w-4 h-4 text-amber-600" /> OTP Verified Handover
            </div>
            <div className="text-xs text-slate-500 mt-0.5">Security Desk coordination</div>
          </div>
        </div>
      </section>

      {/* 4-Step Workflow Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Lifecycle Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
            How CampusFind Works
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            A structured, 4-step process designed to make lost property reporting quick, transparent, and secure.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card reveal delay-1 border-slate-200/90 bg-white relative p-6 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center font-bold text-base">
              1
            </div>
            <h3 className="text-base font-bold text-slate-900">Report</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Submit your lost or found item in under 30 seconds with campus location zones, categories, and descriptions.
            </p>
          </div>

          <div className="card reveal delay-2 border-slate-200/90 bg-white relative p-6 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center font-bold text-base">
              2
            </div>
            <h3 className="text-base font-bold text-slate-900">Match</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our intelligent engine analyzes item identity, category, location, and dates to identify candidate matches automatically.
            </p>
          </div>

          <div className="card reveal delay-3 border-slate-200/90 bg-white relative p-6 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center font-bold text-base">
              3
            </div>
            <h3 className="text-base font-bold text-slate-900">Verify</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Submit private ownership proof. Campus administrators review evidence confidentially to prevent fraudulent claims.
            </p>
          </div>

          <div className="card reveal delay-4 border-slate-200/90 bg-white relative p-6 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold text-base">
              4
            </div>
            <h3 className="text-base font-bold text-slate-900">Recover</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Approved claimants receive a secure 6-digit Collection OTP to present at the Main Security Desk for verified item handover.
            </p>
          </div>
        </div>
      </section>

      {/* Live Campus Activity / Recent Items */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">Live Campus Activity</h2>
            <p className="text-xs text-slate-600 mt-1">Recent lost and found items across library, classrooms, labs, and sports grounds</p>
          </div>
          <Link
            to="/search"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl border border-indigo-200 transition-colors w-fit"
          >
            Explore Full Catalog <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : recentItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentItems.slice(0, 6).map((item, idx) => (
              <div key={item.id} className={`reveal delay-${(idx % 6) + 1}`}>
                <ItemCard
                  item={item}
                  showReporter={false}
                  onViewDetail={(i) => setPreviewItem(i)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-12 text-slate-500 text-sm bg-white border border-slate-200">
            No active reports right now. Be the first to report an item!
          </div>
        )}
      </section>

      {/* Item Detail Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs modal-overlay">
          <div className="card w-full max-w-md bg-white border-slate-200 shadow-2xl p-6 relative space-y-4 modal-panel">
            <button
              onClick={() => setPreviewItem(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              aria-label="Close preview"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${previewItem.report_type === 'LOST' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                {previewItem.report_type}
              </span>
              <span className="text-xs text-slate-500 font-medium">{previewItem.category}</span>
            </div>

            {previewItem.image_url && (
              <div className="w-full h-44 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                <img
                  src={previewItem.image_url}
                  alt={previewItem.item_name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <h3 className="text-lg font-bold text-slate-900">{previewItem.item_name}</h3>
            {previewItem.description && (
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                {previewItem.description}
              </p>
            )}
            <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <div className="flex justify-between">
                <span>Location:</span>
                <span className="text-slate-900 font-semibold">{previewItem.location}</span>
              </div>
              <div className="flex justify-between">
                <span>Date Reported:</span>
                <span className="text-slate-900">{previewItem.date_reported}</span>
              </div>
              <div className="flex justify-between">
                <span>Current Status:</span>
                <span className="text-indigo-600 font-semibold">{previewItem.status}</span>
              </div>
            </div>
            <div className="pt-3 border-t border-slate-100 flex gap-2">
              <Link
                to="/search"
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold text-center transition-all shadow-xs"
              >
                Search Full Catalog
              </Link>
              <button
                onClick={() => setPreviewItem(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-8 sm:p-12 rounded-3xl shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to recover your campus belongings?
            </h3>
            <p className="text-indigo-100 text-sm max-w-xl">
              Sign up with your university email to start tracking your lost items or report found property today.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/register"
              className="px-6 py-3 bg-white text-indigo-700 hover:bg-indigo-50 font-bold rounded-xl text-sm shadow-sm transition-all"
            >
              Create Account
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 bg-indigo-800/60 hover:bg-indigo-800 text-white font-bold rounded-xl text-sm border border-indigo-400/40 transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
