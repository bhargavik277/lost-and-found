import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../store/AuthContext'
import { itemsAPI, matchesAPI, claimsAPI, notificationsAPI } from '../services/api'
import { 
  PlusCircle, 
  Search, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  Bell, 
  FileText, 
  ArrowRight, 
  MapPin, 
  Layers, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react'
import ItemCard from '../components/ItemCard'
import MatchCard from '../components/MatchCard'
import ClaimModal from '../components/ClaimModal'

export default function Dashboard() {
  const { user } = useAuth()
  const [myItems, setMyItems] = useState([])
  const [matches, setMatches] = useState([])
  const [claims, setClaims] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedClaimItem, setSelectedClaimItem] = useState(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [itemsRes, matchesRes, claimsRes, notifsRes] = await Promise.all([
        itemsAPI.myItems(),
        matchesAPI.list(),
        claimsAPI.myClaims(),
        notificationsAPI.list(),
      ])
      setMyItems(itemsRes.data || [])
      setMatches(matchesRes.data || [])
      setClaims(claimsRes.data || [])
      setNotifications(notifsRes.data || [])
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const lostCount = myItems.filter(i => i.report_type === 'LOST').length
  const foundCount = myItems.filter(i => i.report_type === 'FOUND').length
  const pendingClaims = claims.filter(c => c.status === 'PENDING').length
  const unreadNotifs = notifications.filter(n => !n.is_read).length

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Welcome Banner */}
      <div className="card bg-gradient-to-r from-navy-800 via-indigo-950/40 to-navy-800 border-slate-700/80 p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3 border border-indigo-500/30">
              <Sparkles className="w-3.5 h-3.5" /> Student Dashboard
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome back, <span className="text-indigo-400">{user?.name}</span>!
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              Track your reported items, review intelligent AI matches in real time, and manage ownership claims securely.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/report-lost"
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-600/20 transition-all flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" /> Report Lost Item
            </Link>
            <Link
              to="/report-found"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" /> Report Found Item
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="card p-5 border-slate-700/60 bg-navy-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">My Reports</span>
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white">{myItems.length}</span>
            <span className="text-xs text-slate-400 font-medium">({lostCount} lost, {foundCount} found)</span>
          </div>
        </div>

        <div className="card p-5 border-slate-700/60 bg-navy-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">AI Match Leads</span>
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-amber-400">{matches.length}</span>
            <span className="text-xs text-slate-400 font-medium">potential matches</span>
          </div>
        </div>

        <div className="card p-5 border-slate-700/60 bg-navy-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Pending Claims</span>
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-purple-400">{pendingClaims}</span>
            <span className="text-xs text-slate-400 font-medium">under review</span>
          </div>
        </div>

        <div className="card p-5 border-slate-700/60 bg-navy-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Notifications</span>
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
              <Bell className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-rose-400">{unreadNotifs}</span>
            <span className="text-xs text-slate-400 font-medium">unread alerts</span>
          </div>
        </div>
      </div>

      {/* Main Section: Matches Alert + Recent Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Smart Matches Preview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-bold text-white">Smart Match Radar</h2>
            </div>
            <Link to="/matches" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
              View All Matches ({matches.length}) <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="card py-12 flex justify-center">
              <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : matches.length > 0 ? (
            <div className="space-y-4">
              {matches.slice(0, 3).map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  onClaim={(item) => setSelectedClaimItem(item)}
                />
              ))}
            </div>
          ) : (
            <div className="card p-8 text-center space-y-3 bg-navy-800/60 border-dashed border-slate-700">
              <Sparkles className="w-8 h-8 text-slate-500 mx-auto" />
              <h4 className="text-sm font-bold text-white">No active matches found yet</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                When you report a lost item or someone reports a found item matching your description, the AI will alert you here immediately.
              </p>
            </div>
          )}

          {/* My Recent Reports Section */}
          <div className="pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">My Reported Items</h2>
              <Link to="/my-reports" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                Manage Reports ({myItems.length}) <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {myItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {myItems.slice(0, 4).map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    showReporter={false}
                  />
                ))}
              </div>
            ) : (
              <div className="card p-6 text-center text-slate-400 text-xs">
                You haven't reported any items yet.
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Notifications & Quick Help */}
        <div className="space-y-6">
          {/* Notifications Feed */}
          <div className="card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">Recent Alerts</h3>
              </div>
              <Link to="/notifications" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold">
                View All
              </Link>
            </div>

            {notifications.length > 0 ? (
              <div className="space-y-3">
                {notifications.slice(0, 4).map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-3 rounded-xl border text-xs space-y-1 transition-colors ${
                      notif.is_read
                        ? 'bg-slate-850 border-slate-750 text-slate-400'
                        : 'bg-indigo-950/30 border-indigo-500/30 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span className="font-semibold text-indigo-400">{notif.type}</span>
                      <span>{new Date(notif.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="line-clamp-2 leading-relaxed">{notif.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-4">No new notifications</p>
            )}
          </div>

          {/* Campus Recovery Guide Card */}
          <div className="card bg-gradient-to-br from-indigo-900/30 to-purple-900/20 border-indigo-500/20 space-y-3 p-5">
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Campus Recovery Tips
            </h4>
            <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 font-bold">•</span>
                <span>Include distinct identifiers (case color, stickers, lock wallpaper).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 font-bold">•</span>
                <span>Found items are handed over to Campus Security Desk after admin verification.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 font-bold">•</span>
                <span>Keep your student ID handy during item pickup.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Claim Modal */}
      <ClaimModal
        item={selectedClaimItem}
        isOpen={!!selectedClaimItem}
        onClose={() => setSelectedClaimItem(null)}
        onSuccess={fetchData}
      />
    </div>
  )
}
