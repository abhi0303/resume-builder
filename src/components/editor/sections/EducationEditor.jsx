import Field from '../../ui/Field'
import ListControls from '../../ui/ListControls'
import { getLimit } from '../../../utils/limits'
import { plainText } from '../../../utils/richText'

export default function EducationEditor({ section, template, actions }) {
  const items = section.items || []
  const limit = (field) => getLimit(template, 'education', field)

  return (
    <>
      {items.map((item, index) => (
        <div className="entry" key={item.id}>
          <div className="entry__head">
            <span className="entry__index">{plainText(item.degree) || `Qualification ${index + 1}`}</span>
            <ListControls
              index={index}
              count={items.length}
              onMove={(delta) => actions.moveEntry(item.id, delta)}
              onRemove={() => actions.removeEntry(item.id)}
              removeLabel="Remove qualification"
            />
          </div>
          <div className="grid-2">
            <Field
              label="Qualification"
              value={item.degree}
              limit={limit('degree')}
              placeholder="M.A. Heritage Management"
              onChange={(degree) => actions.updateEntry(item.id, { degree })}
            />
            <Field
              label="Year"
              value={item.date}
              limit={limit('date')}
              placeholder="2023"
              onChange={(date) => actions.updateEntry(item.id, { date })}
            />
          </div>
          <Field
            label="Institution"
            value={item.institution}
            limit={limit('institution')}
            placeholder="Banaras Hindu University (BHU)"
            onChange={(institution) => actions.updateEntry(item.id, { institution })}
          />
          <Field
            label="Location (optional)"
            value={item.location}
            limit={limit('location')}
            placeholder="West Lafayette, IN"
            onChange={(location) => actions.updateEntry(item.id, { location })}
          />
          <div className="grid-2">
            <Field
              label="Score"
              value={item.score}
              limit={limit('score')}
              placeholder="CGPA: 8.25"
              onChange={(score) => actions.updateEntry(item.id, { score })}
            />
            <Field
              label="Highlight (optional)"
              value={item.badge}
              limit={limit('badge')}
              placeholder="Gold Medalist"
              onChange={(badge) => actions.updateEntry(item.id, { badge })}
            />
          </div>
        </div>
      ))}
      <button type="button" className="btn btn--sm" onClick={actions.addEntry}>
        + Add qualification
      </button>
    </>
  )
}
