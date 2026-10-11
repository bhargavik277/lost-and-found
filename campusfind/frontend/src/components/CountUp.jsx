import React, { useEffect, useRef, useState } from 'react'

/**
 * Animates a number from its previous value to the new one (ease-out).
 * Always renders the EXACT final value once the animation completes, and
 * renders it immediately (no animation) when the user prefers reduced motion.
 *
 * Use for KPI stats: <CountUp value={kpis.total_items || 0} />
 */
export default function CountUp({ value, end, duration = 700, className, decimals = 0, suffix = '' }) {
  const rawTarget = value !== undefined ? value : end
  const target = Number(rawTarget) || 0
  const [display, setDisplay] = useState(target)
  const fromRef = useRef(target)
  const frameRef = useRef(null)

  useEffect(() => {
    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const from = fromRef.current
    if (reduced || from === target) {
      fromRef.current = target
      setDisplay(target)
      return undefined
    }

    const start = performance.now()
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3) // ease-out cubic
      const current = from + (target - from) * eased
      setDisplay(decimals > 0 ? Number(current.toFixed(decimals)) : Math.round(current))
      if (t < 1) {
        frameRef.current = requestAnimationFrame(tick)
      } else {
        fromRef.current = target
        setDisplay(target) // land on the exact value
        frameRef.current = null
      }
    }
    frameRef.current = requestAnimationFrame(tick)
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [target, duration, decimals])

  const formatted = decimals > 0 ? Number(display).toFixed(decimals) : display

  return <span className={className}>{formatted}{suffix}</span>
}
