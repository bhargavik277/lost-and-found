import { useCallback, useRef, useState } from 'react'

/**
 * Gives a conditionally-rendered modal a closing animation.
 *
 * Usage inside a modal component whose open state lives in the parent:
 *   const { closing, handleClose } = useModalExit(onClose)
 *   if (!isOpen) return null
 *   ...swap every onClose call in the JSX for handleClose...
 *   <div className={`modal-overlay ${closing ? 'is-closing' : ''}`}>
 *     <div className={`modal-panel ${closing ? 'is-closing' : ''}`}>
 *
 * handleClose() flips the local `closing` flag (which applies the reverse
 * animation via CSS), then calls the real onClose after the animation has
 * played, so the parent unmounts the modal with the exit already done.
 * Rapid re-calls are ignored while a close is in flight.
 */
export default function useModalExit(onClose, durationMs = 180) {
  const [closing, setClosing] = useState(false)
  const timerRef = useRef(null)

  const handleClose = useCallback(() => {
    if (timerRef.current) return
    setClosing(true)
    timerRef.current = setTimeout(() => {
      timerRef.current = null
      setClosing(false)
      onClose?.()
    }, durationMs)
  }, [onClose, durationMs])

  return { closing, handleClose }
}
