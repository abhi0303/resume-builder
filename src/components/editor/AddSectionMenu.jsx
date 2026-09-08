import { SECTION_TYPE_LIST } from '../../data/sectionTypes'

/**
 * Every section type can be added any number of times, each with its own heading —
 * this is how "PROFESSIONAL SUMMARY" and "INTERNSHIP EXPERIENCE" coexist with
 * identical styling.
 */
export default function AddSectionMenu({ onAdd }) {
  return (
    <div className="add-section">
      <p className="add-section__title">Add a section</p>
      <p className="add-section__note">
        Pick a block shape, then rename its heading to anything you like. Add the same shape as many times as you need —
        e.g. a second “Experience timeline” titled <strong>INTERNSHIP EXPERIENCE</strong>.
      </p>
      <div className="type-grid">
        {SECTION_TYPE_LIST.map((type) => (
          <button key={type.id} type="button" className="type-btn" onClick={() => onAdd(type.id)}>
            <span className="type-btn__icon">{type.icon}</span>
            <span>
              <span className="type-btn__label">{type.label}</span>
              <span className="type-btn__hint">{type.hint}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
