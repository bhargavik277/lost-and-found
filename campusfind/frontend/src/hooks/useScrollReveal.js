import { useLayoutEffect } from 'react'

/**
 * Scroll-triggered reveal system.
 *
 * Elements tagged with `.reveal`, `.reveal-fade` or `.bar-grow` stay hidden
 * until they scroll INTO the viewport, then transition in (stagger delays come
 * from the `.delay-N` classes next to them).
 *
 * Safety: the hidden state is gated behind the `.reveal-ready` class on
 * <html>. We add that class in main.jsx *before* React renders (so there is no
 * flash of unstyled content), and we synchronously mark every element that is
 * already inside the viewport as visible during the layout phase — so nothing
 * flickers on first paint and nothing can stay permanently invisible:
 *  - no IntersectionObserver support  -> class never added, all content visible
 *  - prefers-reduced-motion           -> class never added, all content visible
 *  - dynamically added nodes (route changes, data loads) are picked up by a
 *    MutationObserver and revealed immediately if already in view.
 */

const SELECTOR = '.reveal, .reveal-fade, .bar-grow'

let sharedObserver = null

function getObserver() {
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            sharedObserver.unobserve(entry.target)
          }
        }
      },
      {
        // Start slightly before the element reaches the viewport bottom.
        rootMargin: '0px 0px -48px 0px',
        threshold: 0,
      }
    )
  }
  return sharedObserver
}

function isInViewport(el) {
  const rect = el.getBoundingClientRect()
  return rect.top < window.innerHeight - 24 && rect.bottom > 0
}

function scan(scope) {
  const observer = getObserver()
  const targets = []
  if (scope instanceof Element && scope.matches && scope.matches(SELECTOR)) {
    targets.push(scope)
  }
  if (scope.querySelectorAll) {
    targets.push(...scope.querySelectorAll(SELECTOR))
  }
  for (const el of targets) {
    if (el.classList.contains('is-visible')) continue
    if (isInViewport(el)) {
      // Already on screen (first paint / route change): reveal immediately.
      el.classList.add('is-visible')
    } else {
      observer.observe(el)
    }
  }
}

export function useScrollReveal() {
  useLayoutEffect(() => {
    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // If the browser can't do scroll reveals (or the user asked for reduced
    // motion) we never add `.reveal-ready`, so all content simply renders
    // visible with no animation — the safe fallback.
    if (reduced || !('IntersectionObserver' in window)) return undefined

    const root = document.documentElement
    root.classList.add('reveal-ready')

    // Reveal everything already inside the viewport before the browser paints.
    scan(document.body)

    const mutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === 1) scan(node)
        }
      }
    })
    mutationObserver.observe(document.body, { childList: true, subtree: true })

    return () => {
      mutationObserver.disconnect()
      root.classList.remove('reveal-ready')
      sharedObserver?.disconnect()
      sharedObserver = null
    }
  }, [])
}

export default useScrollReveal
