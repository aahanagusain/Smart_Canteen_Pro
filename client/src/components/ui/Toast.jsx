import { useEffect } from 'react'

/**
 * Short-lived notification message (toast).
 *
 * @param {Object} props
 * @param {boolean} props.isVisible - Whether the toast is shown
 * @param {string} props.message - Text to display
 * @param {'success'|'error'|'info'} [props.type='info'] - Toast color/style
 * @param {() => void} [props.onClose] - Called when the toast auto-hides or is dismissed
 * @param {number} [props.duration=3000] - Auto-hide delay in milliseconds (0 = no auto-hide)
 */
export default function Toast({
  isVisible,
  message,
  type = 'info',
  onClose,
  duration = 3000,
}) {
  useEffect(() => {
    if (!isVisible || duration <= 0) return undefined

    const timer = setTimeout(() => {
      onClose?.()
    }, duration)

    return () => clearTimeout(timer)
  }, [isVisible, message, duration, onClose])

  if (!isVisible || !message) return null

  return (
    <div className={`ui-toast ui-toast--${type}`} role="status" aria-live="polite">
      <span className="ui-toast-message">{message}</span>
      {onClose ? (
        <button type="button" className="ui-toast-close" onClick={onClose} aria-label="Dismiss">
          ×
        </button>
      ) : null}
    </div>
  )
}
