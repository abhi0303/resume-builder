import IconButton from './IconButton'

/** Move up / move down / delete — shared by every repeating row in the editor. */
export default function ListControls({ index, count, onMove, onRemove, removeLabel = 'Remove', canRemove = true }) {
  return (
    <>
      <IconButton label="Move up" disabled={index === 0} onClick={() => onMove(-1)}>
        ↑
      </IconButton>
      <IconButton label="Move down" disabled={index === count - 1} onClick={() => onMove(1)}>
        ↓
      </IconButton>
      <IconButton label={removeLabel} danger disabled={!canRemove} onClick={onRemove}>
        ✕
      </IconButton>
    </>
  )
}
