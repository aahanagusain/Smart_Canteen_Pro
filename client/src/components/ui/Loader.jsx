/**
 * Loading spinner with optional message.
 *
 * @param {Object} props
 * @param {string} [props.text='Loading...'] - Message shown below the spinner
 * @param {'sm'|'md'|'lg'} [props.size='md'] - Spinner size
 * @param {boolean} [props.centered=true] - Center content in its container
 * @param {string} [props.className=''] - Extra CSS classes for the wrapper
 */
export default function Loader({
  text = 'Loading...',
  size = 'md',
  centered = true,
  className = '',
}) {
  const wrapperClass = centered ? 'ui-loader ui-loader--centered' : 'ui-loader'

  return (
    <div className={`${wrapperClass} ${className}`.trim()} role="status" aria-live="polite">
      <div className={`ui-loader-spinner ui-loader-spinner--${size}`} aria-hidden="true" />
      {text ? <p className="ui-loader-text">{text}</p> : null}
    </div>
  )
}
