export default function IconButton({ label, onClick, disabled, danger, className = '', children }) {
  return (
    <button
      type="button"
      className={`icon-btn${danger ? ' icon-btn--danger' : ''}${className ? ` ${className}` : ''}`}
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
