import IconButton from './IconButton'
import { ArrowDown, ArrowUp, Close } from './icons'

/** Move up / move down / delete — shared by every repeating row in the editor,
 *  using the same icons as the section header so the chrome reads as one set. */
export default function ListControls({ index, count, onMove, onRemove, removeLabel = 'Remove', canRemove = true }) {
  return (
    <>
      <IconButton label="Move up" disabled={index === 0} onClick={() => onMove(-1)}>
        <ArrowUp />
      </IconButton>
      <IconButton label="Move down" disabled={index === count - 1} onClick={() => onMove(1)}>
        <ArrowDown />
      </IconButton>
      <IconButton label={removeLabel} danger disabled={!canRemove} onClick={onRemove}>
        <Close />
      </IconButton>
    </>
  )
}
