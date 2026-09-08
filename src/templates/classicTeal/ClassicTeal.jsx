import RichText from '../../components/RichText'
import { isEmptyText, plainText } from '../../utils/richText'
import { RATING_MAX } from '../../data/sectionTypes'
import { DEFAULT_BANNER, bannerPalette } from './theme'
import './classicTeal.css'

const has = (value) => !isEmptyText(value)

/**
 * Renderers are keyed by section type. A template supports a new section type
 * by adding one function here; unknown types are skipped rather than crashing.
 */
const renderers = {
  summary: (section) => (
    <p className="ct-summary">
      <RichText value={section.text} />
    </p>
  ),

  experience: (section) => (
    <div className="ct-timeline">
      {(section.items || []).map((item) => (
        <article className="ct-entry" key={item.id}>
          <div className="ct-entry__head">
            <h4 className="ct-entry__title">
              <RichText value={item.title} />
            </h4>
            {has(item.dateRange) ? (
              <span className="ct-entry__date">
                <RichText value={item.dateRange} />
              </span>
            ) : null}
          </div>
          {has(item.organization) || has(item.location) ? (
            <div className="ct-entry__org">
              <RichText value={item.organization} />
              {has(item.location) ? (
                <>
                  <span className="ct-dot"> · </span>
                  <RichText value={item.location} />
                </>
              ) : null}
            </div>
          ) : null}
          {item.bullets?.some((bullet) => has(bullet.text)) ? (
            <ul className="ct-bullets">
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
      ))}
    </div>
  ),

  bullets: (section) => (
    <ul className="ct-bullets ct-bullets--flat">
      {(section.items || [])
        .filter((item) => has(item.text))
        .map((item) => (
          <li key={item.id}>
            <RichText value={item.text} />
          </li>
        ))}
    </ul>
  ),

  education: (section) => (
    <div className="ct-edu">
      {(section.items || []).map((item) => (
        <div className="ct-edu__card" key={item.id}>
          <div className="ct-edu__head">
            <h4 className="ct-edu__degree">
              <RichText value={item.degree} />
            </h4>
            {has(item.date) ? (
              <span className="ct-edu__date">
                <RichText value={item.date} />
              </span>
            ) : null}
          </div>
          {has(item.institution) ? (
            <div className="ct-edu__meta">
              <RichText value={item.institution} />
            </div>
          ) : null}
          {has(item.location) ? (
            <div className="ct-edu__meta">
              <RichText value={item.location} />
            </div>
          ) : null}
          {has(item.score) ? (
            <div className="ct-edu__meta">
              <RichText value={item.score} />
            </div>
          ) : null}
          {has(item.badge) ? (
            <div className="ct-edu__badge">
              <span className="ct-square ct-square--gold" />
              <RichText value={item.badge} />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  ),

  highlights: (section) => (
    <div className="ct-highlights">
      {(section.items || []).map((item) => (
        <div className="ct-highlight" key={item.id}>
          <h4 className="ct-highlight__title">
            {has(item.icon) ? <span className="ct-highlight__icon">{plainText(item.icon)}</span> : null}
            <RichText value={item.title} />
          </h4>
          {has(item.description) ? (
            <p className="ct-highlight__text">
              <RichText value={item.description} />
            </p>
          ) : null}
        </div>
      ))}
    </div>
  ),

  ratings: (section) => (
    <div className="ct-ratings">
      {(section.items || []).map((item) => (
        <div className="ct-rating" key={item.id}>
          <span className="ct-rating__label">
            <RichText value={item.label} />
          </span>
          {has(item.note) ? (
            <span className="ct-rating__note">
              <RichText value={item.note} />
            </span>
          ) : null}
          <span className="ct-rating__dots">
            {Array.from({ length: RATING_MAX }, (_, index) => (
              <span key={index} className={`ct-dot-mark${index < (item.level ?? 0) ? ' ct-dot-mark--on' : ''}`} />
            ))}
          </span>
        </div>
      ))}
    </div>
  ),

  skillGroups: (section) => (
    <div className="ct-skills">
      {(section.groups || []).map((group) => (
        <div className="ct-skills__group" key={group.id}>
          {has(group.label) ? (
            <h4 className="ct-skills__label">
              <RichText value={group.label} />
            </h4>
          ) : null}
          <ul className="ct-tags">
            {(group.items || [])
              .filter((item) => has(item.text))
              .map((item) => (
                <li key={item.id}>
                  <span className="ct-square" />
                  <RichText value={item.text} />
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  ),
}

function Section({ section }) {
  const render = renderers[section.type]
  if (!render) return null
  const headingStyle = section.headingColor
    ? { color: section.headingColor, borderBottomColor: section.headingColor }
    : undefined
  return (
    <section className="ct-section" data-section-id={section.id}>
      <h3 className="ct-section__title" style={headingStyle}>
        {section.heading}
      </h3>
      {render(section)}
    </section>
  )
}

export default function ClassicTeal({ resume }) {
  const { header, sections } = resume
  const visible = sections.filter((s) => s.visible !== false)
  const main = visible.filter((s) => s.column !== 'side')
  const side = visible.filter((s) => s.column === 'side')
  const contacts = [header.phone, header.email].filter(has)
  const background = resume.theme?.bannerBg || DEFAULT_BANNER
  const palette = bannerPalette(background)

  return (
    <div className="tpl-classic-teal">
      <header className="ct-banner" style={{ background, color: palette.name }}>
        <h1 className="ct-banner__name" style={{ color: palette.name }}>
          <RichText value={header.name} />
        </h1>
        {has(header.title) ? (
          <p className="ct-banner__title" style={{ color: palette.title }}>
            <RichText value={header.title} />
          </p>
        ) : null}
        <div className="ct-banner__rule" style={{ background: palette.rule }} />
        <div className="ct-banner__contact" style={{ color: palette.contact }}>
          {contacts.map((contact, index) => (
            <span key={index}>
              {index > 0 ? (
                <span className="ct-sep" style={{ color: palette.separator }}>
                  |
                </span>
              ) : null}
              <RichText value={contact} />
            </span>
          ))}
        </div>
        {has(header.address) ? (
          <div className="ct-banner__contact" style={{ color: palette.contact }}>
            <RichText value={header.address} />
          </div>
        ) : null}
      </header>

      <div className="ct-body">
        <div className="ct-col ct-col--main">
          {main.map((section) => (
            <Section key={section.id} section={section} />
          ))}
        </div>
        <div className="ct-col ct-col--side">
          {side.map((section) => (
            <Section key={section.id} section={section} />
          ))}
        </div>
      </div>
    </div>
  )
}
