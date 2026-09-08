/**
 * Drag handle between the editor and the preview. Drag anywhere on the bar, use
 * the chevrons to jump between stops, or double-click to restore the default.
 */
export default function Splitter({ dragging, collapsed, canShrink, canGrow, onDragStart, onStep, onReset, onNudge }) {
  const stopDrag = (event) => event.stopPropagation()

  return (
    <div
      className={`splitter${dragging ? ' splitter--dragging' : ''}`}
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize the editor"
      tabIndex={0}
      onPointerDown={onDragStart}
      onDoubleClick={onReset}
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft') onNudge(-24)
        if (event.key === 'ArrowRight') onNudge(24)
        if (event.key === 'Enter') onReset()
      }}
    >
      <div className="splitter__pill" onPointerDown={stopDrag} onDoubleClick={stopDrag}>
        <button
          type="button"
          className="splitter__arrow"
          title={collapsed ? 'Editor is hidden' : 'Narrow the editor'}
          aria-label="Narrow the editor"
          disabled={!canShrink}
          onClick={() => onStep(-1)}
        >
          ‹
        </button>
        <button
          type="button"
          className="splitter__arrow"
          title="Widen the editor"
          aria-label="Widen the editor"
          disabled={!canGrow}
          onClick={() => onStep(1)}
        >
          ›
        </button>
      </div>
    </div>
  )
}
