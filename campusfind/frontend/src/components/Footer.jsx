import React from 'react'
import { Compass, Heart, Shield, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-navy-950 border-t border-slate-800/80 mt-auto text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                CAMPUS<span className="text-indigo-400">FIND</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              A smart, automated lost-and-found ecosystem engineered for university campuses. 
              Powered by intelligent AI matching, zone-based location tracking, and verified ownership claims.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> TF-IDF AI Scoring
              </span>
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-emerald-400" /> Private Proof of Ownership
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/search" className="hover:text-indigo-400 transition-colors">Browse Public Items</Link></li>
              <li><Link to="/report-lost" className="hover:text-indigo-400 transition-colors">Report Lost Item</Link></li>
              <li><Link to="/report-found" className="hover:text-indigo-400 transition-colors">Report Found Item</Link></li>
              <li><Link to="/matches" className="hover:text-indigo-400 transition-colors">Smart Match Radar</Link></li>
            </ul>
          </div>

          {/* Campus Support */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Campus Support</h4>
            <ul className="space-y-2 text-xs">
              <li className="text-slate-400">Campus Security Office</li>
              <li className="text-slate-400">Main Library Desk 1</li>
              <li className="text-slate-400">admin@campusfind.edu</li>
              <li className="text-emerald-400 font-medium">● System Online</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 CampusFind. Smart College Lost & Found System.</p>
          <p className="flex items-center gap-1">
            "Lost. Found. Reconnected."
          </p>
        </div>
      </div>
    </footer>
  )
}
