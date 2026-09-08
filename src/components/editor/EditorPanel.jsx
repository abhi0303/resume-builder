import { useState } from 'react'
import HeaderEditor from './HeaderEditor'
import SectionCard from './SectionCard'
import AddSectionMenu from './AddSectionMenu'
import { useResume } from '../../state/ResumeContext'

export default function EditorPanel({ template, collapsed }) {
  const { resume, dispatch } = useResume()
  const [justAdded, setJustAdded] = useState(false)

  const addSection = (typeId) => {
    dispatch({ type: 'ADD_SECTION', typeId })
    // The new section is appended last; focus its heading so it can be renamed at once.
    setJustAdded(true)
    requestAnimationFrame(() => {
      const cards = document.querySelectorAll('[data-section]')
      cards[cards.length - 1]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
  }

  return (
    <div className={`app__editor${collapsed ? ' app__editor--collapsed' : ''}`} aria-hidden={collapsed}>
      <HeaderEditor header={resume.header} template={template} dispatch={dispatch} />

      {resume.sections.length === 0 ? (
        <div className="empty-state">
          No sections yet. Add one below — every section carries its own heading, so you decide what this CV is made of.
        </div>
      ) : null}

      {resume.sections.map((section, index) => (
        <SectionCard
          key={section.id}
          section={section}
          index={index}
          count={resume.sections.length}
          template={template}
          dispatch={dispatch}
          autoFocusHeading={justAdded && index === resume.sections.length - 1}
          syncHeadings={resume.theme?.syncHeadingColors !== false}
        />
      ))}

      <AddSectionMenu onAdd={addSection} />
    </div>
  )
}
