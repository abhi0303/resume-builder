export default function IconButton({ label, onClick, disabled, danger, children }) {
  return (
    <button
      type="button"
      className={`icon-btn${danger ? ' icon-btn--danger' : ''}`}
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
