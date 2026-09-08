import Field from '../../ui/Field'
import IconButton from '../../ui/IconButton'
import ListControls from '../../ui/ListControls'
import { getLimit } from '../../../utils/limits'
import { plainText } from '../../../utils/richText'

export default function ExperienceEditor({ section, template, actions }) {
  const items = section.items || []
  const limit = (field) => getLimit(template, 'experience', field)

  return (
    <>
      {items.map((item, index) => {
        const bullets = item.bullets || []
        return (
          <div className="entry" key={item.id}>
            <div className="entry__head">
              <span className="entry__index">{plainText(item.title) || `Entry ${index + 1}`}</span>
              <ListControls
                index={index}
                count={items.length}
                onMove={(delta) => actions.moveEntry(item.id, delta)}
                onRemove={() => actions.removeEntry(item.id)}
                removeLabel="Remove entry"
              />
            </div>

            <Field
              label="Role / position"
              value={item.title}
              limit={limit('title')}
              placeholder="Documentation Assistant – CAC Section"
              onChange={(title) => actions.updateEntry(item.id, { title })}
            />
            <div className="grid-2">
              <Field
                label="Organisation"
                value={item.organization}
                limit={limit('organization')}
                placeholder="Archaeological Survey of India"
                onChange={(organization) => actions.updateEntry(item.id, { organization })}
              />
              <Field
                label="Dates"
                value={item.dateRange}
                limit={limit('dateRange')}
                placeholder="Jan–Jun 2023"
                onChange={(dateRange) => actions.updateEntry(item.id, { dateRange })}
              />
            </div>
            <Field
              label="Location (optional)"
              value={item.location}
              limit={limit('location')}
              placeholder="Indianapolis, IN"
              onChange={(location) => actions.updateEntry(item.id, { location })}
            />

            <div className="subhead">Bullet points</div>
            {bullets.map((bullet, bulletIndex) => (
              <div className="bullet-row" key={bullet.id}>
                <Field
                  label={`Point ${bulletIndex + 1}`}
                  multiline
                  rows={2}
                  value={bullet.text}
                  limit={limit('bullet')}
                  placeholder="What you did and what it produced"
                  onChange={(text) => actions.updateChild(item.id, bullet.id, { text })}
                />
                <div className="bullet-row__tools">
                  <ListControls
                    index={bulletIndex}
                    count={bullets.length}
                    onMove={(delta) => actions.moveChild(item.id, bullet.id, delta)}
                    onRemove={() => actions.removeChild(item.id, bullet.id)}
                    canRemove={bullets.length > 1}
                  />
                </div>
              </div>
            ))}
            <button type="button" className="btn btn--sm" onClick={() => actions.addChild(item.id)}>
              + Add point
            </button>
          </div>
        )
      })}
      <button type="button" className="btn btn--sm" onClick={actions.addEntry}>
        + Add entry
      </button>
    </>
  )
}
