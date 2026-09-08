import Field from '../ui/Field'
import { getLimit } from '../../utils/limits'

export default function HeaderEditor({ header, template, dispatch }) {
  const set = (patch) => dispatch({ type: 'UPDATE_HEADER', patch })
  const limit = (field) => getLimit(template, 'header', field)

  return (
    <div className="card">
      <div className="card__head">
        <h2 className="card__title">Header</h2>
        <span className="section-card__badge">Fixed</span>
      </div>
      <div className="card__body">
        <div className="grid-2">
          <Field label="Full name" value={header.name} limit={limit('name')} onChange={(name) => set({ name })} />
          <Field label="Phone" value={header.phone} limit={limit('phone')} onChange={(phone) => set({ phone })} />
        </div>
        <Field
          label="Professional title"
          value={header.title}
          limit={limit('title')}
          placeholder="Heritage Management & Archaeology Professional"
          onChange={(title) => set({ title })}
        />
        <div className="grid-2">
          <Field label="Email" value={header.email} limit={limit('email')} onChange={(email) => set({ email })} />
          <Field
            label="Website / profile"
            value={header.website}
            limit={limit('website')}
            placeholder="linkedin.com/in/you"
            onChange={(website) => set({ website })}
          />
        </div>
        <Field
          label="Address"
          value={header.address}
          limit={limit('address')}
          onChange={(address) => set({ address })}
          hint="Keep it to a single line — a long address pushes the header out of shape."
        />
      </div>
    </div>
  )
}
