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
  MapPin 
} from 'lucide-react'
import { itemsAPI } from '../services/api'

export default function Landing() {
  const [recentItems, setRecentItems] = useState([])
  const [loading, setLoading] = useState(true)

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
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-indigo-500/15 rounded-full blur-[100px] pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Next-Gen Smart Lost & Found for Modern Campuses</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] max-w-4xl mx-auto">
          Lost Something on Campus?{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-indigo-200 bg-clip-text text-transparent">
            Let AI Reconnect You.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
          CampusFind combines smart TF-IDF text matching, location zone heuristics, and private ownership verification to turn lost property chaotic searches into instant recoveries.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/report-lost"
            className="w-full sm:w-auto px-8 py-4 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-2xl shadow-xl shadow-rose-600/25 hover:shadow-rose-600/40 transition-all flex items-center justify-center gap-2 text-base"
          >
            <PlusCircle className="w-5 h-5" /> I Lost Something
          </Link>
          <Link
            to="/report-found"
            className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-xl shadow-emerald-600/25 hover:shadow-emerald-600/40 transition-all flex items-center justify-center gap-2 text-base"
          >
            <PlusCircle className="w-5 h-5" /> I Found Something
          </Link>
          <Link
            to="/search"
            className="w-full sm:w-auto px-8 py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 text-base"
          >
            <Search className="w-5 h-5 text-indigo-400" /> Browse Catalog
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="mt-14 pt-8 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-black text-white">90%+</div>
            <div className="text-xs text-slate-400">Match Accuracy</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-indigo-400">&lt; 4.2 Days</div>
            <div className="text-xs text-slate-400">Avg. Recovery Time</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">100%</div>
            <div className="text-xs text-slate-400">Private Proof of Claim</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-purple-400">Real-Time</div>
            <div className="text-xs text-slate-400">Instant Notifications</div>
          </div>
        </div>
      </section>

      {/* 3 Step Workflow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">How CampusFind Works</h2>
          <p className="text-slate-400 text-sm mt-2">Zero hassle, automated notifications, and strict verification.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-hover">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-black text-xl mb-4">
              1
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Report in 30 Seconds</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Post your lost or found item with quick tags, campus zone location, category, and optional photos.
            </p>
          </div>

          <div className="card-hover">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-black text-xl mb-4">
              2
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Intelligent Matching</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Our AI engine continuously analyzes category, location zones, and keywords to calculate match probabilities and trigger instant alerts.
            </p>
          </div>

          <div className="card-hover">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-black text-xl mb-4">
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
            <h2 className="text-2xl font-bold text-white">Recent Campus Activity</h2>
            <p className="text-xs text-slate-400 mt-1">Live reports across classrooms, library, labs, and sports facilities</p>
          </div>
          <Link to="/search" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
            View All Items <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : recentItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentItems.slice(0, 6).map((item) => (
              <div key={item.id} className="card-hover">
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${item.report_type === 'LOST' ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                    {item.report_type === 'LOST' ? '🔴 Lost' : '🟢 Found'}
                  </span>
                  <span className="text-[11px] text-slate-400">{item.category}</span>
                </div>
                <h4 className="text-base font-bold text-white line-clamp-1">{item.item_name}</h4>
                <div className="mt-3 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1 truncate"><MapPin className="w-3.5 h-3.5 text-indigo-400" /> {item.location}</span>
                  <span>{item.date_reported}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-12 text-slate-400">
            No active reports right now.
          </div>
        )}
      </section>
    </div>
  )
}
