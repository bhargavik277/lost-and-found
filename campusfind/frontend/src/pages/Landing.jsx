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
<<<<<<< HEAD
  MapPin,
  X,
  Eye,
  Calendar,
  Tag
=======
  Layers,
  Building2,
  FileText
>>>>>>> 13ba826 (feat: complete premium SaaS frontend redesign)
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
<<<<<<< HEAD
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Ambient Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[360px] bg-gradient-to-tr from-indigo-500/20 via-purple-500/15 to-teal-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-indigo-600/10 rounded-full blur-[90px] pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-6 shadow-sm shadow-indigo-500/10 hover:border-indigo-500/50 transition-colors">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          <span>Next-Gen Smart Lost & Found for Modern Campuses</span>
=======
      <section className="relative pt-8 sm:pt-14 pb-12 sm:pb-16 text-center max-w-5xl mx-auto px-4">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-100/70 via-indigo-50/50 to-purple-100/60 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Feature badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-bold mb-6 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Smart College Lost & Found Management System</span>
>>>>>>> 13ba826 (feat: complete premium SaaS frontend redesign)
        </div>

        {/* Primary Headline */}
        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] max-w-4xl mx-auto">
          Lost Something on Campus?{' '}
<<<<<<< HEAD
          <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-indigo-100 bg-clip-text text-transparent">
            Let AI Reconnect You.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
          CampusFind combines smart TF-IDF text matching, location zone heuristics, and private ownership verification to turn lost property chaotic searches into instant recoveries.
=======
          <span className="gradient-text">
            Let's Help You Find It.
          </span>
        </h1>

        {/* Supporting Text */}
        <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          CampusFind connects students, administrators, and the Main Security Desk to report lost belongings, discover found items, and reconnect rightful owners with verified security.
>>>>>>> 13ba826 (feat: complete premium SaaS frontend redesign)
        </p>

        {/* Primary CTAs */}
        <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-xl mx-auto">
          <Link
            to="/report-lost"
<<<<<<< HEAD
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold rounded-2xl shadow-xl shadow-rose-600/25 hover:shadow-rose-600/40 transition-all flex items-center justify-center gap-2 text-base hover:scale-102"
=======
            className="w-full sm:w-auto px-6 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl shadow-sm shadow-rose-600/25 hover:shadow-md transition-all flex items-center justify-center gap-2 text-sm active:scale-95"
>>>>>>> 13ba826 (feat: complete premium SaaS frontend redesign)
          >
            <PlusCircle className="w-4 h-4" /> I Lost Something
          </Link>
          <Link
            to="/report-found"
<<<<<<< HEAD
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold rounded-2xl shadow-xl shadow-emerald-600/25 hover:shadow-emerald-600/40 transition-all flex items-center justify-center gap-2 text-base hover:scale-102"
=======
            className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-sm shadow-emerald-600/25 hover:shadow-md transition-all flex items-center justify-center gap-2 text-sm active:scale-95"
>>>>>>> 13ba826 (feat: complete premium SaaS frontend redesign)
          >
            <PlusCircle className="w-4 h-4" /> I Found Something
          </Link>
          <Link
            to="/search"
<<<<<<< HEAD
            className="w-full sm:w-auto px-8 py-4 bg-slate-800/90 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700/80 hover:border-slate-600 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 text-base hover:scale-102 shadow-lg"
=======
            className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-300/80 font-bold rounded-2xl shadow-xs hover:border-slate-400 transition-all flex items-center justify-center gap-2 text-sm"
>>>>>>> 13ba826 (feat: complete premium SaaS frontend redesign)
          >
            <Search className="w-4 h-4 text-indigo-600" /> Browse Catalog
          </Link>
        </div>

<<<<<<< HEAD
        {/* Trust Badges */}
        <div className="mt-14 pt-8 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto text-center">
          <div className="p-3 rounded-2xl bg-navy-800/40 border border-slate-800/60">
            <div className="text-2xl sm:text-3xl font-black text-white">90%+</div>
            <div className="text-xs text-slate-400 mt-0.5">Match Accuracy</div>
          </div>
          <div className="p-3 rounded-2xl bg-navy-800/40 border border-slate-800/60">
            <div className="text-2xl sm:text-3xl font-black text-indigo-400">&lt; 4.2 Days</div>
            <div className="text-xs text-slate-400 mt-0.5">Avg. Recovery Time</div>
          </div>
          <div className="p-3 rounded-2xl bg-navy-800/40 border border-slate-800/60">
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">100%</div>
            <div className="text-xs text-slate-400 mt-0.5">Private Proof of Claim</div>
          </div>
          <div className="p-3 rounded-2xl bg-navy-800/40 border border-slate-800/60">
            <div className="text-2xl sm:text-3xl font-black text-purple-400">Real-Time</div>
            <div className="text-xs text-slate-400 mt-0.5">Instant Notifications</div>
=======
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
>>>>>>> 13ba826 (feat: complete premium SaaS frontend redesign)
          </div>
        </div>
      </section>

      {/* 4-Step Workflow Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
<<<<<<< HEAD
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-300 font-semibold mb-3">
            <Compass className="w-3.5 h-3.5 text-indigo-400" /> Automated Lifecycle
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">How CampusFind Works</h2>
          <p className="text-slate-400 text-sm mt-2">Zero hassle, automated notifications, and strict verification.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-hover interactive-lift reveal delay-1 bg-navy-800/90 border border-slate-700/80 p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full blur-2xl pointer-events-none group-hover:bg-indigo-600/20 transition-all"></div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-black text-xl mb-4 shadow-md shadow-indigo-500/10">
=======
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
          <div className="card border-slate-200/90 relative p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center font-bold text-base">
>>>>>>> 13ba826 (feat: complete premium SaaS frontend redesign)
              1
            </div>
            <h3 className="text-base font-bold text-slate-900">Report</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Submit your lost or found item in under 30 seconds with campus location zones, categories, and descriptions.
            </p>
          </div>

<<<<<<< HEAD
          <div className="card-hover interactive-lift reveal delay-2 bg-navy-800/90 border border-slate-700/80 p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-500/20 transition-all"></div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-black text-xl mb-4 shadow-md shadow-amber-500/10">
=======
          <div className="card border-slate-200/90 relative p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center font-bold text-base">
>>>>>>> 13ba826 (feat: complete premium SaaS frontend redesign)
              2
            </div>
            <h3 className="text-base font-bold text-slate-900">Match</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our intelligent engine analyzes item identity, category, location, and dates to identify candidate matches automatically.
            </p>
          </div>

<<<<<<< HEAD
          <div className="card-hover interactive-lift reveal delay-3 bg-navy-800/90 border border-slate-700/80 p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/20 transition-all"></div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-black text-xl mb-4 shadow-md shadow-emerald-500/10">
=======
          <div className="card border-slate-200/90 relative p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center font-bold text-base">
>>>>>>> 13ba826 (feat: complete premium SaaS frontend redesign)
              3
            </div>
            <h3 className="text-base font-bold text-slate-900">Verify</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Submit private ownership proof. Campus administrators review evidence confidentially to prevent fraudulent claims.
            </p>
          </div>

          <div className="card border-slate-200/90 relative p-6 space-y-3">
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
<<<<<<< HEAD
            <h2 className="text-2xl font-bold text-white tracking-tight">Recent Campus Activity</h2>
            <p className="text-xs text-slate-400 mt-1">Live reports across classrooms, library, labs, and sports facilities</p>
          </div>
          <Link to="/search" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 group">
            <span>View All Items</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
=======
            <h2 className="text-2xl font-extrabold text-slate-900">Live Campus Activity</h2>
            <p className="text-xs text-slate-600 mt-1">Recent lost and found items across library, classrooms, labs, and sports grounds</p>
          </div>
          <Link 
            to="/search" 
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl border border-indigo-200 transition-colors w-fit"
          >
            Explore Full Catalog <ArrowRight className="w-3.5 h-3.5" />
>>>>>>> 13ba826 (feat: complete premium SaaS frontend redesign)
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : recentItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
<<<<<<< HEAD
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
          <div className="card text-center py-12 text-slate-400 bg-navy-800/60 border-dashed border-slate-700">
            No active reports right now.
=======
            {recentItems.slice(0, 6).map((item) => (
              <ItemCard key={item.id} item={item} showReporter={false} />
            ))}
          </div>
        ) : (
          <div className="card text-center py-12 text-slate-500 text-sm">
            No active reports right now. Be the first to report an item!
>>>>>>> 13ba826 (feat: complete premium SaaS frontend redesign)
          </div>
        )}
      </section>

<<<<<<< HEAD
      {/* Item Detail Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md modal-overlay">
          <div className="card w-full max-w-md bg-navy-900 border-slate-700 shadow-2xl p-6 relative space-y-4 modal-panel">
            <button
              onClick={() => setPreviewItem(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer"
              aria-label="Close preview"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold ${previewItem.report_type === 'LOST' ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                {previewItem.report_type}
              </span>
              <span className="text-xs text-slate-400">{previewItem.category}</span>
            </div>

            {previewItem.image_url && (
              <div className="w-full h-44 rounded-xl overflow-hidden bg-slate-900 border border-slate-750">
                <img
                  src={previewItem.image_url}
                  alt={previewItem.item_name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <h3 className="text-lg font-bold text-white">{previewItem.item_name}</h3>
            {previewItem.description && (
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-850 p-3 rounded-xl border border-slate-750">
                {previewItem.description}
              </p>
            )}
            <div className="space-y-2 text-xs text-slate-400 pt-2 border-t border-slate-800">
              <div className="flex justify-between">
                <span>Location:</span>
                <span className="text-white font-semibold">{previewItem.location}</span>
              </div>
              <div className="flex justify-between">
                <span>Date Reported:</span>
                <span className="text-white">{previewItem.date_reported}</span>
              </div>
              <div className="flex justify-between">
                <span>Current Status:</span>
                <span className="text-indigo-400 font-semibold">{previewItem.status}</span>
              </div>
            </div>
            <div className="pt-3 border-t border-slate-800 flex gap-2">
              <Link
                to="/search"
                className="flex-1 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-xl text-xs font-bold text-center transition-all"
              >
                Search Full Catalog
              </Link>
              <button
                onClick={() => setPreviewItem(null)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
=======
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
>>>>>>> 13ba826 (feat: complete premium SaaS frontend redesign)
    </div>
  )
}
