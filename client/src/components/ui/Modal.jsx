import { useEffect } from 'react'

/**
 * Modal dialog overlay for confirmations or extra content.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is visible
 * @param {() => void} props.onClose - Called when the user closes the modal
 * @param {string} [props.title=''] - Modal heading
 * @param {React.ReactNode} props.children - Modal body content
 * @param {string} [props.className=''] - Extra CSS classes for the modal panel
 */
export default function Modal({ isOpen, onClose, title = '', children, className = '' }) {
  useEffect(() => {
    if (!isOpen) return undefined

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="ui-modal-overlay" onClick={onClose} role="presentation">
      <div
        className={`ui-modal ${className}`.trim()}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'ui-modal-title' : undefined}
      >
        <div className="ui-modal-header">
          {title ? (
            <h2 id="ui-modal-title" className="ui-modal-title">
              {title}
            </h2>
          ) : null}
          <button type="button" className="ui-modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className="ui-modal-body">{children}</div>
      </div>
    </div>
  )
}
