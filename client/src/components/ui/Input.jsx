/**
 * Reusable text input with optional label and error message.
 *
 * @param {Object} props
 * @param {string} props.id - Input id (used for label association)
 * @param {string} [props.label] - Label text shown above the input
 * @param {string} [props.type='text'] - HTML input type (text, email, password, etc.)
 * @param {string} [props.value=''] - Controlled input value
 * @param {(e: React.ChangeEvent<HTMLInputElement>) => void} [props.onChange] - Change handler
 * @param {string} [props.placeholder=''] - Placeholder text
 * @param {boolean} [props.required=false] - Marks field as required
 * @param {string} [props.error=''] - Error message displayed below the input
 * @param {'default'|'login'} [props.variant='default'] - Visual style variant
 * @param {string} [props.className=''] - Extra CSS classes for the input element
 */
export default function Input({
  id,
  label,
  type = 'text',
  value = '',
  onChange,
  placeholder = '',
  required = false,
  error = '',
  variant = 'default',
  className = '',
}) {
  const inputClass = variant === 'login' ? 'login-input' : 'ui-input'
  const hasError = Boolean(error)

  return (
    <div className={`ui-input-group ${hasError ? 'ui-input-group--error' : ''}`}>
      {label ? (
        <label
          htmlFor={id}
          className={variant === 'login' ? 'login-input-label' : 'ui-input-label'}
        >
          {label}
        </label>
      ) : null}
      <input
        id={id}
        type={type}
        className={`${inputClass} ${className}`.trim()}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        aria-invalid={hasError}
      />
      {hasError ? <p className="ui-input-error">{error}</p> : null}
    </div>
  )
}
