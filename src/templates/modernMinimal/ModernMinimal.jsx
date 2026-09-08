import RichText from '../../components/RichText'
import { isEmptyText, plainText } from '../../utils/richText'
import { RATING_MAX } from '../../data/sectionTypes'
import { DEFAULT_ACCENT } from './theme'
import './modernMinimal.css'

const has = (value) => !isEmptyText(value)

/* Small line icons — inline so nothing depends on a font or an external file. */
const PATHS = {
  phone: 'M4 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L14 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 3 5a1 1 0 0 1 1-1Z',
  mail: 'M3 6h18v12H3zM3 7l9 6 9-6',
  link: 'M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1',
  pin: 'M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11Z',
  calendar: 'M4 6h16v14H4zM4 10h16M9 3v4M15 3v4',
}

function Icon({ name }) {
  return (
    <svg className="mm-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d={PATHS[name]} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      {name === 'pin' ? <circle cx="12" cy="10" r="2.4" fill="none" stroke="currentColor" strokeWidth="1.8" /> : null}
    </svg>
  )
}

/** Organisation / date / place row, shared by experience and education. */
function MetaRow({ primary, date, place }) {
  return (
    <div className="mm-meta">
      <span className="mm-meta__primary">
        <RichText value={primary} />
      </span>
      {has(date) ? (
        <span className="mm-meta__item">
          <Icon name="calendar" />
          <RichText value={date} />
        </span>
      ) : null}
      {has(place) ? (
        <span className="mm-meta__item">
          <Icon name="pin" />
          <RichText value={place} />
        </span>
      ) : null}
    </div>
  )
}

const renderers = {
  summary: (section) => (
    <p className="mm-summary">
      <RichText value={section.text} />
    </p>
  ),

  experience: (section) =>
    (section.items || []).map((item) => (
      <article className="mm-entry" key={item.id}>
        <h4 className="mm-entry__title">
          <RichText value={item.title} />
        </h4>
        <MetaRow primary={item.organization} date={item.dateRange} place={item.location} />
        {item.bullets?.some((bullet) => has(bullet.text)) ? (
          <ul className="mm-bullets">
            {item.bullets
              .filter((bullet) => has(bullet.text))
              .map((bullet) => (
                <li key={bullet.id}>
                  <RichText value={bullet.text} />
                </li>
              ))}
          </ul>
        ) : null}
      </article>
    )),

  bullets: (section) => (
    <ul className="mm-bullets">
      {(section.items || [])
        .filter((item) => has(item.text))
        .map((item) => (
          <li key={item.id}>
            <RichText value={item.text} />
          </li>
        ))}
    </ul>
  ),

  education: (section) =>
    (section.items || []).map((item) => (
      <article className="mm-entry" key={item.id}>
        <h4 className="mm-entry__title">
          <RichText value={item.degree} />
        </h4>
        <MetaRow primary={item.institution} date={item.date} place={item.location} />
        {[item.score, item.badge].filter(has).map((line, index) => (
          <div className="mm-entry__badge" key={index}>
            <RichText value={line} />
          </div>
        ))}
      </article>
    )),

  /** Tags read as prose here rather than as a list — same data, different template. */
  skillGroups: (section) =>
    (section.groups || []).map((group) => (
      <div className="mm-group" key={group.id}>
        {has(group.label) ? (
          <h4 className="mm-group__label">
            <RichText value={group.label} />
          </h4>
        ) : null}
        <p className="mm-group__items">
          {(group.items || [])
            .filter((item) => has(item.text))
            .map((item, index) => (
              <span key={item.id}>
                {index > 0 ? ', ' : ''}
                <RichText value={item.text} />
              </span>
            ))}
        </p>
      </div>
    )),

  /**
   * Cards run two-up in the wide main column and stacked in the side column,
   * which keeps certifications compact without needing an extra setting.
   */
  highlights: (section) => (
    <div className={`mm-cards${section.column === 'side' ? '' : ' mm-cards--grid'}`}>
      {(section.items || []).map((item) => (
        <div className="mm-card" key={item.id}>
          {has(item.icon) ? <span className="mm-card__icon">{plainText(item.icon)}</span> : null}
          <div className="mm-card__body">
            <h4 className="mm-card__title">
              <RichText value={item.title} />
            </h4>
            {has(item.description) ? (
              <p className="mm-card__text">
                <RichText value={item.description} />
              </p>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  ),

  ratings: (section) =>
    (section.items || []).map((item) => (
      <div className="mm-rating" key={item.id}>
        <span className="mm-rating__label">
          <RichText value={item.label} />
        </span>
        {has(item.note) ? (
          <span className="mm-rating__note">
            <RichText value={item.note} />
          </span>
        ) : null}
        <span className="mm-rating__dots">
          {Array.from({ length: RATING_MAX }, (_, index) => (
            <span key={index} className={`mm-dot${index < (item.level ?? 0) ? ' mm-dot--on' : ''}`} />
          ))}
        </span>
      </div>
    )),
}

function Section({ section }) {
  const render = renderers[section.type]
  if (!render) return null
  return (
    <section className="mm-section" data-section-id={section.id}>
      <h3 className="mm-section__title" style={section.headingColor ? { color: section.headingColor } : undefined}>
        {section.heading}
      </h3>
      {render(section)}
    </section>
  )
}

export default function ModernMinimal({ resume }) {
  const { header, sections } = resume
  const visible = sections.filter((s) => s.visible !== false)
  const main = visible.filter((s) => s.column !== 'side')
  const side = visible.filter((s) => s.column === 'side')
  const accent = resume.theme?.accent || DEFAULT_ACCENT

  const contacts = [
    { icon: 'phone', value: header.phone },
    { icon: 'mail', value: header.email },
    { icon: 'link', value: header.website },
    { icon: 'pin', value: header.address },
  ].filter((entry) => has(entry.value))

  return (
    <div className="tpl-modern-minimal" style={{ '--mm-accent': accent }}>
      <header className="mm-header">
        <h1 className="mm-name">
          <RichText value={header.name} />
        </h1>
        {has(header.title) ? (
          <p className="mm-title">
            <RichText value={header.title} />
          </p>
        ) : null}
        {contacts.length ? (
          <div className="mm-contacts">
            {contacts.map((entry) => (
              <span className="mm-contact" key={entry.icon}>
                <Icon name={entry.icon} />
                <RichText value={entry.value} />
              </span>
            ))}
          </div>
        ) : null}
      </header>

      <div className="mm-body">
        <div className="mm-col mm-col--main">
          {main.map((section) => (
            <Section key={section.id} section={section} />
          ))}
        </div>
        <div className="mm-col mm-col--side">
          {side.map((section) => (
            <Section key={section.id} section={section} />
          ))}
        </div>
      </div>
    </div>
  )
}
