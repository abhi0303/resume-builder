import { uid } from '../utils/id'

const b = (text) => ({ id: uid('b'), text })

/**
 * Seed document. Everything below is plain data — headings included — so the
 * whole resume can be re-shaped from the editor without touching the template.
 */
export const sampleResume = {
  version: 1,
  templateId: 'classicTeal',
  theme: { bannerBg: '#14384a', syncHeadingColors: true },
  header: {
    name: 'PURVEE',
    title: 'Heritage Management & Archaeology Professional',
    phone: '+91-9097811415',
    email: 'purveesingh12@gmail.com',
    address: '90, Anukampa Apartment, Indirapuram, Ghaziabad, Uttar Pradesh',
  },
  sections: [
    {
      id: uid('sec'),
      type: 'summary',
      heading: 'PROFESSIONAL SUMMARY',
      column: 'main',
      visible: true,
      text:
        'Dedicated Heritage Management professional and Gold Medalist (MA, BHU) with expertise in archaeological documentation, pottery cataloguing, manuscript preservation, digital archiving, and heritage research. Experienced in NMMA format documentation, Indus Script data management, and Sanskrit manuscript transliteration. Passionate about cultural heritage conservation and academic research.',
    },
    {
      id: uid('sec'),
      type: 'experience',
      heading: 'PROFESSIONAL EXPERIENCE',
      column: 'main',
      visible: true,
      items: [
        {
          id: uid('exp'),
          title: 'Documentation Assistant – CAC Section',
          organization: 'Archaeological Survey of India',
          dateRange: 'Present',
          bullets: [
            b('Documentation of pottery in NMMA format: measurement, photography, typological description, cultural period, state identification, and reference coding'),
            b('Collected and organized reference materials related to Harappan Ware pottery'),
            b('Assisted in systematic heritage documentation and cataloguing procedures'),
          ],
        },
        {
          id: uid('exp'),
          title: 'Data Management & Documentation',
          organization: 'Archaeological Survey of India – Institute of Archaeology',
          dateRange: 'Sep–Oct 2025',
          bullets: [
            b('Compiled, stored, and documented data related to the Indus Script'),
            b('Managed PGDA alumni information and digital cataloguing of library resources'),
            b('Conducted data verification, categorization, and systematic Excel documentation'),
          ],
        },
        {
          id: uid('exp'),
          title: 'Intern – Manuscript Preservation',
          organization: 'Indology Classics Input Society, Varanasi',
          dateRange: 'Jan–Jun 2023',
          bullets: [
            b('Conducted detailed assessments of historical manuscripts including condition analysis and cultural significance'),
            b('Collaborated with experts to develop preservation strategies for fragile manuscripts'),
            b('Maintained accurate preservation records and documentation for conservation efforts'),
          ],
        },
        {
          id: uid('exp'),
          title: 'Intern – Sanskrit Manuscript Digitization',
          organization: 'Indology Classics Input Society, Varanasi',
          dateRange: 'Jul 2023',
          bullets: [
            b('Specialized in transliteration and digitization of Sanskrit manuscripts'),
            b('Cross-checked multilingual symbols (German, Chinese, Russian) for manuscript accuracy'),
            b('Gained practical experience reading and interpreting old Devanagari scripts'),
          ],
        },
      ],
    },
    {
      id: uid('sec'),
      type: 'bullets',
      heading: 'ACADEMIC PROJECTS',
      column: 'main',
      visible: true,
      items: [
        b('Research on Buddhist Iconography'),
        b('Research on shapes and typologies of Harappan Civilization pottery with reference documentation'),
        b('Reference collection and comparative study of Harappan Ware pottery'),
      ],
    },
    {
      id: uid('sec'),
      type: 'education',
      heading: 'EDUCATION',
      column: 'side',
      visible: true,
      items: [
        {
          id: uid('edu'),
          degree: 'M.A. Heritage Management',
          institution: 'Banaras Hindu University (BHU)',
          date: '2023',
          score: 'CGPA: 8.25',
          badge: 'Gold Medalist',
        },
        { id: uid('edu'), degree: 'B.A. History', institution: 'IGNOU', date: '2021', score: '64%', badge: '' },
        {
          id: uid('edu'),
          degree: 'Higher Secondary (12th)',
          institution: 'D.A.V. Public School, Bhagalpur',
          date: '2016',
          score: '68%',
          badge: '',
        },
        {
          id: uid('edu'),
          degree: 'Secondary (10th)',
          institution: 'Sant Pathik Vidyalaya, Bhagalpur',
          date: '2014',
          score: 'CGPA: 9.6',
          badge: '',
        },
      ],
    },
    {
      id: uid('sec'),
      type: 'skillGroups',
      heading: 'SKILLS',
      column: 'side',
      visible: true,
      groups: [
        {
          id: uid('grp'),
          label: 'Technical',
          items: [
            b('MS Office (Word, Excel, PowerPoint)'),
            b('Documentation & Digital Archiving'),
            b('Pottery Documentation – NMMA Format'),
            b('Data Verification & Cataloguing'),
            b('Heritage Documentation & Research'),
          ],
        },
        { id: uid('grp'), label: 'Languages', items: [b('Hindi – Fluent'), b('English – Fluent')] },
        {
          id: uid('grp'),
          label: 'Soft Skills',
          items: [
            b('Leadership'),
            b('Teamwork & Collaboration'),
            b('Research & Analytical Skills'),
            b('Attention to Detail'),
            b('Multitasking & Time Management'),
            b('Adaptability'),
          ],
        },
      ],
    },
    {
      id: uid('sec'),
      type: 'bullets',
      heading: 'CERTIFICATIONS',
      column: 'side',
      visible: true,
      items: [b('Diploma in Computer Applications (ADCA & CFA)')],
    },
  ],
}

export const emptyResume = {
  version: 1,
  templateId: 'classicTeal',
  theme: { bannerBg: '#14384a', syncHeadingColors: true },
  header: { name: 'YOUR NAME', title: 'Your professional title', phone: '', email: '', address: '' },
  sections: [],
}
