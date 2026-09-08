import Field from '../../ui/Field'
import ListControls from '../../ui/ListControls'
import { getLimit } from '../../../utils/limits'
import { plainText } from '../../../utils/richText'

export default function HighlightsEditor({ section, template, actions }) {
  const items = section.items || []
  const limit = (field) => getLimit(template, 'highlights', field)

  return (
    <>
      {items.map((item, index) => (
        <div className="entry" key={item.id}>
          <div className="entry__head">
            <span className="entry__index">{plainText(item.title) || `Card ${index + 1}`}</span>
            <ListControls
              index={index}
              count={items.length}
              onMove={(delta) => actions.moveEntry(item.id, delta)}
              onRemove={() => actions.removeEntry(item.id)}
              removeLabel="Remove card"
            />
          </div>
          <div className="grid-2">
            <Field
              label="Title"
              value={item.title}
              limit={limit('title')}
              placeholder="E-commerce Platform"
              onChange={(title) => actions.updateEntry(item.id, { title })}
            />
            <Field
              label="Icon (optional)"
              value={item.icon}
              limit={limit('icon')}
              placeholder="★"
              hint="One character, e.g. ★ ● ◆ — shown in a circle where the template supports it."
              onChange={(icon) => actions.updateEntry(item.id, { icon })}
            />
          </div>
          <Field
            label="Description"
            multiline
            rows={2}
            value={item.description}
            limit={limit('description')}
            placeholder="Built flexible platform using ReactJS + AWS, adopted by 200+ users."
            onChange={(description) => actions.updateEntry(item.id, { description })}
          />
        </div>
      ))}
      <button type="button" className="btn btn--sm" onClick={actions.addEntry}>
        + Add card
      </button>
    </>
  )
}
