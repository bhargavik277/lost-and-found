import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Compass, 
  Search, 
  PlusCircle, 
  Sparkles, 
  ShieldCheck, 
  BarChart3, 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  Package, 
  Clock, 
  MapPin,
  X,
  Eye,
  Calendar,
  Tag
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
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Ambient Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[360px] bg-gradient-to-tr from-indigo-500/20 via-purple-500/15 to-teal-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-indigo-600/10 rounded-full blur-[90px] pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-6 shadow-sm shadow-indigo-500/10 hover:border-indigo-500/50 transition-colors">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          <span>Next-Gen Smart Lost & Found for Modern Campuses</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] max-w-4xl mx-auto">
          Lost Something on Campus?{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-indigo-100 bg-clip-text text-transparent">
            Let AI Reconnect You.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
          CampusFind combines smart TF-IDF text matching, location zone heuristics, and private ownership verification to turn lost property chaotic searches into instant recoveries.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/report-lost"
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold rounded-2xl shadow-xl shadow-rose-600/25 hover:shadow-rose-600/40 transition-all flex items-center justify-center gap-2 text-base hover:scale-102"
          >
            <PlusCircle className="w-5 h-5" /> I Lost Something
          </Link>
          <Link
            to="/report-found"
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold rounded-2xl shadow-xl shadow-emerald-600/25 hover:shadow-emerald-600/40 transition-all flex items-center justify-center gap-2 text-base hover:scale-102"
          >
            <PlusCircle className="w-5 h-5" /> I Found Something
          </Link>
          <Link
            to="/search"
            className="w-full sm:w-auto px-8 py-4 bg-slate-800/90 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700/80 hover:border-slate-600 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 text-base hover:scale-102 shadow-lg"
          >
            <Search className="w-5 h-5 text-indigo-400" /> Browse Catalog
          </Link>
        </div>

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
          </div>
        </div>
      </section>

      {/* 3 Step Workflow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
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
              1
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Report in 30 Seconds</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Post your lost or found item with quick tags, campus zone location, category, and optional photos.
            </p>
          </div>

          <div className="card-hover interactive-lift reveal delay-2 bg-navy-800/90 border border-slate-700/80 p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-500/20 transition-all"></div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-black text-xl mb-4 shadow-md shadow-amber-500/10">
              2
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Intelligent Matching</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Our AI engine continuously analyzes category, location zones, and keywords to calculate match probabilities and trigger instant alerts.
            </p>
          </div>

          <div className="card-hover interactive-lift reveal delay-3 bg-navy-800/90 border border-slate-700/80 p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/20 transition-all"></div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-black text-xl mb-4 shadow-md shadow-emerald-500/10">
              3
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Verified Handover</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Submit confidential proof of ownership. Campus security validates the match and coordinates a secure return.
            </p>
          </div>
        </div>
      </section>

      {/* Recent Items Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Recent Campus Activity</h2>
            <p className="text-xs text-slate-400 mt-1">Live reports across classrooms, library, labs, and sports facilities</p>
          </div>
          <Link to="/search" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 group">
            <span>View All Items</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
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
          <div className="card text-center py-12 text-slate-400 bg-navy-800/60 border-dashed border-slate-700">
            No active reports right now.
          </div>
        )}
      </section>

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
    </div>
  )
}
