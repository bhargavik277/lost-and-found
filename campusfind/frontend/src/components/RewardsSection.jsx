import React from 'react'
import { 
  Star, 
  Award, 
  Trophy, 
  ShieldCheck, 
  Sparkles, 
  Lock, 
  CheckCircle2, 
  Medal,
  Clock,
  ChevronRight
} from 'lucide-react'
import CountUp from './CountUp'

// Visual icons and themes matching the 4 achievement badge tiers
const BADGE_CONFIG = {
  FIRST_FIND: {
    icon: Sparkles,
    gradient: 'from-blue-500/20 via-indigo-500/10 to-transparent',
    borderColor: 'border-blue-500/40',
    iconColor: 'text-blue-400',
    badgeTagBg: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  },
  GOOD_SAMARITAN: {
    icon: ShieldCheck,
    gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    borderColor: 'border-emerald-500/40',
    iconColor: 'text-emerald-400',
    badgeTagBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  },
  CAMPUS_HERO: {
    icon: Medal,
    gradient: 'from-purple-500/20 via-indigo-500/10 to-transparent',
    borderColor: 'border-purple-500/40',
    iconColor: 'text-purple-400',
    badgeTagBg: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  },
  CAMPUS_LEGEND: {
    icon: Trophy,
    gradient: 'from-amber-500/25 via-yellow-500/10 to-transparent',
    borderColor: 'border-amber-500/50',
    iconColor: 'text-amber-400',
    badgeTagBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  },
}

export default function RewardsSection({ rewards, loading = false, compact = false }) {
  if (loading && !rewards) {
    return (
      <div className="card bg-navy-800 border-slate-700/60 p-6 flex justify-center items-center py-12">
        <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const totalStars = rewards?.total_stars ?? 0
  const verifiedRecoveries = rewards?.verified_recoveries ?? 0
  const badges = rewards?.badges ?? []
  const nextMilestone = rewards?.next_milestone

  return (
    <div className="card reveal bg-navy-800 border-slate-700/70 p-6 sm:p-7 space-y-6 relative overflow-hidden shadow-xl shadow-black/20">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none -ml-12 -mb-12"></div>

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-700/80 relative z-10">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/15 text-amber-300 text-xs font-bold border border-amber-500/30">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> Star Reputation & Badges
          </div>
          <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            Campus Recognition
          </h2>
          <p className="text-xs text-slate-400 max-w-md">
            Earn 1 star and unlock honorary badges for each verified lost item successfully returned to its rightful owner.
          </p>
        </div>

        {/* Highlighted Stars Metric Chip */}
        <div className="flex items-center gap-3 bg-slate-850/90 border border-slate-700/80 p-3 sm:px-4 sm:py-2.5 rounded-2xl shadow-inner">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 text-white font-black animate-scale-up">
            <Star className="w-5 h-5 fill-white text-white drop-shadow" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-amber-400 count-emphasis">
                <CountUp value={totalStars} />
              </span>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                {totalStars === 1 ? 'Star' : 'Stars'}
              </span>
            </div>
            <span className="text-[11px] text-slate-400 block font-medium">
              {verifiedRecoveries} {verifiedRecoveries === 1 ? 'verified recovery' : 'verified recoveries'}
            </span>
          </div>
        </div>
      </div>

      {/* Next Milestone Progress Bar (if not maxed out) */}
      {nextMilestone ? (
        <div className="p-4 rounded-xl bg-gradient-to-r from-slate-850 via-indigo-950/20 to-slate-850 border border-indigo-500/20 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1 mb-2">
            <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Next Milestone: <strong className="text-white">{nextMilestone.name}</strong></span>
            </div>
            <span className="text-slate-400 text-[11px]">
              <strong className="text-indigo-400">{nextMilestone.remaining}</strong> more {nextMilestone.remaining === 1 ? 'recovery' : 'recoveries'} needed ({nextMilestone.progress}%)
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-750 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-amber-400 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${Math.max(5, nextMilestone.progress)}%` }}
            />
          </div>
        </div>
      ) : verifiedRecoveries >= 10 ? (
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2 text-xs text-amber-300 font-semibold relative z-10">
          <Trophy className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>Incredible! You have unlocked all milestone tiers and achieved Campus Legend status!</span>
        </div>
      ) : null}

      {/* 4 Achievement Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 relative z-10">
        {badges.map((badge) => {
          const cfg = BADGE_CONFIG[badge.key] || BADGE_CONFIG.FIRST_FIND
          const IconComponent = cfg.icon
          const isUnlocked = badge.is_unlocked

          return (
            <div
              key={badge.key}
              className={`p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                isUnlocked
                  ? `bg-navy-850 ${cfg.borderColor} shadow-lg shadow-black/20 hover:-translate-y-1 hover:border-amber-400/60`
                  : 'bg-slate-850/50 border-slate-750/70 opacity-75 hover:opacity-90'
              }`}
            >
              {/* Unlocked background wash */}
              {isUnlocked && (
                <div className={`absolute inset-0 bg-gradient-to-br ${cfg.gradient} pointer-events-none`} />
              )}

              <div className="space-y-3 relative z-10">
                {/* Top row: Badge icon & unlock status */}
                <div className="flex items-center justify-between">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-300 ${
                      isUnlocked
                        ? `bg-slate-800 ${cfg.iconColor} border ${cfg.borderColor} shadow-md`
                        : 'bg-slate-800/80 text-slate-500 border border-slate-700'
                    }`}
                  >
                    {isUnlocked ? (
                      <IconComponent className="w-5 h-5 drop-shadow animate-scale-up" />
                    ) : (
                      <Lock className="w-4 h-4" />
                    )}
                  </div>

                  {isUnlocked ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" /> Unlocked
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-750 text-slate-400 border border-slate-700">
                      {badge.current_count}/{badge.threshold}
                    </span>
                  )}
                </div>

                {/* Badge title & description */}
                <div>
                  <h4 className={`text-sm font-bold tracking-tight ${isUnlocked ? 'text-white' : 'text-slate-400'}`}>
                    {badge.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                    {badge.description}
                  </p>
                </div>
              </div>

              {/* Bottom footer: Progress or Unlocked date */}
              <div className="pt-3 mt-3 border-t border-slate-700/50 relative z-10 text-[10px]">
                {isUnlocked ? (
                  <span className="text-amber-300/80 font-medium flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> Milestone Achieved
                  </span>
                ) : (
                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-400 font-medium">
                      <span>Progress</span>
                      <span>{badge.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-700/80 overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                        style={{ width: `${badge.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
