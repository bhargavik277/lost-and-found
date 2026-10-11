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
  ArrowRight,
  MapPin,
  Layers,
  CheckCircle2,
  AlertCircle,
  Shield,
  HelpCircle
} from 'lucide-react'
import ItemCard from '../components/ItemCard'
import MatchCard from '../components/MatchCard'
import ClaimModal from '../components/ClaimModal'
import CountUp from '../components/CountUp'

export default function Dashboard() {
  const { user } = useAuth()
  const [myItems, setMyItems] = useState([])
  const [matches, setMatches] = useState([])
  const [claims, setClaims] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedClaimItem, setSelectedClaimItem] = useState(null)

  const fetchData = async () => {
    setLoading(true)
    setError('')
    try {
      const [itemsRes, matchesRes, claimsRes, notifsRes] = await Promise.all([
        itemsAPI.myItems(),
        matchesAPI.getAll(),
        claimsAPI.myClaims(),
        notificationsAPI.getAll(),
      ])
      setMyItems(itemsRes.data || [])
      setMatches(matchesRes.data || [])
      setClaims(claimsRes.data || [])
      setNotifications(notifsRes.data || [])
    } catch (err) {
      setError('Could not refresh dashboard data. Please try again.')
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
      <div className="card reveal bg-white border border-slate-200/90 shadow-sm p-7 sm:p-9 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-indigo-50 via-purple-50/50 to-transparent rounded-full blur-2xl pointer-events-none -mr-16 -mt-16"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-3 border border-indigo-200/80 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Student Dashboard
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome back, <span className="text-indigo-600">{user?.name}</span>
            </h1>
            <p className="text-slate-600 text-sm mt-1.5 max-w-xl leading-relaxed">
              Track your reported property, review intelligent AI match alerts in real time, and coordinate secure ownership claims.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/report-lost"
              className="px-4.5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs shadow-rose-600/20 hover:shadow transition-all flex items-center gap-1.5 active:scale-95"
            >
              <PlusCircle className="w-4 h-4" /> Report Lost Item
            </Link>
            <Link
              to="/report-found"
              className="px-4.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs shadow-emerald-600/20 hover:shadow transition-all flex items-center gap-1.5 active:scale-95"
            >
              <PlusCircle className="w-4 h-4" /> Report Found Item
            </Link>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-2.5 text-xs text-amber-800 font-medium">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="card reveal delay-1 p-5 border-slate-200/90 bg-white hover:border-indigo-200 transition-all shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">My Reports</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 count-emphasis"><CountUp value={myItems.length} /></span>
            <span className="text-xs text-slate-500 font-medium">({lostCount} lost, {foundCount} found)</span>
          </div>
        </div>

        <div className="card reveal delay-2 p-5 border-slate-200/90 bg-white hover:border-amber-200 transition-all shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">AI Match Leads</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-600 count-emphasis"><CountUp value={matches.length} /></span>
            <span className="text-xs text-slate-500 font-medium">potential leads</span>
          </div>
        </div>

        <div className="card reveal delay-3 p-5 border-slate-200/90 bg-white hover:border-purple-200 transition-all shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Claims</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-purple-600 count-emphasis"><CountUp value={pendingClaims} /></span>
            <span className="text-xs text-slate-500 font-medium">under review</span>
          </div>
        </div>

        <div className="card reveal delay-4 p-5 border-slate-200/90 bg-white hover:border-rose-200 transition-all shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Notifications</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <Bell className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-rose-600 count-emphasis"><CountUp value={unreadNotifs} /></span>
            <span className="text-xs text-slate-500 font-medium">unread alerts</span>
          </div>
        </div>
      </div>

      {/* Main Section: Matches Alert + Recent Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Smart Matches Preview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-bold text-slate-900">Smart Match Radar</h2>
            </div>
            <Link to="/matches" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors">
              View All Matches ({matches.length}) <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="card py-16 flex justify-center">
              <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
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
            <div className="card p-8 text-center space-y-3 bg-white border-dashed border-slate-300">
              <Sparkles className="w-8 h-8 text-slate-400 mx-auto" />
              <h4 className="text-sm font-bold text-slate-900">No active matches found yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                When you report a lost item or someone submits a found item matching your description, the AI matching engine will alert you here immediately.
              </p>
            </div>
          )}

          {/* My Recent Reports Section */}
          <div className="pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">My Reported Items</h2>
              <Link to="/my-reports" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors">
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
              <div className="card p-6 text-center text-slate-500 text-xs bg-white">
                You haven't reported any lost or found items yet. Use the buttons above to create your first report.
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Notifications & Quick Help */}
        <div className="space-y-6">
          {/* Notifications Feed */}
          <div className="card space-y-4 bg-white border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">Recent Alerts</h3>
              </div>
              <Link to="/notifications" className="text-xs text-indigo-600 hover:text-indigo-700 font-bold">
                View All
              </Link>
            </div>

            {notifications.length > 0 ? (
              <div className="space-y-2.5">
                {notifications.slice(0, 4).map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-3 rounded-xl border text-xs space-y-1 transition-all duration-300 hover:-translate-y-0.5 ${
                      notif.is_read
                        ? 'bg-slate-50 border-slate-200 text-slate-600'
                        : 'bg-indigo-50/70 border-indigo-200 text-slate-800 font-medium'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span className="font-bold text-indigo-700">{notif.type}</span>
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

          {/* Quick Help & Guidelines */}
          <div className="card bg-gradient-to-br from-indigo-50/80 to-purple-50/50 border border-indigo-100 p-5 space-y-3 shadow-xs">
            <div className="flex items-center gap-2 text-indigo-800">
              <Shield className="w-4 h-4 text-indigo-600" />
              <h4 className="text-xs font-bold uppercase tracking-wider">Campus Recovery Protocol</h4>
            </div>
            <ul className="text-xs text-slate-600 space-y-2 leading-relaxed">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Found an item? Report it promptly to start automated matching.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Claim approval generates a confidential 6-digit Collection OTP.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Present your OTP at the Main Security Desk to complete handover.</span>
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
