import { createSection, shapeOf } from '../data/sectionTypes'
import { move, uid, updateById } from '../utils/id'

/** Generic, type-agnostic reducer: every section is `{heading, column, …lists}`. */
export function resumeReducer(state, action) {
  switch (action.type) {
    case 'LOAD':
      return action.resume

    case 'SET_TEMPLATE':
      return { ...state, templateId: action.templateId }

    case 'UPDATE_THEME':
      return { ...state, theme: { ...(state.theme || {}), ...action.patch } }

    /**
     * Heading colour, with an opt-out for "all headings". Keeping the fan-out in
     * the reducer means one action still produces one undoable state change.
     */
    case 'SET_HEADING_COLOR':
      return {
        ...state,
        sections: state.sections.map((section) =>
          action.applyToAll || section.id === action.sectionId
            ? { ...section, headingColor: action.color || undefined }
            : section,
        ),
      }

    case 'UPDATE_HEADER':
      return { ...state, header: { ...state.header, ...action.patch } }

    case 'ADD_SECTION': {
      const section = createSection(action.typeId, action.heading)
      if (action.column) section.column = action.column
      return { ...state, sections: [...state.sections, section] }
    }

    case 'UPDATE_SECTION':
      return {
        ...state,
        sections: updateById(state.sections, action.sectionId, (s) => ({ ...s, ...action.patch })),
      }

    case 'REMOVE_SECTION':
      return { ...state, sections: state.sections.filter((s) => s.id !== action.sectionId) }

    case 'DUPLICATE_SECTION': {
      const index = state.sections.findIndex((s) => s.id === action.sectionId)
      if (index < 0) return state
      const clone = reId(structuredCloneSafe(state.sections[index]))
      clone.heading = `${clone.heading} (COPY)`
      const sections = [...state.sections]
      sections.splice(index + 1, 0, clone)
      return { ...state, sections }
    }

    case 'MOVE_SECTION': {
      const index = state.sections.findIndex((s) => s.id === action.sectionId)
      if (index < 0) return state
      return { ...state, sections: move(state.sections, index, action.delta) }
    }

    case 'ADD_ENTRY':
      return mapSection(state, action.sectionId, (section) => {
        const { entriesKey, createEntry } = shapeOf(section)
        if (!entriesKey || !createEntry) return section
        return { ...section, [entriesKey]: [...section[entriesKey], createEntry()] }
      })

    case 'UPDATE_ENTRY':
      return mapEntries(state, action.sectionId, (entries) =>
        updateById(entries, action.entryId, (entry) => ({ ...entry, ...action.patch })),
      )

    case 'REMOVE_ENTRY':
      return mapEntries(state, action.sectionId, (entries) => entries.filter((e) => e.id !== action.entryId))

    case 'MOVE_ENTRY':
      return mapEntries(state, action.sectionId, (entries) => {
        const index = entries.findIndex((e) => e.id === action.entryId)
        return index < 0 ? entries : move(entries, index, action.delta)
      })

    case 'ADD_CHILD':
      return mapChildren(state, action, (children, createChild) => [...children, createChild()])

    case 'UPDATE_CHILD':
      return mapChildren(state, action, (children) =>
        updateById(children, action.childId, (child) => ({ ...child, ...action.patch })),
      )

    case 'REMOVE_CHILD':
      return mapChildren(state, action, (children) => children.filter((c) => c.id !== action.childId))

    case 'MOVE_CHILD':
      return mapChildren(state, action, (children) => {
        const index = children.findIndex((c) => c.id === action.childId)
        return index < 0 ? children : move(children, index, action.delta)
      })

    default:
      return state
  }
}

function mapSection(state, sectionId, updater) {
  return { ...state, sections: updateById(state.sections, sectionId, updater) }
}

function mapEntries(state, sectionId, updater) {
  return mapSection(state, sectionId, (section) => {
    const { entriesKey } = shapeOf(section)
    if (!entriesKey) return section
    return { ...section, [entriesKey]: updater(section[entriesKey] || []) }
  })
}

function mapChildren(state, action, updater) {
  return mapSection(state, action.sectionId, (section) => {
    const { entriesKey, childrenKey, createChild } = shapeOf(section)
    if (!entriesKey || !childrenKey) return section
    return {
      ...section,
      [entriesKey]: updateById(section[entriesKey] || [], action.entryId, (entry) => ({
        ...entry,
        [childrenKey]: updater(entry[childrenKey] || [], createChild),
      })),
    }
  })
}

function structuredCloneSafe(value) {
  return JSON.parse(JSON.stringify(value))
}

/** Re-key a cloned subtree so duplicated nodes stay independently addressable. */
function reId(node) {
  if (Array.isArray(node)) return node.map(reId)
  if (node && typeof node === 'object') {
    const out = {}
    for (const [key, value] of Object.entries(node)) {
      out[key] = key === 'id' && typeof value === 'string' ? uid(value.split('_')[0]) : reId(value)
    }
    return out
  }
  return node
}
