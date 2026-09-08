import { useState } from 'react'
import IconButton from '../ui/IconButton'
import ColorButton from '../ui/ColorButton'
import { useConfirm } from '../../state/DialogContext'
import { SECTION_EDITORS } from './sections'
import { useSectionActions } from './useSectionActions'
import { COLUMNS, SECTION_TYPES } from '../../data/sectionTypes'
import { getLimit, usageLevel } from '../../utils/limits'

const DEFAULT_HEADING_COLOR = '#2b7c8f'

export default function SectionCard({ section, index, count, template, dispatch, autoFocusHeading, syncHeadings }) {
  const [collapsed, setCollapsed] = useState(false)
  const confirm = useConfirm()
  const actions = useSectionActions(section.id, dispatch)
  const Editor = SECTION_EDITORS[section.type]
  const type = SECTION_TYPES[section.type]
  const headingLimit = getLimit(template, section.type, 'heading')
  const headingLevel = usageLevel(section.heading.length, headingLimit)

  return (
    <div
      className={`card${collapsed ? ' card--collapsed' : ''}${section.visible === false ? ' section-card--hidden' : ''}`}
      data-section={section.id}
    >
      <div className="card__head card__head--stack">
        <div className="card__headline">
          <IconButton label={collapsed ? 'Expand' : 'Collapse'} onClick={() => setCollapsed((value) => !value)}>
            {collapsed ? '▸' : '▾'}
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
        </div>

        <div className="card__tools">
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

          <span className="card__tools-spacer" />

          <IconButton
            label="Move up"
            disabled={index === 0}
            onClick={() => dispatch({ type: 'MOVE_SECTION', sectionId: section.id, delta: -1 })}
          >
            ↑
          </IconButton>
          <IconButton
            label="Move down"
            disabled={index === count - 1}
            onClick={() => dispatch({ type: 'MOVE_SECTION', sectionId: section.id, delta: 1 })}
          >
            ↓
          </IconButton>
          <IconButton
            label={section.visible === false ? 'Show in resume' : 'Hide from resume'}
            onClick={() => actions.updateSection({ visible: section.visible === false })}
          >
            {section.visible === false ? '○' : '●'}
          </IconButton>
          <IconButton label="Duplicate section" onClick={() => dispatch({ type: 'DUPLICATE_SECTION', sectionId: section.id })}>
            ⧉
          </IconButton>
          <IconButton
            label="Delete section"
            danger
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
            ✕
          </IconButton>
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
