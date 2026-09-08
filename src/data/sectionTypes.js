import { uid } from '../utils/id'

/**
 * Section type registry.
 *
 * A "section type" is a reusable block shape (paragraph, timeline, bullet list…).
 * The resume holds any number of sections of any type, each with its own editable
 * heading — so a user can create "PROFESSIONAL SUMMARY" and "INTERNSHIP EXPERIENCE"
 * from the very same type and get identical layout.
 *
 * Adding a new block shape = add an entry here + a renderer in the template +
 * an editor in components/editor/sections. Nothing else needs to change.
 */

export const COLUMNS = {
  main: { id: 'main', label: 'Main column' },
  side: { id: 'side', label: 'Side column' },
}

export const SECTION_TYPES = {
  summary: {
    id: 'summary',
    label: 'Summary paragraph',
    icon: '¶',
    hint: 'Heading + one paragraph. Professional Summary, Objective, Profile, About Me…',
    defaultHeading: 'PROFESSIONAL SUMMARY',
    defaultColumn: 'main',
    limits: { heading: 42, text: 720 },
    create: (heading) => ({
      id: uid('sec'),
      type: 'summary',
      heading: heading || 'PROFESSIONAL SUMMARY',
      column: 'main',
      visible: true,
      text: '',
    }),
  },

  experience: {
    id: 'experience',
    label: 'Experience timeline',
    icon: '≡',
    hint: 'Role + organisation + dates + bullets. Professional Experience, Internships, Volunteering…',
    defaultHeading: 'PROFESSIONAL EXPERIENCE',
    defaultColumn: 'main',
    limits: { heading: 42, title: 70, organization: 80, dateRange: 22, bullet: 200 },
    create: (heading) => ({
      id: uid('sec'),
      type: 'experience',
      heading: heading || 'PROFESSIONAL EXPERIENCE',
      column: 'main',
      visible: true,
      items: [createExperienceItem()],
    }),
  },

  bullets: {
    id: 'bullets',
    label: 'Bullet list',
    icon: '•',
    hint: 'A simple list of one-liners. Academic Projects, Certifications, Publications, Awards…',
    defaultHeading: 'ACADEMIC PROJECTS',
    defaultColumn: 'main',
    limits: { heading: 42, bullet: 200 },
    create: (heading) => ({
      id: uid('sec'),
      type: 'bullets',
      heading: heading || 'ACADEMIC PROJECTS',
      column: 'main',
      visible: true,
      items: [createBulletItem()],
    }),
  },

  education: {
    id: 'education',
    label: 'Education cards',
    icon: '▤',
    hint: 'Qualification cards with year, institute, score and an optional highlight badge.',
    defaultHeading: 'EDUCATION',
    defaultColumn: 'side',
    limits: { heading: 42, degree: 46, institution: 52, date: 12, score: 26, badge: 26 },
    create: (heading) => ({
      id: uid('sec'),
      type: 'education',
      heading: heading || 'EDUCATION',
      column: 'side',
      visible: true,
      items: [createEducationItem()],
    }),
  },

  highlights: {
    id: 'highlights',
    label: 'Titled cards',
    icon: '◫',
    hint: 'Title + short description. Projects, Key Achievements, Certifications, Awards…',
    defaultHeading: 'PROJECTS & PORTFOLIO',
    defaultColumn: 'side',
    limits: { heading: 42, title: 48, description: 220, icon: 2 },
    create: (heading) => ({
      id: uid('sec'),
      type: 'highlights',
      heading: heading || 'PROJECTS & PORTFOLIO',
      column: 'side',
      visible: true,
      items: [createHighlightItem()],
    }),
  },

  ratings: {
    id: 'ratings',
    label: 'Rated list',
    icon: '◍',
    hint: 'A label with a level out of five. Languages, tools, proficiencies…',
    defaultHeading: 'LANGUAGES',
    defaultColumn: 'side',
    limits: { heading: 42, label: 28, note: 18 },
    create: (heading) => ({
      id: uid('sec'),
      type: 'ratings',
      heading: heading || 'LANGUAGES',
      column: 'side',
      visible: true,
      items: [createRatingItem()],
    }),
  },

  skillGroups: {
    id: 'skillGroups',
    label: 'Grouped tags',
    icon: '▣',
    hint: 'Labelled groups of short tags. Skills, Languages, Tools, Interests…',
    defaultHeading: 'SKILLS',
    defaultColumn: 'side',
    limits: { heading: 42, groupLabel: 28, tag: 46 },
    create: (heading) => ({
      id: uid('sec'),
      type: 'skillGroups',
      heading: heading || 'SKILLS',
      column: 'side',
      visible: true,
      groups: [createSkillGroup('Technical')],
    }),
  },
}

export const SECTION_TYPE_LIST = Object.values(SECTION_TYPES)

export function createExperienceItem() {
  return {
    id: uid('exp'),
    title: '',
    organization: '',
    dateRange: '',
    bullets: [createBulletItem()],
  }
}

export function createBulletItem(text = '') {
  return { id: uid('b'), text }
}

export function createEducationItem() {
  return {
    id: uid('edu'),
    degree: '',
    institution: '',
    date: '',
    score: '',
    badge: '',
  }
}

export function createHighlightItem() {
  return { id: uid('hl'), title: '', description: '', icon: '' }
}

export function createRatingItem() {
  return { id: uid('rt'), label: '', note: '', level: 5 }
}

export const RATING_MAX = 5

export function createSkillGroup(label = '') {
  return { id: uid('grp'), label, items: [createBulletItem()] }
}

export function createSection(typeId, heading) {
  const type = SECTION_TYPES[typeId]
  if (!type) throw new Error(`Unknown section type: ${typeId}`)
  return type.create(heading)
}

/**
 * Structural shape of each type, used by the generic reducer so it never needs
 * to know what a section *means* — only how its nested lists are named.
 *
 *   entriesKey  -> array of entries on the section  (null = no entries)
 *   childrenKey -> array nested inside each entry   (null = no children)
 */
export const SECTION_SHAPE = {
  summary: { entriesKey: null, childrenKey: null },
  experience: { entriesKey: 'items', childrenKey: 'bullets', createEntry: createExperienceItem, createChild: createBulletItem },
  bullets: { entriesKey: 'items', childrenKey: null, createEntry: createBulletItem },
  education: { entriesKey: 'items', childrenKey: null, createEntry: createEducationItem },
  highlights: {
    id: 'highlights',
    label: 'Titled cards',
    icon: '◫',
    hint: 'Title + short description. Projects, Key Achievements, Certifications, Awards…',
    defaultHeading: 'PROJECTS & PORTFOLIO',
    defaultColumn: 'side',
    limits: { heading: 42, title: 48, description: 220, icon: 2 },
    create: (heading) => ({
      id: uid('sec'),
      type: 'highlights',
      heading: heading || 'PROJECTS & PORTFOLIO',
      column: 'side',
      visible: true,
      items: [createHighlightItem()],
    }),
  },

  ratings: {
    id: 'ratings',
    label: 'Rated list',
    icon: '◍',
    hint: 'A label with a level out of five. Languages, tools, proficiencies…',
    defaultHeading: 'LANGUAGES',
    defaultColumn: 'side',
    limits: { heading: 42, label: 28, note: 18 },
    create: (heading) => ({
      id: uid('sec'),
      type: 'ratings',
      heading: heading || 'LANGUAGES',
      column: 'side',
      visible: true,
      items: [createRatingItem()],
    }),
  },

  skillGroups: { entriesKey: 'groups', childrenKey: 'items', createEntry: createSkillGroup, createChild: createBulletItem },
  highlights: { entriesKey: 'items', childrenKey: null, createEntry: createHighlightItem },
  ratings: { entriesKey: 'items', childrenKey: null, createEntry: createRatingItem },
}

export const shapeOf = (section) => SECTION_SHAPE[section.type] || { entriesKey: null, childrenKey: null }
