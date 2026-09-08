import SummaryEditor from './SummaryEditor'
import ExperienceEditor from './ExperienceEditor'
import BulletsEditor from './BulletsEditor'
import EducationEditor from './EducationEditor'
import SkillGroupsEditor from './SkillGroupsEditor'
import HighlightsEditor from './HighlightsEditor'
import RatingsEditor from './RatingsEditor'

/** type id -> editor. Add a section type by registering its editor here. */
export const SECTION_EDITORS = {
  summary: SummaryEditor,
  experience: ExperienceEditor,
  bullets: BulletsEditor,
  education: EducationEditor,
  skillGroups: SkillGroupsEditor,
  highlights: HighlightsEditor,
  ratings: RatingsEditor,
}
