import Field from '../../ui/Field'
import ListControls from '../../ui/ListControls'
import { getLimit } from '../../../utils/limits'
import { plainText } from '../../../utils/richText'

export default function SkillGroupsEditor({ section, template, actions }) {
  const groups = section.groups || []
  const limit = (field) => getLimit(template, 'skillGroups', field)

  return (
    <>
      {groups.map((group, index) => {
        const items = group.items || []
        return (
          <div className="entry" key={group.id}>
            <div className="entry__head">
              <span className="entry__index">{plainText(group.label) || `Group ${index + 1}`}</span>
              <ListControls
                index={index}
                count={groups.length}
                onMove={(delta) => actions.moveEntry(group.id, delta)}
                onRemove={() => actions.removeEntry(group.id)}
                removeLabel="Remove group"
              />
            </div>
            <Field
              label="Group label"
              value={group.label}
              limit={limit('groupLabel')}
              placeholder="Technical"
              onChange={(label) => actions.updateEntry(group.id, { label })}
            />
            <div className="subhead">Entries</div>
            {items.map((item, itemIndex) => (
              <div className="bullet-row" key={item.id}>
                <Field
                  label={`Item ${itemIndex + 1}`}
                  value={item.text}
                  limit={limit('tag')}
                  placeholder="MS Office (Word, Excel, PowerPoint)"
                  onChange={(text) => actions.updateChild(group.id, item.id, { text })}
                />
                <div className="bullet-row__tools">
                  <ListControls
                    index={itemIndex}
                    count={items.length}
                    onMove={(delta) => actions.moveChild(group.id, item.id, delta)}
                    onRemove={() => actions.removeChild(group.id, item.id)}
                    canRemove={items.length > 1}
                  />
                </div>
              </div>
            ))}
            <button type="button" className="btn btn--sm" onClick={() => actions.addChild(group.id)}>
              + Add item
            </button>
          </div>
        )
      })}
      <button type="button" className="btn btn--sm" onClick={actions.addEntry}>
        + Add group
      </button>
    </>
  )
}
