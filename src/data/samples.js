import { sampleResume } from './sampleResume'
import { developerResume } from './developerResume'

/** Ready-made documents. The first is what a fresh visit starts with. */
export const SAMPLES = [
  {
    id: 'heritage',
    person: 'Abhinav Singh',
    label: 'Heritage & archaeology',
    template: 'Classic Teal',
    document: sampleResume,
  },
  {
    id: 'developer',
    person: 'Addison Harris',
    label: 'Full stack developer',
    template: 'Modern Minimal',
    document: developerResume,
  },
]

export const getSample = (id) => SAMPLES.find((sample) => sample.id === id) || SAMPLES[0]
