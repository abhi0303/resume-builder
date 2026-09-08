import Field from '../../ui/Field'
import ListControls from '../../ui/ListControls'
import { RATING_MAX } from '../../../data/sectionTypes'
import { getLimit } from '../../../utils/limits'
import { plainText } from '../../../utils/richText'

export default function RatingsEditor({ section, template, actions }) {
  const items = section.items || []
  const limit = (field) => getLimit(template, 'ratings', field)

  return (
    <>
      {items.map((item, index) => (
        <div className="entry" key={item.id}>
          <div className="entry__head">
            <span className="entry__index">{plainText(item.label) || `Item ${index + 1}`}</span>
            <ListControls
              index={index}
              count={items.length}
              onMove={(delta) => actions.moveEntry(item.id, delta)}
              onRemove={() => actions.removeEntry(item.id)}
            />
          </div>
          <div className="grid-2">
            <Field
              label="Label"
              value={item.label}
              limit={limit('label')}
              placeholder="English"
              onChange={(label) => actions.updateEntry(item.id, { label })}
            />
            <Field
              label="Note"
              value={item.note}
              limit={limit('note')}
              placeholder="Native"
              onChange={(note) => actions.updateEntry(item.id, { note })}
            />
          </div>
          <div className="field">
            <div className="field__label">
              <span>Level</span>
              <span className="counter">
                {item.level} / {RATING_MAX}
              </span>
            </div>
            <div className="rating-picker">
              {Array.from({ length: RATING_MAX + 1 }, (_, value) => (
                <button
                  type="button"
                  key={value}
                  className={`rating-dot${value === 0 ? ' rating-dot--zero' : ''}${
                    value !== 0 && value <= item.level ? ' rating-dot--on' : ''
                  }`}
                  title={`${value} of ${RATING_MAX}`}
                  aria-label={`Set level ${value}`}
                  onClick={() => actions.updateEntry(item.id, { level: value })}
                >
                  {value === 0 ? '✕' : ''}
                </button>
              ))}
            </div>
          </div>
        </div>
      ))}
      <button type="button" className="btn btn--sm" onClick={actions.addEntry}>
        + Add item
      </button>
    </>
  )
}
