/**
 * Reusable button component with multiple style variants.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Button label or content
 * @param {() => void} [props.onClick] - Click handler
 * @param {'button'|'submit'|'reset'} [props.type='button'] - Native button type
 * @param {'primary'|'secondary'|'danger'|'gradient'} [props.variant='primary'] - Visual style
 * @param {boolean} [props.disabled=false] - Disables the button
 * @param {boolean} [props.fullWidth=false] - Stretches button to full container width
 * @param {string} [props.className=''] - Extra CSS classes
 */
export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  fullWidth = false,
  className = '',
}) {
  const variantClass = {
    primary: 'ui-btn ui-btn--primary',
    secondary: 'ui-btn ui-btn--secondary',
    danger: 'ui-btn ui-btn--danger',
    gradient: 'ui-btn ui-btn--gradient',
  }[variant]

  const widthClass = fullWidth ? 'ui-btn--full' : ''

  return (
    <button
      type={type}
      className={`${variantClass} ${widthClass} ${className}`.trim()}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
