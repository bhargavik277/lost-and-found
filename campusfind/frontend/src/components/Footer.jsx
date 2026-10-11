import React from 'react'
import { Compass, Shield, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto text-slate-600 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shadow-xs">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-extrabold text-slate-900 tracking-tight">
                CAMPUS<span className="text-indigo-600">FIND</span>
              </span>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed max-w-md">
              A modern, intelligent lost-and-found ecosystem engineered for university campuses.
              Powered by multi-parameter similarity scoring, campus zone tracking, and cryptographic OTP-verified handovers.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 pt-1">
              <span className="flex items-center gap-1.5 text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Smart Radar Matching
              </span>
              <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                <Shield className="w-3.5 h-3.5 text-emerald-600" /> Private Proof of Ownership
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-slate-900 font-bold mb-3 text-sm">Explore CampusFind</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li><Link to="/search" className="hover:text-indigo-600 transition-colors">Browse Public Catalog</Link></li>
              <li><Link to="/report-lost" className="hover:text-indigo-600 transition-colors">Report Lost Item</Link></li>
              <li><Link to="/report-found" className="hover:text-indigo-600 transition-colors">Report Found Item</Link></li>
              <li><Link to="/matches" className="hover:text-indigo-600 transition-colors">Smart Match Radar</Link></li>
            </ul>
          </div>

          {/* Campus Support */}
          <div>
            <h4 className="text-slate-900 font-bold mb-3 text-sm">Security & Support</h4>
            <ul className="space-y-2 text-xs">
              <li className="text-slate-600">Main Security Desk (Gate 1)</li>
              <li className="text-slate-600">Central Campus Library</li>
              <li className="text-slate-600">support@campusfind.edu</li>
              <li className="flex items-center gap-2 text-emerald-700 font-semibold pt-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Campus Station Operational
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 CampusFind. Smart College Lost & Found Management System.</p>
          <p className="font-semibold text-slate-600">
            "Lost. Found. Reconnected."
          </p>
        </div>
      </div>
    </footer>
  )
}
