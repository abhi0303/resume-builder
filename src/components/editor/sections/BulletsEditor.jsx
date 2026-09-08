import Field from '../../ui/Field'
import ListControls from '../../ui/ListControls'
import { getLimit } from '../../../utils/limits'

export default function BulletsEditor({ section, template, actions }) {
  const items = section.items || []
  const limit = getLimit(template, 'bullets', 'bullet')

  return (
    <>
      {items.map((item, index) => (
        <div className="bullet-row" key={item.id}>
          <Field
            label={`Point ${index + 1}`}
            multiline
            rows={2}
            value={item.text}
            limit={limit}
            placeholder="One line per point"
            onChange={(text) => actions.updateEntry(item.id, { text })}
          />
          <div className="bullet-row__tools">
            <ListControls
              index={index}
              count={items.length}
              onMove={(delta) => actions.moveEntry(item.id, delta)}
              onRemove={() => actions.removeEntry(item.id)}
              canRemove={items.length > 1}
            />
          </div>
        </div>
      ))}
      <button type="button" className="btn btn--sm" onClick={actions.addEntry}>
        + Add point
      </button>
    </>
  )
}
