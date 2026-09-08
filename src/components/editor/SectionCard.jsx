import { useRef, useState } from 'react'
import IconButton from '../ui/IconButton'
import ColorButton from '../ui/ColorButton'
import { ArrowDown, ArrowUp, ChevronDown, ChevronRight, CloseCircle, Copy, Eye, EyeOff } from '../ui/icons'
import { useConfirm } from '../../state/DialogContext'
import { useStuck } from '../../state/useStuck'
import { SECTION_EDITORS } from './sections'
import { useSectionActions } from './useSectionActions'
import { COLUMNS, SECTION_TYPES } from '../../data/sectionTypes'
import { getLimit, usageLevel } from '../../utils/limits'

const DEFAULT_HEADING_COLOR = '#2b7c8f'

/**
 * One section, with a sticky header split into two readable rows:
 * the heading itself, then what the section *is* (type, column) beside what you
 * can *do* with it (colour, reorder, hide, duplicate). Delete ends the heading row
 * behind a divider, set apart from the neutral controls.
 *
 * Both rows wrap rather than overflow: on a narrow phone the controls drop onto
 * another line inside the card instead of spilling past its edge.
 */
export default function SectionCard({ section, index, count, template, dispatch, autoFocusHeading, syncHeadings }) {
  const [collapsed, setCollapsed] = useState(false)
  const headRef = useRef(null)
  const stuck = useStuck(headRef)
  const confirm = useConfirm()
  const actions = useSectionActions(section.id, dispatch)
  const Editor = SECTION_EDITORS[section.type]
  const type = SECTION_TYPES[section.type]
  const headingLimit = getLimit(template, section.type, 'heading')
  const headingLevel = usageLevel(section.heading.length, headingLimit)
  const hidden = section.visible === false

  return (
    <div
      className={`card${collapsed ? ' card--collapsed' : ''}${hidden ? ' section-card--hidden' : ''}`}
      data-section={section.id}
    >
      <div className={`card__head card__head--stack${stuck ? ' card__head--stuck' : ''}`} ref={headRef}>
        <div className="card__headline">
          <IconButton label={collapsed ? 'Expand section' : 'Collapse section'} onClick={() => setCollapsed((value) => !value)}>
            {collapsed ? <ChevronRight /> : <ChevronDown />}
          </IconButton>

          <input
            className="heading-input"
            value={section.heading}
            maxLength={headingLimit}
            autoFocus={autoFocusHeading}
            aria-label="Section heading"
            placeholder="SECTION HEADING"
            onChange={(event) => actions.updateSection({ heading: event.target.value })}
          />

          <span className={`counter counter--${headingLevel}`}>
            {section.heading.length}/{headingLimit}
          </span>

          <span className="card__headline-sep" />

          <IconButton
            label="Delete section"
            danger
            className="card__delete"
            onClick={async () => {
              const ok = await confirm({
                title: `Delete “${section.heading}”?`,
                message: 'This section and everything in it will be removed from your CV.',
                confirmLabel: 'Delete section',
                danger: true,
              })
              if (ok) dispatch({ type: 'REMOVE_SECTION', sectionId: section.id })
            }}
          >
            <CloseCircle />
          </IconButton>
        </div>

        <div className="card__tools">
          <div className="card__meta">
            <span className="section-card__badge" title={type?.hint}>
              {type?.label || section.type}
            </span>
            <select
              className="select-inline"
              value={section.column}
              aria-label="Column"
              onChange={(event) => actions.updateSection({ column: event.target.value })}
            >
              {Object.values(COLUMNS).map((column) => (
                <option key={column.id} value={column.id}>
                  {column.label}
                </option>
              ))}
            </select>
          </div>

          <div className="card__actions">
            <ColorButton
              className="icon-btn heading-color"
              title="Heading colour"
              value={section.headingColor}
              clearLabel="Template default"
              align="right"
              onChange={(color) =>
                dispatch({ type: 'SET_HEADING_COLOR', sectionId: section.id, color, applyToAll: syncHeadings })
              }
              footer={
                <label className="color-panel__check">
                  <input
                    type="checkbox"
                    checked={syncHeadings}
                    onChange={(event) =>
                      dispatch({ type: 'UPDATE_THEME', patch: { syncHeadingColors: event.target.checked } })
                    }
                  />
                  Apply to all headings
                </label>
              }
            >
              <span className="heading-color__chip" style={{ background: section.headingColor || DEFAULT_HEADING_COLOR }} />
            </ColorButton>

            <IconButton
              label="Move section up"
              disabled={index === 0}
              onClick={() => dispatch({ type: 'MOVE_SECTION', sectionId: section.id, delta: -1 })}
            >
              <ArrowUp />
            </IconButton>
            <IconButton
              label="Move section down"
              disabled={index === count - 1}
              onClick={() => dispatch({ type: 'MOVE_SECTION', sectionId: section.id, delta: 1 })}
            >
              <ArrowDown />
            </IconButton>
            <IconButton
              label={hidden ? 'Show in resume' : 'Hide from resume'}
              onClick={() => actions.updateSection({ visible: hidden })}
            >
              {hidden ? <EyeOff /> : <Eye />}
            </IconButton>
            <IconButton label="Duplicate section" onClick={() => dispatch({ type: 'DUPLICATE_SECTION', sectionId: section.id })}>
              <Copy />
            </IconButton>
          </div>
        </div>

      </div>

      <div className="card__body">
        {Editor ? (
          <Editor section={section} template={template} actions={actions} />
        ) : (
          <p className="field__hint">This template has no editor for “{section.type}”.</p>
        )}
      </div>
    </div>
  )
}
